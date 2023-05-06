import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { MANUFACTURES_API, TOOLS_API, TOOLS_API_CATEGORIES_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { IToolMessageResponse, IToolRequest, IToolResponse } from "interfaces/tool";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type ToolCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const ToolCreate = (props: ToolCreateProps) => {
    const { setIsModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<IToolMessageResponse>();

    const { mutate, data: createData, isLoading } = useCreate();
    const [payload, setPayload] = useState<FormData>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const onFinish = (event: IToolRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        formData.append("purchase_cost", event.purchase_cost.toString());
        formData.append("purchase_date", event.purchase_date.toString());
        formData.append("version", event.version);
        formData.append("manufacturer_id", event.manufacturer_id.toString());
        formData.append("category_id", event.category_id.toString());
        formData.append("notes", event.notes);

        setPayload(formData);
        form.resetFields();
    };

    const { selectProps: categorySelectProps } = useSelect<IModel>({
        resource: TOOLS_API_CATEGORIES_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: manufacturerSelectProps } = useSelect<IModel>({
        resource: MANUFACTURES_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { formProps, form } = useForm<IToolRequest>({
        action: "create",
    });

    useEffect(() => {
        if (payload) {
            mutate({
                resource: TOOLS_API,
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
                    >
                        <Input placeholder={t("tools.label.placeholder.name")} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.purchase_cost")}
                        name="purchase_cost"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.purchase_cost") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.usd")}
                            placeholder={t("tools.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.purchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_cost[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.purchase_date")}
                        name="purchase_date"

                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.purchase_date && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_date[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("tools.label.field.version")}
                        name="version"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.version") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("tools.label.placeholder.version")} />
                    </Form.Item>
                    {messageErr?.version && (
                        <Typography.Text type="danger">
                            {messageErr.version[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.category")}
                        name="category_id"
                        initialValue={16}
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.seats") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                    >
                        <Select placeholder={t("tools.label.placeholder.category")}
                            {...categorySelectProps}
                        />
                    </Form.Item>
                    {messageErr?.category_id && (
                        <Typography.Text type="danger">
                            {messageErr.category_id[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.manufacturer")}
                        name="manufacturer_id"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.manufacturer") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                    >
                        <Select placeholder={t("tools.label.placeholder.manufacturer")}
                            {...manufacturerSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.manufacturer_id && (
                        <Typography.Text type="danger">
                            {messageErr.manufacturer_id[0]}
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
            >
                <ReactMde
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={(markdown) =>
                        Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                    }
                />
            </Form.Item>
            {messageErr?.notes && (
                <Typography.Text type="danger">
                    {messageErr.notes[0]}
                </Typography.Text>
            )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("tools.label.button.create")}
                </Button>
            </div>
        </Form>
    )
}