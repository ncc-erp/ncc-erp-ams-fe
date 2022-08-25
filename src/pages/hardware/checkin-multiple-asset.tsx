/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  useForm,
  Button,
  Row,
  Col,
  Select,
  useSelect,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IHardwareRequestMultipleCheckin } from "interfaces/hardware";

import { HARDWARE_CHECKIN_API, STATUS_LABELS_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import { EStatus, STATUS_LABELS } from "constants/assets";
import moment from "moment";

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
  const [, setIsReadyToDeploy] = useState<Boolean>(false);

  const t = useTranslate();

  const { form, formProps } = useForm<IHardwareRequestMultipleCheckin>({
    action: "create",
  });

  const { selectProps: statusLabelSelectProps } = useSelect<ICompany>({
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
  const { setFields } = form;

  const { mutate, data: dataCheckin, isLoading } = useCreate();

  const onFinish = (event: IHardwareRequestMultipleCheckin) => {
    mutate({
      resource: HARDWARE_CHECKIN_API,
      values: {
        assets: event.assets,
        status_id: event.status_id,
        note: event.note !== null ? event.note : "",
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
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm")
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

  const findLabel = (value: number): Boolean => {
    let check = true;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (
          item.label === EStatus.READY_TO_DEPLOY ||
          item.label === EStatus.ASSIGN
        ) {
          check = false;
          return false;
        }
      }
    });
    return check;
  };

  const filterStatusLabelSelectProps = () => {
    const optionsFiltered = statusLabelSelectProps.options?.filter(
      (item) => item.label !== EStatus.ASSIGN
    );
    statusLabelSelectProps.options = optionsFiltered;
    return statusLabelSelectProps;
  };

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value)));
  };
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
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.field.status")}
            name="status_id"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.status") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={Number(STATUS_LABELS.READY_TO_DEPLOY)}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("hardware.label.placeholder.status")}
              {...filterStatusLabelSelectProps()}
            />
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
