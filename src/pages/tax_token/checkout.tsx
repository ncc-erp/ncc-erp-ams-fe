/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
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
import {
    ITaxTokenRequestCheckout, ITaxTokenResponse,
} from "interfaces/tax_token";
import { IModel } from "interfaces/model";
import { ICompany } from "interfaces/company";
import { HARDWARE_API, MODELS_SELECT_LIST_API, TAX_TOKEN_API, USERS_API } from "api/baseApi";
import { STATUS_LABELS } from "constants/assets";
import moment from "moment";

type TaxTokenCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ITaxTokenRequestCheckout | undefined;
};

export const TaxTokenCheckout = (props: TaxTokenCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  
  const [messageErr, setMessageErr] = useState<ITaxTokenRequestCheckout>();

  const t = useTranslate();

  const { form, formProps } = useForm<ITaxTokenRequestCheckout>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: MODELS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
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

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: TAX_TOKEN_API + "/" + data?.id + "/checkout",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: ITaxTokenRequestCheckout) => {
    setMessageErr(messageErr);

    const formData = new FormData();
    formData.append("name", event.name);
    if (event.note !== null) {
      formData.append("note", event.note ?? "");
    }
    formData.append("checkout_date", event.checkout_date);

    if (event.assigned_user !== undefined) {
      formData.append("assigned_to", event.assigned_user.toString());
    }

    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "supplier", value: data?.supplier },
      { name: "note", value: ""},
      {
        name: "checkout_date",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

  useEffect(() => {
    if (payload) {
      refetch();
      if (updateData?.data.message) form.resetFields();
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
            <Input
              placeholder={t("tax_token.label.placeholder.name")}
              disabled={true}
            />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}

          <Form.Item
            className="tabUserCheckout"
            label={t("tax_token.label.field.checkoutTo")}
            name="assigned_user"
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
        </Col>
        <Col className="gutter-row" span={12}>
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
            initialValue={data?.supplier}
          >
            <Input disabled={true}/>
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.checkout_at")}
            name="checkout_date"
            rules={[
              {
                required: true,
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
              t("tax_token.label.field.note") +
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
