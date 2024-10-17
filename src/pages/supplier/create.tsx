import { useEffect, useState } from "react";
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { ISupplierRequest } from "interfaces/supplier";
import { SUPPLIERS_API } from "api/baseApi";

type SupplierCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const SupplierCreate = (props: SupplierCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ISupplierRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<ISupplierRequest>({
    action: "create",
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: ISupplierRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.address !== undefined) {
      formData.append("address", event.address);
    }

    if (event.contact !== undefined) {
      formData.append("contact", event.contact);
    }
    if (event.phone !== undefined) {
      formData.append("phone", event.phone);
    }

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: SUPPLIERS_API,
          values: payload,
          successNotification: false,
          errorNotification: false,
        },
        {
          onError: (error) => {
            const err: { [key: string]: string[] | string } =
              error?.response.data.messages;
            const message = Object.values(err)[0][0];
            open?.({
              type: "error",
              message: message,
            });
            setMessageErr(error?.response.data.messages);
          },
          onSuccess(data, variables, context) {
            open?.({
              type: "success",
              message: data?.data.messages,
            });
          },
        }
      );
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData]);

  useEffect(() => {
    form.setFieldsValue({
      image: file,
    });
  }, [file]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Form.Item
        label={t("supplier.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("supplier.label.field.name") +
              " " +
              t("supplier.label.message.required"),
          },
        ]}
      >
        <Input />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item label={t("supplier.label.field.address")} name="address">
        <Input />
      </Form.Item>
      {messageErr?.address && (
        <Typography.Text type="danger">{messageErr.address[0]}</Typography.Text>
      )}
      <Form.Item label={t("supplier.label.field.contact")} name="contact">
        <Input />
      </Form.Item>
      {messageErr?.contact && (
        <Typography.Text type="danger">{messageErr.contact[0]}</Typography.Text>
      )}
      <Form.Item label={t("supplier.label.field.phone")} name="phone">
        <Input />
      </Form.Item>
      {messageErr?.phone && (
        <Typography.Text type="danger">{messageErr.phone[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("supplier.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
