import { useEffect, useState } from "react";
import { useCustom, useTranslate, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { ISupplierRequest } from "interfaces/supplier";
import { SUPPLIERS_API } from "api/baseApi";

type SupplierEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ISupplierRequest | undefined;
};

export const SupplierEdit = (props: SupplierEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ISupplierRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { form, formProps } = useForm<ISupplierRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const { refetch, isFetching } = useCustom({
    url: SUPPLIERS_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false,
  });

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

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "address", value: data?.address },
      { name: "contact", value: data?.contact },
      { name: "phone", value: data?.phone },
    ]);
  }, [data, form, isModalVisible]);

  useEffect(() => {
    if (!payload) return;
    const fetch = async () => {
      const response = await refetch();
      if (response.isError === true) {
        const err: { [key: string]: string[] | string } =
          response.error?.response.data.messages;
        const message = Object.values(err)[0][0];
        open?.({
          type: "error",
          message: message,
        });
        setMessageErr(response.error?.response.data.messages);
        return;
      }
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(null);
      open?.({
        type: "success",
        message: response.data?.data.messages,
      });
    };
    fetch();
  }, [payload]);

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
        initialValue={data?.name}
      >
        <Input />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("supplier.label.field.address")}
        name="address"
        initialValue={data?.address}
      >
        <Input />
      </Form.Item>
      {messageErr?.address && (
        <Typography.Text type="danger">{messageErr.address[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("supplier.label.field.contact")}
        name="contact"
        initialValue={data?.contact}
      >
        <Input />
      </Form.Item>
      {messageErr?.contact && (
        <Typography.Text type="danger">{messageErr.contact[0]}</Typography.Text>
      )}
      <Form.Item
        label={t("supplier.label.field.phone")}
        name="phone"
        initialValue={data?.phone}
      >
        <Input />
      </Form.Item>
      {messageErr?.phone && (
        <Typography.Text type="danger">{messageErr.phone[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("supplier.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
