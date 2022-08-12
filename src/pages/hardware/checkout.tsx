/* eslint-disable react-hooks/exhaustive-deps */
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
import { UserOutlined } from "@ant-design/icons";
import { ICompany } from "interfaces/company";
import { HARDWARE_API, MODELS_SELECT_LIST_API, USERS_API } from "api/baseApi";

type HardwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckout | undefined;
};

export const HardwareCheckout = (props: HardwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [activeModel, setActiveModel] = useState<String | any>("1");
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IHardwareRequestCheckout>();

  const t = useTranslate();

  const { form, formProps } = useForm<IHardwareRequestCheckout>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: MODELS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: userSelectProps } = useSelect<ICompany>({
    resource: USERS_API,
    optionLabel: "text",
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
    url: HARDWARE_API + "/" + data?.id + "/checkout",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareRequestCheckout) => {
    setMessageErr(messageErr);

    const formData = new FormData();
    formData.append("name", event.name);
    if (event.note !== null) {
      formData.append("note", event.note);
    }
    formData.append("checkout_at", event.checkout_at);
    formData.append("model_id", event.model.toString());
    formData.append("status_id", 4 as any);

    if (event.assigned_user !== undefined) {
      formData.append("assigned_user", event.assigned_user);
      formData.append("checkout_to_type", "user");
    }

    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "model_id", value: data?.model.name },
      { name: "note", value: data?.note },
      {
        name: "checkout_at",
        value: new Date().toISOString().substring(0, 10),
      },
      { name: "assigned_user", value: data?.assigned_user },
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
      setMessageErr(messageErr);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

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
            initialValue={data?.model.name}
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
            className="tabUserCheckout"
            label={t("hardware.label.field.checkoutTo")}
            name="assigned_user"
            rules={[
              {
                required: true,
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
          {messageErr?.assigned_user && (
            <Typography.Text type="danger">
              {messageErr.assigned_user[0]}
            </Typography.Text>
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
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.note")}
        name="note"
        rules={[
          {
            required: false,
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

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
