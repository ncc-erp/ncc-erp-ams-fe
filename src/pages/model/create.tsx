/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Checkbox,
  Button,
  Typography,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IModel, IModelRequest } from "interfaces/model";

import "../../styles/hardware.less";
import { ICheckboxChange } from "interfaces";
import {
  MANUFACTURERS_SELECT_LIST_API,
  CATEGORIES_API,
  MODELS_API,
} from "api/baseApi";

type ModelCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const ModelCreate = (props: ModelCreateProps) => {
  const { setIsModalVisible } = props;
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IModelRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<IModelRequest>({
    action: "create",
  });

  const { selectProps: manufacturersSelectProps } = useSelect<IModel>({
    resource: MANUFACTURERS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: categorySelectProps } = useSelect<IModel>({
    resource: CATEGORIES_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IModelRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.manufacturer !== undefined)
      formData.append("manufacturer_id", event.manufacturer);
    if (event.category !== undefined)
      formData.append("category_id", event.category.toString());
    if (event.notes !== undefined) formData.append("notes", event.notes);
    if (event.requestable !== undefined) {
      formData.append("requestable", event.requestable.toString());
    }

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: MODELS_API,
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

  const onCheck = (event: ICheckboxChange) => {
    if (event.target.checked) {
      form.setFieldsValue({ requestable: 1 });
    } else {
      form.setFieldsValue({ requestable: 0 });
    }
  };

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
        label={t("model.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("model.label.field.name") +
              " " +
              t("model.label.message.required"),
          },
        ]}
      >
        <Input />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("model.label.field.manufacturer")}
        name="manufacturer"
        rules={[
          {
            required: false,
            message:
              t("model.label.field.manufacturer") +
              " " +
              t("model.label.message.required"),
          },
        ]}
      >
        <Select
          placeholder={t("model.label.placeholder.manufacturer")}
          {...manufacturersSelectProps}
        />
      </Form.Item>
      {messageErr?.manufacturer && (
        <Typography.Text type="danger">
          {messageErr.manufacturer[0]}
        </Typography.Text>
      )}

      <Form.Item
        label={t("model.label.field.category")}
        name="category"
        rules={[
          {
            required: true,
            message:
              t("model.label.field.category") +
              " " +
              t("model.label.message.required"),
          },
        ]}
      >
        <Select
          placeholder={t("model.label.placeholder.category")}
          {...categorySelectProps}
        />
      </Form.Item>
      {messageErr?.category && (
        <Typography.Text type="danger">{messageErr.category}</Typography.Text>
      )}

      <Form.Item label={t("model.label.field.notes")} name="notes">
        <ReactMde
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
        />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <Form.Item
        label=""
        name="requestable"
        valuePropName="checked"
        rules={[
          {
            required: true,
            message: t("model.label.message.required"),
          },
        ]}
      >
        <Checkbox
          onChange={(event) => {
            onCheck(event);
          }}
        >
          {t("model.label.field.checkbox")}
        </Checkbox>
      </Form.Item>
      {messageErr?.requestable && (
        <Typography.Text type="danger">
          {messageErr.requestable}
        </Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("model.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};