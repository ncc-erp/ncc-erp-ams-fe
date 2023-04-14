/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCustom } from "@pankod/refine-core";
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
    Checkbox,
} from "@pankod/refine-antd";

import { Tabs, Radio } from "antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import "../../styles/hardware.less";
import {
    LOCATION_API,
    USERS_API,
} from "api/baseApi";
import { IUser, IUserCreateRequest } from "interfaces/user";
import "styles/antd.less";
import { Permission, optionsPermissions, defaultValue, AccessType } from "constants/permissions";

type UserCreateProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: any;
};

const { TabPane } = Tabs;

export const UserEdit = (props: UserCreateProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const t = useTranslate();

    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<any>();
    const [messageErr, setMessageErr] = useState<IUserCreateRequest>();

    if (data?.permissions) {
        Object.keys(data.permissions).forEach((categoryName: string) => {
            if (!data.permissions[categoryName]) {
                data.permissions[categoryName] = '0';
            }
        });
    }
    else {
        data.permissions = {};
    }

    const [permissionOfUser, setPermissionOfUser] = useState(data?.permissions);  

    useEffect(() => {
        setPermissionOfUser(data?.permissions);
    }, [data]);
    

    const [showCheckboxList, setShowCheckboxList] = useState(false);

    const [locationSelected, setSelectedLocation] = useState<any[]>(data?.manager_location);

    useEffect(() => {
        setSelectedLocation(data?.manager_location);
    }, [data]);

    const handleCheckboxChange = (event: any, location: any) => {
        const { checked } = event.target;

        setSelectedLocation((prevValues) => {
            if (checked) {
                if (prevValues.includes(location)) {
                    return prevValues;
                } else {
                    return [...prevValues, location];
                }
            } else {
                return prevValues.filter((prevValue) => prevValue !== location);
            }
        });
    };
    

    const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);

    useEffect(() => {
        setIsCheckboxSelected(locationSelected.length > 0);
    }, [locationSelected]);

    const [checkedList, setCheckboxSelected] = useState<any[]>([]);

    useEffect(() => {
        if (data?.permissions['branchadmin'] === AccessType.allow) {
            setShowCheckboxList(true);
            setCheckboxSelected(data?.manager_location);
        }
        else{
            setShowCheckboxList(false);
            setCheckboxSelected([]);
        }
    }, [data]);

    const { form, formProps } = useForm<IUserCreateRequest>({
        action: "edit",
    });

    const { setFields } = form;

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

    const locationOptions = locationSelectProps?.options ?? [];

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

        if (event.first_name !== undefined) {
            formData.append("first_name", event.first_name);
        }
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
        if (event.avatar !== undefined && event.avatar !== null && typeof (event.avatar) !== "string") {
            formData.append("image", event.avatar);
        }
        formData.append("activated", "true");

        formData.append("permissions", JSON.stringify(permissionOfUser));

        formData.append("manager_location", JSON.stringify(locationSelected));

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
            { name: "location", value: data?.location.id },
            { name: "phone", value: data?.phone },
            { name: "address", value: data?.address !== "null" ? data?.address : "" },
            { name: "city", value: data?.city !== "null" ? data?.city : "" },
            { name: "state", value: data?.state !== "nul" ? data?.state : "" },
            { name: "notes", value: data?.notes },
            { name: "avatar", value: data?.avatar },
            { name: "permissions", value: JSON.stringify(permissionOfUser) }
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
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={t("user.label.field.information")} key={defaultValue.active}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label={t("user.label.field.last_name")}
                                name="last_name"
                                initialValue={data?.last_name}
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
                                rules={[{
                                    required: false
                                }]}
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
                        </Col>
                        <Col className="gutter-row" span={12}>
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

                    <Form.Item label={t("user.label.field.download_picter")} name="avatar" initialValue={data?.avatar}>
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
                <TabPane tab={t("user.label.field.permission")} key={defaultValue.inactive}>
                    <div className="title_permission">
                        <Form.Item
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

                                {!isLoading &&
                                    Object.values(Permission).map((key, index) => (
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
                                                        <Form.Item name={`${key.name}`} initialValue={data?.permissions[key.name]?.toString() ?? '0'}>
                                                            <Radio.Group
                                                                options={optionsPermissions}
                                                                onChange={(event) => {
                                                                    setPermissionOfUser((prevState: any) => {                                                                        
                                                                        return {
                                                                            ...prevState,
                                                                            [key.name]: event.target.value
                                                                        }
                                                                    })
                                                                    
                                                                    if (event.target.value ===  AccessType.allow && key.name ==  Permission.branchadmin.name) {
                                                                        setShowCheckboxList(true);
                                                                    }
                                                                    if (event.target.value !== AccessType.allow && key.name == Permission.branchadmin.name) {
                                                                        setShowCheckboxList(false);
                                                                    }
                                                                }}
                                                                defaultValue={permissionOfUser[key.name]?.toString() ?? '0'}
                                                                className="radio-actions"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                }
                                            </Row>
                                            {showCheckboxList && index == 2 && (
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
                                                                            defaultChecked={checkedList.includes(location.value)}
                                                                            onChange={(event) =>handleCheckboxChange(event, location.value)}
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
                                                            <Form.Item name={`${key.name}.${item.code}`} initialValue={data?.permissions[`${key.name}.${item.code}`]?.toString() ?? '0'}>
                                                                <Radio.Group
                                                                    options={optionsPermissions}
                                                                    onChange={event => setPermissionOfUser((prevState: any) => {
                                                                        return {
                                                                            ...prevState,
                                                                            [`${key.name}.${item.code}`]: event.target.value
                                                                        }
                                                                    })}
                                                                    defaultValue={data?.permissions[`${key.name}.${item.code}`]?.toString() ?? '0'}
                                                                    className="radio-actions"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        </Form.Item>
                    </div>
                    <div className="submit">
                        <Button type="primary" htmlType="submit" disabled={!isCheckboxSelected && showCheckboxList} loading={isLoading}>
                            {t("user.label.button.update")}
                        </Button>
                    </div>
                </TabPane>
            </Tabs >
        </Form >
    );
};
