import { useEffect, useState } from "react";
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
import {
  Form,
  Input,
  useForm,
  Button,
  Typography,
  Checkbox,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { WEBHOOK_API } from "api/baseApi";
import { IWebhookRequest } from "interfaces/webhook";
import { WebhookEventType } from "constants/webhook";

type WebhookCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const WebhookCreate = (props: WebhookCreateProps) => {
  const { isModalVisible, setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IWebhookRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<IWebhookRequest>({
    action: "create",
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IWebhookRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("url", event.url);
    event.type.forEach((item: string) => {
      formData.append("type[]", item);
    });
    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: WEBHOOK_API,
          values: payload,
          successNotification: false,
          errorNotification: false,
        },
        {
          onError: (error) => {
            const err: { [key: string]: string[] | string } =
              error?.response.data.messages;
            const message = Object.values(err)[0][0];
            open?.({
              type: "error",
              message: message,
            });
            setMessageErr(error?.response.data.messages);
          },
          onSuccess(data, variables, context) {
            open?.({
              type: "success",
              message: data?.data.messages,
            });
          },
        }
      );
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData]);

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
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("location.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
