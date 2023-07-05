/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
import { Form, Input, useForm, Button } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
    IToolCheckoutRequest,
    IToolRequestMultipleCancel,
    IToolMultiCheckoutRequest
} from "interfaces/tool";
import { TOOLS_API } from "api/baseApi";
import { ASSIGNED_STATUS } from "constants/assets";

type ToolCancelProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
  setSelectedRowKey: any;
};

export const ToolCancelMultiple = (props: ToolCancelProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKey } = props;
  const [messageErr, setMessageErr] = useState<IToolCheckoutRequest>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<IToolMultiCheckoutRequest>({
    action: "create",
  });

  const { mutate, data: dataCancel, isLoading } = useCreate();

  const onFinish = (event: IToolRequestMultipleCancel) => {
    mutate({
      resource: TOOLS_API + "?_method=PUT",
      values: {
        tools: event.tools,
        assigned_status: ASSIGNED_STATUS.REFUSE,
        reason: event.reason,
      },
      successNotification: false,
    }, {
      onSuccess(data, variables, context) {
        open?.({
          type: 'success',
          description: 'Success',
          message: data?.data.messages
        })
      },
    });
  };

  const { setFields } = form;
  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "tools", value: data?.map((item: any) => item.id) },
      { name: "reason", value: data?.reason },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCancel?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(messageErr);
      localStorage.removeItem("selectedRow_AcceptRefuse");
      setSelectedRowKey([]);
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
      <Form.Item label={t("tools.label.field.list_tools")} name="tools">
        {data &&
          data?.map((item: any) => (
            <div>
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
