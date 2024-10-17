import { useEffect, useState } from "react";
import { useTranslate, useCustom, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button, Typography } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { IHardwareResponse, IHardwareUpdateRequest } from "interfaces/hardware";
import { HARDWARE_API } from "api/baseApi";
import { ASSIGNED_STATUS } from "constants/assets";
import { IToolResponse } from "interfaces/tool";
import { ITaxTokenResponse } from "interfaces/tax_token";

type HardwareEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponse | IToolResponse | ITaxTokenResponse | undefined;
  ApiLink?: string;
  refreshData?: () => void;
};

export const CancleAsset = (props: HardwareEditProps) => {
  const { setIsModalVisible, data, isModalVisible, ApiLink, refreshData } =
    props;
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IHardwareUpdateRequest>();
  const { open } = useNotification();

  const t = useTranslate();
  const { formProps, form } = useForm<IHardwareUpdateRequest>({
    action: "edit",
  });
  const urlLink = ApiLink ? ApiLink : HARDWARE_API;

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: urlLink + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
    errorNotification: false,
  });

  const onFinish = (event: IHardwareUpdateRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("reason", event.reason);
    formData.append("assigned_status", ASSIGNED_STATUS.REFUSE.toString());

    const method = ApiLink === HARDWARE_API ? "PATCH" : "PUT";
    formData.append("_method", method);
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
      open?.({
        type: "success",
        description: "Success",
        message: response.data?.data.messages,
      });
      if (refreshData) {
        refreshData();
      }
    };
    fetch();
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
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("user.label.button.cancle")}
        </Button>
      </div>
    </Form>
  );
};
