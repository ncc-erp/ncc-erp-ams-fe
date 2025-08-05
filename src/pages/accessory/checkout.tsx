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
import { USERS_API, ACCESSORY_CHECKOUT_API } from "api/baseApi";
import {
  IAccessoryRequestCheckout,
  IAccessoryResponseCheckout,
} from "interfaces/accessory";

type AccessoryCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IAccessoryResponseCheckout | undefined;
};

export const AccessoryCheckout = (props: AccessoryCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<any>();
  const [messageErr, setMessageErr] = useState<IAccessoryRequestCheckout>();

  const t = useTranslate();

  const { form, formProps } = useForm<IAccessoryRequestCheckout>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: userSelectProps } = useSelect<any>({
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
    url: ACCESSORY_CHECKOUT_API.replace("{accessory}", String(data?.id || "")),
    method: "get",
    config: {
      query: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IAccessoryRequestCheckout) => {
    setMessageErr(messageErr);

    const checkout = {
      name: event.name,
      category_id: event.category,
      assigned_to: event.assigned_to,
      note: event.note ?? "",
    };
    setPayload(checkout);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "category_id", value: data?.category.id },
      { name: "assigned_to", value: data?.assigned_to },
      { name: "note", value: data?.note },
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
            label={t("accessory.label.field.name")}
            name="name"
            rules={[
              {
                required: false,
                message:
                  t("accessory.label.field.name") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.name}
          >
            <Input disabled={true} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">{messageErr.name}</Typography.Text>
          )}

          <Form.Item
            className="tabUserCheckout"
            label={t("accessory.label.field.checkoutTo")}
            name="assigned_to"
            rules={[
              {
                required: true,
                message:
                  t("accessory.label.field.user") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("accessory.label.placeholder.user")}
              {...userSelectProps}
            />
          </Form.Item>
          {messageErr?.assigned_to && (
            <Typography.Text type="danger">
              {messageErr.assigned_to}
            </Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("accessory.label.field.category")}
            name="category"
            initialValue={data?.category.name}
          >
            <Input disabled={true} />
          </Form.Item>
          {messageErr?.category && (
            <Typography.Text type="danger">
              {messageErr.category}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("accessory.label.field.notes")}
        name="note"
        rules={[
          {
            required: false,
            message:
              t("accessory.label.field.notes") +
              " " +
              t("accessory.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("accessory.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
