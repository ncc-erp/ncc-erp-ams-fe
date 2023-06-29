/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
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
import "react-mde/lib/styles/css/react-mde-all.css";
import { IModel, IModelRequest, IModelResponse } from "interfaces/model";
import { ICheckboxChange } from "interfaces";
import {
  MANUFACTURERS_SELECT_LIST_API,
  CATEGORIES_API,
  MODELS_API,
} from "api/baseApi";
import { requestable } from "constants/assets";

type ModelCloneProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IModelResponse | undefined;
};

export const ModelClone = (props: ModelCloneProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IModelResponse>();
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    setChecked(props.data?.requestable === true ? true : false);
  }, [props]);

  const t = useTranslate();

  const { form, formProps } = useForm<IModelRequest>({
    action: "clone",
  });

  const { setFields } = form;

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

  const { mutate, data: cloneData, isLoading } = useCreate();

  const onFinish = (event: IModelRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.manufacturer !== undefined)
      formData.append("manufacturer_id", event.manufacturer);
    if (event.category !== undefined)
      formData.append("category_id", event.category.toString());
    formData.append("notes", event.notes);
    formData.append(
      "requestable",
      checked ? requestable.REQUIRED : requestable.REFUSE
    );

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: MODELS_API,
        values: payload,
      });
      if (cloneData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setFields([
      { name: "name", value: data?.name },
      { name: "manufacturer", value: data?.manufacturer.id },
      { name: "category", value: data?.category.id },
      { name: "notes", value: data?.notes },
      { name: "requestable", value: data?.requestable },
    ]);
  }, [data, form, isModalVisible]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  useEffect(() => {
    if (cloneData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
    } else {
      setMessageErr(cloneData?.data.messages);
    }
  }, [cloneData]);

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
        initialValue={data?.name}
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
        initialValue={data?.manufacturer.id}
      >
        <Select
          placeholder={t("model.label.placeholder.manufacturer")}
          {...manufacturersSelectProps}
        />
      </Form.Item>
      {messageErr?.manufacturer && (
        <Typography.Text type="danger">
          {messageErr.manufacturer}
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
        initialValue={data?.category.id}
      >
        <Select
          placeholder={t("hardware.label.placeholder.propertyType")}
          {...categorySelectProps}
        />
      </Form.Item>
      {messageErr?.category && (
        <Typography.Text type="danger">{messageErr.category}</Typography.Text>
      )}

      <Form.Item
        label={t("model.label.field.notes")}
        name="notes"
        initialValue={data?.notes}
      >
        <Input.TextArea value={data?.notes} />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <Checkbox
        name="requestable"
        style={{ marginTop: 20 }}
        checked={checked}
        value={data?.requestable}
        onChange={(event: ICheckboxChange) => {
          setChecked(event.target.checked);
        }}
      >
        {t("model.label.field.checkbox")}
      </Checkbox>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.clone")}
        </Button>
      </div>
    </Form>
  );
};
