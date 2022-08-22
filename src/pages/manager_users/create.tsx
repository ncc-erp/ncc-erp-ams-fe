/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
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
    Radio,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import { Tabs } from "antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import "../../styles/hardware.less";
import {
    LOCATION_API,
    USERS_API,
    USER_API,
} from "api/baseApi";
import { IUser, IUserCreateRequest } from "interfaces/user";
import { ICheckboxChange } from "interfaces";
import { actions, EPermissions, Permission, optionsPermissions } from "constants/assets";

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

const { TabPane } = Tabs;

export const UserCreate = (props: UserCreateProps) => {
    const { setIsModalVisible } = props;
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();

    const [permissionsAdmin, setPermissionsAdmin] = useState(0);
    const [permissionsSuperUser, setPermissionsSuperUser] = useState(0);

    const [permissionActions, setPermissionActions] = useState(actions);

    const t = useTranslate();

    const { formProps, form } = useForm<IUserCreateRequest>({
        action: "create",
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

        formData.append("activated", "true");
        formData.append("ldap_import", "true");
        formData.append("two_factor_activated", "false");
        formData.append("two_factor_enrolled", "false");

        if (event.permissions !== null) {
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
                "assets.view.requestable": permissionActions.assets["view_requestable"],

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
        }

        setPayload(formData);
        form.resetFields();
    };

    const onCheckRemote = (event: ICheckboxChange) => {
        if (event.target.checked)
            form.setFieldsValue({
                remote: EPermissions.ADMIN
            });
        else form.setFieldsValue({ remote: EPermissions.USER });
    };

    useEffect(() => {
        if (payload) {
            mutate({
                resource: USER_API,
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
                <TabPane tab={t("user.label.field.information")} key="1">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label={t("user.label.field.last_name")}
                                name="last_name"
                            >
                                <Input placeholder={t("user.label.placeholder.last_name")} />
                            </Form.Item>
                            {messageErr?.last_name && (
                                <Typography.Text type="danger">
                                    {messageErr.last_name[0]}
                                </Typography.Text>
                            )}

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
                                <Typography.Text type="danger">
                                    {messageErr.username}
                                </Typography.Text>
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
                                <Input type="password" minLength={10} />
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
                                <Input type="password" minLength={10} />
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
                                <Input placeholder={t("user.label.placeholder.email")}
                                />
                            </Form.Item>
                            {messageErr?.email && (
                                <Typography.Text type="danger">
                                    {messageErr.email}
                                </Typography.Text>
                            )}
                        </Col>
                        <Col className="gutter-row" span={12}>
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
                                <Input placeholder={t("user.label.placeholder.address")} />
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
                        <Typography.Text type="danger">
                            {messageErr.notes[0]}
                        </Typography.Text>
                    )}

                    <Form.Item label={t("user.label.field.download_picter")} name="avatar">
                        <UploadImage
                            id={"create"}
                            file={file}
                            setFile={setFile}
                        ></UploadImage>
                    </Form.Item>
                    {messageErr?.avatar && (
                        <Typography.Text type="danger">
                            {messageErr.avatar[0]}
                        </Typography.Text>
                    )}
                    <div className="submit">
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t("user.label.button.create")}
                        </Button>
                    </div>
                </TabPane>
                <TabPane tab={t("user.label.field.permission")} key="2">
                    <div className="title_permission">
                        <Form.Item name="permissions">
                            <div>
                                <div className="list-permission">
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="title-row"
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.name_user")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="superuser">
                                                <Radio.Group
                                                    options={optionsPermissions}
                                                    onChange={event => setPermissionsSuperUser(event.target.value)}
                                                    className="radio-actions"
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.admin")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="admin">
                                                <Radio.Group
                                                    options={optionsPermissions}
                                                    onChange={event => setPermissionsAdmin(event.target.value)}
                                                    className="radio-actions"
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.import_csv")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="import">
                                                <Radio.Group
                                                    options={optionsPermissions}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        import: event.target.value
                                                    }))}
                                                    className="radio-actions"
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.report_view")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={17}>
                                            <Form.Item name="reports.view">
                                                <Radio.Group
                                                    options={optionsPermissions}
                                                    onChange={event => setPermissionActions(prevState => ({
                                                        ...prevState,
                                                        reports_view: event.target.value
                                                    }))}
                                                    className="radio-actions"
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div style={style}>{t("user.label.title.asset")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.assets || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`assets.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                assets: {
                                                                    ...prevState.assets,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.accessory")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.accessories || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`accessories.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                accessories: {
                                                                    ...prevState.accessories,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.consumables")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.consumables || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`consumables.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                consumables: {
                                                                    ...prevState.consumables,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.licenses")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.licenses || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`licenses.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                licenses: {
                                                                    ...prevState.licenses,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.name_user")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.users || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`users.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                users: {
                                                                    ...prevState.users,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.model")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.models || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`models.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                models: {
                                                                    ...prevState.models,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.categories")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.categories || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`categories.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    ...prevState.categories,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.department")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.departments || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`departments.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                departments: {
                                                                    ...prevState.departments,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.status_label")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.statuslabels || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`statuslabels.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                statuslabels: {
                                                                    ...prevState.statuslabels,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.custom_fields")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.customfields || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`customfields.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                customfields: {
                                                                    ...prevState.customfields,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.supplier")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.suppliers || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`suppliers.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                suppliers: {
                                                                    ...prevState.suppliers,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.manufacturers")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.manufacturers || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`manufacturers.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                manufacturers: {
                                                                    ...prevState.manufacturers,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
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
                                        className="title-row"
                                    >
                                        <Col className="gutter-row" span={6}>
                                            <div>{t("user.label.title.location")}</div>
                                        </Col>
                                    </Row>
                                    <hr className="hr-row" />
                                    <Row
                                        gutter={{
                                            xs: 8,
                                            sm: 16,
                                            md: 24,
                                            lg: 32
                                        }}
                                        className="actions-row"
                                    >
                                        {(Permission.locations || []).map((item: any) => (
                                            <>
                                                <Col className="gutter-row" span={6}>
                                                    <div>{t(`user.label.title.${item}`)}</div>
                                                </Col>
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`locations.${item}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={event => setPermissionActions(prevState => ({
                                                                ...prevState,
                                                                locations: {
                                                                    ...prevState.locations,
                                                                    [`${item}`]: event.target.value
                                                                }
                                                            }))}
                                                            className="radio-actions"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                    <div className="submit">
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t("user.label.button.create")}
                        </Button>
                    </div>
                </TabPane>
            </Tabs >
        </Form >
    );
};
