/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate, useNotification } from "@pankod/refine-core";
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
// import {
//   ITaxTokenRequestCheckin,
//   ITaxTokenResponseCheckin
// } from "interfaces/tools";
import {
    IToolCheckinRequest,
    IToolResponseCheckin,
} from "interfaces/tool"
import { ICompany } from "interfaces/company";
import {
  STATUS_LABELS_API,
  TOOLS_API,
} from "api/baseApi";
import { EStatus, STATUS_LABELS } from "constants/assets";
import moment from "moment";

type ToolCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IToolResponseCheckin | undefined;
};

export const ToolCheckin = (props: ToolCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IToolCheckinRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { form, formProps } = useForm<IToolCheckinRequest>({
    action: "edit",
  });

  const { setFields } = form;

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

  const {
    refetch,
    isFetching,
  } = useCustom({
    url: TOOLS_API + "/" + data?.id + "/checkin",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IToolCheckinRequest) => {
    setMessageErr(messageErr);

    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("assigned_user", event.assigned_to);
    formData.append("status_id", event.status_label);
    formData.append(
      "checkin_at",
      moment(new Date()).format("YYYY-MM-DDTHH:mm")
    );
    formData.append("notes", event.notes ?? "");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "notes", value: data?.notes },
      { name: "status_id", value: data?.status_label.id },
      {
        name: "checkin_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      { name: "assigned_user", value: data?.assigned_to },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (!payload) return;
    const fetch = async () => {
        const response = await refetch();
        if (response.isError === true) {
            let err: { [key: string]: string[] | string } = response.error?.response.data.messages;
            let message = Object.values(err)[0][0];
            open?.({
              type: 'error',
              description: "Error",
              message: message
            }); 
            setMessageErr(response.error?.response.data.messages);
            return;
        }
        form.resetFields();
        setIsModalVisible(false);
        setMessageErr(null);
        open?.({
            type: 'success',
            description: 'Success',
            message: response.data?.data.messages,
        });        
    } 
    fetch();
  }, [payload]);

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
            label={t("tools.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.name") +
                  " " +
                  t("tools.label.message.required"),
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
            label={t("tools.label.field.status")}
            name="status_label"
            rules={[
              {
                required: false,
                message:
                  t("tools.label.field.status") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
            initialValue={Number(STATUS_LABELS.READY_TO_DEPLOY)}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("tools.label.placeholder.status")}
              {...filterStatusLabelSelectProps()}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tools.label.field.checkinTo")}
            name="assigned_to"
            rules={[
              {
                required: true,
                message:
                  t("tools.label.field.user") +
                  " " +
                  t("tools.label.message.required"),
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
            label={t("tools.label.field.dateCheckin")}
            name="checkin_at"
            rules={[
              {
                required: false,
                message:
                  t("tools.label.field.dateCheckin") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={t("tools.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("tools.label.field.notes") +
              " " +
              t("tools.label.message.required"),
          },
        ]}
        initialValue={data?.notes}
      >
        <Input.TextArea value={data?.notes} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("tools.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
