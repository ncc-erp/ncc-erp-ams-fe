/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
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
    Checkbox,
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
import { Permission, optionsPermissions, defaultValue, AccessType } from "constants/permissions";

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
};

const { TabPane } = Tabs;

export const UserCreate = (props: UserCreateProps) => {
    const { setIsModalVisible } = props;
    const t = useTranslate();

    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<File>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();
    const {open } = useNotification();

    const [permissionActions, setPermissionActions] = useState<any>(Permission);

    const permissionData: any = {};
    Object.keys(permissionActions).forEach((categoryName: string) => {
        const parentPermission: any = permissionActions[`${categoryName}`];
        if (parentPermission.children && parentPermission.children.length > 0) {
            parentPermission.children.forEach((childrenPermission: any) => {
                permissionData[`${parentPermission.name}.${childrenPermission.name}`.toLowerCase()] = childrenPermission.default;
            });
        } else {
            permissionData[`${parentPermission.name}`] = parentPermission.default;
        }
    })

    const [permissionOfUser, setPermissionOfUser] = useState(permissionData);

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


    const [showCheckboxList, setShowCheckboxList] = useState(false);

    const locationOptions = locationSelectProps?.options ?? [];

    const [locationSelected, setSelectedLocation] = useState<any[]>([]);

    const handleCheckboxChange = (event: any, location: any) => {
        const { checked } = event.target;
        setSelectedLocation((prevValues) => {
            if (checked) {
                return [...prevValues, location];
            } else {
                return prevValues.filter((prevValue) => prevValue !== location);
            }
        });

    };

    const { mutate, isLoading } = useCreate();

    const onFinish = (event: IUserCreateRequest) => {
        setMessageErr(messageErr);
        const formData = new FormData();

        formData.append("first_name", event.first_name);
        formData.append("username", event.username);
        formData.append("password", event.password);
        formData.append("password_confirmation", event.password_confirmation);

        if (event.mezon_id !== undefined) {
            formData.append("mezon_id", event.mezon_id);
        }
        if (event.last_name !== undefined) {
            formData.append("last_name", event.last_name);
        }
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
        // formData.append("two_factor_activated", "false");
        // formData.append("two_factor_enrolled", "false");
        if (event.permissions !== undefined) {
            formData.append("permissions", JSON.stringify(permissionOfUser));
        }

        formData.append("manager_location", JSON.stringify(locationSelected));

        setPayload(formData);
        form.resetFields();
        setSelectedLocation([]);
        setShowCheckboxList(false);
    };

    useEffect(() => {
        if (!payload) return;
        mutate(
        {
            resource: USER_API,
            values: payload,
            successNotification: false,
            errorNotification: false,
        },
        {
            onError(error, variables, context) {
                open?.({
                    type: 'error',
                    message: "There was an error creating user"
                });
                setMessageErr(error?.response.data.messages);
            },
            onSuccess(data, variables, context) {
                open?.({
                    type: 'success',
                    message: data?.data.messages,
                })
                form.resetFields();
                setFile(undefined);
                setIsModalVisible(false);
                setMessageErr(messageErr);
            },
        });
    }, [payload]);

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
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={t("user.label.field.information")} key={defaultValue.active}>
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
                                label={t("user.label.field.mezon_id")}
                                name="mezon_id"
                            >
                                <Input placeholder={t("user.label.placeholder.mezon_id")}
                                />
                            </Form.Item>
                            {/* <Form.Item
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
                            )} */}

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
                <TabPane tab={t("user.label.field.permission")} key={defaultValue.inactive}>
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
                                        <Col className="gutter-row" span={10}>
                                            <div style={style}>{t("user.label.title.grant")}</div>
                                        </Col>
                                        <Col className="gutter-row" span={7}>
                                            <div style={style}>{t("user.label.title.refuse")}</div>
                                        </Col>
                                    </Row>
                                </div>

                                {Object.values(Permission).map((key, index) => (
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
                                                <div>{t(`user.label.title.${key.name}`)}</div>
                                            </Col>
                                            {index < 5 &&
                                                <Col className="gutter-row" span={17}>
                                                    <Form.Item name={`${key.name}`}>
                                                        <Radio.Group
                                                            options={optionsPermissions}
                                                            onChange={(event) => {
                                                                setPermissionOfUser((prevState: any) => {
                                                                    return {
                                                                        ...prevState,
                                                                        [key.name]: event.target.value
                                                                    };
                                                                });
                                                                if (event.target.value === AccessType.allow && key.name === Permission.branchadmin.name) {
                                                                    setShowCheckboxList(true);
                                                                }
                                                                if (event.target.value !== AccessType.allow && key.name === Permission.branchadmin.name) {
                                                                    setShowCheckboxList(false);
                                                                    setSelectedLocation([])
                                                                }
                                                            }}
                                                            className="radio-actions"
                                                            name={key.name}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            }
                                        </Row>
                                        {showCheckboxList && index === 2 && (
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
                                                        <div>{t(`user.label.title.choose_branchadmin`)}</div>
                                                    </Col>
                                                    <Col span={17} offset={5} >
                                                        <Form.Item name={`locationIds.${key.name}`}>
                                                            <div className="checkbox-container">
                                                                {locationOptions.map((location) => (
                                                                    <Checkbox key={location.value}
                                                                        onChange={(event) => handleCheckboxChange(event, location.value)}
                                                                        className="checkbox"
                                                                    >
                                                                        {location.label}
                                                                    </Checkbox>
                                                                ))}
                                                            </div>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}

                                        {key?.children && key?.children.length > 0 && <hr className="hr-row" />}
                                        {key?.children && key?.children.length > 0 && key?.children?.map((item: any) =>
                                        (
                                            <>
                                                <Row
                                                    gutter={{
                                                        xs: 8,
                                                        sm: 16,
                                                        md: 24,
                                                        lg: 32
                                                    }}
                                                    className="actions-row"
                                                >
                                                    <Col className="gutter-row" span={6}>
                                                        {item.code === 'view.requestable' ?
                                                            <div>{t(`user.label.title.view_requestable`)}</div>
                                                            :
                                                            <div>{t(`user.label.title.${item.code}`)}</div>
                                                        }
                                                    </Col>
                                                    <Col className="gutter-row" span={17}>
                                                        <Form.Item name={`${key.name}.${item.code}`}>
                                                            <Radio.Group
                                                                options={optionsPermissions}
                                                                onChange={event => setPermissionOfUser((prevState: any) => {
                                                                    return {
                                                                        ...prevState,
                                                                        [`${key.name}.${item.code}`]: event.target.value
                                                                    }
                                                                })}
                                                                className="radio-actions"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </>
                                        ))}
                                    </div>
                                ))}
                                {messageErr?.manager_location && (
                                    <Typography.Text type="danger">
                                        {messageErr?.manager_location}
                                    </Typography.Text>
                                )}
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
