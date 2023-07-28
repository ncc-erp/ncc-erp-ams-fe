import { Button, Col, Form, Input, Row, Typography, useForm } from "@pankod/refine-antd";
import { useCustom, useTranslate } from "@pankod/refine-core";
import { LICENSES_API } from "api/baseApi";
import { ILicensesRequestEdit, ILicensesCreateRequest } from "interfaces/license";
import { useEffect, useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";

type LicensesEditProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: ILicensesRequestEdit | undefined;
};

export const LicensesEdit = (props: LicensesEditProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<ILicensesCreateRequest>();
    const [payload, setPayload] = useState<FormData>();

    const { form, formProps } = useForm<ILicensesRequestEdit>({
        action: "edit",
    });

    const { setFields } = form;

    const {
        refetch,
        data: updateData,
        isLoading,
    } = useCustom({
        url: LICENSES_API + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: ILicensesRequestEdit) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("licenses", event.licenses);
        formData.append("seats", event.seats);
        formData.append("purchase_date", event.purchase_date.toString());
        formData.append("expiration_date", event.expiration_date.toString());
        formData.append("purchase_cost", event.purchase_cost)
        formData.append("_method", "PUT");

        setPayload(formData);
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "licenses", value: data?.licenses },
            { name: "seats", value: data?.seats },
            { name: "purchase_date", value: data?.purchase_date.date },
            { name: "expiration_date", value: data?.expiration_date.date },
            { name: "purchase_cost", value: data?.purchase_cost && data?.purchase_cost.toString().split(",").join("") },
        ]);
    }, [data, form, isModalVisible]);

    useEffect(() => {
        form.resetFields();
    }, [isModalVisible]);

    useEffect(() => {
        if (payload) {
            refetch();
            if (updateData?.data.message) {
                form.resetFields();
            }
        }
    }, [payload]);

    useEffect(() => {
        if (updateData?.data.status === "success") {
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(undefined);
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
            }}>
            <Row gutter={12}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("licenses.label.field.licenses")}
                        name="licenses"
                        initialValue={data?.licenses}
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.licenses") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("licenses.label.placeholder.licenses")} />
                    </Form.Item>
                    {messageErr?.licenses && (
                        <Typography.Text type="danger">
                            {messageErr.licenses[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("licenses.label.field.software")}
                        name="software"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.software") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={data?.software.name}
                    >
                        <Input disabled={true} placeholder={t("licenses.label.placeholder.software")} />
                    </Form.Item>
                    {messageErr?.software_id && (
                        <Typography.Text type="danger">
                            {messageErr.software_id[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("licenses.label.field.seats")}
                        name="seats"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.seats") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={data?.seats}
                    >
                        <Input type="number" placeholder={t("licenses.label.placeholder.licenses")} />
                    </Form.Item>
                    {messageErr?.seats && (
                        <Typography.Text type="danger">
                            {messageErr.seats[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("licenses.label.field.purchase_cost")}
                        name="purchase_cost"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.purchase_cost") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={
                            data?.purchase_cost &&
                            data?.purchase_cost.toString().split(",").join("")
                        }
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.usd")}
                            value={
                                data?.purchase_cost &&
                                data?.purchase_cost.toString().split(",").join("")
                            }
                            placeholder={t("licenses.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.purchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_cost[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("licenses.label.field.purchase_date")}
                        name="purchase_date"
                        initialValue={
                            data?.purchase_date.date
                        }
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.purchase_date && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_date[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("licenses.label.field.expiration_date")}
                        name="expiration_date"
                        initialValue={
                            data?.expiration_date.date
                        }
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.expiration_date && (
                        <Typography.Text type="danger">
                            {messageErr.expiration_date}
                        </Typography.Text>
                    )}
                </Col>
            </Row>
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("licenses.label.button.edit")}
                </Button>
            </div>
        </Form>
    );
};