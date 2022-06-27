import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    Select,
    useForm,
    Button,
    Typography,
    useSelect,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { UploadImage } from "components/elements/uploadImage";
import { COMPANY_API, DEPARTMENT_API, LOCATIONS_SELECT_LIST_API, USERS_API } from "api/baseApi";
import { IDepartment, IDepartmentRequest, IDepartmentResponse } from "interfaces/department";

type DepartmentEditProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IDepartmentResponse | undefined;
};

export const DepartmentEdit = (props: DepartmentEditProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<IDepartmentRequest>();

    const t = useTranslate();

    const { form, formProps } = useForm<IDepartmentRequest>({
        action: "edit",
    });

    const { setFields } = form;

    const { selectProps: companySelectProps } = useSelect<IDepartment>({
        resource: COMPANY_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: managerSelectProps } = useSelect<IDepartment>({
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

    const { selectProps: locationSelectProps } = useSelect<IDepartment>({
        resource: LOCATIONS_SELECT_LIST_API,
        optionLabel: "text",
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
        url: DEPARTMENT_API + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: IDepartmentRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("name", event.name);
        if (event.company !== undefined) { formData.append("company_id", event.company); }
        if (event.manager !== undefined) formData.append("manager_id", event.manager);
        if (event.location !== undefined) formData.append("location_id", event.location);

        if (typeof event.image !== "string" && event.image !== undefined && event.image !== null) formData.append("image", event.image);

        formData.append("_method", "PATCH");
        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setFile(undefined);
        setFields([
            { name: "name", value: data?.name },
            { name: "company", value: data?.company.id },
            { name: "manager", value: data?.manager.id },
            { name: "location", value: data?.location.id },
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
            <Form.Item
                label={t("department.label.field.name")}
                name="name"
                rules={[
                    {
                        required: true,
                        message:
                            t("department.label.field.name") +
                            " " +
                            t("department.label.message.required"),
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
                label={t("department.label.field.company")}
                name="company"
                initialValue={data?.company.id}
            >
                <Select placeholder={t("department.label.placeholder.company")}
                    {...companySelectProps} />
            </Form.Item>
            {messageErr?.company && (
                <Typography.Text type="danger">
                    {messageErr.company[0]}
                </Typography.Text>
            )}

            <Form.Item
                label={t("department.label.field.manager")}
                name="manager"
                initialValue={data?.manager.id}
            >
                <Select placeholder={t("department.label.placeholder.manager")}
                    {...managerSelectProps} />
            </Form.Item>
            {messageErr?.manager && (
                <Typography.Text type="danger">
                    {messageErr.manager[0]}
                </Typography.Text>
            )}

            <Form.Item
                label={t("department.label.field.location")}
                name="location"
                initialValue={data?.location.id}
            >
                <Select placeholder={t("department.label.placeholder.location")}
                    {...locationSelectProps} />
            </Form.Item>
            {messageErr?.location && (
                <Typography.Text type="danger">
                    {messageErr.location[0]}
                </Typography.Text>
            )}

            <Form.Item label={t("department.label.field.image")} name="image" initialValue={data?.image}>
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
                    {t("department.label.button.update")}
                </Button>
            </div>
        </Form>
    );
};
