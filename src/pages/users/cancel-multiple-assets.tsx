/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    useForm,
    Button,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
    IHardwareRequestCheckout,
    IHardwareRequestMultipleCancel,
    IHardwareRequestMultipleCheckout,
} from "interfaces/hardware";
import { HARDWARE_API } from "api/baseApi";

type HardwareCancelProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: any;
    setSelectedRowKey: any;
};

export const HardwareCancelMultipleAsset = (props: HardwareCancelProps) => {
    const { setIsModalVisible, data, isModalVisible, setSelectedRowKey } = props;
    const [messageErr, setMessageErr] = useState<IHardwareRequestCheckout>();

    const t = useTranslate();

    const { formProps, form } = useForm<IHardwareRequestMultipleCheckout>({
        action: "create",
    });

    const { mutate, data: dataCancel, isLoading } = useCreate();

    const onFinish = (event: IHardwareRequestMultipleCancel) => {
        mutate({
            resource: HARDWARE_API + "?_method=PUT",
            values: {
                assets: event.assets,
                assigned_status: 3,
                reason: event.reason
            },
        });
    };

    const { setFields } = form;
    useEffect(() => {
        form.resetFields();
        setFields([
            { name: "assets", value: data?.map((item: any) => item.id) },
            { name: "reason", value: data?.reason },
        ]);
    }, [data, form, isModalVisible, setFields]);

    useEffect(() => {
        if (dataCancel?.data.status === "success") {
            form.resetFields();
            setIsModalVisible(false);
            setMessageErr(messageErr);
            localStorage.removeItem("selectedRowKeys_AcceptRefuse");
            setSelectedRowKey([]);
        }
    }, [dataCancel, form, setIsModalVisible]);

    useEffect(() => {
        localStorage.removeItem("selectedRowKeys_AcceptRefuse");
    }, [window.location.reload]);

    return (
        <Form
            {...formProps}
            layout="vertical"
            onFinish={(event: any) => {
                onFinish(event);
            }}
        >
            <Form.Item label={t("user.label.field.list_assets")} name="assets">
                {data &&
                    data?.map((item: any) => (
                        <div>
                            {item.asset_tag} - {item.model.name}
                        </div>
                    ))}
            </Form.Item>

            <Form.Item
                label={t("user.label.field.reason")}
                name="reason"
                rules={[
                    {
                        required: false,
                        message:
                            t("user.label.field.reason") +
                            " " +
                            t("user.label.message.required"),
                    },
                ]}
                initialValue={data?.reason}
            >
                <Input.TextArea value={data?.reason} />
            </Form.Item>

            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("user.label.button.cancle")}
                </Button>
            </div>
        </Form>
    );
};
