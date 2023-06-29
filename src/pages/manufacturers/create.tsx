/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";

import "../../styles/hardware.less";
import { IManufacturesRequest } from "interfaces/manufacturers";
import { MANUFACTURES_API } from "api/baseApi";

type ManufacturesCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const ManufacturesCreate = (props: ManufacturesCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IManufacturesRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<IManufacturesRequest>({
    action: "create",
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IManufacturesRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.url !== undefined) {
      formData.append("url", event.url);
    }
    if (event.support_url !== undefined) {
      formData.append("support_url", event.support_url);
    }
    if (event.support_phone !== undefined) {
      formData.append("support_phone", event.support_phone);
    }
    if (event.support_email !== undefined) {
      formData.append("support_email", event.support_email);
    }

    if (event.image !== null && event.image !== undefined) {
      formData.append("image", event.image);
    }

    setPayload(formData);
    form.resetFields();
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: MANUFACTURES_API,
        values: payload,
      });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(messageErr);
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
        label={t("manufactures.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("manufactures.label.field.name") +
              " " +
              t("manufactures.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("manufactures.label.field.name")} />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("manufactures.label.field.url")}
        name="url"
        rules={[
          {
            required: false,
            message:
              t("manufactures.label.field.url") +
              " " +
              t("manufactures.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("manufactures.label.placeholder.url")} />
      </Form.Item>

      <Form.Item
        label={t("manufactures.label.field.urlSupport")}
        name="support_url"
        rules={[
          {
            required: false,
            message:
              t("manufactures.label.field.urlSupport") +
              " " +
              t("manufactures.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("manufactures.label.placeholder.urlSupport")} />
      </Form.Item>

      <Form.Item
        label={t("manufactures.label.field.phone")}
        name="support_phone"
        rules={[
          {
            required: false,
            message:
              t("manufactures.label.field.phone") +
              " " +
              t("manufactures.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("manufactures.label.field.phone")} />
      </Form.Item>

      <Form.Item
        label={t("manufactures.label.field.email")}
        name="support_email"
        rules={[
          {
            required: false,
            message:
              t("manufactures.label.field.email") +
              " " +
              t("manufactures.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("manufactures.label.field.email")} />
      </Form.Item>

      <Form.Item label={t("manufactures.label.field.image")} name="image">
        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("manufactures.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
