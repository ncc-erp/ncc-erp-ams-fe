import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  useForm,
} from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { LICENSES_API } from "api/baseApi";
import { ILicensesResponse, ILicensesCreateRequest } from "interfaces/license";
import { useEffect, useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useSearchParams } from "react-router-dom";

type LicensesCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const LicensesCreate = (props: LicensesCreateProps) => {
  const { setIsModalVisible } = props;
  const t = useTranslate();
  const [messageErr, setMessageErr] = useState<ILicensesCreateRequest>();

  const { mutate, data: createData, isLoading } = useCreate();
  const [payload, setPayload] = useState<FormData>();

  const [searchParams, setSearchParams] = useSearchParams();
  const software_id = searchParams.get("id");
  const software_name = searchParams.get("name");

  const onFinish = (event: ILicensesResponse) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("software_id", software_id ? software_id : "");
    formData.append("licenses", event.licenses.toString());
    formData.append("seats", event.seats.toString());
    formData.append("purchase_date", event.purchase_date.toString());
    formData.append("expiration_date", event.expiration_date.toString());
    formData.append("purchase_cost", event.purchase_cost);

    setPayload(formData);
    form.resetFields();
  };

  const { formProps, form } = useForm<ILicensesCreateRequest>({
    action: "create",
  });

  useEffect(() => {
    if (payload) {
      mutate({
        resource: LICENSES_API,
        values: payload,
      });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
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
            label={t("licenses.label.field.software")}
            name="software_id"
            initialValue={software_name}
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.software") +
                  " " +
                  t("licenses.label.message.required"),
              },
            ]}
          >
            <Input
              placeholder={t("licenses.label.placeholder.software")}
              disabled={true}
            />
          </Form.Item>
          {messageErr?.software_id && (
            <Typography.Text type="danger">
              {messageErr.software_id[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("licenses.label.field.licenses")}
            name="licenses"
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.licenses") +
                  " " +
                  t("licenses.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("licenses.label.placeholder.licenses")} />
          </Form.Item>
          {messageErr?.licenses && (
            <Typography.Text type="danger">
              {messageErr.licenses[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("licenses.label.field.seats")}
            name="seats"
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.seats") +
                  " " +
                  t("licenses.label.message.required"),
              },
            ]}
          >
            <Input
              type="number"
              placeholder={t("licenses.label.placeholder.seats")}
            />
          </Form.Item>
          {messageErr?.seats && (
            <Typography.Text type="danger">
              {messageErr.seats[0]}
            </Typography.Text>
          )}
        </Col>
        <Col span={12}>
          <Form.Item
            label={t("licenses.label.field.purchase_date")}
            name="purchase_date"
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.purchase_date") +
                  " " +
                  t("licenses.label.message.required"),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("licenses.label.field.expiration_date")}
            name="expiration_date"
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.expiration_date") +
                  " " +
                  t("licenses.label.message.required"),
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
            label={t("licenses.label.field.purchase_cost")}
            name="purchase_cost"
            rules={[
              {
                required: true,
                message:
                  t("licenses.label.field.purchase_cost") +
                  " " +
                  t("licenses.label.message.required"),
              },
            ]}
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.usd")}
              placeholder={t("licenses.label.placeholder.purchase_cost")}
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("licenses.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
