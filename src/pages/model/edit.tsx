/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    Select,
    useSelect,
    useForm,
    Checkbox,
    Button,
    Row,
    Col,
    Typography,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import { IModel, IModelRequest, IModelResponse } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICheckboxChange } from "interfaces";
import { MANUFACTURERS_SELECT_LIST_API, CATEGORIES_API, MODELS_API, DEPRECIATIONS_API, FIELDSET_API } from "api/baseApi";

type ModelEditProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IModelResponse | undefined;
};

export const ModelEdit = (props: ModelEditProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<IModelResponse>();
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        setChecked(props.data?.requestable === true ? true : false)
    }, [props])

    const t = useTranslate();

    const { form, formProps } = useForm<IModelRequest>({
        action: "edit",
    });

    const { setFields } = form;

    const { selectProps: manufacturersSelectProps } = useSelect<IModel>({
        resource: MANUFACTURERS_SELECT_LIST_API,
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
        resource: CATEGORIES_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: depreciationsSelectProps } = useSelect<IModel>({
        resource: DEPRECIATIONS_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: fieldsetSelectProps } = useSelect<IModel>({
        resource: FIELDSET_API,
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
        url: MODELS_API + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: IModelRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        if (event.manufacturer !== undefined) formData.append("manufacturer_id", event.manufacturer);
        if (event.category !== undefined) formData.append("category_id", event.category.toString());
        formData.append("model_number", event.model_number);
        if (event.depreciation !== undefined) formData.append("depreciation_id", event.depreciation);
        if (event.eol !== undefined && event.eol !== "None") formData.append("eol", event.eol.toString());
        if (event.fieldset !== undefined) formData.append("fieldset_id", event.fieldset);
        formData.append("notes", event.notes);

        if (typeof event.image !== "string" && event.image !== undefined && event.image !== null) formData.append("image", event.image);
        formData.append("requestable", checked ? "1" : "0");

        formData.append("_method", "PATCH");
        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setFile(undefined);
        setFields([
            { name: "name", value: data?.name },
            { name: "manufacturer", value: data?.manufacturer.id },
            { name: "model_number", value: data?.model_number },
            { name: "category", value: data?.category.id },
            { name: "depreciation", value: data?.depreciation.name },
            { name: "eol", value: data?.eol && data.eol.split(" ")[0] },
            { name: "fieldset", value: data?.fieldset },
            { name: "notes", value: data?.notes },
            { name: "requestable", value: data?.requestable },
            { name: "image", value: data?.image },
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
            setFile(undefined);
            setIsModalVisible(false);
            setMessageErr(messageErr);
        } else {
            setMessageErr(updateData?.data.messages);
        }
    }, [updateData]);

    useEffect(() => {
        form.setFieldsValue({
            image: file,
        });
    }, [file]);

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
                        label={t("model.label.field.name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("model.label.field.name") +
                                    " " +
                                    t("model.label.message.required"),
                            },
                        ]}
                        initialValue={data?.name}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.name && (
                        <Typography.Text type="danger">
                            {messageErr.name[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("model.label.field.manufacturer")}
                        name="manufacturer"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("model.label.field.manufacturer") +
                                    " " +
                                    t("model.label.message.required"),
                            },
                        ]}
                        initialValue={data?.manufacturer.id}
                    >
                        <Select
                            placeholder={t("model.label.placeholder.manufacturer")}
                            {...manufacturersSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.manufacturer && (
                        <Typography.Text type="danger">
                            {messageErr.manufacturer}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("model.label.field.category")}
                        name="category"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("model.label.field.category") +
                                    " " +
                                    t("model.label.message.required"),
                            },
                        ]}
                        initialValue={data?.category.id}
                    >
                        <Select
                            placeholder={t("hardware.label.placeholder.propertyType")}
                            {...categorySelectProps}
                        />
                    </Form.Item>
                    {messageErr?.category && (
                        <Typography.Text type="danger">
                            {messageErr.category}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("model.label.field.model_number")}
                        name="model_number"
                        initialValue={data?.model_number}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.model_number && (
                        <Typography.Text type="danger">
                            {messageErr.model_number[0]}
                        </Typography.Text>
                    )}


                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("model.label.field.depreciation")}
                        name="depreciation"
                        initialValue={data?.depreciation.id}
                    >
                        <Select {...depreciationsSelectProps} />
                    </Form.Item>
                    {messageErr?.depreciation && (
                        <Typography.Text type="danger">
                            {messageErr.depreciation}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("model.label.field.eol")}
                        name="eol"
                        initialValue={data?.eol && data?.eol.split(" ")[0]}
                    >
                        <Input
                            type="number"
                            addonAfter={t("model.label.field.month")}
                            value={data?.eol && data?.eol.split(" ")[0]}
                        />
                    </Form.Item>
                    {messageErr?.eol && (
                        <Typography.Text type="danger">
                            {messageErr.eol[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("model.label.field.fieldset")}
                        name="fieldset"
                        initialValue={data?.fieldset}
                    >
                        <Select {...fieldsetSelectProps} />
                    </Form.Item>
                    {messageErr?.fieldset && (
                        <Typography.Text type="danger">
                            {messageErr.fieldset[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>

            <Form.Item
                label={t("model.label.field.notes")}
                name="notes"
                initialValue={data?.notes}
            >
                <Input.TextArea value={data?.notes} />
            </Form.Item>
            {messageErr?.notes && (
                <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
            )}

            <Checkbox
                name="requestable"
                style={{ marginTop: 20 }}
                checked={checked}
                value={data?.requestable}
                onChange={(event: ICheckboxChange) => {
                    setChecked(event.target.checked)
                }}
            ></Checkbox> {t("model.label.field.checkbox")}

            <Form.Item label={t("model.label.field.image")} name="image" initialValue={data?.image}>
                {data?.image ? (
                    <UploadImage
                        id={"update" + data?.id}
                        url={data?.image}
                        file={file}
                        setFile={setFile}
                    ></UploadImage>
                ) : (
                    <UploadImage file={file} setFile={setFile}></UploadImage>
                )}
            </Form.Item>
            {messageErr?.image && (
                <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
            )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("model.label.button.update")}
                </Button>
            </div>
        </Form>
    );
};
