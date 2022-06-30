/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    Select,
    useForm,
    Button,
    Row,
    Col,
    Typography,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { UploadImage } from "components/elements/uploadImage";
import { ISupplierRequest } from "interfaces/supplier";
import TextArea from "antd/lib/input/TextArea";
import { SUPPLIERS_API } from "api/baseApi";

type SupplierEditProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: ISupplierRequest | undefined;
};

export const SupplierEdit = (props: SupplierEditProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<ISupplierRequest>();

    const t = useTranslate();

    const { form, formProps } = useForm<ISupplierRequest>({
        action: "edit",
    });

    const { setFields } = form;

    const {
        refetch,
        data: updateData,
        isLoading,
    } = useCustom({
        url: SUPPLIERS_API + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: ISupplierRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        if (event.address !== undefined) { formData.append("address", event.address); }
        if (event.city !== undefined) formData.append("city", event.city);
        if (event.state !== undefined) formData.append("state", event.state);
        if (event.country !== undefined) { formData.append("country", event.country); }
        if (event.contact !== undefined) { formData.append("contact", event.contact); }
        if (event.phone !== undefined) { formData.append("phone", event.phone); }
        if (event.fax !== undefined) formData.append("fax", event.fax);
        if (event.zip !== undefined) formData.append("zip", event.zip);
        if (event.email !== undefined) formData.append("email", event.email);
        if (event.url !== undefined) formData.append("url", event.url);
        if (event.notes !== undefined) formData.append("notes", event.notes);

        if (typeof event.image !== "string" && event.image !== null && event.image !== undefined) formData.append("image", event.image);

        formData.append("_method", "PATCH");
        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setFile(undefined);
        setFields([
            { name: "name", value: data?.name },
            { name: "address", value: data?.address },
            { name: "city", value: data?.city },
            { name: "state", value: data?.state },
            { name: "country", value: data?.country },
            { name: "contact", value: data?.contact },
            { name: "phone", value: data?.phone },
            { name: "fax", value: data?.fax },
            { name: "zip", value: data?.zip },
            { name: "email", value: data?.email },
            { name: "notes", value: data?.notes !== "null" ? data?.notes : "" },
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
                        label={t("supplier.label.field.name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("supplier.label.field.name") +
                                    " " +
                                    t("supplier.label.message.required"),
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
                        label={t("supplier.label.field.address")}
                        name="address"
                        initialValue={data?.address}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.address && (
                        <Typography.Text type="danger">
                            {messageErr.address[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("supplier.label.field.city")}
                        name="city"
                        initialValue={data?.city}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.city && (
                        <Typography.Text type="danger">
                            {messageErr.city[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("supplier.label.field.state")}
                        name="state"
                        initialValue={data?.state}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.state && (
                        <Typography.Text type="danger">
                            {messageErr.state[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("supplier.label.field.country")}
                        name="country"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("supplier.label.field.country") +
                                    " " +
                                    t("supplier.label.message.required"),
                            },
                        ]}
                        initialValue={data?.country}
                    >
                        <Select
                            options={[
                                {
                                    label: "Việt Nam",
                                    value: "VN",
                                },
                                {
                                    label: "England",
                                    value: "EN",
                                },
                            ]}
                        />
                    </Form.Item>
                    {messageErr?.country && (
                        <Typography.Text type="danger">
                            {messageErr.country[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("supplier.label.field.zip")}
                        name="zip"
                        initialValue={data?.zip}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.zip && (
                        <Typography.Text type="danger">
                            {messageErr.zip[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("supplier.label.field.contact")}
                        name="contact"
                        initialValue={data?.contact}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.contact && (
                        <Typography.Text type="danger">
                            {messageErr.contact[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("supplier.label.field.phone")}
                        name="phone"
                        initialValue={data?.phone}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.phone && (
                        <Typography.Text type="danger">
                            {messageErr.phone[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("supplier.label.field.fax")}
                        name="fax"
                        initialValue={data?.fax}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.fax && (
                        <Typography.Text type="danger">
                            {messageErr.fax[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("supplier.label.field.email")}
                        name="email"
                        initialValue={data?.email}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.email && (
                        <Typography.Text type="danger">
                            {messageErr.email[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>

            <Form.Item
                label={t("supplier.label.field.url")}
                name="url"
                initialValue={data?.url}
            >
                <Input />
            </Form.Item>
            {messageErr?.url && (
                <Typography.Text type="danger">{messageErr.url[0]}</Typography.Text>
            )}

            <Form.Item
                label={t("supplier.label.field.notes")}
                name="notes"
                initialValue={data?.notes}
            >
                <TextArea />
            </Form.Item>
            {messageErr?.notes && (
                <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
            )}
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
                    {t("supplier.label.button.update")}
                </Button>
            </div>
        </Form>
    );
};
