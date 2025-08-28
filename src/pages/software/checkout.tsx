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
import { ISoftwareRequestMultipleCheckout } from "interfaces/software";
import { USERS_API, SOFTWARE_CHECKOUT_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import moment from "moment";
import { LocalStorageKey } from "enums/LocalStorageKey";

type SoftwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const SoftwareCheckout = (props: SoftwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] =
    useState<ISoftwareRequestMultipleCheckout>();
  const t = useTranslate();
  const { mutate, data: dataCheckout, isLoading } = useCreate();

  const { formProps, form } = useForm<ISoftwareRequestMultipleCheckout>({
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

  const onFinish = (event: ISoftwareRequestMultipleCheckout) => {
    mutate({
      resource: SOFTWARE_CHECKOUT_API,
      values: {
        softwares: event.softwares,
        checkout_at: event.checkout_at,
        assigned_users: event.assigned_users,
        notes: event.notes !== null ? event.notes : "",
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "softwares", value: data?.map((item: any) => item.id) },
      { name: "notes", value: data?.notes ? data?.notes : "" },
      {
        name: "checkout_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      { name: "assigned_users", value: data?.assigned_users },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCheckout?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(undefined);
      setSelectedRowKeys([]);
      localStorage.removeItem(LocalStorageKey.SELECTED_SOFTWARE_ROW_KEYS);
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
          <Form.Item
            label={t("software.label.title.list_software")}
            name="softwares"
          >
            {data &&
              data?.map((item: any, index: number) => (
                <div key={index}>
                  <span className="show-asset">{item.software_tag}</span> -{" "}
                  {item.name}
                </div>
              ))}
          </Form.Item>
          {messageErr?.software && (
            <Typography.Text type="danger">
              {messageErr.software}
            </Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("software.label.field.checkoutTo")}
            name="assigned_users"
            rules={[
              {
                required: true,
                message:
                  t("software.label.field.checkoutTo") +
                  " " +
                  t("software.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("software.label.placeholder.user")}
              mode="multiple"
              {...userSelectProps}
            />
          </Form.Item>
          {messageErr?.assigned_users && (
            <Typography.Text type="danger">
              {messageErr.assigned_users}
            </Typography.Text>
          )}
          <Form.Item
            label={t("software.label.field.checkout_at")}
            name="checkout_at"
            rules={[
              {
                required: false,
                message:
                  t("software.label.field.checkout_at") +
                  " " +
                  t("software.label.message.required"),
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
        label={t("software.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("software.label.field.notes") +
              " " +
              t("software.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("software.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
