/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
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
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import {
  UserOutlined,
  AndroidOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ICompany } from "interfaces/company";

type HardwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckout;
};

export const HardwareCheckout = (props: HardwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String | any>("1");
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

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: "api/v1/models/selectlist",
    optionLabel: "text",
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
    resource: "api/v1/users/selectlist",
    optionLabel: "text",
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
    optionLabel: "text",
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
    url: "api/v1/hardware/" + data?.id + "/checkout",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareRequestCheckout) => {
    setMessageErr(null);

    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("note", event.note);
    formData.append("status_id", event.status_label);
    formData.append("expected_checkin", event.expected_checkin);
    formData.append("checkout_at", event.checkout_at);
    formData.append("model_id", event.model.toString());

    if (event.assigned_location !== undefined) {
      formData.append("assigned_location", event.assigned_location);
      formData.append("checkout_to_type", "location");
    }
    if (event.assigned_asset !== undefined) {
      formData.append("assigned_asset", event.assigned_asset);
      formData.append("checkout_to_type", "asset");
    }
    if (event.assigned_user !== undefined) {
      formData.append("assigned_user", event.assigned_user);
      formData.append("checkout_to_type", "user");
    }

    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data.name },
      { name: "model_id", value: data.model.name },

      { name: "note", value: data.note },

      { name: "status_id", value: data.status_label.id },
      {
        name: "expected_checkin",
        value: data.expected_checkin.date,
      },
      {
        name: "checkout_at",
        value: new Date().toISOString().substring(0, 10),
      },

      { name: "assigned_user", value: data.assigned_user },
      { name: "assigned_location", value: data?.assigned_location.name },
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
    setIsReadyToDeploy(findLabel(Number(value)));
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
                    <UserOutlined />
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
                    <EnvironmentOutlined />
                    {t("hardware.label.field.location")}
                  </span>
                }
                key="3"
              ></Tabs.TabPane>
            </Tabs>
          </Form.Item>

          {activeModel === "1" && (
            <Form.Item
              className="tabUser"
              label={t("hardware.label.field.user")}
              name="assigned_user"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.user") +
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
              className="tabUser"
              label={t("hardware.label.field.asset")}
              name="assigned_asset"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.asset") +
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
              className="tabUser"
              label={t("hardware.label.field.location")}
              name="assigned_location"
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
            label={t("hardware.label.field.dateCheckout")}
            name="checkout_at"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dateCheckout") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={new Date().toISOString().substring(0, 10)}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.checkout_at && (
            <Typography.Text type="danger">
              {messageErr.checkout_at[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.dateWantCheckin")}
            name="expected_checkin"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dateWantCheckin") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.expected_checkin && (
            <Typography.Text type="danger">
              {messageErr.expected_checkin[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.note")}
        name="note"
        rules={[
          {
            required: true,
            message:
              t("hardware.label.field.notes") +
              " " +
              t("hardware.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>
      {messageErr?.note && (
        <Typography.Text type="danger">{messageErr.note[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
