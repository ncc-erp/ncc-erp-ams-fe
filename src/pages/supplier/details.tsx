/* eslint-disable react-hooks/exhaustive-deps */
import {
    Button,
    Checkbox,
    CloneButton,
    DateField,
    DeleteButton,
    EditButton,
    Form,
    getDefaultSortOrder,
    List,
    ShowButton,
    Space,
    Spin,
    Table,
    TagField,
    TextField,
    Tooltip,
    Typography,
    useSelect,
    useTable,
} from "@pankod/refine-antd";
import {
    CrudFilters,
    HttpError,
    IResourceComponentsProps,
    useNavigation,
    useTranslate,
} from "@pankod/refine-core";
import { CATEGORIES_API, HARDWARE_API, STATUS_LABELS_API } from "api/baseApi";
import { MModal } from "components/Modal/MModal";
import { IHardwareFilterVariables, IHardwareResponse, IHardwareResponseCheckin, IHardwareResponseCheckout } from "interfaces/hardware";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";
import { Image } from "antd";
import { filterAssignedStatus, getAssetAssignedStatusDecription, getAssetStatusDecription, getBGAssetAssignedStatusDecription, getBGAssetStatusDecription } from "untils/assets";
import { ICategory, IHardware } from "interfaces";
import { IStatusLabel } from "interfaces/statusLabel";
import { HardwareEdit, HardwareShow } from "pages/hardware";
import { HardwareClone } from "pages/hardware/clone";
import { HardwareCheckout } from "pages/hardware/checkout";
import { HardwareCheckin } from "pages/hardware/checkin";
import { TableAction } from "components/elements/tables/TableAction";
import { HardwareSearch } from "pages/hardware/search";
import {
    MenuOutlined,
    FileSearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { SupplierDetailsAccessory } from "./detailAccessory";
import { SupplierDetailsConsumable } from "./detailConsumable";


const defaultCheckedList = [
    "id",
    "name",
    "image",
    "model",
    "category",
    "status_label",
    "assigned_to",
    "assigned_status",
    "created_at",
];

interface ICheckboxChange {
    key: string;
}

export const SupplierDetails: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { Title } = Typography;
    const { list } = useNavigation();

    const [isLoadingArr] = useState<boolean[]>([]);

    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [listening, setListening] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);
    const menuRef = useRef(null);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detail, setDetail] = useState<IHardwareResponse>();
    const [detailCheckout, setDetailCheckout] =
        useState<IHardwareResponseCheckout>();

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);

    const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
    const [detailCheckin, setDetailCheckin] =
        useState<IHardwareResponseCheckin>();
    const [detailClone, setDetailClone] = useState<IHardwareResponse>();

    const [collumnSelected, setColumnSelected] = useState<string[]>(
        localStorage.getItem("item_selected") !== null
            ? JSON.parse(localStorage.getItem("item_selected") as string)
            : defaultCheckedList);


    const [searchParams] = useSearchParams();
    const category_id = searchParams.get("category_id");
    const status_id = searchParams.get("status_id");
    const rtd_location_id = searchParams.get("rtd_location_id");
    const searchParam = searchParams.get("search");
    const supplier_id = searchParams.get('id');
    const supplier_name = searchParams.get('name');


    const { tableProps, tableQueryResult, sorter, searchFormProps } = useTable<
        IHardwareResponse,
        HttpError,
        IHardwareFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: `${HARDWARE_API}?supplier_id=${supplier_id}`,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
                name,
                asset_tag,
                serial,
                model,
                location,
                status_label,
                purchase_date,
                assigned_to,
                category,
            } = params;
            filters.push(
                {
                    field: "search",
                    operator: "eq",
                    value: searchParam,
                },
                {
                    field: "filter",
                    operator: "eq",
                    value: JSON.stringify({
                        name,
                        asset_tag,
                        serial,
                        model,
                        status_label,
                        assigned_to,
                    }),
                },

                {
                    field: "dateFrom",
                    operator: "eq",
                    value: purchase_date
                        ? purchase_date[0].format().substring(0, 10)
                        : undefined,
                },
                {
                    field: "dateTo",
                    operator: "eq",
                    value: purchase_date
                        ? purchase_date[1].format().substring(0, 10)
                        : undefined,
                },
                {
                    field: "assigned_to",
                    operator: "eq",
                    value: assigned_to,
                },
                {
                    field: "supplier_id",
                    operator: "eq",
                    value: supplier_id,
                },
                {
                    field: "status_id",
                    operator: "eq",
                    value: status_id,
                },
            );

            return filters;
        },
    });


    const collumns = useMemo(
        () => [
            {
                key: "id",
                title: "ID",
                render: (value: number) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "name",
                title: translate("hardware.label.field.assetName"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                        onClick={() => show(record)}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "image",
                title: translate("hardware.label.field.image"),
                render: (value: string) => {
                    return value ? (
                        <Image width={80} alt="" height={"auto"} src={value} />
                    ) : (
                        ""
                    );
                },
            },
            {
                key: "asset_tag",
                title: translate("hardware.label.field.propertyCard"),
                render: (value: string) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
            },
            {
                key: "serial",
                title: translate("hardware.label.field.serial"),
                render: (value: string) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("serial", sorter),
            },
            {
                key: "model",
                title: translate("hardware.label.field.propertyType"),
                render: (value: IHardwareResponse) =>
                    <TagField value={value.name}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
                        onClick={() => {
                            {
                                list(`assets?model_id=${value.id}`)
                            }
                        }} />,
                defaultSortOrder: getDefaultSortOrder("model.name", sorter),
            },
            {
                key: "category",
                title: translate("hardware.label.field.category"),
                render: (value: IHardwareResponse) => <TextField value={value.name} />,
                defaultSortOrder: getDefaultSortOrder("category.name", sorter),
                // filters: filterCategory,
                // onFilter: (value: number, record: IHardwareResponse) => {
                //     return record.category.id === value;
                // },
            },
            {
                key: "status_label",
                title: translate("hardware.label.field.status"),
                render: (value: IHardwareResponse) => (
                    <TagField
                        value={getAssetStatusDecription(value)}
                        style={{
                            background: getBGAssetStatusDecription(value),
                            color: "white",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
                // filters: filterStatus_Label,
                // onFilter: (value: number, record: IHardwareResponse) => {
                //     return record.status_label.id === value;
                // },
            },
            {
                key: "assigned_to",
                title: translate("hardware.label.field.checkoutTo"),
                render: (value: IHardwareResponse) => (
                    <TextField strong value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
            },
            {
                key: "location",
                title: translate("hardware.label.field.rtd_location"),
                render: (value: IHardwareResponse) => (
                    <TextField value={value && value.name} />
                ),
                defaultSortOrder: getDefaultSortOrder("location.name", sorter),
            },
            {
                key: "rtd_location",
                title: translate("hardware.label.field.locationFix"),
                render: (value: IHardwareResponse) => (
                    <TextField value={value && value.name} />
                ),
                defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
            },
            {
                key: "manufacturer",
                title: translate("hardware.label.field.manufacturer"),
                render: (value: IHardwareResponse) => (
                    <TextField value={value && value.name} />
                ),
                defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
            },
            {
                key: "supplier",
                title: translate("hardware.label.field.supplier"),
                render: (value: IHardwareResponse) => (
                    <div
                        dangerouslySetInnerHTML={{ __html: `${value ? value.name : ""}` }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
            },
            {
                key: "purchase_date",
                title: translate("hardware.label.field.dateBuy"),
                render: (value: IHardware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.date : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("warranty_expires.date", sorter),
            },
            {
                key: "purchase_cost",
                title: translate("hardware.label.field.cost"),
                render: (value: number) => <TextField value={value ? value : 0} />,
                defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
            },
            {
                key: "order_number",
                title: translate("hardware.label.field.orderNumber"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("order_number", sorter),
            },

            {
                key: "assigned_status",
                title: translate("hardware.label.field.condition"),
                render: (value: number) => (
                    <TagField
                        value={getAssetAssignedStatusDecription(value)}
                        style={{
                            background: getBGAssetAssignedStatusDecription(value),
                            color: "white",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
                filters: filterAssignedStatus,
                onFilter: (value: number, record: IHardwareResponse) =>
                    record.assigned_status === value,
            },
            {
                key: "created_at",
                title: translate("hardware.label.field.dateCreate"),
                render: (value: IHardware) =>
                    value ? (
                        <DateField format="LLL" value={value && value.datetime} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
            },
        ],
        []
    );

    const edit = (data: IHardwareResponse) => {
        const dataConvert: IHardwareResponse = {
            id: data.id,
            name: data.name,
            asset_tag: data.asset_tag,
            serial: data.serial ?? "",
            model: {
                id: data?.model?.id,
                name: data?.model?.name,
            },
            model_number: data?.order_number,
            status_label: {
                id: data?.status_label.id,
                name: data?.status_label.name,
                status_type: data?.status_label.status_type,
                status_meta: data?.status_label.status_meta,
            },
            category: {
                id: data?.category?.id,
                name: data?.category?.name,
            },
            supplier: {
                id: data?.supplier?.id,
                name: data?.supplier?.name,
            },
            notes: data.notes ?? "",
            order_number: data.order_number ?? "",
            location: {
                id: data?.location?.id,
                name: data?.location?.name,
            },
            rtd_location: {
                id: data?.rtd_location?.id,
                name: data?.rtd_location?.name,
            },
            image: data?.image,
            warranty_months: data?.warranty_months,
            purchase_cost: data?.purchase_cost,
            purchase_date: {
                date: data?.purchase_date !== null ? data?.purchase_date.date : "",
                formatted:
                    data?.purchase_date !== null ? data?.purchase_date.formatted : "",
            },
            assigned_to: data?.assigned_to,
            last_audit_date: data?.last_audit_date,

            requestable: data?.requestable,
            physical: data?.physical,

            note: "",
            expected_checkin: {
                date: "",
                formatted: "",
            },
            last_checkout: {
                date: "",
                formatted: "",
            },
            assigned_location: {
                id: 0,
                name: "",
            },
            assigned_user: 0,
            assigned_asset: "",
            checkout_to_type: {
                assigned_user: 0,
                assigned_asset: "",
                assigned_location: {
                    id: 0,
                    name: "",
                },
            },
            user_can_checkout: false,
            assigned_status: 0,
            checkin_at: {
                date: "",
                formatted: "",
            },
            created_at: {
                datetime: "",
                formatted: "",
            },
            updated_at: {
                datetime: "",
                formatted: "",
            },
            manufacturer: {
                id: data?.manufacturer.id,
                name: data?.manufacturer.name,
            },
            checkin_counter: 0,
            checkout_counter: 0,
            requests_counter: 0,
            warranty_expires: {
                date: "",
                formatted: "",
            },
            user_can_checkin: false,
            withdraw_from: data?.withdraw_from,
        };
        setDetail(dataConvert);
        setIsEditModalVisible(true);
    };

    const clone = (data: IHardwareResponse) => {
        const dataConvert: any = {
            id: data.id,
            name: data.name,
            asset_tag: data.asset_tag,
            serial: data.serial ?? "",
            model: {
                id: data?.model?.id,
                name: data?.model?.name,
            },
            model_number: data?.order_number,
            status_label: {
                id: data?.status_label.id,
                name: data?.status_label.name,
                status_type: data?.status_label.status_type,
                status_meta: data?.status_label.status_meta,
            },
            category: {
                id: data?.category?.id,
                name: data?.category?.name,
            },
            supplier: {
                id: data?.supplier?.id,
                name: data?.supplier?.name,
            },
            notes: data?.notes ?? "",
            order_number: data.order_number ?? "",
            location: {
                id: data?.location?.id,
                name: data?.location?.name,
            },
            rtd_location: {
                id: data?.rtd_location?.id,
                name: data?.rtd_location?.name,
            },

            warranty_months: data?.warranty_months,
            purchase_cost: data?.purchase_cost,
            purchase_date: {
                date: data?.purchase_date !== null ? data?.purchase_date.date : "",
                formatted:
                    data?.purchase_date !== null ? data?.purchase_date.formatted : "",
            },
            assigned_to: data?.assigned_to,
            last_audit_date: data?.last_audit_date,

            requestable: data?.requestable,
            physical: data?.physical,
            user_can_checkout: data?.user_can_checkout,

            note: "",
            expected_checkin: {
                date: "",
                formatted: "",
            },
            last_checkout: {
                date: "",
                formatted: "",
            },
            assigned_location: {
                id: 0,
                name: "",
            },
            assigned_user: 0,
            assigned_asset: "",
            checkout_to_type: {
                assigned_user: 0,
                assigned_asset: "",
                assigned_location: {
                    id: 0,
                    name: "",
                },
            },
            assigned_status: 0,
            checkin_at: {
                date: "",
                formatted: "",
            },
            created_at: {
                datetime: "",
                formatted: "",
            },
            updated_at: {
                datetime: "",
                formatted: "",
            },
            manufacturer: {
                id: data?.manufacturer.id,
                name: data?.manufacturer.name,
            },
            checkin_counter: 0,
            checkout_counter: 0,
            requests_counter: 0,
            warranty_expires: {
                date: "",
                formatted: "",
            },
            user_can_checkin: false,
            withdraw_from: data?.withdraw_from,
        };

        setDetailClone(dataConvert);
        setIsCloneModalVisible(true);
    };

    const checkout = (data: IHardwareResponse) => {
        const dataConvert: IHardwareResponseCheckout = {
            id: data.id,
            name: data.name,
            model: {
                id: data?.model?.id,
                name: data?.model?.name,
            },
            status_label: {
                id: data?.status_label.id,
                name: data?.status_label.name,
                status_type: data?.status_label.status_type,
                status_meta: data?.status_label.status_meta,
            },
            category: {
                id: data?.category?.id,
                name: data?.category?.name,
            },
            note: data.note,
            assigned_location: {
                id: data?.assigned_location?.id,
                name: data?.assigned_location?.name,
            },
            last_checkout: {
                date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            },
            assigned_user: data?.assigned_user,
            model_number: data?.model_number,
            assigned_asset: data?.assigned_asset,
            checkout_to_type: data?.checkout_to_type,
            user_can_checkout: data?.user_can_checkout,
        };

        setDetailCheckout(dataConvert);
        setIsCheckoutModalVisible(true);
    };

    const checkin = (data: IHardwareResponse) => {
        const dataConvert: IHardwareResponseCheckin = {
            id: data.id,
            name: data.name,
            model: {
                id: data?.model?.id,
                name: data?.model?.name,
            },
            status_label: {
                id: data?.status_label.id,
                name: data?.status_label.name,
                status_type: data?.status_label.status_type,
                status_meta: data?.status_label.status_meta,
            },
            checkin_at: {
                date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            },
            assigned_to: {
                id: data?.assigned_to.id,
                username: data?.assigned_to.username,
                last_name: data?.assigned_to.last_name,
                first_name: data?.assigned_to.first_name,
            },
            rtd_location: {
                id: data?.id,
                name: data?.name,
            },
            note: data?.note,
            user_can_checkout: false,
        };

        setDetailCheckin(dataConvert);
        setIsCheckinModalVisible(true);
    };

    const handleSearch = () => {
        handleOpenSearchModel();
    };

    const handleOpenSearchModel = () => {
        setIsSearchModalVisible(!isSearchModalVisible);
    };

    const show = (data: IHardwareResponse) => {
        setIsShowModalVisible(true);
        setDetail(data);
    };

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCloneModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCheckoutModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCheckinModalVisible]);


    useEffect(() => {
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    const { selectProps: categorySelectProps } = useSelect<ICategory>({
        resource: CATEGORIES_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const filterCategory = categorySelectProps?.options?.map((item) => ({
        text: item.label,
        value: item.value,
    }));

    const { selectProps: statusLabelSelectProps } = useSelect<IStatusLabel>({
        resource: STATUS_LABELS_API,
        optionLabel: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const filterStatus_Label = statusLabelSelectProps?.options?.map((item) => ({
        text: item.label,
        value: item.value,
    }));

    const onCheckItem = (value: ICheckboxChange) => {
        if (collumnSelected.includes(value.key)) {
            setColumnSelected(
                collumnSelected.filter((item: any) => item !== value.key)
            );
        } else {
            setColumnSelected(collumnSelected.concat(value.key));
        }
    };

    useEffect(() => {
        localStorage.setItem("item_selected", JSON.stringify(collumnSelected));
    }, [collumnSelected]);


    const listenForOutsideClicks = (
        listening: boolean,
        setListening: (arg0: boolean) => void,
        menuRef: { current: any },
        setIsActive: (arg0: boolean) => void
    ) => {
        if (listening) return;
        if (!menuRef.current) return;
        setListening(true);
        [`click`, `touchstart`].forEach((type) => {
            document.addEventListener(`click`, (event) => {
                const current = menuRef.current;
                const node = event.target;
                if (current && current.contains(node)) return;
                setIsActive(false);
            });
        });
    };


    useEffect(() => {
        const aboutController = new AbortController();
        listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
        return function cleanup() {
            aboutController.abort();
        };
    }, []);

    const [loading, setLoading] = useState(false);
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            refreshData();
            setLoading(false);
        }, 300);
    };

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    useEffect(() => {
        refreshData();
    }, [isCheckoutModalVisible]);

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    return (
        <>
            <Title level={3}>{translate("supplier.label.title.note")} - {supplier_name}</Title>
            <List title={translate("supplier.label.title.assets")}>
                <div className="all">
                    <TableAction searchFormProps={searchFormProps} />
                    <div className="other_function">
                        <div className="menu-container" ref={menuRef}>
                            <div>
                                <button
                                    className="menu-trigger"
                                    style={{
                                        borderTopLeftRadius: "3px",
                                        borderBottomLeftRadius: "3px",
                                    }}
                                >
                                    <Tooltip
                                        title={translate("hardware.label.tooltip.refresh")}
                                        color={"#108ee9"}
                                    >
                                        <SyncOutlined
                                            onClick={handleRefresh}
                                            style={{ color: "black" }}
                                        />
                                    </Tooltip>
                                </button>
                            </div>
                            <div>
                                <button onClick={onClickDropDown} className="menu-trigger">
                                    <Tooltip
                                        title={translate("hardware.label.tooltip.columns")}
                                        color={"#108ee9"}
                                    >
                                        <MenuOutlined style={{ color: "black" }} />
                                    </Tooltip>
                                </button>
                            </div>
                            <nav className={`menu ${isActive ? "active" : "inactive"}`}>
                                <div className="menu-dropdown">
                                    {collumns.map((item) => (
                                        <Checkbox
                                            className="checkbox"
                                            key={item.key}
                                            onChange={() => onCheckItem(item)}
                                            checked={collumnSelected.includes(item.key)}
                                        >
                                            {item.title}
                                        </Checkbox>
                                    ))}
                                </div>
                            </nav>
                        </div>
                        <div>
                            <button
                                className="menu-trigger"
                                style={{
                                    borderTopRightRadius: "3px",
                                    borderBottomRightRadius: "3px",
                                }}
                            >
                                <Tooltip
                                    title={translate("hardware.label.tooltip.search")}
                                    color={"#108ee9"}
                                >
                                    <FileSearchOutlined
                                        onClick={handleSearch}
                                        style={{ color: "black" }}
                                    />
                                </Tooltip>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="sum-items">
                    <span className="name-sum-assets">
                        {translate("hardware.label.title.sum-assets")}
                    </span>{" "}
                    : {tableProps.pagination ? tableProps.pagination?.total : 0}
                </div>

                {loading ? (
                    <>
                        <div style={{ paddingTop: "15rem", textAlign: "center" }}>
                            <Spin
                                tip={`${translate("loading")}...`}
                                style={{ fontSize: "18px", color: "black" }}
                            />
                        </div>
                    </>
                ) : (
                    <Table
                        {...tableProps}
                        rowKey="id"
                        scroll={{ x: 1090 }}
                        className={(pageTotal as number) <= 10 ? "list-table" : ""}
                        pagination={
                            (pageTotal as number) > 10
                                ? {
                                    position: ["topRight", "bottomRight"],
                                    total: pageTotal ? pageTotal : 0,
                                    showSizeChanger: true,
                                }
                                : false
                        }

                    >
                        {collumns
                            .filter((collumn) => collumnSelected.includes(collumn.key))
                            .map((col) => (
                                <Table.Column dataIndex={col.key} {...(col as any)} sorter />
                            ))}
                        <Table.Column<IHardwareResponse>
                            title={translate("table.actions")}
                            dataIndex="actions"
                            render={(_, record) => (
                                <Space>
                                    <Tooltip
                                        title={translate("hardware.label.tooltip.viewDetail")}
                                        color={"#108ee9"}
                                    >
                                        <ShowButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onClick={() => show(record)}
                                        />
                                    </Tooltip>

                                    <Tooltip
                                        title={translate("hardware.label.tooltip.clone")}
                                        color={"#108ee9"}
                                    >
                                        <CloneButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onClick={() => clone(record)}
                                        />
                                    </Tooltip>

                                    <Tooltip
                                        title={translate("hardware.label.tooltip.edit")}
                                        color={"#108ee9"}
                                    >
                                        <EditButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onClick={() => edit(record)}
                                        />
                                    </Tooltip>

                                    {record.assigned_to !== null ? (
                                        <DeleteButton hideText size="small" disabled />
                                    ) : (
                                        <Tooltip
                                            title={translate("hardware.label.tooltip.delete")}
                                            color={"red"}
                                        >
                                            <DeleteButton
                                                resourceName={HARDWARE_API}
                                                hideText
                                                size="small"
                                                recordItemId={record.id}
                                            />
                                        </Tooltip>
                                    )}

                                    {record.user_can_checkout === true && (
                                        <Button
                                            className="ant-btn-checkout"
                                            type="primary"
                                            shape="round"
                                            size="small"
                                            loading={
                                                isLoadingArr[record.id] === undefined
                                                    ? false
                                                    : isLoadingArr[record.id] === false
                                                        ? false
                                                        : true
                                            }
                                            onClick={() => checkout(record)}
                                        >
                                            {translate("hardware.label.button.checkout")}
                                        </Button>
                                    )}

                                    {record.user_can_checkin === true && (
                                        <Button
                                            type="primary"
                                            shape="round"
                                            size="small"
                                            loading={
                                                isLoadingArr[record.id] === undefined
                                                    ? false
                                                    : isLoadingArr[record.id] === false
                                                        ? false
                                                        : true
                                            }
                                            onClick={() => checkin(record)}
                                        >
                                            {translate("hardware.label.button.checkin")}
                                        </Button>
                                    )}
                                </Space>
                            )}
                        />
                    </Table>
                )}
                <MModal
                    title={translate("hardware.label.title.search_advanced")}
                    setIsModalVisible={setIsSearchModalVisible}
                    isModalVisible={isSearchModalVisible}
                >
                    <HardwareSearch
                        isModalVisible={isSearchModalVisible}
                        setIsModalVisible={setIsSearchModalVisible}
                        searchFormProps={searchFormProps}
                    />
                </MModal>

                <MModal
                    title={translate("hardware.label.title.edit")}
                    setIsModalVisible={setIsEditModalVisible}
                    isModalVisible={isEditModalVisible}
                >
                    <HardwareEdit
                        isModalVisible={isEditModalVisible}
                        setIsModalVisible={setIsEditModalVisible}
                        data={detail}
                    />
                </MModal>
                <MModal
                    title={translate("hardware.label.title.clone")}
                    setIsModalVisible={setIsCloneModalVisible}
                    isModalVisible={isCloneModalVisible}
                >
                    <HardwareClone
                        isModalVisible={isCloneModalVisible}
                        setIsModalVisible={setIsCloneModalVisible}
                        data={detailClone}
                    />
                </MModal>
                <MModal
                    title={translate("hardware.label.title.checkout")}
                    setIsModalVisible={setIsCheckoutModalVisible}
                    isModalVisible={isCheckoutModalVisible}
                >
                    <HardwareCheckout
                        isModalVisible={isCheckoutModalVisible}
                        setIsModalVisible={setIsCheckoutModalVisible}
                        data={detailCheckout}
                    />
                </MModal>
                <MModal
                    title={translate("hardware.label.title.detail")}
                    setIsModalVisible={setIsShowModalVisible}
                    isModalVisible={isShowModalVisible}
                >
                    <HardwareShow
                        setIsModalVisible={setIsShowModalVisible}
                        detail={detail}
                    />
                </MModal>
                <MModal
                    title={translate("hardware.label.title.checkin")}
                    setIsModalVisible={setIsCheckinModalVisible}
                    isModalVisible={isCheckinModalVisible}
                >
                    <HardwareCheckin
                        isModalVisible={isCheckinModalVisible}
                        setIsModalVisible={setIsCheckinModalVisible}
                        data={detailCheckin}
                    />
                </MModal>
            </List >

            <SupplierDetailsAccessory />
            <SupplierDetailsConsumable />

        </>
    );
};
