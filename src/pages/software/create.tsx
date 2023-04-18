import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCreate, useTranslate } from "@pankod/refine-core";
import { CATEGORIES_API, CATEGORIES_SELECT_LIST_API, CATEGORIES_SELECT_SOFTWARE_LIST_API, MANUFACTURES_API, SOFTWARE_API } from "api/baseApi";
import { IModel } from "interfaces/model";
import { ISoftwareCreateRequest } from "interfaces/software";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";


type SoftwareCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const SoftwareCreate = (props: SoftwareCreateProps) => {
    const { setIsModalVisible } = props;
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<ISoftwareCreateRequest>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const { mutate, data: createData, isLoading } = useCreate();
    const [payload, setPayload] = useState<FormData>();

    const onFinish = (event: ISoftwareCreateRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        if (event.name !== undefined) {
            formData.append("name", event.name);
        }
        formData.append("software_tag", event.software_tag);
        formData.append("manufacturer_id", event.manufacturer_id.toString());
        formData.append("category_id", event.category_id.toString());
        formData.append("notes", event.notes ?? "");
        formData.append("version", event.version);

        setPayload(formData);
        form.resetFields();
    };

    const { formProps, form } = useForm<ISoftwareCreateRequest>({
        action: "create",
    });

    useEffect(() => {
        if (payload) {
            mutate({
                resource: SOFTWARE_API,
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

    const { selectProps: modelManufactureSelectProps } = useSelect<IModel>({
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

    const { selectProps: modelCategorySelectProps } = useSelect<IModel>({
        resource: CATEGORIES_SELECT_SOFTWARE_LIST_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

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
                        name="name"
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
                        <Input placeholder={t("software.label.placeholder.softwareName")} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("software.label.field.software_tag")}
                        name="software_tag"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("software.label.field.software_tag") +
                                    " " +
                                    t("software.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("software.label.placeholder.software_tag")} />
                    </Form.Item>
                    {messageErr?.software_tag && (
                        <Typography.Text type="danger">
                            {messageErr.software_tag[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("software.label.field.version")}
                        name="version"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("software.label.field.version") +
                                    " " +
                                    t("software.label.message.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("software.label.placeholder.version")} />
                    </Form.Item>
                    {messageErr?.version && (
                        <Typography.Text type="danger">
                            {messageErr.version[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("software.label.field.manufacturer")}
                        name="manufacturer_id"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("software.label.field.manufacturer") +
                                    " " +
                                    t("software.label.message.required"),
                            },
                        ]}
                    >
                        <Select placeholder={t("software.label.placeholder.manufacturer")}
                            {...modelManufactureSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.manufacturer_id && (
                        <Typography.Text type="danger">
                            {messageErr.manufacturer_id[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("software.label.field.category")}
                        name="category_id"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("software.label.field.category") +
                                    " " +
                                    t("software.label.message.required"),
                            },
                        ]}
                    >
                        <Select placeholder={t("software.label.placeholder.category")}
                            {...modelCategorySelectProps}
                        />
                    </Form.Item>
                    {messageErr?.manufacturer_id && (
                        <Typography.Text type="danger">
                            {messageErr.category_id[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>
            <Form.Item
                label={t("hardware.label.field.notes")}
                name="notes"
                rules={[
                    {
                        required: false,
                        message:
                            t("hardware.label.field.notes") +
                            " " +
                            t("hardware.label.message.required"),
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
                <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
            )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("software.label.button.create")}
                </Button>
            </div>
        </Form>
    )
}