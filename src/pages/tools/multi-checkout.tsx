import { useEffect, useState } from "react";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
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
import { USERS_API, TOOLS_MULTI_CHECKOUT_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import moment from "moment";
import {
  IToolCheckoutMessageResponse,
  IToolMultiCheckoutRequest,
} from "interfaces/tool";
import { LocalStorageKey } from "enums/LocalStorageKey";

type ToolMultiCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const ToolMultiCheckout = (props: ToolMultiCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] = useState<IToolCheckoutMessageResponse>();
  const t = useTranslate();
  const { open } = useNotification();
  const { mutate, data: dataCheckout, isLoading } = useCreate();

  const { formProps, form } = useForm<IToolMultiCheckoutRequest>({
    action: "create",
  });

  const { setFields } = form;

  const { selectProps: userSelectProps } = useSelect<ICompany>({
    resource: USERS_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const onFinish = (event: IToolMultiCheckoutRequest) => {
    mutate(
      {
        resource: TOOLS_MULTI_CHECKOUT_API,
        values: {
          tools: event.tools,
          checkout_at: event.checkout_at,
          assigned_to: event.assigned_to,
          notes: event.notes !== null ? event.notes : "",
        },
        successNotification: false,
      },
      {
        onSuccess(data, variables, context) {
          open?.({
            type: "success",
            description: "Success",
            message: data?.data.messages,
          });
        },
      }
    );
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "tools", value: data?.map((item: any) => item.id) },
      { name: "notes", value: data?.notes ? data?.notes : "" },
      {
        name: "checkout_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      { name: "assigned_to", value: data?.assigned_to },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCheckout?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(undefined);
      setSelectedRowKeys([]);
      localStorage.removeItem(LocalStorageKey.SELECTED_TOOLS_CHECKOUT_ROW_KEYS);
    } else {
      setMessageErr(dataCheckout?.data.messages);
    }
  }, [dataCheckout, form, setIsModalVisible]);

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
          <Form.Item label={t("tools.label.title.name")} name="tools">
            {data &&
              data?.map((item: any, index: number) => (
                <div key={index}>
                  <span className="show-asset">{item.id}</span> - {item.name}
                </div>
              ))}
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">{messageErr.name}</Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tools.label.field.checkoutTo")}
            name="assigned_to"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.checkoutTo") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("tools.label.placeholder.checkoutTo")}
              {...userSelectProps}
            />
          </Form.Item>
          {messageErr?.assigned_to && (
            <Typography.Text type="danger">
              {messageErr.assigned_to}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tools.label.field.checkout_at")}
            name="checkout_at"
            rules={[
              {
                required: false,
                message:
                  t("tools.label.field.checkout_at") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
          {messageErr?.checkout_at && (
            <Typography.Text type="danger">
              {messageErr.checkout_at[0]}
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
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("tools.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
