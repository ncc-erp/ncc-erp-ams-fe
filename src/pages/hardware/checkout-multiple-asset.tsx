import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
  useForm,
  useSelect,
} from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import moment from "moment";
import { useEffect, useState } from "react";

import { HARDWARE_CHECKOUT_API, USERS_API } from "api/baseApi";
import { STATUS_LABELS } from "constants/assets";
import { EBooleanString } from "constants/common";
import { IValidationErrors } from "interfaces";
import { ICompany } from "interfaces/company";
import {
  IHardwareRequestCheckout,
  IHardwareRequestMultipleCheckout,
} from "interfaces/hardware";
import "react-mde/lib/styles/css/react-mde-all.css";

type HardwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const HardwareCheckoutMultipleAsset = (props: HardwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] =
    useState<IValidationErrors<IHardwareRequestCheckout>>();
  const [isCustomerRenting, setIsCustomerRenting] = useState<EBooleanString>(
    EBooleanString.FALSE
  );

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

  const handleValuesChange = (
    changedValues: Partial<IHardwareRequestMultipleCheckout>
  ) => {
    if (
      "isCustomerRenting" in changedValues &&
      changedValues.isCustomerRenting
    ) {
      setIsCustomerRenting(changedValues.isCustomerRenting);
    }
  };

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
        isCustomerRenting: event.isCustomerRenting,
        startRentalDate:
          event.isCustomerRenting === EBooleanString.TRUE
            ? event.startRentalDate
            : null,
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
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
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
      onValuesChange={(changedValues) => {
        handleValuesChange(changedValues);
      }}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.detail.list-asset")}
            name="assets"
          >
            {data &&
              data?.map((item: any, index: number) => (
                <div key={index}>
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
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
          {messageErr?.checkout_at && (
            <Typography.Text type="danger">
              {messageErr.checkout_at[0]}
            </Typography.Text>
          )}

          <>
            <Form.Item
              label={t("hardware.label.field.isCustomerRenting")}
              name="isCustomerRenting"
              rules={[
                {
                  required: true,
                  message:
                    t("hardware.label.field.isCustomerRenting") +
                    " " +
                    t("hardware.label.message.required"),
                },
              ]}
              initialValue={EBooleanString.FALSE}
            >
              <Radio.Group style={{ display: "flex" }}>
                <Radio value={EBooleanString.TRUE} style={{ padding: 0 }}>
                  {t("hardware.label.field.yes")}
                </Radio>
                <Radio value={EBooleanString.FALSE} style={{ padding: 0 }}>
                  {t("hardware.label.field.no")}
                </Radio>
              </Radio.Group>
            </Form.Item>
            {messageErr?.isCustomerRenting && (
              <Typography.Text type="danger">
                {messageErr.isCustomerRenting[0]}
              </Typography.Text>
            )}
          </>

          {isCustomerRenting === EBooleanString.TRUE && (
            <>
              <Form.Item
                label={t("hardware.label.field.startRentalDate")}
                name="startRentalDate"
                rules={[
                  {
                    required: true,
                    message:
                      t("hardware.label.field.startRentalDate") +
                      " " +
                      t("hardware.label.message.required"),
                  },
                ]}
                initialValue={data?.startRentalDate?.date}
              >
                <Input
                  type="date"
                  placeholder={t("hardware.label.placeholder.startRentalDate")}
                />
              </Form.Item>
              {messageErr?.startRentalDate && (
                <Typography.Text type="danger">
                  {messageErr.startRentalDate[0]}
                </Typography.Text>
              )}
            </>
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
