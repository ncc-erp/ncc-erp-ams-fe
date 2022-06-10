/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
  IHardwareRequestCheckin,
  IHardwareRequestCheckout,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";

import { ICompany } from "interfaces/company";

type HardwareCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckout;
};

export const HardwareCheckin = (props: HardwareCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
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
    url: "api/v1/hardware/" + data?.id + "/checkin",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareRequestCheckin) => {
    setMessageErr(null);

    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("note", event.note);
    formData.append("status_id", event.status_label);
    formData.append("expected_checkin", event.expected_checkin);
    formData.append("model_id", event.model.toString());
    formData.append("rtd_location", event.rtd_location.toString());
    formData.append("updated_at", new Date().toISOString().substring(0, 10));

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
        name: "updated_at",
        value: new Date().toISOString().substring(0, 10),
      },

      { name: "rtd_location", value: "" },
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
              disabled={true}
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

          <Form.Item
            label={t("hardware.label.field.location")}
            name="rtd_location"
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
            name="updated_at"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dateCheckin") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={new Date().toISOString().substring(0, 10)}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.updated_at && (
            <Typography.Text type="danger">
              {messageErr.updated_at[0]}
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
          {t("hardware.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
