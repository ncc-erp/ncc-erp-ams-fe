import { Button, Col, Form, Input, Row, Select, Typography, useForm, useSelect } from "@pankod/refine-antd";
import { useCustom, useTranslate, useNotification } from "@pankod/refine-core";
import {
    TOOLS_API,
    TOOLS_CATEGORIES_API,
    SUPPLIERS_SELECT_LIST_API,
    LOCATION_SELECT_LIST_API,
    STATUS_LABELS_API
} from "api/baseApi";
import { IModel } from "interfaces/model";
import { IToolMessageResponse, IToolRequest, IToolResponse } from "interfaces/tool";
import { useEffect, useState } from "react";
import { EStatus, STATUS_LABELS } from "constants/assets";
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
    const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
    const t = useTranslate();
    const [messageErr, setMessageErr] = useState<IToolMessageResponse | null>();
    const [payload, setPayload] = useState<FormData>();
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const { form, formProps } = useForm<IToolRequest>({
        action: "edit",
    });
    const { setFields } = form;
    const { open } = useNotification();

    const { selectProps: supplierSelectProps } = useSelect<IModel>({
        resource: SUPPLIERS_SELECT_LIST_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: locationSelectProps } = useSelect<IModel>({
        resource: LOCATION_SELECT_LIST_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: categorySelectProps } = useSelect<IModel>({
        resource: TOOLS_CATEGORIES_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: statusLabelSelectProps } = useSelect<IModel>({
        resource: STATUS_LABELS_API,
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
        isFetching,
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

    const findLabel = (value: number): Boolean => {
        let check = false;
        statusLabelSelectProps.options?.forEach((item) => {
            if (value === item.value) {
                if (
                    item.label === EStatus.PENDING ||
                    item.label === EStatus.BROKEN ||
                    item.label === EStatus.READY_TO_DEPLOY
                ) {
                    check = true;
                    return true;
                }
            }
        });
        return check;
    };

    const onChangeStatusLabel = (value: { value: string; label: string }) => {
        setIsReadyToDeploy(findLabel(Number(value.value)));
    };

    const filterStatusLabelSelectProps = () => {
        const optionsFiltered = statusLabelSelectProps.options?.filter(
            (item) =>
                item.label === EStatus.PENDING ||
                item.label === EStatus.BROKEN ||
                item.label === EStatus.READY_TO_DEPLOY
        );
        statusLabelSelectProps.options = optionsFiltered;
        return statusLabelSelectProps;
    };

    const onFinish = (event: IToolRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        formData.append("supplier_id", event.supplier)
        formData.append("purchase_date", event.purchase_date.toString());
        formData.append("expiration_date", event.expiration_date.toString());
        formData.append("purchase_cost", event.purchase_cost);
        formData.append("notes", event.notes);
        formData.append("qty", event.qty.toString());
        if (event.status_label !== undefined) {
            formData.append("status_id", event.status_label.toString());
        }
        formData.append("location_id", event.location);
        formData.append("category_id", event.category);

        formData.append("_method", "PUT");

        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setMessageErr(null);
        setFields([
            { name: "name", value: data?.name },
            { name: "supplier_id", value: data?.supplier.id },
            { name: "location_id", value: data?.location.id },
            { name: "category_id", value: data?.category.id },
            { name: "qty", value: data?.qty },
            { name: "status_id", value: data?.status_label.id },
            { name: "purchase_date", value: data?.purchase_date.date },
            { name: "expiration_date", value: data?.expiration_date.date },
            { name: "purchase_cost", value: data?.purchase_cost && data?.purchase_cost.toString().split(",").join("") },
            { name: "note", value: data?.notes ? data?.notes : "" },
        ]);
    }, [data, form, isModalVisible]);

    useEffect(() => {
        if (!payload) return;
        const fetch = async () => {
            const response = await refetch();
            if (response.isError === true) {
                let err: { [key: string]: string[] | string } = response.error?.response.data.messages;
                let message = Object.values(err)[0][0];
                open?.({
                    type: 'error',
                    description: 'Error',
                    message: message
                });
                setMessageErr(response.error?.response.data.messages);
                return;
            }
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(null);
            open?.({
                type: 'success',
                description: 'Success',
                message: response.data?.data.messages
            });
        }
        fetch();
    }, [payload]);

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
                        initialValue={data?.name}
                    >
                        <Input placeholder={t("tools.label.placeholder.name")} />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.supplier")}
                        name="supplier"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.supplier") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.supplier.id}
                    >
                        <Select placeholder={t("tools.label.placeholder.supplier")}
                            {...supplierSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.supplier && (
                        <Typography.Text type="danger">
                            {messageErr.supplier[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.location")}
                        name="location"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.location") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.location.id}
                    >
                        <Select placeholder={t("tools.label.placeholder.location")}
                            {...locationSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.location && (
                        <Typography.Text type="danger">
                            {messageErr.location[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.category")}
                        name="category"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.category") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.category.id}
                    >
                        <Select placeholder={t("tools.label.placeholder.category")}
                            {...categorySelectProps}
                        />
                    </Form.Item>
                    {messageErr?.category && (
                        <Typography.Text type="danger">
                            {messageErr.category[0]}
                        </Typography.Text>
                    )}
                    {data?.status_label.id !== STATUS_LABELS.ASSIGN && (
                        <>
                            <Form.Item
                                label={t("hardware.label.field.status")}
                                name="status_label"
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            t("hardware.label.field.status") +
                                            " " +
                                            t("hardware.label.message.required"),
                                    },
                                ]}
                                initialValue={Number(data?.status_label.id)}
                            >
                                <Select
                                    onChange={(value) => {
                                        onChangeStatusLabel(value);
                                    }}
                                    placeholder={t("hardware.label.placeholder.status")}
                                    {...filterStatusLabelSelectProps()}
                                />
                            </Form.Item>
                            {messageErr?.status_label && (
                                <Typography.Text type="danger">
                                    {messageErr.status_label}
                                </Typography.Text>
                            )}
                        </>
                    )}
                    {/* <Form.Item
                        label={t("hardware.label.field.status")}
                        name="status_label"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("hardware.label.field.status") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={Number(data?.status_label.id)}
                    >
                        <Select
                            onChange={(value) => {
                                onChangeStatusLabel(value);
                            }}
                            placeholder={t("hardware.label.placeholder.status")}
                            {...filterStatusLabelSelectProps()}
                        />
                    </Form.Item>
                    {messageErr?.status_label && (
                        <Typography.Text type="danger">
                            {messageErr.status_label}
                        </Typography.Text>
                    )} */}
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("tools.label.field.purchase_date")}
                        name="purchase_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.purchase_date") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.purchase_date.date !== null ? data?.purchase_date.date : ""}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.purchase_date && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_date}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.expiration_date")}
                        name="expiration_date"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.expiration_date") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.expiration_date.date !== null ? data?.expiration_date.date : ""}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {messageErr?.expiration_date && (
                        <Typography.Text type="danger">
                            {messageErr.expiration_date}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("tools.label.field.qty")}
                        name="qty"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("tools.label.field.qty") +
                                    " " +
                                    t("tools.label.message.required"),
                            },
                        ]}
                        initialValue={data?.qty}
                    >
                        <Input type="number" />
                    </Form.Item>
                    {messageErr?.qty && (
                        <Typography.Text type="danger">
                            {messageErr.qty}
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
                            data?.purchase_cost.toString().split(",").join("")
                        }
                    >
                        <Input type="number"
                            addonAfter={t("tools.label.field.usd")}
                            placeholder={t("tools.label.placeholder.purchase_cost")} />
                    </Form.Item>
                    {messageErr?.purchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_cost[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>
            <Form.Item
                label={t("tools.label.field.notes")}
                name="notes"
                initialValue={data?.notes ? data?.notes : ""}
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
                <Button type="primary" htmlType="submit" loading={isFetching}>
                    {t("tools.label.button.edit")}
                </Button>
            </div>
        </Form>
    )
}