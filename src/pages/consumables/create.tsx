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
  CONSUMABLE_API,
  CONSUMABLE_CATEGORIES_API,
  LOCATION_SELECT_LIST_API,
  MANUFACTURERS_SELECT_LIST_API,
} from "api/baseApi";
import { IConsumablesRequest } from "interfaces/consumables";
import { ILocation } from "interfaces/dashboard";
import { IManufactures } from "interfaces/manufacturers";

type ConsumablesCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const ConsumablesCreate = (props: ConsumablesCreateProps) => {
  const { setIsModalVisible } = props;

  const [payload, setPayload] = useState<FormData>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [messageErr, setMessageErr] = useState<IConsumablesRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<IConsumablesRequest>({
    action: "create",
  });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: CONSUMABLE_CATEGORIES_API,
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

  const { selectProps: manufacturesSelectProps } = useSelect<IManufactures>({
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

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IConsumablesRequest) => {
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
    if (event.manufacturer !== undefined)
      formData.append("manufacturer_id", event.manufacturer);
    if (event.notes !== undefined) formData.append("notes", event.notes);

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: CONSUMABLE_API,
        values: payload,
      });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
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
            label={t("consumables.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("consumables.label.field.name") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("consumables.label.placeholder.name")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("consumables.label.field.location")}
            name="location"
            rules={[
              {
                required: false,
                message:
                  t("consumables.label.field.location") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("consumables.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>
          {messageErr?.location && (
            <Typography.Text type="danger">
              {messageErr.location}
            </Typography.Text>
          )}

          <Form.Item
            label={t("consumables.label.field.manufacturer")}
            name="manufacturer"
            rules={[
              {
                required: false,
                message:
                  t("consumables.label.field.manufacturer") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("consumables.label.placeholder.manufacturer")}
              {...manufacturesSelectProps}
            />
          </Form.Item>
          {messageErr?.manufacturer && (
            <Typography.Text type="danger">
              {messageErr.manufacturer}
            </Typography.Text>
          )}
        </Col>

        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("consumables.label.field.category")}
            name="category"
            rules={[
              {
                required: true,
                message:
                  t("consumables.label.field.category") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("consumables.label.placeholder.category")}
              {...categorySelectProps}
            />
          </Form.Item>
          {messageErr?.category && (
            <Typography.Text type="danger">
              {messageErr.category}
            </Typography.Text>
          )}

          <Form.Item
            label={t("consumables.label.field.purchase_date")}
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
            label={t("consumables.label.field.total_consumables")}
            name="qty"
            rules={[
              {
                required: true,
                message:
                  t("consumables.label.field.total_consumables") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          {messageErr?.total_consumables && (
            <Typography.Text type="danger">
              {messageErr.total_consumables}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("consumables.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("consumables.label.field.notes") +
              " " +
              t("consumables.label.message.required"),
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
          {t("consumables.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};