import { useEffect, useState } from "react";
import { useCustom, useTranslate, useNotification } from "@pankod/refine-core";
import {
  Form,
  Input,
  useForm,
  Button,
  Typography,
  Checkbox,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import { WEBHOOK_API } from "api/baseApi";
import { IWebhookRequest, IWebhookResponse } from "interfaces/webhook";
import { WebhookEventType } from "constants/webhook";

type WebhookEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IWebhookResponse | undefined;
};

export const WebhookEdit = (props: WebhookEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IWebhookRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { form, formProps } = useForm<IWebhookRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const { refetch, isFetching } = useCustom({
    url: WEBHOOK_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false,
  });

  const onFinish = (event: IWebhookRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("url", event.url);
    event.type.forEach((item: string) => {
      formData.append("type[]", item);
    });

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setMessageErr(null);
    setFields([
      { name: "name", value: data?.name },
      { name: "url", value: data?.url },
      { name: "type", value: data?.type || [] },
    ]);
  }, [data, form, isModalVisible]);

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
        message: response.data?.data.messages,
      });
    };
    fetch();
  }, [payload]);

  useEffect(() => {
    form.setFieldsValue({
      image: file,
    });
  }, [file]);
  const webhookEventOptions = Object.entries(WebhookEventType).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  );
  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Form.Item
        label={t("webhook.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("webhook.label.field.name") +
              " " +
              t("webhook.label.message.required"),
          },
        ]}
        initialValue={data?.name}
      >
        <Input placeholder={t("webhook.label.field.name")} />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("webhook.label.field.url")}
        name="url"
        rules={[
          {
            required: true,
            message:
              t("webhook.label.field.url") +
              " " +
              t("webhook.label.message.required"),
          },
        ]}
        initialValue={data?.url ? data?.url : ""}
      >
        <Input.TextArea placeholder={t("webhook.label.field.url")} rows={4} />
      </Form.Item>
      <Form.Item
        label={t("webhook.label.field.type")}
        name="type"
        rules={[
          {
            required: true,
            message:
              t("webhook.label.field.type") +
              " " +
              t("webhook.label.message.required"),
          },
        ]}
      >
        <Checkbox.Group options={webhookEventOptions} />
      </Form.Item>
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {t("location.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
