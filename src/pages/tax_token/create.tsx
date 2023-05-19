import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect, } from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { SUPPLIERS_API, TAX_TOKEN_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { ITaxTokenCreateRequest, ITaxTokenResponse } from "interfaces/tax_token";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type TaxTokenCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const TaxTokenCreate = (props: TaxTokenCreateProps) => {
    const { setIsModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<ITaxTokenCreateRequest>();

    const { mutate, data: createData, isLoading } = useCreate();
    const [payload, setPayload] = useState<FormData>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const { selectProps: modelSupplierSelectProps } = useSelect<IModel>({
        resource: SUPPLIERS_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const onFinish = (event: ITaxTokenCreateRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        formData.append("seri", event.seri);
        formData.append("supplier_id", event.supplier)
        formData.append("purchase_date", event.purchase_date.toString());
        formData.append("expiration_date", event.expiration_date.toString());
        formData.append("purchase_cost", event.purchase_cost);
        formData.append("note", event.note);

        setPayload(formData);
        form.resetFields();
    };

    const { formProps, form } = useForm<ITaxTokenCreateRequest>({
        action: "create",
    });

    useEffect(() => {
        if (payload) {
            mutate({
                resource: TAX_TOKEN_API,
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
                        label={t("tax_token.label.field.name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.name") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("tax_token.label.placeholder.name")} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tax_token.label.field.seri")}
                        name="seri"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.seri") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("tax_token.label.placeholder.seri")} />
                    </Form.Item>
                    {messageErr?.seri && (
                        <Typography.Text type="danger">
                            {messageErr.seri[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tax_token.label.field.supplier")}
                        name="supplier"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.supplier") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Select placeholder={t("tax_token.label.placeholder.supplier")}
                            {...modelSupplierSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.supplier && (
                        <Typography.Text type="danger">
                            {messageErr.supplier[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("tax_token.label.field.purchase_date")}
                        name="purchase_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.purchase_date") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.purchase_date && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_date}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tax_token.label.field.expiration_date")}
                        name="expiration_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.expiration_date") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.expiration_date && (
                        <Typography.Text type="danger">
                            {messageErr.expiration_date}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tax_token.label.field.purchase_cost")}
                        name="purchase_cost"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tax_token.label.field.purchase_cost") +
                                    " " +
                                    t("tax_token.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="number"
                            addonAfter={t("tax_token.label.field.usd")}
                            placeholder={t("tax_token.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.purchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_cost[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>
            <Form.Item
                    label={t("tax_token.label.field.note")}
                    name="note"
                    rules={[
                        {
                            required: false,
                            message:
                                t("tax_token.label.field.note") +
                                " " +
                                t("tax_token.label.message.required"),
                        },
                    ]}
                >
                    <ReactMde
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) =>
                            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                        }
                    />
                </Form.Item>
                {messageErr?.note && (
                    <Typography.Text type="danger">{messageErr.note[0]}</Typography.Text>
                )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("tax_token.label.button.create")}
                </Button>
            </div>
        </Form >
    )
}