/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
import { Form, Input, Button, useForm } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import "../../styles/hardware.less";
import { W2REQUEST_API } from "api/baseApi";

type RejectRequestProps = {
    refreshData: () => void;
    setIsModalVisible: (data: boolean) => void;
    id: string;
};

export const CancelRequest = (props: RejectRequestProps) => {
    const { id, setIsModalVisible, refreshData } = props;
    const { open } = useNotification();
    const t = useTranslate();
    const { form } = useForm<{ reason: string }>();
    form.resetFields();

    const onFinish = (e: any) => {
        mutate({
            resource: W2REQUEST_API + "/reject-request",
            values: {
                id: id,
                reason: e.reason,
            },
            successNotification: false,
            errorNotification: false,
        }, {
            onSuccess(data) {
                setIsModalVisible(false);
                open?.({
                    type: 'success',
                    description: 'Success',
                    message: data?.data.messages
                })
                refreshData();
            },
            onError(error) {
                open?.({
                    type: 'error',
                    description: 'Error',
                    message: error?.response?.data.messages,
                });
                form.resetFields();
            }
        })
    };

    const { mutate, isLoading: isFetching } = useCreate();

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(e) => onFinish(e)}
        >
            <Form.Item
                label={t("user.label.field.reason")}
                name="reason"
                rules={[
                    {
                        required: true,
                        message:
                            t("user.label.field.reason") +
                            " " +
                            t("user.label.message.required"),
                    },
                ]}
            >
                <Input.TextArea placeholder={t("user.label.field.inputReason")} />
            </Form.Item>

            <div className="submit">
                <Button type="primary" htmlType="submit" loading={isFetching}>
                    {t("user.label.button.cancle")}
                </Button>
            </div>
        </Form>
    );
};
