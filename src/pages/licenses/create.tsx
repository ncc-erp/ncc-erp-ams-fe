import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { CATEGORIES_API, CATEGORIES_SELECT_LIST_API, CATEGORIES_SELECT_SOFTWARE_LIST_API, LICENSES_API, MANUFACTURES_API, SOFTWARE_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { ILicensesRequestCheckout, ISoftwareCreateRequest, ISoftwareLicensesResponse } from "interfaces/software";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useSearchParams } from "react-router-dom";


type LicensesCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const LicensesCreate = (props: LicensesCreateProps) => {
    const { setIsModalVisible } = props;
    const t = useTranslate();
    const [searchParams, setSearchParams] = useSearchParams();
    const software_id = searchParams.get('id');
    const software_name = searchParams.get('name');
    const [messageErr, setMessageErr] = useState<ISoftwareCreateRequest>();

    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const onFinish = (event: ISoftwareLicensesResponse) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("software_id", "3");
        formData.append("licenses", event.licenses.toString());
        formData.append("seats", event.seats.toString());
        formData.append("purchase_date", event.purchase_date.toString() );
        formData.append("expiration_date", event.expiration_date.toString() );
        formData.append("purchase_cost", event.purchase_cost);

        setPayload(formData);
        form.resetFields();
    };


    const { formProps, form } = useForm<ISoftwareCreateRequest>({
        action: "create",
    });
    const { mutate, data: createData, isLoading } = useCreate();
    const [payload, setPayload] = useState<FormData>();
    useEffect(() => {
        if (payload) {
            mutate({
                resource: LICENSES_API,
                values: payload,
            });
            if (createData?.data.message) form.resetFields();
        }
    }, [payload]);

    useEffect(() => {
        if (createData?.data.status === "success") {
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(messageErr);
        } else {
            setMessageErr(createData?.data.messages);
        }
    }, [createData]);

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
                        label={t("software.label.field.softwareName")}
                        name="software"
                        initialValue={software_name}
                        rules={[
                            {
                                required: true,
                                message:
                                    t("software.label.field.softwareName") +
                                    " " +
                                    t("software.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("software.label.placeholder.softwareName")} disabled={true} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("licenses.label.field.licenses")}
                        name="licenses"
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
                    {messageErr?.software_tag && (
                        <Typography.Text type="danger">
                            {messageErr.software_tag[0]}
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
                    >
                        <Input type="number" placeholder={t("licenses.label.placeholder.seats")} />
                    </Form.Item>
                    {messageErr?.version && (
                        <Typography.Text type="danger">
                            {messageErr.version[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("licenses.label.field.dateAdd")}
                        name="purchase_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.dateAdd") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.manufacturer_id && (
                        <Typography.Text type="danger">
                            {messageErr.manufacturer_id[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("licenses.label.field.expiration_date")}
                        name="expiration_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.expiration_date") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.manufacturer_id && (
                        <Typography.Text type="danger">
                            {messageErr.manufacturer_id[0]}
                        </Typography.Text>
                    )}

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
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.usd")}
                            placeholder={t("licenses.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.version && (
                        <Typography.Text type="danger">
                            {messageErr.version[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("licenses.label.button.create")}
                </Button>
            </div>
        </Form>
    )
}