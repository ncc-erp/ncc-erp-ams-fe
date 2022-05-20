import { useEffect, useState } from "react";
import { useCustom, useTranslate, useUpdate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Tabs,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import {
  IHardwareRequestCheckout,
  IHardwareResponseCheckin,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import { ICompany } from "interfaces/company";

type HardwareEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckin;
};

export const HardwareCheckin = (props: HardwareEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;

  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String>("1");
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<any>(null);

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { form, formProps } = useForm<IHardwareRequestCheckout>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: modelSelectProps, queryResult } = useSelect<IModel>({
    resource: "api/v1/models",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: statusLabelSelectProps } = useSelect<ICompany>({
    resource: "api/v1/statuslabels",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: userSelectProps } = useSelect<ICompany>({
    resource: "api/v1/users",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: hardwareSelectProps } = useSelect<ICompany>({
    resource: "api/v1/hardware/selectlist",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: "api/v1/locations",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: "api/v1/hardware/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: any) => {
    setMessageErr(null);
    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("model_id", event.model.value);

    formData.append("notes", event.notes);

    formData.append("status_id", event.status_label.label);
    formData.append("last_audit_date", event.last_audit_date);
    formData.append("company", event.company.label);

    formData.append("location_id", event.location?.value);

    formData.append("_method", "PATCH");

    setPayload(formData);
  };

  useEffect(() => {
    setFields([
      { name: "name", value: data.name },
      { name: "model_id", value: data.model.name },
      { name: "notes", value: data.notes },
      { name: "status_id", value: data.status_label.name },
      {
        name: "last_audit_date",
        value: data.last_audit_date,
      },
      { name: "assigned_to", value: data.assigned_to },

      { name: "location_id", value: data?.location },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

  useEffect(() => {
    if (payload) {
      refetch();
      if (updateData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (updateData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

  const findLabel = (value: number): Boolean => {
    let check = false;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (
          item.label === EStatus.READY_TO_DEPLOY ||
          item.label === EStatus.ASSIGN
        ) {
          check = true;
          return true;
        }
      }
    });
    return check;
  };

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value.value)));
  };

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.propertyType")}
            name="model"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.propertyType") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.model.id}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
            />
          </Form.Item>
          {messageErr?.model && (
            <Typography.Text type="danger">
              {messageErr.model[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.status")}
            name="status_label"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.status") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.status_label.id}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("hardware.label.placeholder.status")}
              {...statusLabelSelectProps}
            />
          </Form.Item>
          {messageErr?.status && (
            <Typography.Text type="danger">
              {messageErr.status[0]}
            </Typography.Text>
          )}

          {isReadyToDeploy && (
            <Form.Item label={t("hardware.label.field.checkoutTo")} name="tab">
              <Tabs
                defaultActiveKey="1"
                onTabClick={(value) => {
                  setActiveModel(value);
                }}
              >
                <Tabs.TabPane
                  tab={
                    <span>
                      <AppleOutlined />
                      {t("hardware.label.field.user")}
                    </span>
                  }
                  key="1"
                ></Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      <AndroidOutlined />
                      {t("hardware.label.field.asset")}
                    </span>
                  }
                  key="2"
                ></Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      <AndroidOutlined />
                      {t("hardware.label.field.location")}
                    </span>
                  }
                  key="3"
                ></Tabs.TabPane>
              </Tabs>
            </Form.Item>
          )}

          {activeModel === "1" && (
            <Form.Item
              label={t("hardware.label.field.checkoutTo")}
              name="assigned_to"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.checkoutTo") +
                    " " +
                    t("hardware.label.message.required"),
                },
              ]}
            >
              <Select
                placeholder={t("hardware.label.placeholder.user")}
                {...userSelectProps}
              />
            </Form.Item>
          )}
          {activeModel === "2" && (
            <Form.Item
              label={t("hardware.label.field.checkoutTo")}
              name="physical"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.checkoutTo") +
                    " " +
                    t("hardware.label.message.required"),
                },
              ]}
            >
              <Select
                placeholder={t("hardware.label.placeholder.asset")}
                {...hardwareSelectProps}
              />
            </Form.Item>
          )}

          {activeModel === "3" && (
            <Form.Item
              label={t("hardware.label.field.location")}
              name="location_id"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.location") +
                    " " +
                    t("hardware.label.message.required"),
                },
              ]}
            >
              <Select
                placeholder={t("hardware.label.placeholder.location")}
                {...locationSelectProps}
              />
            </Form.Item>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.assetName")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.assetName") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.name}
          >
            <Input />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.dateCheckin")}
            name="last_audit_date"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dataBuy") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.last_audit_date}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.last_audit_date && (
            <Typography.Text type="danger">
              {messageErr.last_audit_date[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.note")}
        name="notes"
        rules={[
          {
            required: true,
            message:
              t("hardware.label.field.notes") +
              " " +
              t("hardware.label.message.required"),
          },
        ]}
        initialValue={data?.notes}
      >
        <Input.TextArea defaultValue={data?.notes} value={data?.notes} />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
