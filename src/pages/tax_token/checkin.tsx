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
  ITaxTokenRequestCheckin,
  ITaxTokenResponseCheckin
} from "interfaces/tax_token";
import { ICompany } from "interfaces/company";
import {
  // HARDWARE_API,
  // LOCATION_API,
  // MODELS_SELECT_LIST_API,
  STATUS_LABELS_API,
  // USERS_API,

  TAX_TOKEN_API,

} from "api/baseApi";
import { EStatus, STATUS_LABELS } from "constants/assets";
import moment from "moment";

type TaxTokenCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ITaxTokenResponseCheckin | undefined;
};

export const TaxTokenCheckin = (props: TaxTokenCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<ITaxTokenRequestCheckin>();

  const t = useTranslate();

  const { form, formProps } = useForm<ITaxTokenRequestCheckin>({
    action: "edit",
  });

  const { setFields } = form;

  // const { selectProps: modelSelectProps } = useSelect<IModel>({
  //   resource: MODELS_SELECT_LIST_API,
  //   optionLabel: "text",
  //   onSearch: (value) => [
  //     {
  //       field: "search",
  //       operator: "containss",
  //       value,
  //     },
  //   ],
  // });

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

  // const { selectProps: locationSelectProps } = useSelect<ICompany>({
  //   resource: LOCATION_API,
  //   optionLabel: "name",
  //   onSearch: (value) => [
  //     {
  //       field: "search",
  //       operator: "containss",
  //       value,
  //     },
  //   ],
  // });

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: TAX_TOKEN_API + "/" + data?.id + "/checkin",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: ITaxTokenRequestCheckin) => {
    setMessageErr(messageErr);

    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("assigned_user", event.assigned_to);
    formData.append("status_id", event.status_label);
    formData.append(
      "checkin_at",
      moment(new Date()).format("YYYY-MM-DDTHH:mm")
    );
    formData.append("note", event.note ?? "");
    // formData.append("name", event.name);
    // if (event.note !== null) {
    //   formData.append("note", event.note ?? "");
    // }
    // if (event.status_label !== undefined) {
    //   formData.append("status_id", event.status_label);
    // }
    // formData.append(
    //   "checkin_at",
    //   moment(new Date()).format("YYYY-MM-DDTHH:mm")
    // );
    // formData.append("model_id", event.model.toString());
    // if (event.rtd_location !== undefined) {
    //   formData.append("rtd_location", event.rtd_location.toString());
    // }
    // if (event.assigned_to !== null) {
    //   formData.append("assigned_user", event.assigned_to);
    // }
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "note", value: data?.note },
      { name: "status_id", value: data?.status_label.id },
      {
        name: "checkin_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      { name: "assigned_user", value: data?.assigned_to },
    ]);
  }, [data, form, isModalVisible, setFields]);

  // useEffect(() => {
  //   form.resetFields();
  // }, [form, isModalVisible]);

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
            <Input disabled={true} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("tax_token.label.field.status")}
            name="status_label"
            rules={[
              {
                required: false,
                message:
                  t("tax_token.label.field.status") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={Number(STATUS_LABELS.READY_TO_DEPLOY)}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("tax_token.label.placeholder.status")}
              {...filterStatusLabelSelectProps()}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tax_token.label.field.checkinTo")}
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
            initialValue={
              data?.assigned_to?.last_name +
              " " +
              data?.assigned_to?.first_name +
              " (" +
              data?.assigned_to?.username +
              ")"
            }
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label={t("tax_token.label.field.dateCheckin")}
            name="checkin_at"
            rules={[
              {
                required: false,
                message:
                  t("tax_token.label.field.dateCheckin") +
                  " " +
                  t("tax_token.label.message.required"),
              },
            ]}
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
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
          {t("tax_token.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
