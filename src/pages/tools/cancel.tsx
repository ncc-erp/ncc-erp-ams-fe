/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCustom, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import {
    IToolResponse,
    IToolUpdateRequest
} from "interfaces/tool";
import { TOOLS_API } from "api/baseApi";
import { ASSIGNED_STATUS } from "constants/assets";

type ToolEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IToolResponse | undefined;
};

export const CancleTool = (props: ToolEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IToolUpdateRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();
  const { formProps, form } = useForm<IToolUpdateRequest>({
    action: "edit",
  });

  const {
    refetch,
    isFetching,
  } = useCustom({
    url: TOOLS_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false
  });

  const onFinish = (event: IToolUpdateRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("reason", event.reason);
    formData.append("assigned_status", ASSIGNED_STATUS.REFUSE.toString());

    formData.append("_method", "PUT");
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
            let err: { [key: string]: string[] | string } = response.error?.response.data.messages;
            let message = Object.values(err)[0][0];
            open?.({
              type: 'error',
              description: 'Error',
              message: message,
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
