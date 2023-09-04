/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography, Switch } from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import { ICategoryRequest, ICategoryResponse } from "interfaces/categories";
import { CATEGORIES_API } from "api/baseApi";

type CategoryEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ICategoryResponse | undefined;
};

export const CategoryEdit = (props: CategoryEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ICategoryRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { form, formProps } = useForm<ICategoryRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const {
    refetch,
    isFetching,
  } = useCustom({
    url: CATEGORIES_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false
  });

  const onFinish = (event: ICategoryRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("category_type", event.category_type);
    formData.append("checkin_email", event.checkin_email ? "true" : "false");
    formData.append("eula_text", event.eula_text ?? "");

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
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "category_type", value: data?.category_type },
      { name: "checkin_email", value: data?.checkin_email },
      {
        name: "eula_text",
        value: data?.eula ?? "",
      },

      { name: "use_default_eula", value: data?.use_default_eula },
      { name: "image", value: data?.image },
    ]);
  }, [data, form, isModalVisible]);

  useEffect(() => {
    if (!payload) return;
    const fetch = async () => {
      const response = await refetch();
      if (response.isError === true) {
        let err: { [key: string]: string[] | string } = response.error?.response.data.messages;
        let message = Object.values(err)[0][0];
        open?.({
          type: 'error',
          message: message,
        });
        setMessageErr(response.error?.response.data.messages);
        return;
      }
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(null);
      open?.({
        type: 'success',
        message: response.data?.data.messages,
      });
    }
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
        label={t("category.label.field.category")}
        name="category_type"
        rules={[
          {
            required: true,
            message:
              t("category.label.field.category") +
              " " +
              t("category.label.message.required"),
          },
        ]}
        initialValue={data?.category_type}
      >
        <Input disabled />
      </Form.Item>
      {messageErr?.category_type && (
        <Typography.Text type="danger">
          {messageErr.category_type}
        </Typography.Text>
      )}

      <Form.Item
        label={t("category.label.field.checkin_email")}
        name="checkin_email"
        rules={[
          {
            message:
              t("category.label.field.category") +
              " " +
              t("category.label.message.required"),
          },
        ]}
        initialValue={data?.checkin_email}
      >
        <Switch defaultChecked={data?.checkin_email} />
      </Form.Item>
      {messageErr?.checkin_email && (
        <Typography.Text type="danger">
          {messageErr.checkin_email}
        </Typography.Text>
      )}

      <Form.Item
        label={t("category.label.field.categoryEULA")}
        name="eula_text"
        rules={[
          {
            required: false,
            message:
              t("category.label.field.categoryEULA") +
              " " +
              t("category.label.message.required"),
          },
        ]}
        initialValue={data?.eula}
      >
        <Input.TextArea value={data?.eula} />
      </Form.Item>

      <Form.Item
        label={t("category.label.field.image")}
        name="image"
        initialValue={data?.image}
      >
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
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("category.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
