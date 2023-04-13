/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    Select,
    useSelect,
    useForm,
    Button,
    Row,
    Col,
    Typography,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
    ISoftwareRequestMultipleCheckout,
} from "interfaces/software"

import { USERS_API, SOFTWARE_CHECKOUT_API, LICENSES_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import moment from "moment";

type LicensesCheckoutProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: any;
};

export const LicensesCheckout = (props: LicensesCheckoutProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [messageErr, setMessageErr] = useState<ISoftwareRequestMultipleCheckout>();

    const t = useTranslate();

    const { formProps, form } = useForm<ISoftwareRequestMultipleCheckout>({
        action: "create",
    });

    const { selectProps: userSelectProps } = useSelect<ICompany>({
        resource: USERS_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { mutate, data: dataCheckout, isLoading } = useCreate();

    const onFinish = (event: ISoftwareRequestMultipleCheckout) => {
        mutate({
            resource: LICENSES_API + "/" + data.id + "/checkout",
            values: {
                checkout_at: event.checkout_at,
                assigned_user: event.assigned_user,
                notes: event.notes !== null ? event.notes : "",
            },
        });
    };

    const { setFields } = form;
      useEffect(() => {
        form.resetFields();
        setFields([
          { name: "licenses", value: data?.licenses },
          { name: "software", value: data?.software },
          { name: "notes", value: data?.note ? data?.note : "" },
          {
            name: "checkout_at",
            value: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
          },
        ]);
      }, [data, form, isModalVisible, setFields]);

    useEffect(() => {
        if (dataCheckout?.data.status === "success") {
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(messageErr);
        }
    }, [dataCheckout, form, setIsModalVisible]);

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
                        label={t("licenses.label.field.licenses")}
                        name="licenses"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.software") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={data?.licenses}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                        label={t("licenses.label.field.software")}
                        name="software"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.software") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={data?.software}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("licenses.label.field.checkoutTo")}
                        name="assigned_user"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("licenses.label.field.user") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                    >
                        <Select
                            placeholder={t("licenses.label.placeholder.user")}
                            {...userSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.assigned_user && (
                        <Typography.Text type="danger">
                            {messageErr.assigned_user[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("licenses.label.field.dateCheckout")}
                        name="checkout_at"
                        rules={[
                            {
                                required: false,
                                message:
                                    t("licenses.label.field.dateCheckout") +
                                    " " +
                                    t("licenses.label.message.required"),
                            },
                        ]}
                        initialValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                    {messageErr?.checkout_at && (
                        <Typography.Text type="danger">
                            {messageErr.checkout_at[0]}
                        </Typography.Text>
                    )}
                </Col>
            </Row>

            <Form.Item
                label={t("licenses.label.field.notes")}
                name="note"
                rules={[
                    {
                        required: false,
                        message:
                            t("licenses.label.field.notes") +
                            " " +
                            t("licenses.label.message.required"),
                    },
                ]}
                initialValue={data?.note}
            >
                <Input.TextArea value={data?.note} />
            </Form.Item>

            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("licenses.label.button.checkout")}
                </Button>
            </div>
        </Form>
    );
};
