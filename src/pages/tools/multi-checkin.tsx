import { useEffect, useState } from "react";
import { useCreate, useTranslate, useNotification } from "@pankod/refine-core";
import {
  Form,
  Input,
  useForm,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { TOOLS_MULTI_CHECKIN_API } from "api/baseApi";
import moment from "moment";
import { IToolCheckinMessageResponse, IToolMultiCheckinRequest, IToolResponse } from "interfaces/tool";

type ToolMultiCheckinProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: any;
setSelectedRowKeys: any;
};

export const ToolMultiCheckin = (props: ToolMultiCheckinProps) => {
  const { setIsModalVisible, data, isModalVisible, setSelectedRowKeys } = props;
  const [messageErr, setMessageErr] = useState<IToolCheckinMessageResponse>();
  const [assigned_users, setAssignedUsers] = useState([])
  const t = useTranslate();
  const { open } = useNotification();
  const { mutate, data: dataCheckin, isLoading } = useCreate();
  
  const { formProps, form } = useForm<IToolMultiCheckinRequest>({
    action: "create",
  });

  const { setFields } = form;

  const onFinish = (event: IToolMultiCheckinRequest) => {  
    mutate({
      resource: TOOLS_MULTI_CHECKIN_API,
      values: {
        tools: event.tools,
        checkin_at: event.checkin_at,
        assigned_users: assigned_users,
        notes: event.notes !== null ? event.notes : "",
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

  useEffect(() => {
    const assignedToIds: [] = data.map((item : IToolResponse) => item.assigned_to.id);
    setAssignedUsers(assignedToIds);
    form.resetFields();
    setFields([
      { name: "tools", value: data?.map((item: any) => item.id) },
      { name: "notes", value: data?.notes ? data?.notes : "" },
      {
        name: "checkin_at",
        value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      { name: "assigned_users", value: assigned_users },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    if (dataCheckin?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setMessageErr(undefined);
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedToolsCheckinRowKeys");
    }else{
      setMessageErr(dataCheckin?.data.messages);
    }
  }, [dataCheckin, form, setIsModalVisible]);

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
            label={t("tools.label.title.name")}
            name="tools"
          >
            {data &&
              data?.map((item: any) => (
                <div>
                  <span className="show-asset">{item.tool_id}</span> -{" "}
                  {item.name} {"("}{item.assigned_to.name}{")"}
                </div>
              ))}
          </Form.Item>
          {messageErr?.name && (
          <Typography.Text type="danger">
              {messageErr.name}
            </Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("tools.label.field.checkin_at")}
            name="checkin_at"
            rules={[
              {
                required: false,
                message:
                  t("tools.label.field.checkin_at") +
                  " " +
                  t("tools.label.message.required"),
              },
            ]}
            initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
          >
            <Input type="datetime-local" />
          </Form.Item>
          {messageErr?.checkin_at && (
            <Typography.Text type="danger">
              {messageErr.checkin_at[0]}
            </Typography.Text>
          )}
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
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("tools.label.button.checkin")}
        </Button>
      </div>
    </Form>
  );
};
