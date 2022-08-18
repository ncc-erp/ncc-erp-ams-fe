/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useForm,
  Button,
  Typography,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";

import "../../styles/hardware.less";
import { ICategoryRequest } from "interfaces/categories";
import { CATEGORIES_API } from "api/baseApi";

type CategoriesCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const CategoryCreate = (props: CategoriesCreateProps) => {
  const { setIsModalVisible } = props;
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ICategoryRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<ICategoryRequest>({
    action: "create",
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: ICategoryRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("category_type", event.category_type.toString());
    formData.append("eula_text", event.eula_text);

    formData.append(
      "use_default_eula",
      event.use_default_eula.toString() ?? ""
    );

    formData.append("image", event.image ?? "");

    setPayload(formData);
    form.resetFields();
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: CATEGORIES_API,
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
      >
        <Select
          placeholder={t("category.label.field.category")}
          options={[
            {
              label: t("category.label.options.accessory"),
              value: "accessory",
            },
            {
              label: t("category.label.options.asset"),
              value: "asset",
            },
            {
              label: t("category.label.options.consumable"),
              value: "consumable",
            },
          ]}
        />
      </Form.Item>

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
      >
        <ReactMde
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
        />
      </Form.Item>

      <Form.Item label={t("category.label.field.image")} name="image">
        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("category.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
