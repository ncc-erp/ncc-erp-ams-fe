/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Row, Col } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IHardwareRequestMultipleCheckin } from "interfaces/hardware";

import { HARDWARE_CHECKIN_API } from "api/baseApi";

type HardwareCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKeys: any;
};

export const HardwareCheckinMultipleAsset = (props: HardwareCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] =
    useState<IHardwareRequestMultipleCheckin>();

  const t = useTranslate();

  const { form, formProps } = useForm<IHardwareRequestMultipleCheckin>({
    action: "create",
  });

  const { setFields } = form;

  const { mutate, data: dataCheckin, isLoading } = useCreate();

  const onFinish = (event: IHardwareRequestMultipleCheckin) => {
    mutate({
      resource: HARDWARE_CHECKIN_API,
      values: {
        assets: event.assets,
        status_id: event.status_id,
        note: event.note,
        checkin_at: event.checkin_at,
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "assets", value: data?.map((item: any) => item.id) },
      { name: "note", value: data?.note },
      {
        name: "checkin_at",
        value: new Date().toISOString().substring(0, 10),
      },
      { name: "rtd_location", value: data?.rtd_location },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCheckin?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedRowKeys");
    }
  }, [dataCheckin, form, setIsModalVisible]);

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
          <Form.Item label="Danh sách các thiết bị" name="assets">
            {data &&
              data?.map((item: any) => (
                <div>
                  {" "}
                  {item.asset_tag} - {item.model && item.model.name}
                </div>
              ))}
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.dateCheckin")}
            name="checkin_at"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.dateCheckin") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={new Date().toISOString().substring(0, 10)}
          >
            <Input type="date" />
          </Form.Item>
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
          {t("hardware.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
