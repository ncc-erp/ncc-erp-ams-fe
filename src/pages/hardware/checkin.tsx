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
  IHardwareRequestCheckin,
  IHardwareResponseCheckin,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";

import { ICompany } from "interfaces/company";
import {
  HARDWARE_API,
  LOCATION_API,
  MODELS_SELECT_LIST_API,
  STATUS_LABELS_API,
} from "api/baseApi";

type HardwareCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckin | undefined;
};

export const HardwareCheckin = (props: HardwareCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IHardwareRequestCheckin>();

  const t = useTranslate();

  enum EStatus {
    PENDING = "Ready to Deploy",
    ASSIGN = "Assign",
  }

  const { form, formProps } = useForm<IHardwareRequestCheckin>({
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

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: LOCATION_API,
    optionLabel: "name",
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
    url: HARDWARE_API + "/" + data?.id + "/checkin",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareRequestCheckin) => {
    setMessageErr(messageErr);

    const formData = new FormData();
    formData.append("name", event.name);
    if (event.note !== null) {
      formData.append("note", event.note);
    }
    if (event.status_label !== undefined) {
      formData.append("status_id", event.status_label);
    }
    formData.append("checkin_at", new Date().toISOString().substring(0, 10));
    formData.append("model_id", event.model.toString());
    if (event.rtd_location !== undefined) {
      formData.append("rtd_location", event.rtd_location.toString());
    }

    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "model_id", value: data?.model.name },
      { name: "note", value: data?.note },
      { name: "status_id", value: data?.status_label.id },
      {
        name: "checkin_at",
        value: new Date().toISOString().substring(0, 10),
      },

      { name: "rtd_location", value: "" },
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

  const findLabel = (value: number): Boolean => {
    let check = true;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (item.label === EStatus.PENDING || item.label === EStatus.ASSIGN) {
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
            label={t("hardware.label.field.propertyType")}
            name="model"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.propertyType") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.model.name}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
              disabled={true}
            />
          </Form.Item>
          {messageErr?.model && (
            <Typography.Text type="danger">
              {messageErr.model[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.status")}
            name="status_label"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.status") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={Number(5)}
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
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.assetName")}
            name="name"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.assetName") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.name}
          >
            <Input />
          </Form.Item>

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
