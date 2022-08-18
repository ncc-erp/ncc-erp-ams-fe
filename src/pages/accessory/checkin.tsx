/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
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
import {
    IAccessoryRequestCheckin,
    IAccessoryResponseCheckin
} from "interfaces/accessory";

type AccessoryCheckinProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IAccessoryResponseCheckin | undefined;
    name: string | null;
};

export const AccessoryCheckin = (props: AccessoryCheckinProps) => {
    const { setIsModalVisible, data, isModalVisible, name } = props;
    const [payload, setPayload] = useState<any>();
    const [messageErr, setMessageErr] = useState<IAccessoryRequestCheckin>();

    const t = useTranslate();

    const { form, formProps } = useForm<IAccessoryRequestCheckin>({
        action: "edit",
    });

    const { setFields } = form;

    const {
        refetch,
        data: updateData,
        isLoading,
    } = useCustom({
        url: "api/v1/accessories" + "/" + data?.assigned_pivot_id + "/" + "checkin",
        method: "get",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: IAccessoryRequestCheckin) => {
        setMessageErr(messageErr);

        const formData = new FormData();
        formData.append("item_name", name !== null ? name : "");
        if (event.note !== null) {
            formData.append("note", event.note);
        }
        formData.append("checkin_date", new Date().toISOString().substring(0, 10));

        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "item_name", value: name !== null ? name : "" },
            { name: "checkin_date", value: new Date().toISOString().substring(0, 10) },
            { name: "note", value: data?.note },
        ]);
    }, [data, form, isModalVisible, setFields]);

    useEffect(() => {
        form.resetFields();
    }, [form, isModalVisible]);

    useEffect(() => {
        if (payload) {
            refetch();
            if (updateData?.data.message) form.resetFields();
        }
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
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("accessory.label.field.name")}
                        name="item_name"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("accessory.label.field.name") +
                                    " " +
                                    t("accessory.label.message.required"),
                            },
                        ]}
                        initialValue={name}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name}
                        </Typography.Text>
                    )}
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("accessory.label.field.checkin_date")}
                        name="checkin_date"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("accessory.label.field.checkin_date") +
                                    " " +
                                    t("accessory.label.message.required"),
                            },
                        ]}
                        initialValue={new Date().toISOString().substring(0, 10)}
                    >
                        <Input type="date" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label={t("accessory.label.field.notes")}
                name="note"
                rules={[
                    {
                        required: false,
                        message:
                            t("accessory.label.field.notes") +
                            " " +
                            t("accessory.label.message.required"),
                    },
                ]}
                initialValue={data?.note}
            >
                <Input.TextArea value={data?.note} />
            </Form.Item>

            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("accessory.label.button.checkin")}
                </Button>
            </div>
        </Form>
    );
};
