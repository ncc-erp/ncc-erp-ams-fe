/* eslint-disable react/prop-types */
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
  TOOLS_API,
  SUPPLIERS_SELECT_LIST_API,
  LOCATION_SELECT_LIST_API,
  TOOLS_CATEGORIES_API,
  STATUS_LABELS_API,
} from "api/baseApi";
import { IModel } from "interfaces/model";
import {
  IToolMessageResponse,
  IToolRequest,
  IToolCreateRequest,
} from "interfaces/tool";
import { useEffect, useState } from "react";
import { STATUS_LABELS } from "constants/assets";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type ToolCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const ToolCreate = (props: ToolCreateProps) => {
  const { setIsModalVisible } = props;
  const t = useTranslate();
  const [messageErr, setMessageErr] = useState<IToolMessageResponse | null>();

  const { mutate, data: createData, isLoading } = useCreate();
  const [payload, setPayload] = useState<FormData>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const { open } = useNotification();

  const onFinish = (event: IToolCreateRequest) => {
    setMessageErr(null);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("supplier_id", event.supplier);
    formData.append("location_id", event.location);
    formData.append("category_id", event.category);
    formData.append("purchase_date", event.purchase_date.toString());
    formData.append("expiration_date", event.expiration_date.toString());
    formData.append("purchase_cost", event.purchase_cost);
    formData.append("qty", event.qty.toString());
    formData.append("status_id", event.status_label.toString());
    formData.append("notes", event.notes ? event.notes : "");

    setPayload(formData);
  };

  const { selectProps: supplierSelectProps } = useSelect<IModel>({
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

  const { selectProps: locationSelectProps } = useSelect<IModel>({
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

  const { selectProps: categorySelectProps } = useSelect<IModel>({
    resource: TOOLS_CATEGORIES_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: statusLabelSelectProps } = useSelect<IModel>({
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
    (props) => props.value === STATUS_LABELS.READY_TO_DEPLOY
  );
  statusLabelSelectProps.options = filteredProps;

  const { formProps, form } = useForm<IToolRequest>({
    action: "create",
  });

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: TOOLS_API,
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
          onSuccess(data, variables, context) {
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
            label={t("tools.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.name") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("tools.label.placeholder.name")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.supplier")}
            name="supplier"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.supplier") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("tools.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.location")}
            name="location"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.location") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("tools.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>
          {messageErr?.location && (
            <Typography.Text type="danger">
              {messageErr.location[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.category")}
            name="category"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.category") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("tools.label.placeholder.category")}
              {...categorySelectProps}
            />
          </Form.Item>
          {messageErr?.category && (
            <Typography.Text type="danger">
              {messageErr.category[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.status")}
            name="status_label"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.status") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
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
            label={t("tools.label.field.purchase_date")}
            name="purchase_date"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.purchase_date") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.expiration_date")}
            name="expiration_date"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.expiration_date") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.expiration_date && (
            <Typography.Text type="danger">
              {messageErr.expiration_date}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.qty")}
            name="qty"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.qty") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          {messageErr?.qty && (
            <Typography.Text type="danger">{messageErr.qty}</Typography.Text>
          )}

          <Form.Item
            label={t("tools.label.field.purchase_cost")}
            name="purchase_cost"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.purchase_cost") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Input
              type="number"
              addonAfter={t("tools.label.field.usd")}
              placeholder={t("tools.label.placeholder.purchase_cost")}
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
        label={t("tools.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("tools.label.field.notes") +
              " " +
              t("tools.label.message.required"),
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
          {t("tools.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
