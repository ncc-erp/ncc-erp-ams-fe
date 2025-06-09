import { useEffect, useState } from "react";
import { useTranslate, useCustom, useNotification } from "@pankod/refine-core";
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
  SUPPLIERS_SELECT_LIST_API,
} from "api/baseApi";
import {
  FormValues,
  IConsumablesRequest,
  IConsumablesResponse,
} from "interfaces/consumables";
import { ILocation } from "interfaces/dashboard";
import { ISupplier } from "interfaces/supplier";
import moment from "moment";

type ConsumablesEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IConsumablesResponse | undefined;
};

export const ConsumablesEdit = (props: ConsumablesEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [messageErr, setMessageErr] = useState<IConsumablesRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<IConsumablesRequest>({
    action: "edit",
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

  const { refetch, isFetching } = useCustom({
    url: CONSUMABLE_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false,
  });
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
    if (event.notes !== undefined) formData.append("notes", event.notes ?? "");

    if (event.supplier !== undefined) {
      formData.append("supplier_id", event.supplier);
    }
    formData.append("purchase_cost", event.purchase_cost ?? "");
    formData.append("warranty_months", event.warranty_months);
    formData.append("maintenance_date", event.maintenance_date ?? "");
    formData.append("maintenance_cycle", event.maintenance_cycle ?? "");

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  const { setFields } = form;
  useEffect(() => {
    form.resetFields();
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "category_id", value: data?.category.id },
      { name: "location_id", value: data?.location.id },
      {
        name: "notes",
        value: data?.notes ?? "",
      },

      {
        name: "purchase_date",
        value:
          data?.purchase_date.date !== null ? data?.purchase_date.date : "",
      },
      { name: "qty", value: data?.qty },
      { name: "manufacturer_id", value: data?.manufacturer.id },
      { name: "supplier_id", value: data?.supplier.id },
      {
        name: "purchase_cost",
        value:
          data?.purchase_cost &&
          data?.purchase_cost.toString().split(",").join(""),
      },
      {
        name: "warranty_months",
        value: data?.warranty_months,
      },
      { name: "maintenance_date", value: data?.maintenance_date?.date },
      {
        name: "maintenance_cycle",
        value:
          data?.maintenance_cycle && data?.maintenance_cycle.split(" ")?.[0],
      },
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

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
      onValuesChange={(changedValues, allValues: FormValues) => {
        if (
          "purchase_date" in changedValues ||
          "maintenance_cycle" in changedValues
        ) {
          const { purchase_date, maintenance_cycle } = allValues;

          if (
            purchase_date &&
            maintenance_cycle &&
            !isNaN(Number(maintenance_cycle)) &&
            moment(purchase_date, "YYYY-MM-DD", true).isValid()
          ) {
            const nextMaintenance = moment(purchase_date)
              .add(Number(maintenance_cycle), "months")
              .format("YYYY-MM-DD");
            form.setFieldsValue({ maintenance_date: nextMaintenance });
          } else {
            form.setFieldsValue({ maintenance_date: "" });
          }
        }
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
            initialValue={data?.name}
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
            initialValue={data?.location.id}
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
            label={t("consumables.label.field.supplier")}
            name="supplier"
            rules={[
              {
                required: false,
                message:
                  t("consumables.label.field.supplier") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
            initialValue={data?.supplier.id}
          >
            <Select
              placeholder={t("consumables.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier}
            </Typography.Text>
          )}

          <Form.Item
            label={t("consumables.label.field.purchase_cost")}
            name="purchase_cost"
            rules={[
              {
                required: false,
                message:
                  t("consumables.label.field.supplier") +
                  " " +
                  t("consumables.label.message.required"),
              },
            ]}
            initialValue={
              data?.purchase_cost &&
              data?.purchase_cost.toString().split(",").join("")
            }
          >
            <Input
              type="number"
              addonAfter={t("consumables.label.field.vnd")}
              value={
                data?.purchase_cost &&
                data?.purchase_cost.toString().split(",").join("")
              }
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("consumables.label.field.maintenance_cycle")}
            name="maintenance_cycle"
            initialValue={
              data?.maintenance_cycle && data?.maintenance_cycle.split(" ")?.[0]
            }
          >
            <Input
              type="number"
              addonAfter={t("consumables.label.field.months_per_time")}
              placeholder={t("consumables.label.placeholder.maintenance_cycle")}
              value={
                data?.maintenance_cycle &&
                data?.maintenance_cycle.split(" ")?.[0]
              }
            />
          </Form.Item>
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
            initialValue={data?.category.id}
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
            initialValue={data?.qty}
          >
            <Input type="number" />
          </Form.Item>
          {messageErr?.total_consumables && (
            <Typography.Text type="danger">
              {messageErr.total_consumables}
            </Typography.Text>
          )}

          <Form.Item
            label={t("consumables.label.field.insurance")}
            name="warranty_months"
            rules={[
              {
                required: false,
                message:
                  t("consumables.label.field.insurance") +
                  " " +
                  t("consumables.label.message.required"),
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
            initialValue={data?.warranty_months}
          >
            <Input
              type="number"
              addonAfter={t("consumables.label.field.month")}
              value={data?.warranty_months}
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("consumables.label.field.maintenance_date")}
            name="maintenance_date"
          >
            <Input
              type="date"
              placeholder={t("consumables.label.placeholder.maintenance_date")}
            />
          </Form.Item>
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
        initialValue={data?.notes}
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
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("consumables.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
