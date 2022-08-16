/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
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
  IHardwareRequestCheckout,
  IHardwareRequestMultipleCheckout,
} from "interfaces/hardware";
import { ICompany } from "interfaces/company";
import { USERS_API, HARDWARE_CHECKOUT_API } from "api/baseApi";
import { STATUS_LABELS } from "constants/assets";

type HardwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const HardwareCheckoutMultipleAsset = (props: HardwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] = useState<IHardwareRequestCheckout>();

  const t = useTranslate();

  const { formProps, form } = useForm<IHardwareRequestMultipleCheckout>({
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

  const onFinish = (event: IHardwareRequestMultipleCheckout) => {
    mutate({
      resource: HARDWARE_CHECKOUT_API,
      values: {
        assets: event.assets,
        assigned_asset: event.assigned_asset,
        assigned_location: event.assigned_location,
        checkout_at: event.checkout_at,
        assigned_user: event.assigned_user,
        checkout_to_type: "user",
        status_id: STATUS_LABELS.ASSIGN,
        note: event.note !== null ? event.note : "",
      },
    });
  };

  const { setFields } = form;
  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "assets", value: data?.map((item: any) => item.id) },
      { name: "assigned_asset", value: data?.assigned_asset },
      { name: "assigned_location", value: data?.assigned_location },
      { name: "note", value: data?.note ? data?.note : "" },
      {
        name: "checkout_at",
        value: new Date().toISOString().substring(0, 10),
      },
      { name: "assigned_user", value: data?.assigned_user },
      { name: "checkout_to_type", value: data?.checkout_to_type },
      { name: "user_can_checkout", value: data?.user_can_checkout },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCheckout?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedRowKeys");
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
            label={t("hardware.label.detail.list-asset")}
            name="assets"
          >
            {data &&
              data?.map((item: any) => (
                <div>
                  <span className="show-asset">{item.asset_tag}</span> -{" "}
                  {item.category.name}
                </div>
              ))}
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.checkoutTo")}
            name="assigned_user"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.user") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.placeholder.user")}
              {...userSelectProps}
            />
          </Form.Item>
          {messageErr?.assigned_user && (
            <Typography.Text type="danger">
              {messageErr.assigned_user[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.dateCheckout")}
            name="checkout_at"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.dateCheckout") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={new Date().toISOString().substring(0, 10)}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.checkout_at && (
            <Typography.Text type="danger">
              {messageErr.checkout_at[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.note")}
        name="note"
        rules={[
          {
            required: false,
            message:
              t("hardware.label.field.notes") +
              " " +
              t("hardware.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
