import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { SUPPLIERS_API, TAX_TOKEN_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { ITaxTokenCreateRequest, ITaxTokenResponse } from "interfaces/tax_token";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type TaxTokenCloneProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: ITaxTokenResponse | undefined;
};

export const TaxTokenClone = (props: TaxTokenCloneProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<ITaxTokenCreateRequest>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const { mutate, data: createData, isLoading } = useCreate();
    const [payload, setPayload] = useState<FormData>();

    const { formProps, form } = useForm<ITaxTokenCreateRequest>({
        action: "create",
    });
    const { setFields } = form;

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
        formData.append("supplier_id", event.supplier.toString());
        formData.append("notes", event.note ?? "");
        if (event.purchase_cost !== null)
            formData.append("purchase_cost", event.purchase_cost);
        if (event.purchase_date !== null)
            formData.append("purchase_date", event.purchase_date);

        setPayload(formData);
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "name", value: data?.name },
            { name: "seri", value: "" },
            { name: "supplier_id", value: data?.supplier.id },
            { name: "purchase_date", value: data?.purchase_date.date },
            { name: "expiration_date", value: data?.expiration_date.date },
            { name: "purchase_cost", value: data?.purchase_cost && data.purchase_cost.toString().split(",")[0] },
            { name: "note", value: data?.note ? data?.note : "" },
        ]);
    }, [data, form, isModalVisible]);

    useEffect(() => {
        form.resetFields();
    }, [isModalVisible]);

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
            setMessageErr(undefined);
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
                        initialValue={data?.name}
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
                        initialValue={data?.supplier.id}
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
                <Col span={12}>
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
                        initialValue={
                            data?.purchase_cost &&
                            data?.purchase_cost.toString().split(",")[0]
                        }
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.usd")}
                            value={
                                data?.purchase_cost &&
                                data?.purchase_cost.toString().split(",")[0]
                            }
                            placeholder={t("tax_token.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.purchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_cost[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tax_token.label.field.purchase_date")}
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
                        label={t("tax_token.label.field.expiration_date")}
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
                initialValue={data?.note}
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
                <Typography.Text type="danger">
                    {messageErr.note[0]}
                </Typography.Text>
            )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("tax_token.label.button.clone")}
                </Button>
            </div>
        </Form>
    )
}