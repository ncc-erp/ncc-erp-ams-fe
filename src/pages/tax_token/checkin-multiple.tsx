import { useEffect, useState } from "react";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Button,
  Row,
  Col,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { ICompany } from "interfaces/company";
import { STATUS_LABELS_API, TAX_TOKEN_CHECKIN_API } from "api/baseApi";
import { EStatus, STATUS_LABELS } from "constants/assets";
import moment from "moment";
import {
  ITaxTokenMultipleRequestCheckin,
  ITaxTokenRequestCheckout,
} from "interfaces/tax_token";

type TaxTokenCheckoutMultipleProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  clearSelection: () => void;
};

export const TaxTokenCheckinMultiple = (
  props: TaxTokenCheckoutMultipleProps
) => {
  const { setIsModalVisible, data, isModalVisible, clearSelection } = props;
  const [messageErr, setMessageErr] = useState<ITaxTokenRequestCheckout>();
  const [, setIsReadyToDeploy] = useState<boolean>(false);
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<ITaxTokenMultipleRequestCheckin>({
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

  const { mutate, data: dataCheckout, isLoading } = useCreate();

  const onFinish = (event: ITaxTokenMultipleRequestCheckin) => {
    mutate(
      {
        resource: TAX_TOKEN_CHECKIN_API,
        values: {
          signatures: event.signatures,
          checkin_at: event.checkin_at,
          note: event.note !== null ? event.note : "",
        },
        successNotification: false,
      },
      {
        onSuccess(data, variables, context) {
          open?.({
            type: "success",
            description: "Success",
            message: data?.data.messages,
          });
        },
      }
    );
  };

  const { setFields } = form;
  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "signatures", value: data?.map((item: any) => item.id) },
      { name: "note", value: data?.note ? data?.note : "" },
      {
        name: "checkin_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
    ]);
  }, [data, form, isModalVisible, setFields]);

  const findLabel = (value: number): boolean => {
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

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value)));
  };

  const filterStatusLabelSelectProps = () => {
    const optionsFiltered = statusLabelSelectProps.options?.filter(
      (item) => item.label !== EStatus.ASSIGN
    );
    statusLabelSelectProps.options = optionsFiltered;
    return statusLabelSelectProps;
  };

  useEffect(() => {
    if (dataCheckout?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
      clearSelection();
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
            label={t("tax_token.label.detail.tax_token")}
            name="signatures"
          >
            {data &&
              data?.map((item: any, index: number) => (
                <div key={index}>
                  <span className="show-asset">{item.seri}</span> - {item.name}
                </div>
              ))}
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
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
          <Form.Item
            label={t("tax_token.label.field.status")}
            name="status_id"
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
              placeholder={t("hardware.label.placeholder.status")}
              {...filterStatusLabelSelectProps()}
            />
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
