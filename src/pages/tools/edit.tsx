import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCustom, useTranslate } from "@pankod/refine-core";
import { MANUFACTURES_API, TOOLS_API, TOOLS_API_CATEGORIES_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { IToolMessageResponse, IToolRequest, IToolResponse } from "interfaces/tool";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

type ToolEditProps = {
    data: IToolResponse | undefined;
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const ToolEdit = (props: ToolEditProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<IToolMessageResponse>();
    const [payload, setPayload] = useState<FormData>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const { form, formProps } = useForm<IToolRequest>({
        action: "edit",
    });
    const { setFields } = form;

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
    
    const {
        refetch,
        data: updateData,
        isLoading,
    } = useCustom({
        url: TOOLS_API + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });
    const onFinish = (event: IToolRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        formData.append("version", event.version);
        formData.append("purchase_cost", event.purchase_cost.toString());
        formData.append("version", event.version);
        formData.append("purchase_date", event.purchase_date.toString());
        formData.append("manufacturer_id", event.manufacturer_id.toString());
        formData.append("category_id", event.category_id.toString());
        formData.append("notes", event.notes);
        formData.append("_method", "PUT")

        setPayload(formData);
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "name", value: data?.name },
            { name: "version", value: data?.version },
            { name: "purchase_cost", value: data?.purchase_cost },
            { name: "notes", value: data?.notes ? data?.notes : "" },
            { name: "purchase_date", value: data?.purchase_date.date },
            { name: "manufacturer_id", value: data?.manufacturer.id },
            { name: "category_id", value: data?.category.id }
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
                        label={t("tools.label.field.name")}
                        name="name"
                        initialValue={data?.name}
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
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("tools.label.field.version")}
                        name="version"
                        initialValue={data?.version}
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
                        initialValue={data?.category.id}
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
                        initialValue={data?.manufacturer.id}
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
                initialValue={data?.notes}
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
                    {t("tools.label.button.edit")}
                </Button>
            </div>
        </Form>
    )
}