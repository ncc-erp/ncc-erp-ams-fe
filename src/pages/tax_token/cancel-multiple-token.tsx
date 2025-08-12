import { useEffect, useState } from "react";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
  ITaxTokenRequestCheckout,
  ITaxTokenRequestMultipleCancel,
  ITaxTokenRequestMultipleCheckout,
} from "interfaces/tax_token";
import { TAX_TOKEN_API } from "api/baseApi";
import { ASSIGNED_STATUS } from "constants/assets";
import { LocalStorageKey } from "enums/LocalStorageKey";

type TaxTokenCancelProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  clearSelection: () => void;
};

export const TaxTokenCancelMultipleToken = (props: TaxTokenCancelProps) => {
  const { setIsModalVisible, data, isModalVisible, clearSelection } = props;
  const [messageErr, setMessageErr] = useState<ITaxTokenRequestCheckout>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<ITaxTokenRequestMultipleCheckout>({
    action: "create",
  });

  const { mutate, data: dataCancel, isLoading } = useCreate();

  const onFinish = (event: ITaxTokenRequestMultipleCancel) => {
    mutate(
      {
        resource: TAX_TOKEN_API + "?_method=PUT",
        values: {
          tax_tokens: event.tax_tokens,
          assigned_status: ASSIGNED_STATUS.REFUSE,
          reason: event.reason,
        },
        successNotification: false,
      },
      {
        onSuccess(data) {
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
      { name: "tax_tokens", value: data?.map((item: any) => item.id) },
      { name: "reason", value: data?.reason },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCancel?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
      clearSelection();
    }
  }, [dataCancel, form, setIsModalVisible]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Form.Item
        label={t("tax_token.label.field.list_tax_token")}
        name="tax_tokens"
      >
        {data &&
          data?.map((item: any, index: number) => (
            <div key={index}>
              {item.name} - {item.seri}
            </div>
          ))}
      </Form.Item>

      <Form.Item
        label={t("user.label.field.reason")}
        name="reason"
        rules={[
          {
            required: false,
            message:
              t("user.label.field.reason") +
              " " +
              t("user.label.message.required"),
          },
        ]}
        initialValue={data?.reason}
      >
        <Input.TextArea value={data?.reason} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("user.label.button.cancle")}
        </Button>
      </div>
    </Form>
  );
};
