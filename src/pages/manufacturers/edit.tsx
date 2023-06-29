/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import {
  IManufacturesRequest,
  IManufacturesResponse,
} from "interfaces/manufacturers";
import { MANUFACTURES_API } from "api/baseApi";

type ManufacturesEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IManufacturesResponse | undefined;
};

export const ManufacturesEdit = (props: ManufacturesEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IManufacturesRequest>();

  const t = useTranslate();

  const { form, formProps } = useForm<IManufacturesRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: MANUFACTURES_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IManufacturesRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("url", event.url);
    formData.append("support_url", event.support_url);
    formData.append("support_phone", event.support_phone);
    formData.append("support_email", event.support_email);

    if (
      typeof event.image !== "string" &&
      event.image !== null &&
      event.image !== undefined
    )
      formData.append("image", event.image);

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setFields([
      { name: "name", value: data?.name },
      { name: "url", value: data?.url },
      { name: "support_url", value: data?.support_url },
      { name: "support_email", value: data?.support_email },
      { name: "support_phone", value: data?.support_phone },

      { name: "image", value: data?.image },
    ]);
  }, [data, form, isModalVisible]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  useEffect(() => {
    if (payload) {
      refetch();
      if (updateData?.data.message) {
        form.resetFields();
      }
    }
  }, [payload]);

  useEffect(() => {
    if (updateData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(messageErr);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

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
        label={t("category.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("category.label.field.name") +
              " " +
              t("category.label.message.required"),
          },
        ]}
        initialValue={data?.name}
      >
        <Input placeholder={t("category.label.field.name")} />
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
        initialValue={data?.url}
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
        initialValue={data?.support_url}
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
        initialValue={data?.support_phone}
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
        initialValue={data?.support_email}
      >
        <Input placeholder={t("manufactures.label.field.email")} />
      </Form.Item>

      <Form.Item label="Tải hình" name="image" initialValue={data?.image}>
        {data?.image ? (
          <UploadImage
            id={"update" + data?.id}
            url={data?.image}
            file={file}
            setFile={setFile}
          ></UploadImage>
        ) : (
          <UploadImage file={file} setFile={setFile}></UploadImage>
        )}
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("manufactures.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
