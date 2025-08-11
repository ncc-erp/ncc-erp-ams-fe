import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  useForm,
  useSelect,
} from "@pankod/refine-antd";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
import {
  TAX_TOKEN_API,
  SUPPLIERS_SELECT_LIST_API,
  TAX_TOKEN_CATEGORIES_API,
  LOCATION_SELECT_LIST_API,
  STATUS_LABELS_API,
} from "api/baseApi";
import {
  ITaxTokenCreateRequest,
  ITaxTokenResponse,
  ITaxToken,
} from "interfaces/tax_token";
import { useEffect, useState } from "react";
import { STATUS_LABELS } from "constants/assets";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type TaxTokenCloneProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ITaxTokenResponse | undefined;
};

export const TaxTokenClone = (props: TaxTokenCloneProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const t = useTranslate();
  const [messageErr, setMessageErr] = useState<ITaxTokenCreateRequest | null>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [payload, setPayload] = useState<FormData>();
  const { open } = useNotification();
  const { formProps, form } = useForm<ITaxTokenCreateRequest>({
    action: "create",
  });
  const { setFields } = form;

  const { selectProps: supplierSelectProps } = useSelect<ITaxToken>({
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

  const { selectProps: locationSelectProps } = useSelect<ITaxToken>({
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

  const { selectProps: categorySelectProps } = useSelect<ITaxToken>({
    resource: TAX_TOKEN_CATEGORIES_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: statusLabelSelectProps } = useSelect<ITaxToken>({
    resource: STATUS_LABELS_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const filteredProps = statusLabelSelectProps.options?.filter(
    (option) => option.value === STATUS_LABELS.READY_TO_DEPLOY
  );
  statusLabelSelectProps.options = filteredProps;

  const onFinish = (event: ITaxTokenCreateRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("seri", event.seri);
    formData.append("supplier_id", event.supplier.toString());
    formData.append("notes", event.note ?? "");
    if (event.purchase_cost !== null)
      formData.append("purchase_cost", event.purchase_cost);
    if (event.purchase_date !== null)
      formData.append("purchase_date", event.purchase_date);
    formData.append("qty", event.qty.toString());
    formData.append("status_id", event.status_label.toString());
    formData.append("warranty_months", event.warranty_months);
    formData.append("location_id", event.location);
    formData.append("category_id", event.category);
    formData.append("expiration_date", event.expiration_date.toString());
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "seri", value: "" },
      { name: "supplier_id", value: data?.supplier.id },
      { name: "location_id", value: data?.location.id },
      { name: "category_id", value: data?.category.id },
      { name: "warranty_months", value: data?.warranty_months },
      { name: "qty", value: data?.qty },
      { name: "status_id", value: STATUS_LABELS.READY_TO_DEPLOY },
      { name: "purchase_date", value: data?.purchase_date.date },
      { name: "expiration_date", value: data?.expiration_date.date },
      {
        name: "purchase_cost",
        value:
          data?.purchase_cost &&
          data?.purchase_cost.toString().split(",").join(""),
      },
      { name: "note", value: data?.note ? data?.note : "" },
    ]);
  }, [data, form, isModalVisible]);

  const { mutate, data: createData, isLoading } = useCreate();

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: TAX_TOKEN_API,
          values: payload,
          successNotification: false,
          errorNotification: false,
        },
        {
          onError: (error) => {
            const err: { [key: string]: string[] | string } =
              error?.response.data.messages;
            const message = Object.values(err)[0][0];
            open?.({
              type: "error",
              description: "Error",
              message: message,
            });
            setMessageErr(error?.response.data.messages);
          },
          onSuccess(data) {
            open?.({
              type: "success",
              description: "Success",
              message: data?.data.messages,
            });
          },
        }
      );
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Row gutter={12}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tax_token.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.name") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.name}
          >
            <Input placeholder={t("tax_token.label.placeholder.name")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.seri")}
            name="seri"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.seri") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.seri}
          >
            <Input placeholder={t("tax_token.label.placeholder.seri")} />
          </Form.Item>
          {messageErr?.seri && (
            <Typography.Text type="danger">
              {messageErr.seri[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.supplier")}
            name="supplier"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.supplier") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.supplier.id}
          >
            <Select
              placeholder={t("tax_token.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.location")}
            name="location"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.location") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.location.id}
          >
            <Select
              placeholder={t("tax_token.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>
          {messageErr?.location && (
            <Typography.Text type="danger">
              {messageErr.location[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.category")}
            name="category"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.category") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.category.id}
          >
            <Select
              placeholder={t("tax_token.label.placeholder.category")}
              {...categorySelectProps}
            />
          </Form.Item>
          {messageErr?.category && (
            <Typography.Text type="danger">
              {messageErr.category[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.status")}
            name="status_label"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.status") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={STATUS_LABELS.READY_TO_DEPLOY}
          >
            <Select
              placeholder={t("hardware.label.placeholder.status")}
              {...statusLabelSelectProps}
            />
          </Form.Item>
          {messageErr?.status_label && (
            <Typography.Text type="danger">
              {messageErr.status_label}
            </Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tax_token.label.field.purchase_date")}
            name="purchase_date"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.purchase_date") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={
              data?.purchase_date.date !== null ? data?.purchase_date.date : ""
            }
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.expiration_date")}
            name="expiration_date"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.expiration_date") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={
              data?.expiration_date.date !== null
                ? data?.expiration_date.date
                : ""
            }
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.expiration_date && (
            <Typography.Text type="danger">
              {messageErr.expiration_date}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.warranty_months")}
            name="warranty_months"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.warranty_months") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.warranty_months}
          >
            <Input
              type="number"
              addonAfter={t("tax_token.label.field.month")}
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.qty")}
            name="qty"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.qty") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={data?.qty}
          >
            <Input type="number" />
          </Form.Item>
          {messageErr?.qty && (
            <Typography.Text type="danger">{messageErr.qty}</Typography.Text>
          )}

          <Form.Item
            label={t("tax_token.label.field.purchase_cost")}
            name="purchase_cost"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.purchase_cost") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={
              data?.purchase_cost &&
              data?.purchase_cost.toString().split(",").join("")
            }
          >
            <Input
              type="number"
              addonAfter={t("tax_token.label.field.usd")}
              placeholder={t("tax_token.label.placeholder.purchase_cost")}
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>
      <Form.Item
        label={t("tax_token.label.field.note")}
        name="note"
        rules={[
          {
            required: false,
            message:
              t("tax_token.label.field.note") +
              " " +
              t("tax_token.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <ReactMde
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
        />
      </Form.Item>
      {messageErr?.note && (
        <Typography.Text type="danger">{messageErr.note[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("tax_token.label.button.clone")}
        </Button>
      </div>
    </Form>
  );
};
