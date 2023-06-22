/* eslint-disable react-hooks/exhaustive-deps */
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
import { ICompany } from "interfaces/company";
import { USERS_API, TAX_TOKEN_CHECKOUT_API } from "api/baseApi";
import moment from "moment";
import { ITaxTokenMultipleRequestCheckout, ITaxTokenRequestCheckout } from "interfaces/tax_token";

type TaxTokenCheckoutMultipleProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const TaxTokenCheckoutMultiple = (props: TaxTokenCheckoutMultipleProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] = useState<ITaxTokenRequestCheckout>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<ITaxTokenMultipleRequestCheckout>({
    action: "create",
  });

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

  const { mutate, data: dataCheckout, isLoading } = useCreate();

  const onFinish = (event: ITaxTokenMultipleRequestCheckout) => {
    mutate({
      resource: TAX_TOKEN_CHECKOUT_API,
      values: {
        signatures: event.signatures,
        checkout_date: event.checkout_date,
        assigned_to: event.assigned_to,
        note: event.note !== null ? event.note : "",
      },
      successNotification: false,
    },{
      onSuccess(data, variables, context) {
        open?.({
            type: 'success',
            message: data?.data.messages,
        })
      },
    });
  };

  const { setFields } = form;
  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "signatures", value: data?.map((item: any) => item.id) },
      { name: "note", value: data?.note ? data?.note : "" },
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
      setMessageErr(messageErr);
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedTaxTokenRowKeys");
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
          <Form.Item
            label={t("tax_token.label.detail.tax_token")}
            name="signatures"
          >
            {data &&
              data?.map((item: any) => (
                <div>
                  <span className="show-asset">{item.seri}</span> -{" "}
                  {item.name}
                </div>
              ))}
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tax_token.label.field.checkoutTo")}
            name="assigned_to"
            rules={[
              {
                required: true,
                message:
                  t("tax_token.label.field.user") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("tax_token.label.placeholder.user")}
              {...userSelectProps}
            />
          </Form.Item>
          {messageErr?.assigned_user && (
            <Typography.Text type="danger">
              {messageErr.assigned_user[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.checkout_at")}
            name="checkout_date"
            rules={[
              {
                required: false,
                message:
                  t("tax_token.label.field.checkout_at") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
          {messageErr?.checkout_date && (
            <Typography.Text type="danger">
              {messageErr.checkout_date[0]}
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
              t("tax_token.label.field.notes") +
              " " +
              t("tax_token.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("tax_token.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
