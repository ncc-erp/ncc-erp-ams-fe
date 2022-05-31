import { useEffect, useState } from "react";
import { useCreate, useTranslate } from "@pankod/refine-core";
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
    Tabs,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import { UserOutlined, AndroidOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
    IHardwareCreateRequest,
    IHardwareResponse,
    IHardwareUpdateRequest,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";
import { ICheckboxChange } from "interfaces";

type HardwareCloneProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    data: IHardwareResponse | undefined;
};

export const HardwareClone = (props: HardwareCloneProps) => {
    const { setIsModalVisible, data, isModalVisible } = props;
    const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
    const [payload, setPayload] = useState<FormData>();
    const [file, setFile] = useState<any>(null);
    const [messageErr, setMessageErr] = useState<any>(null);
    const [activeModel, setActiveModel] = useState<String>("1");
    const [checked, setChecked] = useState(true);

    const toggleChecked = () => {
        setChecked(!checked);
    };

    const t = useTranslate();

    enum EStatus {
        READY_TO_DEPLOY = "Ready to deploy",
        ASSIGN = "Assign",
    }

    const { form, formProps } = useForm<IHardwareCreateRequest>({
        action: "clone",
    });

    const { setFields } = form;

    const { selectProps: modelSelectProps } = useSelect<IModel>({
        resource: "api/v1/models/selectlist",
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: companySelectProps } = useSelect<ICompany>({
        resource: "api/v1/companies",
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: statusLabelSelectProps } = useSelect<ICompany>({
        resource: "api/v1/statuslabels",
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: locationSelectProps } = useSelect<ICompany>({
        resource: "api/v1/locations",
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: supplierSelectProps } = useSelect<ICompany>({
        resource: "api/v1/suppliers",
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: userSelectProps } = useSelect<ICompany>({
        resource: "api/v1/users/selectlist",
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: hardwareSelectProps } = useSelect<ICompany>({
        resource: "api/v1/hardware/selectlist",
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { mutate, data: cloneData, isLoading } = useCreate();

    const onFinish = (event: IHardwareUpdateRequest) => {
        setMessageErr(null);
        const formData = new FormData();

        formData.append("name", event.name);
        if (event.serial !== undefined) formData.append("serial", event.serial);
        // formData.append("company_id", event.company.toString())
        formData.append("model_id", event.model.toString());
        if (event.order_number !== null) formData.append("order_number", event.order_number);

        formData.append("notes", event.notes);
        formData.append("asset_tag", event.asset_tag);

        formData.append("status_id", event.status_label.toString());
        if (event.user_id !== undefined) formData.append("assigned_to", event.user_id.toString());
        if (event.physical !== undefined) formData.append("physical", event.physical.toString())
        if (event.location !== undefined) formData.append("location_id", event.location.toString());

        formData.append("warranty_months", event.warranty_months);

        if (event.purchase_cost !== null) formData.append("purchase_cost", event.purchase_cost);
        if (event.purchase_date !== null) formData.append("purchase_date", event.purchase_date);

        formData.append("rtd_location_id", event.rtd_location.toString());
        formData.append("supplier_id", event.supplier.toString())

        if (event.requestable !== undefined) formData.append("requestable", event.requestable.toString());

        if (typeof (event.image) !== "string" && event.image !== null) formData.append("image", event.image);

        setPayload(formData);
    };

    useEffect(() => {
        if (payload) {
            mutate({
                resource: "api/v1/hardware",
                values: payload,
            });
            if (cloneData?.data.message) form.resetFields();
        }
    }, [payload]);

    useEffect(() => {
        form.resetFields();
        setFile(null);
        setFields([
            { name: "name", value: data?.name },
            { name: "serial", value: "" },
            // { name: "company_id", value: data?.company.id },
            { name: "model_id", value: data?.model.id },
            { name: "order_number", value: data?.order_number },

            { name: "notes", value: data?.notes },
            { name: "asset_tag", value: "" },

            { name: "status_id", value: data?.status_label.id },
            { name: "warranty_months", value: data?.warranty_months && data.warranty_months.split(" ")[0] },
            { name: "purchase_cost", value: data?.purchase_cost && data.purchase_cost.toString().split(",")[0] },
            { name: "purchase_date", value: data?.purchase_date.date !== null ? data?.purchase_date.date : "" },
            { name: "supplier_id", value: data?.supplier.id },
            { name: "rtd_location_id", value: data?.rtd_location.id },

            { name: "assigned_to", value: data?.assigned_to },
            { name: "requestable", value: data?.requestable },

            { name: "image", value: data?.image },
        ]);
    }, [data, form, isModalVisible]);

    useEffect(() => {
        form.resetFields();
    }, [isModalVisible]);

    useEffect(() => {
        if (cloneData?.data.status === "success") {
            form.resetFields();
            setFile(null);
            setIsModalVisible(false);
            setMessageErr(null);
        } else {
            setMessageErr(cloneData?.data.messages);
        }
    }, [cloneData]);


    const findLabel = (value: number): Boolean => {
        let check = false;
        statusLabelSelectProps.options?.forEach((item) => {
            if (value === item.value) {
                if (
                    item.label === EStatus.READY_TO_DEPLOY ||
                    item.label === EStatus.ASSIGN
                ) {
                    check = true;
                    return true;
                }
            }
        });
        return check;
    };

    const onChangeStatusLabel = (value: { value: string; label: string; }) => {
        setIsReadyToDeploy(findLabel(Number(value)));
    };

    const onCheck = (event: ICheckboxChange) => {
        if (event.target.checked)
            form.setFieldsValue({
                requestable: 1,
            });
        else
            form.setFieldsValue({
                requestable: 0,
            });
    };

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
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    {/* <Form.Item
                        label={t("hardware.label.field.nameCompany")}
                        name="company"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.nameCompany") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.company.id}
                    >
                        <Select
                            placeholder={t("hardware.label.placeholder.nameCompany")}
                            {...companySelectProps}
                            showSearch
                        />
                    </Form.Item>
                    {messageErr?.company && (
                        <Typography.Text type="danger">
                            {messageErr.company[0]}
                        </Typography.Text>
                    )} */}

                    <Form.Item
                        label={t("hardware.label.field.assetName")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.assetName") +
                                    " " +
                                    t("hardware.label.message.required"),
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
                        label={t("hardware.label.field.serial")}
                        name="serial"
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.serial && (
                        <Typography.Text type="danger">
                            {messageErr.serial[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("hardware.label.field.propertyType")}
                        name="model"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.propertyType") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.model.id}
                    >
                        <Select
                            placeholder={t("hardware.label.placeholder.propertyType")}
                            {...modelSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.model && (
                        <Typography.Text type="danger">
                            {messageErr.model[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("hardware.label.field.locationFix")}
                        name="rtd_location"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.locationFix") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.rtd_location.id}
                    >
                        <Select
                            placeholder={t("hardware.label.placeholder.location")}
                            {...locationSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.rtd_location && (
                        <Typography.Text type="danger">
                            {messageErr.rtd_location[0]}
                        </Typography.Text>
                    )}

                    <Form.Item
                        label={t("hardware.label.field.status")}
                        name="status_label"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.status") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.status_label.id}
                    >
                        <Select
                            onChange={(value) => {
                                onChangeStatusLabel(value);
                            }}
                            placeholder={t("hardware.label.placeholder.status")}
                            {...statusLabelSelectProps}
                        />

                    </Form.Item>
                    {messageErr?.status && (
                        <Typography.Text type="danger">
                            {messageErr.status[0]}
                        </Typography.Text>
                    )}
                    {isReadyToDeploy && (
                        <Form.Item label={t("hardware.label.field.checkoutTo")} name="tab">
                            <Tabs
                                defaultActiveKey="1"
                                onTabClick={(value) => {
                                    setActiveModel(value);
                                }}
                            >
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <UserOutlined />
                                            {t("hardware.label.field.user")}
                                        </span>
                                    }
                                    key="1"
                                ></Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <AndroidOutlined />
                                            {t("hardware.label.field.asset")}
                                        </span>
                                    }
                                    key="2"
                                ></Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                            <EnvironmentOutlined />
                                            {t("hardware.label.field.location")}
                                        </span>
                                    }
                                    key="3"
                                ></Tabs.TabPane>
                            </Tabs>
                        </Form.Item>
                    )}

                    {activeModel === "1" && (
                        <Form.Item
                            className="tabUser"
                            label={t("hardware.label.field.user")}
                            name="assigned_to"
                            rules={[
                                {
                                    required: false,
                                    message:
                                        t("hardware.label.field.user") +
                                        " " +
                                        t("hardware.label.message.required"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("hardware.label.placeholder.user")}
                                {...userSelectProps}
                            />
                        </Form.Item>
                    )}
                    {activeModel === "2" && (
                        <Form.Item
                            className="tabAsset"
                            label={t("hardware.label.field.asset")}
                            name="physical"
                            rules={[
                                {
                                    required: false,
                                    message:
                                        t("hardware.label.field.asset") +
                                        " " +
                                        t("hardware.label.message.required"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("hardware.label.placeholder.asset")}
                                {...hardwareSelectProps}
                            />
                        </Form.Item>
                    )}
                    {activeModel === "3" && (
                        <Form.Item
                            className="tabLocation"
                            label={t("hardware.label.field.location")}
                            name="location"
                            rules={[
                                {
                                    required: false,
                                    message:
                                        t("hardware.label.field.location") +
                                        " " +
                                        t("hardware.label.message.required"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("hardware.label.placeholder.location")}
                                {...locationSelectProps}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label={t("hardware.label.field.insurance")}
                        name="warranty_months"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.insurance") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.warranty_months && data?.warranty_months.split(" ")[0]}
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.month")}
                            value={data?.warranty_months && data?.warranty_months.split(" ")[0]}
                        />
                    </Form.Item>
                    {messageErr?.warranty_months && (
                        <Typography.Text type="danger">
                            {messageErr.warranty_months[0]}
                        </Typography.Text>
                    )}
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label={t("hardware.label.field.propertyCard")}
                        name="asset_tag"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.propertyCard") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {messageErr?.asset_tag && (
                        <Typography.Text type="danger">
                            {messageErr.asset_tag[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("hardware.label.field.dateBuy")}
                        name="purchase_date"
                        initialValue={data?.purchase_date.date !== null ? data?.purchase_date.date : ""}
                    >
                        <Input
                            type="date"
                        />
                    </Form.Item>
                    {messageErr?.purchase_date && (
                        <Typography.Text type="danger">
                            {messageErr.purchase_date[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("hardware.label.field.supplier")}
                        name="supplier"
                        rules={[
                            {
                                required: true,
                                message:
                                    t("hardware.label.field.supplier") +
                                    " " +
                                    t("hardware.label.message.required"),
                            },
                        ]}
                        initialValue={data?.supplier.id}
                    >
                        <Select
                            placeholder={t("hardware.label.placeholder.supplier")}
                            {...supplierSelectProps}
                        />
                    </Form.Item>
                    {messageErr?.supplier && (
                        <Typography.Text type="danger">
                            {messageErr.supplier[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("hardware.label.field.orderNumber")}
                        name="order_number"
                        initialValue={data?.order_number}
                    >
                        <Input
                            value={data?.order_number}
                        />
                    </Form.Item>
                    {messageErr?.order_number && (
                        <Typography.Text type="danger">
                            {messageErr.order_number[0]}
                        </Typography.Text>
                    )}
                    <Form.Item
                        label={t("hardware.label.field.cost")}
                        name="purchase_cost"
                        initialValue={data?.purchase_cost && data?.purchase_cost.toString().split(",")[0]}
                    >
                        <Input type="number"
                            addonAfter={t("hardware.label.field.usd")}
                            value={data?.purchase_cost && data?.purchase_cost.toString().split(",")[0]} />
                    </Form.Item>
                    {messageErr?.puchase_cost && (
                        <Typography.Text type="danger">
                            {messageErr.puchase_cost[0]}
                        </Typography.Text>
                    )}

                </Col>
            </Row>

            <Form.Item
                label={t("hardware.label.field.notes")}
                name="notes"
                rules={[
                    {
                        required: true,
                        message:
                            t("hardware.label.field.notes") +
                            " " +
                            t("hardware.label.message.required"),
                    },
                ]}
                initialValue={data?.notes}
            >
                <Input.TextArea
                    value={data?.notes} />
            </Form.Item>
            {messageErr?.notes && (
                <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
            )}
            <Form.Item label="" name="requestable" valuePropName="checked">
                {data?.requestable.toString() == "1" &&
                    <Checkbox
                        checked={checked}
                        value={data?.requestable}
                        onChange={(event) => {
                            onCheck(event);
                        }}
                        onClick={toggleChecked}
                    >{t("hardware.label.field.checkbox")}
                    </Checkbox>
                }
                {data?.requestable.toString() == "0" &&
                    <Checkbox
                        checked={!checked}
                        value={data?.requestable}
                        onChange={(event) => {
                            onCheck(event);
                        }}
                        onClick={toggleChecked}
                    >{t("hardware.label.field.checkbox")}
                    </Checkbox>
                }
            </Form.Item>

            <Form.Item label="Tải hình" name="image" initialValue={data?.image}>
                {data?.image ? (
                    <UploadImage
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
                    {t("hardware.label.button.clone")}
                </Button>
            </div>
        </Form>
    );
};