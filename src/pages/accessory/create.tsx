/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
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

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { ICategory } from "interfaces";
import {
  ACCESSORY_API,
  ACCESSORY_CATEGORIES_API,
  LOCATION_SELECT_LIST_API,
  SUPPLIERS_SELECT_LIST_API,
} from "api/baseApi";
import { IAccesstoryRequest } from "interfaces/accessory";
import { ILocation } from "interfaces/dashboard";
import { ISupplier } from "interfaces/supplier";

type AccessoryCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const AccessoryCreate = (props: AccessoryCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [messageErr, setMessageErr] = useState<IAccesstoryRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<IAccesstoryRequest>({
    action: "create",
  });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: ACCESSORY_CATEGORIES_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: locationSelectProps } = useSelect<ILocation>({
    resource: LOCATION_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: supplierSelectProps } = useSelect<ISupplier>({
    resource: SUPPLIERS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IAccesstoryRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event?.name);
    formData.append("category_id", event.category);
    if (event.location !== undefined)
      formData.append("location_id", event.location);
    if (event.purchase_date !== undefined)
      formData.append("purchase_date", event.purchase_date);

    if (event.qty !== undefined) {
      formData.append("qty", event.qty.toString());
    }
    if (event.supplier !== undefined)
      formData.append("supplier_id", event.supplier);
    if (event.notes !== undefined) formData.append("notes", event.notes);

    if (event.purchase_cost !== undefined) {
      formData.append("purchase_cost", event.purchase_cost.toString());
    }
    formData.append("warranty_months", event.warranty_months);

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: ACCESSORY_API,
          values: payload,
        },
        {
          onError: (error) => {
            setMessageErr(error?.response.data.messages);
          }
        });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(undefined);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData, form, setIsModalVisible]);

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
                required: true,
                message:
                  t("accessory.label.field.name") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("accessory.label.placeholder.name")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("accessory.label.field.category")}
            name="category"
            rules={[
              {
                required: true,
                message:
                  t("accessory.label.field.category") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("accessory.label.placeholder.category")}
              {...categorySelectProps}
            />
          </Form.Item>
          {messageErr?.category && (
            <Typography.Text type="danger">
              {messageErr.category}
            </Typography.Text>
          )}

          <Form.Item
            label={t("accessory.label.field.supplier")}
            name="supplier"
            rules={[
              {
                required: false,
                message:
                  t("accessory.label.field.supplier") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("accessory.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier}
            </Typography.Text>
          )}
          <Form.Item
            label={t("accessory.label.field.cost")}
            name="purchase_cost"
          >
            <Input
              type="number"
              addonAfter={t("accessory.label.field.vnd")}
              placeholder={t("accessory.label.placeholder.cost")}
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
            </Typography.Text>
          )}
        </Col>

        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("accessory.label.field.location")}
            name="location"
            rules={[
              {
                required: true,
                message:
                  t("accessory.label.field.location") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("accessory.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>
          {messageErr?.location && (
            <Typography.Text type="danger">
              {messageErr.location}
            </Typography.Text>
          )}

          <Form.Item
            label={t("accessory.label.field.purchase_date")}
            name="purchase_date"
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("accessory.label.field.total_accessory")}
            name="qty"
            rules={[
              {
                required: true,
                message:
                  t("accessory.label.field.total_accessory") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          {messageErr?.total_accessory && (
            <Typography.Text type="danger">
              {messageErr.total_accessory}
            </Typography.Text>
          )}

          <Form.Item
            label={t("accessory.label.field.insurance")}
            name="warranty_months"
            rules={[
              {
                required: true,
                message:
                  t("accessory.label.field.insurance") +
                  " " +
                  t("accessory.label.message.required"),
              },
              ({ getFieldValue, setFieldsValue }) => ({
                validator(_, value) {
                  if (value < 0) {
                    setFieldsValue({ warranty_months: 0 });
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              type="number"
              addonAfter={t("accessory.label.field.month")}
              placeholder={t("accessory.label.placeholder.insurance")}
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("accessory.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("accessory.label.field.notes") +
              " " +
              t("accessory.label.message.required"),
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
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("accessory.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
