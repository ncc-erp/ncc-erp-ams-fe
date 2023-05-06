import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
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
import { TOOLS_API } from "api/baseApi";
import moment from "moment";
import { IToolCheckinMessageResponse, IToolCheckinRequest } from "interfaces/tool";

type ToolCheckinProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: any;
};

export const ToolCheckin = (props: ToolCheckinProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [messageErr, setMessageErr] = useState<IToolCheckinMessageResponse>();
    const t = useTranslate();

    const { mutate, data: dataCheckin, isLoading } = useCreate();
    const { formProps, form } = useForm<IToolCheckinRequest>({
        action: "create",
    });

    const onFinish = (event: IToolCheckinRequest) => {
        mutate({
            resource: TOOLS_API + "/" + data.id + "/checkin",
            values: {
                checkin_at: event.checkin_at,
                assigned_user: data.assigned_user,
                notes: event.notes !== null ? event.notes : "",
            },
        });
    };

    const { setFields } = form;
    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "assigned_user", value: data?.username },
            { name: "notes", value: data?.notes ? data?.notes : "" },
            {
                name: "checkin_at",
                value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            },
        ]);
    }, [data, form, isModalVisible, setFields]);

    useEffect(() => {
        if (dataCheckin?.data.status === "success") {
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(messageErr);
        }
        else {
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
                    <Form.Item
                        label={t("tools.label.field.checkinTo")}
                        name="assigned_user"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.user") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.username}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    {messageErr?.assigned_users && (
                        <Typography.Text type="danger">
                            {messageErr.assigned_users}
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
                initialValue={data?.notes}
            >
                <Input.TextArea value={data?.notes} />
            </Form.Item>
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("tools.label.button.checkin")}
                </Button>
            </div>
        </Form>
    );
};
