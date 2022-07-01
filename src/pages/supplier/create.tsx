/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
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

import "../../styles/hardware.less";
import { ISupplierRequest } from "interfaces/supplier";
import TextArea from "antd/lib/input/TextArea";
import { SUPPLIERS_API } from "api/baseApi";

type SupplierCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

export const SupplierCreate = (props: SupplierCreateProps) => {
    const { setIsModalVisible } = props;
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<ISupplierRequest>();

    const t = useTranslate();

    const { formProps, form } = useForm<ISupplierRequest>({
        action: "create",
    });

    const { mutate, data: createData, isLoading } = useCreate();

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

        if (typeof event.image !== "string" && event.image !== undefined && event.image !== null) formData.append("image", event.image);

        setPayload(formData);
    };

    useEffect(() => {
        if (payload) {
            mutate({
                resource: SUPPLIERS_API,
                values: payload,
            });
            if (createData?.data.message) form.resetFields();
        }
    }, [payload]);

    useEffect(() => {
        if (createData?.data.status === "success") {
            form.resetFields();
            setFile(undefined);
            setIsModalVisible(false);
            setMessageErr(messageErr);
        } else {
            setMessageErr(createData?.data.messages);
        }
    }, [createData])

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
            >
                <Input />
            </Form.Item>
            {messageErr?.url && (
                <Typography.Text type="danger">{messageErr.url[0]}</Typography.Text>
            )}

            <Form.Item
                label={t("supplier.label.field.notes")}
                name="notes"
            >
                <TextArea />
            </Form.Item>
            {messageErr?.notes && (
                <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
            )}

            <Form.Item label={t("supplier.label.field.image")} name="image">
                <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
            </Form.Item>
            {messageErr?.image && (
                <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
            )}
            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("supplier.label.button.create")}
                </Button>
            </div>
        </Form>
    )
}