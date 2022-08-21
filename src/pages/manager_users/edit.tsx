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

import { Tabs, Radio } from "antd";

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
import { AccessType } from "constants/assets";

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IUserResponse | undefined;
};

const { TabPane } = Tabs;

const options = [
    {
        label: "",
        value: AccessType.allow,
    },
    {
        label: "",
        value: AccessType.refuse,
    },
    {
        label: "",
        value: AccessType.can,
    },
];

export const UserEdit = (props: UserCreateProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const t = useTranslate();

    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<any>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();
    const [checkedRemote, setCheckedRemote] = useState(true);

    const [permissionsAdmin, setPermissionsAdmin] = useState(data?.permissions && data?.permissions.admin);
    const [permissionsSuperUser, setPermissionsSuperUser] = useState(data?.permissions && data?.permissions.superuser);

    const actions = {
        import: data?.permissions && data?.permissions.import,
        reports_view: props?.data?.permissions && props?.data?.permissions["reports.view"],

        assets: {
            view: props?.data?.permissions && props?.data?.permissions["assets.view"],
            create: props?.data?.permissions && props?.data?.permissions["assets.create"],
            edit: props?.data?.permissions && props?.data?.permissions["assets.edit"],
            delete: props?.data?.permissions && props?.data?.permissions["assets.delete"],
            checkout: props?.data?.permissions && props?.data?.permissions["assets.checkout"],
            checkin: props?.data?.permissions && props?.data?.permissions["assets.checkin"],
            audit: props?.data?.permissions && props?.data?.permissions["assets.audit"],
            view_requestable: props?.data?.permissions && props?.data?.permissions["assets.view.requestable"]
        },
        accessories: {
            view: props?.data?.permissions && props?.data?.permissions["accessories.view"],
            create: props?.data?.permissions && props?.data?.permissions["accessories.create"],
            edit: props?.data?.permissions && props?.data?.permissions["accessories.edit"],
            delete: props?.data?.permissions && props?.data?.permissions["accessories.delete"],
            checkout: props?.data?.permissions && props?.data?.permissions["accessories.checkout"],
            checkin: props?.data?.permissions && props?.data?.permissions["accessories.checkin"]
        },
        consumables: {
            view: props?.data?.permissions && props?.data?.permissions["consumables.view"],
            create: props?.data?.permissions && props?.data?.permissions["consumables.create"],
            edit: props?.data?.permissions && props?.data?.permissions["consumables.edit"],
            delete: props?.data?.permissions && props?.data?.permissions["consumables.delete"],
            checkout: props?.data?.permissions && props?.data?.permissions["consumables.checkout"]
        },
        licenses: {
            view: props?.data?.permissions && props?.data?.permissions["licenses.view"],
            create: props?.data?.permissions && props?.data?.permissions["licenses.create"],
            edit: props?.data?.permissions && props?.data?.permissions["licenses.edit"],
            delete: props?.data?.permissions && props?.data?.permissions["licenses.delete"],
            checkout: props?.data?.permissions && props?.data?.permissions["licenses.checkout"],
            keys: props?.data?.permissions && props?.data?.permissions["licenses.keys"],
            files: props?.data?.permissions && props?.data?.permissions["licenses.files"]
        },
        users: {
            view: data?.permissions && props?.data?.permissions["users.view"],
            create: data?.permissions && props?.data?.permissions["users.create"],
            edit: data?.permissions && props?.data?.permissions["users.edit"],
            delete: data?.permissions && props?.data?.permissions["users.delete"]
        },
        models: {
            view: data?.permissions && props?.data?.permissions["models.view"],
            create: data?.permissions && props?.data?.permissions["models.create"],
            edit: data?.permissions && props?.data?.permissions["models.edit"],
            delete: data?.permissions && props?.data?.permissions["models.delete"]
        },
        categories: {
            view: data?.permissions && props?.data?.permissions["categories.view"],
            create: data?.permissions && props?.data?.permissions["categories.create"],
            edit: data?.permissions && props?.data?.permissions["categories.edit"],
            delete: data?.permissions && props?.data?.permissions["categories.delete"]
        },
        departments: {
            view: data?.permissions && data?.permissions["departments.view"],
            create: data?.permissions && data?.permissions["departments.create"],
            edit: data?.permissions && data?.permissions["departments.edit"],
            delete: data?.permissions && data?.permissions["departments.delete"]
        },
        statuslabels: {
            view: data?.permissions && data?.permissions["statuslabels.view"],
            create: data?.permissions && data?.permissions["statuslabels.create"],
            edit: data?.permissions && data?.permissions["statuslabels.edit"],
            delete: data?.permissions && data?.permissions["statuslabels.delete"]
        },
        customfields: {
            view: data?.permissions && data?.permissions["customfields.view"],
            create: data?.permissions && data?.permissions["customfields.create"],
            edit: data?.permissions && data?.permissions["customfields.edit"],
            delete: data?.permissions && data?.permissions["customfields.delete"]
        },
        suppliers: {
            view: data?.permissions && data?.permissions["suppliers.view"],
            create: data?.permissions && data?.permissions["suppliers.create"],
            edit: data?.permissions && data?.permissions["suppliers.edit"],
            delete: data?.permissions && data?.permissions["suppliers.delete"]
        },
        manufacturers: {
            view: data?.permissions && data?.permissions["manufacturers.view"],
            create: data?.permissions && data?.permissions["manufacturers.create"],
            edit: data?.permissions && data?.permissions["manufacturers.edit"],
            delete: data?.permissions && data?.permissions["manufacturers.delete"]
        },
        locations: {
            view: data?.permissions && data?.permissions["locations.view"],
            create: data?.permissions && data?.permissions["locations.create"],
            edit: data?.permissions && data?.permissions["locations.edit"],
            delete: data?.permissions && data?.permissions["locations.delete"]
        }
    }
    const [permissionActions, setPermissionActions] = useState(actions);

    useEffect(() => {
        setCheckedRemote(props.data?.remote === true ? true : false);
    }, [props]);

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
        if (event.last_name !== undefined) {
            formData.append("last_name", event.last_name);
        }
        if (event.username !== undefined) {
            formData.append("username", event.username);
        }
        if (event.password !== undefined) {
            formData.append("password", event.password);
        }
        if (event.password_confirmation !== undefined) {
            formData.append("password_confirmation", event.password_confirmation);
        }
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
        if (event.address !== null) {
            formData.append("address", event.address);
        }
        if (event.city !== null) {
            formData.append("city", event.city);
        }
        if (event.state !== null) {
            formData.append("state", event.state);
        }
        if (event.notes !== undefined) {
            formData.append("notes", event.notes);
        }
        if (event.avatar !== undefined) {
            formData.append("image", event.avatar);
        }
        formData.append("remote", checkedRemote ? AccessType.allow : AccessType.refuse);

        const permissions = JSON.stringify({
            admin: permissionsAdmin,
            superuser: permissionsSuperUser,

            "import": permissionActions.import,
            "reports.view": permissionActions.reports_view,

            "assets.view": permissionActions.assets.view,
            "assets.create": permissionActions.assets.create,
            "assets.edit": permissionActions.assets.edit,
            "assets.delete": permissionActions.assets.delete,
            "assets.checkin": permissionActions.assets.checkin,
            "assets.checkout": permissionActions.assets.checkout,
            "assets.audit": permissionActions.assets.audit,
            "assets.view.requestable": permissionActions.assets.view_requestable,

            "accessories.view": permissionActions.accessories.view,
            "accessories.create": permissionActions.accessories.create,
            "accessories.edit": permissionActions.accessories.edit,
            "accessories.delete": permissionActions.accessories.delete,
            "accessories.checkin": permissionActions.accessories.checkin,
            "accessories.checkout": permissionActions.accessories.checkout,

            "consumables.view": permissionActions.consumables.view,
            "consumables.create": permissionActions.consumables.create,
            "consumables.edit": permissionActions.consumables.edit,
            "consumables.delete": permissionActions.consumables.delete,
            "consumables.checkout": permissionActions.consumables.checkout,

            "licenses.view": permissionActions.licenses.view,
            "licenses.create": permissionActions.licenses.create,
            "licenses.edit": permissionActions.licenses.edit,
            "licenses.delete": permissionActions.licenses.delete,
            "licenses.checkout": permissionActions.licenses.checkout,
            "licenses.keys": permissionActions.licenses.keys,
            "licenses.files": permissionActions.licenses.files,

            "users.view": permissionActions.users.view,
            "users.create": permissionActions.users.create,
            "users.edit": permissionActions.users.edit,
            "users.delete": permissionActions.users.delete,

            "models.view": permissionActions.models.view,
            "models.create": permissionActions.models.create,
            "models.edit": permissionActions.models.edit,
            "models.delete": permissionActions.models.delete,

            "categories.view": permissionActions.categories.view,
            "categories.create": permissionActions.categories.create,
            "categories.edit": permissionActions.categories.edit,
            "categories.delete": permissionActions.categories.delete,

            "departments.view": permissionActions.departments.view,
            "departments.create": permissionActions.departments.create,
            "departments.edit": permissionActions.departments.edit,
            "departments.delete": permissionActions.departments.delete,

            "statuslabels.view": permissionActions.statuslabels.view,
            "statuslabels.create": permissionActions.statuslabels.create,
            "statuslabels.edit": permissionActions.statuslabels.edit,
            "statuslabels.delete": permissionActions.statuslabels.delete,

            "customfields.view": permissionActions.customfields.view,
            "customfields.create": permissionActions.customfields.create,
            "customfields.edit": permissionActions.customfields.edit,
            "customfields.delete": permissionActions.customfields.delete,

            "suppliers.view": permissionActions.suppliers.view,
            "suppliers.create": permissionActions.suppliers.create,
            "suppliers.edit": permissionActions.suppliers.edit,
            "suppliers.delete": permissionActions.suppliers.delete,

            "manufacturers.view": permissionActions.manufacturers.view,
            "manufacturers.create": permissionActions.manufacturers.create,
            "manufacturers.edit": permissionActions.manufacturers.edit,
            "manufacturers.delete": permissionActions.manufacturers.delete,

            "locations.view": permissionActions.locations.view,
            "locations.create": permissionActions.locations.create,
            "locations.edit": permissionActions.locations.edit,
            "locations.delete": permissionActions.locations.delete,
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
            { name: "password", value: data?.password },
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

            { name: "admin", value: data?.permissions ? data?.permissions.admin : "" },
            { name: "superuser", value: data?.permissions ? data?.permissions.superuser : "" },

            { name: "import", value: data?.permissions ? data?.permissions.import : "" },
            { name: "reports.view", value: data?.permissions ? data?.permissions["reports.view"] : "" },

            { name: "assets.view", value: data?.permissions ? data?.permissions["assets.view"] : "" },
            { name: "assets.create", value: data?.permissions ? data?.permissions["assets.create"] : "" },
            { name: "assets.edit", value: data?.permissions ? data?.permissions["assets.edit"] : "" },
            { name: "assets.delete", value: data?.permissions ? data?.permissions["assets.delete"] : "" },
            { name: "assets.checkout", value: data?.permissions ? data?.permissions["assets.checkout"] : "" },
            { name: "assets.checkin", value: data?.permissions ? data?.permissions["assets.checkin"] : "" },
            { name: "assets.audit", value: data?.permissions ? data?.permissions["assets.audit"] : "" },
            { name: "assets.view.requestable", value: data?.permissions ? data?.permissions["assets.view.requestable"] : "" },

            { name: "accessories.view", value: data?.permissions ? data?.permissions["accessories.view"] : "" },
            { name: "accessories.create", value: data?.permissions ? data?.permissions["accessories.create"] : "" },
            { name: "accessories.edit", value: data?.permissions ? data?.permissions["accessories.edit"] : "" },
            { name: "accessories.delete", value: data?.permissions ? data?.permissions["accessories.delete"] : "" },
            { name: "accessories.checkout", value: data?.permissions ? data?.permissions["accessories.checkout"] : "" },
            { name: "accessories.checkin", value: data?.permissions ? data?.permissions["accessories.checkin"] : "" },

            { name: "consumables.view", value: data?.permissions ? data?.permissions["consumables.view"] : "" },
            { name: "consumables.create", value: data?.permissions ? data?.permissions["consumables.create"] : "" },
            { name: "consumables.edit", value: data?.permissions ? data?.permissions["consumables.edit"] : "" },
            { name: "consumables.delete", value: data?.permissions ? data?.permissions["consumables.delete"] : "" },
            { name: "consumables.checkout", value: data?.permissions ? data?.permissions["consumables.checkout"] : "" },

            { name: "licenses.view", value: data?.permissions ? data?.permissions["licenses.view"] : "" },
            { name: "licenses.create", value: data?.permissions ? data?.permissions["licenses.create"] : "" },
            { name: "licenses.edit", value: data?.permissions ? data?.permissions["licenses.edit"] : "" },
            { name: "licenses.delete", value: data?.permissions ? data?.permissions["licenses.delete"] : "" },
            { name: "licenses.checkout", value: data?.permissions ? data?.permissions["licenses.checkout"] : "" },
            { name: "licenses.keys", value: data?.permissions ? data?.permissions["licenses.keys"] : "" },
            { name: "licenses.files", value: data?.permissions ? data?.permissions["licenses.files"] : "" },

            { name: "users.view", value: data?.permissions ? data?.permissions["users.view"] : "" },
            { name: "users.create", value: data?.permissions ? data?.permissions["users.create"] : "" },
            { name: "users.edit", value: data?.permissions ? data?.permissions["users.edit"] : "" },
            { name: "users.delete", value: data?.permissions ? data?.permissions["users.delete"] : "" },

            { name: "models.view", value: data?.permissions ? data?.permissions["models.view"] : "" },
            { name: "models.create", value: data?.permissions ? data?.permissions["models.create"] : "" },
            { name: "models.edit", value: data?.permissions ? data?.permissions["models.edit"] : "" },
            { name: "models.delete", value: data?.permissions ? data?.permissions["models.delete"] : "" },

            { name: "categories.view", value: data?.permissions ? data?.permissions["categories.view"] : "" },
            { name: "categories.create", value: data?.permissions ? data?.permissions["categories.create"] : "" },
            { name: "categories.edit", value: data?.permissions ? data?.permissions["categories.edit"] : "" },
            { name: "categories.delete", value: data?.permissions ? data?.permissions["categories.delete"] : "" },

            { name: "departments.view", value: data?.permissions ? data?.permissions["departments.view"] : "" },
            { name: "departments.create", value: data?.permissions ? data?.permissions["departments.create"] : "" },
            { name: "departments.edit", value: data?.permissions ? data?.permissions["departments.edit"] : "" },
            { name: "departments.delete", value: data?.permissions ? data?.permissions["departments.delete"] : "" },

            { name: "statuslabels.view", value: data?.permissions ? data?.permissions["statuslabels.view"] : "" },
            { name: "statuslabels.create", value: data?.permissions ? data?.permissions["statuslabels.create"] : "" },
            { name: "statuslabels.edit", value: data?.permissions ? data?.permissions["statuslabels.edit"] : "" },
            { name: "statuslabels.delete", value: data?.permissions ? data?.permissions["statuslabels.delete"] : "" },

            { name: "customfields.view", value: data?.permissions ? data?.permissions["customfields.view"] : "" },
            { name: "customfields.create", value: data?.permissions ? data?.permissions["customfields.create"] : "" },
            { name: "customfields.edit", value: data?.permissions ? data?.permissions["customfields.edit"] : "" },
            { name: "customfields.delete", value: data?.permissions ? data?.permissions["customfields.delete"] : "" },

            { name: "suppliers.view", value: data?.permissions ? data?.permissions["suppliers.view"] : "" },
            { name: "suppliers.create", value: data?.permissions ? data?.permissions["suppliers.create"] : "" },
            { name: "suppliers.edit", value: data?.permissions ? data?.permissions["suppliers.edit"] : "" },
            { name: "suppliers.delete", value: data?.permissions ? data?.permissions["suppliers.delete"] : "" },

            { name: "manufacturers.view", value: data?.permissions ? data?.permissions["manufacturers.view"] : "" },
            { name: "manufacturers.create", value: data?.permissions ? data?.permissions["manufacturers.create"] : "" },
            { name: "manufacturers.edit", value: data?.permissions ? data?.permissions["manufacturers.edit"] : "" },
            { name: "manufacturers.delete", value: data?.permissions ? data?.permissions["manufacturers.delete"] : "" },

            { name: "locations.view", value: data?.permissions ? data?.permissions["locations.view"] : "" },
            { name: "locations.create", value: data?.permissions ? data?.permissions["locations.create"] : "" },
            { name: "locations.edit", value: data?.permissions ? data?.permissions["locations.edit"] : "" },
            { name: "locations.delete", value: data?.permissions ? data?.permissions["locations.delete"] : "" },
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

    const style: React.CSSProperties = { padding: '6px 0' };

    return (
        <Form
            {...formProps}
            layout="vertical"
            onFinish={(event: any) => {
                onFinish(event);
            }}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab={t("user.label.title.information")} key="1">
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
                                label={t("user.label.field.password")}
                                name="password"
                                initialValue={data?.password}
                                rules={[{
                                    required: false
                                }]}
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
                                rules={[{
                                    required: false
                                }]}
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
                <TabPane tab={t("user.label.title.permission")} key="2">
                    <div className="title_permission">
                        <Form.Item
                            label=""
                            name="permissions"
                            initialValue={data?.permissions}
                        >
                            <div>
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={7}>
                                            <div style={style}>{t("user.label.title.permission")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.grant")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.refuse")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={4}>
                                            <div style={style}>{t("user.label.title.inheritance")}</div>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Super User */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col span={6}>
                                            <div style={style}>{t("user.label.title.name_user")}</div>
                                        </Col>
                                        <Col span={17}>
                                            <Form.Item name="superuser" initialValue={permissionsSuperUser}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionsSuperUser(event.target.value)}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Admin */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.admin")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="admin" initialValue={permissionsAdmin}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionsAdmin(event.target.value)}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between"
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* CSV Import */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.import_csv")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="import" initialValue={permissionActions.import}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        import: event.target.value
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between"
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Reports: View */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.report_view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="reports.view" initialValue={permissionActions.reports_view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        reports_view: event.target.value
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Assets */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.asset")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.view" initialValue={permissionActions.assets.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.create" initialValue={permissionActions.assets.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.edit" initialValue={permissionActions.assets.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.delete" initialValue={permissionActions.assets.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkout")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.checkout" initialValue={permissionActions.assets.checkout}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            checkout: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkin")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.checkin" initialValue={permissionActions.assets.checkin}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            checkin: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.audit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.audit" initialValue={permissionActions.assets.audit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            audit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view_requestable_assets")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="assets.view.requestable" initialValue={permissionActions.assets.view_requestable}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        assets: {
                                                            ...prevState.assets,
                                                            view_requestable: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Accessory */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.accessory")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.view" initialValue={permissionActions.accessories.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.create" initialValue={permissionActions.accessories.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.edit" initialValue={permissionActions.accessories.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.delete" initialValue={permissionActions.accessories.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkout")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.checkout" initialValue={permissionActions.accessories.checkout}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            checkout: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkin")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="accessories.checkin" initialValue={permissionActions.accessories.checkin}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        accessories: {
                                                            ...prevState.accessories,
                                                            checkin: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Consumables */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.consumables")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="consumables.view" initialValue={permissionActions.consumables.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        consumables: {
                                                            ...prevState.consumables,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="consumables.create" initialValue={permissionActions.consumables.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        consumables: {
                                                            ...prevState.consumables,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="consumables.edit" initialValue={permissionActions.consumables.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        consumables: {
                                                            ...prevState.consumables,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="consumables.delete" initialValue={permissionActions.consumables.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        consumables: {
                                                            ...prevState.consumables,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkout")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="consumables.checkout" initialValue={permissionActions.consumables.checkout}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        consumables: {
                                                            ...prevState.consumables,
                                                            checkout: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Licenses */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.licenses")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.view" initialValue={permissionActions.licenses.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.create" initialValue={permissionActions.licenses.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.edit" initialValue={permissionActions.licenses.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.delete" initialValue={permissionActions.licenses.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.checkout")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.checkout" initialValue={permissionActions.licenses.checkout}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            checkout: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.keys_licenses")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.keys" initialValue={permissionActions.licenses.keys}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            keys: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.files_licenses")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="licenses.files" initialValue={permissionActions.licenses.files}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        licenses: {
                                                            ...prevState.licenses,
                                                            files: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Users */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.name_user")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="users.view" initialValue={permissionActions.users.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        users: {
                                                            ...prevState.users,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="users.create" initialValue={permissionActions.users.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        users: {
                                                            ...prevState.users,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="users.edit" initialValue={permissionActions.users.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        users: {
                                                            ...prevState.users,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="users.delete" initialValue={permissionActions.users.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        users: {
                                                            ...prevState.users,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Models */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.model")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="models.view" initialValue={permissionActions.models.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        models: {
                                                            ...prevState.models,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="models.create" initialValue={permissionActions.models.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        models: {
                                                            ...prevState.models,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="models.edit" initialValue={permissionActions.models.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        models: {
                                                            ...prevState.models,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="models.delete" initialValue={permissionActions.models.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        models: {
                                                            ...prevState.models,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Categories */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.categories")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="categories.view" initialValue={permissionActions.categories.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        categories: {
                                                            ...prevState.categories,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="categories.create" initialValue={permissionActions.categories.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        categories: {
                                                            ...prevState.categories,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="categories.edit" initialValue={permissionActions.categories.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        categories: {
                                                            ...prevState.categories,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="categories.delete" initialValue={permissionActions.categories.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        categories: {
                                                            ...prevState.categories,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Departments */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.department")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="departments.view" initialValue={permissionActions.departments.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        departments: {
                                                            ...prevState.departments,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="departments.create" initialValue={permissionActions.departments.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        departments: {
                                                            ...prevState.departments,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="departments.edit" initialValue={permissionActions.departments.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        departments: {
                                                            ...prevState.departments,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="departments.delete" initialValue={permissionActions.departments.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        departments: {
                                                            ...prevState.departments,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Statuslabels */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.status_label")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="statuslabels.view" initialValue={permissionActions.statuslabels.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        statuslabels: {
                                                            ...prevState.statuslabels,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="statuslabels.create" initialValue={permissionActions.statuslabels.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        statuslabels: {
                                                            ...prevState.statuslabels,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="statuslabels.edit" initialValue={permissionActions.statuslabels.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        statuslabels: {
                                                            ...prevState.statuslabels,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="statuslabels.delete" initialValue={permissionActions.statuslabels.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        statuslabels: {
                                                            ...prevState.statuslabels,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Customfields */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.custom_fields")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="customfields.view" initialValue={permissionActions.customfields.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        customfields: {
                                                            ...prevState.customfields,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="customfields.create" initialValue={permissionActions.customfields.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        customfields: {
                                                            ...prevState.customfields,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="customfields.edit" initialValue={permissionActions.customfields.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        customfields: {
                                                            ...prevState.customfields,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="customfields.delete" initialValue={permissionActions.customfields.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        customfields: {
                                                            ...prevState.customfields,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Suppliers */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.supplier")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="suppliers.view" initialValue={permissionActions.suppliers.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        suppliers: {
                                                            ...prevState.suppliers,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="suppliers.create" initialValue={permissionActions.suppliers.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        suppliers: {
                                                            ...prevState.suppliers,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="suppliers.edit" initialValue={permissionActions.suppliers.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        suppliers: {
                                                            ...prevState.suppliers,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="suppliers.delete" initialValue={permissionActions.suppliers.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        suppliers: {
                                                            ...prevState.suppliers,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Manufacturers */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.manufacturers")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="manufacturers.view" initialValue={permissionActions.manufacturers.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        manufacturers: {
                                                            ...prevState.manufacturers,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="manufacturers.create" initialValue={permissionActions.manufacturers.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        manufacturers: {
                                                            ...prevState.manufacturers,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="manufacturers.edit" initialValue={permissionActions.manufacturers.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        manufacturers: {
                                                            ...prevState.manufacturers,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="manufacturers.delete" initialValue={permissionActions.manufacturers.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        manufacturers: {
                                                            ...prevState.manufacturers,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Locations */}
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.location")}</div>
                                        </Col>
                                    </Row>
                                    <hr style={{ width: "60rem" }} />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="locations.view" initialValue={permissionActions.locations.view}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        locations: {
                                                            ...prevState.locations,
                                                            view: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.create")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="locations.create" initialValue={permissionActions.locations.create}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        locations: {
                                                            ...prevState.locations,
                                                            create: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.edit")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="locations.edit" initialValue={permissionActions.locations.edit}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        locations: {
                                                            ...prevState.locations,
                                                            edit: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions_row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.delete")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="locations.delete" initialValue={permissionActions.locations.delete}>
                                                <Radio.Group
                                                    options={options}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        locations: {
                                                            ...prevState.locations,
                                                            delete: event.target.value
                                                        }
                                                    }))}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
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
