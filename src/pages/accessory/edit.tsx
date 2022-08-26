/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCustom } from "@pankod/refine-core";
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

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { ICategory } from "interfaces";
import {
  ACCESSORY_API,
  ACCESSORY_CATEGORIES_API,
  LOCATION_SELECT_LIST_API,
  SUPPLIERS_SELECT_LIST_API,
} from "api/baseApi";
import { IAccesstoryRequest, IAccesstoryResponse } from "interfaces/accessory";
import { ILocation } from "interfaces/dashboard";
import { ISupplier } from "interfaces/supplier";

type AccessoryEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IAccesstoryResponse | undefined;
};

export const AccessoryEdit = (props: AccessoryEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IAccesstoryRequest>();

  const t = useTranslate();

  const { form, formProps } = useForm<IAccesstoryRequest>({
    action: "edit",
  });

  const { setFields } = form;

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

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: ACCESSORY_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IAccesstoryRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);

    if (event.category !== undefined) {
      formData.append("category_id", event.category);
    }
    if (event.location !== undefined) {
      formData.append("location_id", event.location);
    }
    if (event.purchase_date !== null) {
      formData.append("purchase_date", event.purchase_date);
    }
    if (event.total_accessory !== null) {
      formData.append("qty", event.qty.toString());
    }
    if (event.supplier !== undefined) {
      formData.append("supplier_id", event.supplier);
    }
    if (event.notes !== null) {
      formData.append("notes", event.notes);
    }
    formData.append("purchase_cost", event.purchase_cost ?? "");
    formData.append("warranty_months", event.warranty_months);

    formData.append("_method", "PUT");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "category_id", value: data?.category.id },
      { name: "location_id", value: data?.location.id },
      {
        name: "purchase_date",
        value:
          data?.purchase_date.date !== null ? data?.purchase_date.date : "",
      },
      { name: "qty", value: data?.qty },
      {
        name: "purchase_cost",
        value:
          data?.purchase_cost && data.purchase_cost.toString().split(",")[0],
      },
      { name: "supplier_id", value: data?.supplier.id },
      { name: "notes", value: data?.notes },
      {
        name: "warranty_months",
        value: data?.warranty_months,
      },
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
      setIsModalVisible(false);
      setMessageErr(messageErr);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

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
                required: false,
                message:
                  t("accessory.label.field.name") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.name}
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
                required: false,
                message:
                  t("accessory.label.field.category") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.category.id}
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
            initialValue={data?.supplier.id}
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
            rules={[
              {
                required: false,
                message:
                  t("accessory.label.field.supplier") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={
              data?.purchase_cost &&
              data?.purchase_cost.toString().split(",")[0]
            }
          >
            <Input
              type="number"
              addonAfter={t("accessory.label.field.vnd")}
              value={
                data?.purchase_cost &&
                data?.purchase_cost.toString().split(",")[0]
              }
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
                required: false,
                message:
                  t("accessory.label.field.location") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.location.id}
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
            initialValue={
              data?.purchase_date.date !== null ? data?.purchase_date.date : ""
            }
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
                required: false,
                message:
                  t("accessory.label.field.total_accessory") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.qty}
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
                required: false,
                message:
                  t("accessory.label.field.insurance") +
                  " " +
                  t("accessory.label.message.required"),
              },
            ]}
            initialValue={data?.warranty_months}
          >
            <Input
              type="number"
              addonAfter={t("accessory.label.field.month")}
              value={data?.warranty_months}
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
        initialValue={data?.notes}
      >
        <Input.TextArea value={data?.notes} />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("accessory.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
