/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCustom } from "@pankod/refine-core";
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

import { Tabs, Collapse, Radio } from 'antd';

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import "../../styles/hardware.less";
import { ICheckboxChange } from "interfaces";
import {
    DEPARTMENT_SELECT_LIST_API,
    LOCATION_API,
    USERS_API,
} from "api/baseApi";
import { IUser, IUserCreateRequest, IUserResponse } from "interfaces/user";
import "styles/antd.less";

const RadioGroup = Radio.Group;

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IUserResponse | undefined;
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

export const UserEdit = (props: UserCreateProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<any>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();
    const [checkedRemote, setCheckedRemote] = useState(true);
    const [permissionsAdmin, setPermissionsAdmin] = useState(props?.data?.permissions && props?.data?.permissions.admin);
    const [permissionsSuperUser, setPermissionsSuperUser] = useState(props?.data?.permissions && props.data?.permissions.superuser);

    useEffect(() => {
        setCheckedRemote(props.data?.remote === true ? true : false);
    }, [props]);

    const t = useTranslate();

    const { form, formProps } = useForm<IUserCreateRequest>({
        action: "edit",
    });

    const { setFields } = form;

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

    const {
        refetch,
        data: updateData,
        isLoading,
    } = useCustom({
        url: "api/v1/users" + "/" + data?.id,
        method: "post",
        config: {
            payload: payload,
        },
        queryOptions: {
            enabled: false,
        },
    });

    const onFinish = (event: IUserCreateRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("first_name", event.first_name);
        formData.append("last_name", event.last_name);
        formData.append("username", event.username);

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
        if (event.phone !== null) {
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

        if (event.avatar !== undefined && typeof (event.avatar) !== "string") {
            formData.append("avatar", event.avatar);
        }

        formData.append("remote", checkedRemote ? "1" : "0");
        formData.append("ldap_import", "true");
        formData.append("two_factor_activated", "false");
        formData.append("two_factor_enrolled", "false");

        const permissions = JSON.stringify({
            admin: permissionsAdmin,
            superuser: permissionsSuperUser,
        });
        formData.append("permissions", permissions);

        formData.append("_method", "PUT");
        setPayload(formData);
    };

    useEffect(() => {
        form.resetFields();
        setFile(undefined);
        setFields([
            { name: "first_name", value: data?.first_name },
            { name: "last_name", value: data?.last_name },
            { name: "username", value: data?.username },
            { name: "email", value: data?.email },
            { name: "manager", value: data?.manager.id },
            { name: "department", value: data?.department.id },
            { name: "location", value: data?.location.id },
            { name: "remote", value: data?.remote },
            { name: "phone", value: data?.phone },
            { name: "address", value: data?.address !== "null" ? data?.address : "" },
            { name: "city", value: data?.city !== "null" ? data?.city : "" },
            { name: "state", value: data?.state !== "nul" ? data?.state : "" },
            { name: "notes", value: data?.notes },
            { name: "avatar", value: data?.avatar },
            {
                name: "permissions",
                value: [
                    { name: "admin", value: data?.permissions ? data?.permissions.admin : "" },
                    { name: "superuser", value: data?.permissions ? data?.permissions.superuser : "" },
                ],
            },
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
                                initialValue={data?.first_name}
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
                                initialValue={data?.last_name}
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
                                initialValue={data?.username}
                            >
                                <Input />
                            </Form.Item>
                            {messageErr?.username && (
                                <Typography.Text type="danger">
                                    {messageErr.username[0]}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.email")}
                                name="email"
                                initialValue={data?.email}
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
                                initialValue={data?.manager.id}
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

                            <Form.Item
                                label={t("user.label.field.department")}
                                name="department"
                                initialValue={data?.department.id}
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

                            <Checkbox
                                name="remote"
                                style={{ marginTop: 20, marginBottom: "1.8rem" }}
                                checked={checkedRemote}
                                value={data?.remote}
                                onChange={(event: ICheckboxChange) => {
                                    setCheckedRemote(event.target.checked);
                                }}
                            ></Checkbox>{" "}
                            {t("user.label.field.remote_checkbox")}
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label={t("user.label.field.locations")}
                                name="location"
                                initialValue={data?.location.id}
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
                                initialValue={data?.phone}
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
                                initialValue={data?.address}
                            >
                                <Input />
                            </Form.Item>
                            {messageErr?.address && (
                                <Typography.Text type="danger">
                                    {messageErr.address}
                                </Typography.Text>
                            )}

                            <Form.Item
                                label={t("user.label.field.city")}
                                name="city"
                                initialValue={data?.city}
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
                                initialValue={data?.state}
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
                        initialValue={data?.notes}
                    >
                        <Input.TextArea value={data?.notes} />
                    </Form.Item>
                    {messageErr?.notes && (
                        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
                    )}

                    <Form.Item label="Tải hình" name="avatar" initialValue={data?.avatar}>
                        {data?.avatar ? (
                            <UploadImage
                                id={"update" + data?.id}
                                url={data?.avatar}
                                file={file}
                                setFile={setFile}
                            ></UploadImage>
                        ) : (
                            <UploadImage file={file} setFile={setFile}></UploadImage>
                        )}
                    </Form.Item>
                    {messageErr?.avatar && (
                        <Typography.Text type="danger">{messageErr.avatar[0]}</Typography.Text>
                    )}

                    <div className="submit">
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t("user.label.button.update")}
                        </Button>
                    </div>
                </TabPane>
                <TabPane tab="Phân quyền" key="2">
                    <div className="title_permission">
                        <Form.Item
                            label=""
                            name="permissions"
                            initialValue={data?.permissions}
                        >
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
                            {t("user.label.button.update")}
                        </Button>
                    </div>
                </TabPane>
            </Tabs >
        </Form >
    );
};
