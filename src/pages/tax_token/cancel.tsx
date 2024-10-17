import { useEffect, useState } from "react";
import { useTranslate, useCustom, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import {
  ITaxTokenResponse,
  ITaxTokenUpdateRequest,
} from "interfaces/tax_token";
import { TAX_TOKEN_API } from "api/baseApi";
import { ASSIGNED_STATUS } from "constants/assets";

type TaxTokenEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ITaxTokenResponse | undefined;
};

export const CancleAsset = (props: TaxTokenEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<ITaxTokenUpdateRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();
  const { formProps, form } = useForm<ITaxTokenUpdateRequest>({
    action: "edit",
  });

  const { refetch, isFetching } = useCustom({
    url: TAX_TOKEN_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false,
  });

  const onFinish = (event: ITaxTokenUpdateRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("reason", event.reason);
    formData.append("assigned_status", ASSIGNED_STATUS.REFUSE.toString());

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  useEffect(() => {
    if (!payload) return;
    const fetch = async () => {
      const response = await refetch();
      if (response.isError === true) {
        const err: { [key: string]: string[] | string } =
          response.error?.response.data.messages;
        const message = Object.values(err)[0][0];
        open?.({
          type: "error",
          description: "Error",
          message: message,
        });
        setMessageErr(response.error?.response.data.messages);
        return;
      }
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(null);
      open?.({
        type: "success",
        description: "Success",
        message: response.data?.data.messages,
      });
    };
    fetch();
  }, [payload]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
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
      >
        <Input.TextArea placeholder={t("user.label.field.inputReason")} />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("user.label.button.cancle")}
        </Button>
      </div>
    </Form>
  );
};
