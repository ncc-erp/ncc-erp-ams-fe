/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
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
    Radio,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import { Tabs } from 'antd';

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import "../../styles/hardware.less";
import {
    DEPARTMENT_SELECT_LIST_API,
    LOCATION_API,
    USERS_API,
} from "api/baseApi";
import { IUser, IUserCreateRequest } from "interfaces/user";
import { ICheckboxChange } from "interfaces";

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

const { TabPane } = Tabs;

const options = [
    {
        label: "",
        value: "0",
    },
    {
        label: "",
        value: "1",
    },
];

export const UserCreate = (props: UserCreateProps) => {
    const { setIsModalVisible } = props;
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();
    const [permissionsAdmin, setPermissionsAdmin] = useState(0);
    const [permissionsSuperUser, setPermissionsSuperUser] = useState(0);

    const t = useTranslate();

    const { formProps, form } = useForm<IUserCreateRequest>({
        action: "create",
    });

    const { selectProps: departmentSelectProps } = useSelect<ICompany>({
        resource: DEPARTMENT_SELECT_LIST_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: userSelectProps } = useSelect<IUser>({
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

    const { selectProps: locationSelectProps } = useSelect<ICompany>({
        resource: LOCATION_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { mutate, data: createData, isLoading } = useCreate();

    const onFinish = (event: IUserCreateRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("first_name", event.first_name);
        formData.append("last_name", event.last_name);
        formData.append("username", event.username);
        formData.append("password", event.password);
        formData.append("password_confirmation", event.password_confirmation);

        if (event.email !== undefined) {
            formData.append("email", event.email);
        }
        if (event.manager !== undefined) {
            formData.append("manager_id", event.manager.toString());
        }
        if (event.department !== undefined) {
            formData.append("department_id", event.department.toString());
        }
        if (event.location !== undefined) {
            formData.append("location_id", event.location.toString());
        }
        if (event.phone !== undefined) {
            formData.append("phone", event.phone.toString());
        }
        if (event.address !== undefined) {
            formData.append("address", event.address);
        }
        if (event.city !== undefined) {
            formData.append("city", event.city);
        }
        if (event.state !== undefined) {
            formData.append("state", event.state);
        }
        if (event.notes !== undefined) {
            formData.append("notes", event.notes);
        }

        if (event.avatar !== undefined) {
            formData.append("image", event.avatar);
        }

        if (event.remote !== undefined) {
            formData.append("remote", event.remote.toString());
        }
        formData.append("activated", "true");
        formData.append("ldap_import", "true");
        formData.append("two_factor_activated", "false");
        formData.append("two_factor_enrolled", "false");

        if (event.permissions !== null) {
            const permissions = JSON.stringify({
                admin: permissionsAdmin,
                superuser: permissionsSuperUser,
            });
            formData.append("permissions", permissions);
        }

        setPayload(formData);
        form.resetFields();
    };

    const onCheckRemote = (event: ICheckboxChange) => {
        if (event.target.checked)
            form.setFieldsValue({
                remote: 1
            });
        else form.setFieldsValue({ remote: 0 });
    };

    useEffect(() => {
        if (payload) {
            mutate({
                resource: "api/v1/users",
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
    }, [createData]);

    useEffect(() => {
        form.setFieldsValue({
            avatar: file,
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
            <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin" key="1">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label={t("user.label.field.first_name")}
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            t("user.label.field.first_name") +
                                            " " +
                                            t("user.label.message.required"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("user.label.placeholder.first_name")} />
                            </Form.Item>
                            {messageErr?.first_name && (
                                <Typography.Text type="danger">
                                    {messageErr.first_name[0]}
                                </Typography.Text>
                            )}
                            <Form.Item
                                label={t("user.label.field.nameUser")}
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            t("user.label.field.nameUser") +
                                            " " +
                                            t("user.label.message.required"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("user.label.placeholder.nameUser")} />
                            </Form.Item>
                            {messageErr?.last_name && (
                                <Typography.Text type="danger">
                                    {messageErr.last_name[0]}
                                </Typography.Text>
                            )}
                            <Form.Item
                                label={t("user.label.field.username")}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            t("user.label.field.username") +
                                            " " +
                                            t("user.label.message.required"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("user.label.placeholder.username")} />
                            </Form.Item>
                            {messageErr?.username && (
                                <Typography.Text type="danger">{messageErr.username}</Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.password")}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            t("user.label.field.password") +
                                            " " +
                                            t("user.label.message.required"),
                                    },
                                ]}
                            >
                                <Input type="password" />
                            </Form.Item>
                            {messageErr?.password && (
                                <Typography.Text type="danger">
                                    {messageErr.password[0]}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.password_confirmation")}
                                name="password_confirmation"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            t("user.label.field.password_confirmation") +
                                            " " +
                                            t("user.label.message.required"),
                                    },
                                ]}
                            >
                                <Input type="password" />
                            </Form.Item>
                            {messageErr?.password_confirmation && (
                                <Typography.Text type="danger">
                                    {messageErr.password_confirmation[0]}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.email")}
                                name="email"
                            >
                                <Input
                                    placeholder={t("user.label.placeholder.email")}
                                />
                            </Form.Item>
                            {messageErr?.email && (
                                <Typography.Text type="danger">
                                    {messageErr.email}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.user_manager")}
                                name="manager"
                            >
                                <Select
                                    {...userSelectProps}
                                    placeholder={t("user.label.placeholder.user_manager")}
                                />
                            </Form.Item>
                            {messageErr?.manager && (
                                <Typography.Text type="danger">
                                    {messageErr.manager}
                                </Typography.Text>
                            )}
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label={t("user.label.field.department")}
                                name="department"
                            >
                                <Select
                                    {...departmentSelectProps}
                                    placeholder={t("user.label.placeholder.department")}
                                />
                            </Form.Item>
                            {messageErr?.department && (
                                <Typography.Text type="danger">
                                    {messageErr.department}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label=""
                                name="remote"
                                valuePropName="checked"
                                style={{ marginBottom: "2.4rem" }}
                            >
                                <Checkbox
                                    onChange={(event) => {
                                        onCheckRemote(event);
                                    }}
                                >
                                    {t("user.label.field.remote_checkbox")}
                                </Checkbox>
                            </Form.Item>
                            {messageErr?.remote && (
                                <Typography.Text type="danger">
                                    {messageErr.remote}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.locations")}
                                name="location"
                            >
                                <Select
                                    {...locationSelectProps}
                                    placeholder={t("user.label.placeholder.locations")}
                                />
                            </Form.Item>
                            {messageErr?.location && (
                                <Typography.Text type="danger">
                                    {messageErr.location}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.phone")}
                                name="phone"
                            >
                                <Input
                                    type="number"
                                    placeholder={t("user.label.placeholder.phone")}
                                />
                            </Form.Item>
                            {messageErr?.phone && (
                                <Typography.Text type="danger">
                                    {messageErr.phone}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.address")}
                                name="address"
                            >
                                <Input
                                />
                            </Form.Item>
                            {messageErr?.address && (
                                <Typography.Text type="danger">
                                    {messageErr.address}
                                </Typography.Text>
                            )}


                            <Form.Item
                                label={t("user.label.field.city")}
                                name="city"
                            >
                                <Input
                                />
                            </Form.Item>
                            {messageErr?.city && (
                                <Typography.Text type="danger">
                                    {messageErr.city}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.state")}
                                name="state"
                            >
                                <Input />
                            </Form.Item>
                            {messageErr?.state && (
                                <Typography.Text type="danger">
                                    {messageErr.state}
                                </Typography.Text>
                            )}
                        </Col>
                    </Row>

                    <Form.Item
                        label={t("user.label.field.note")}
                        name="notes"
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

                    <Form.Item label="Tải hình" name="avatar">
                        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
                    </Form.Item>
                    {messageErr?.avatar && (
                        <Typography.Text type="danger">{messageErr.avatar[0]}</Typography.Text>
                    )}
                    <div className="submit">
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t("user.label.button.create")}
                        </Button>
                    </div>
                </TabPane>
                <TabPane tab="Phân quyền" key="2">
                    <div className="title_permission">
                        <Form.Item name="permissions">
                            <Row gutter={16}>
                                <Typography.Text style={{ marginLeft: "7.5rem" }}>Từ chối</Typography.Text>
                                <Typography.Text style={{ marginLeft: "11rem" }}>Chấp nhận</Typography.Text>
                            </Row>
                            <Row gutter={16}>
                                <Typography.Text style={{ marginRight: "1rem" }}>Super User</Typography.Text>
                                <Radio.Group
                                    options={options}
                                    onChange={event => setPermissionsSuperUser(event.target.value)}
                                    defaultValue={permissionsSuperUser}
                                />
                            </Row>
                            <Row gutter={17}>
                                <Typography.Text style={{ marginRight: "3rem" }}>Admin</Typography.Text>
                                <Radio.Group
                                    options={options}
                                    onChange={event => setPermissionsAdmin(event.target.value)}
                                    defaultValue={permissionsAdmin}
                                />
                            </Row>
                        </Form.Item>
                    </div>
                    <div className="submit">
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t("user.label.button.create")}
                        </Button>
                    </div>
                </TabPane>
            </Tabs>
        </Form >
    );
};
