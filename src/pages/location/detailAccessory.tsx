/* eslint-disable react-hooks/exhaustive-deps */
import {
    Button,
    Checkbox,
    DateField,
    DeleteButton,
    EditButton,
    getDefaultSortOrder,
    List,
    ShowButton,
    Space,
    Spin,
    Table,
    TagField,
    TextField,
    Tooltip,
    useTable,
} from "@pankod/refine-antd";
import {
    CrudFilters,
    HttpError,
    IResourceComponentsProps,
    useNavigation,
    useTranslate,
} from "@pankod/refine-core";
import { ACCESSORY_API, ACCRSSORY_TOTAL_DETAIL_API } from "api/baseApi";
import { MModal } from "components/Modal/MModal";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";
import { Image } from "antd";
import { TableAction } from "components/elements/tables/TableAction";
import {
    MenuOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { IAccessoryFilterVariables, IAccessoryResponseCheckout, IAccesstoryRequest, IAccesstoryResponse } from "interfaces/accessory";
import { AccessoryShow } from "pages/accessory/show";
import { AccessoryCheckout, AccessoryEdit } from "pages/accessory";
import { TotalDetail } from "components/elements/TotalDetail";


const defaultCheckedListAccessory = [
    "id",
    "name",
    "category",
    "purchase_date",
    "supplier",
    "location",
    "qty",
    "notes",
];

export const LocationDetailsAccessory: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { list } = useNavigation();
    const [isLoadingArr] = useState<boolean[]>([]);

    const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);

    const [listening, setListening] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);
    const menuRef = useRef(null);

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detail, setDetail] = useState<IAccesstoryResponse>();

    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [detailCheckout, setDetailCheckout] =
        useState<IAccessoryResponseCheckout>();

    const [collumnSelectedAccessory, setColumnSelectedAccessory] = useState<string[]>(
        localStorage.getItem("item_accessory_selected") !== null
            ? JSON.parse(localStorage.getItem("item_accessory_selected") as string)
            : defaultCheckedListAccessory
    );

    const [searchParams] = useSearchParams();
    const category_id = searchParams.get("category_id");
    const searchParam = searchParams.get("search");
    const location_id = searchParams.get('id');

    const { tableProps, tableQueryResult, searchFormProps, sorter, filters } = useTable<
        IAccesstoryResponse,
        HttpError,
        IAccessoryFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: `${ACCESSORY_API}?location_id=${location_id}`,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let { search, category } = params;
            filters.push(
                {
                    field: "search",
                    operator: "eq",
                    value: search ? search : searchParam,
                },
                {
                    field: "category_id",
                    operator: "eq",
                    value: category ? category : category_id,
                },
                {
                    field: "location_id",
                    operator: "eq",
                    value: location_id,
                },
            );

            return filters;
        },
    });


    const collumnDetailsAccessory = useMemo(
        () => [
            {
                key: "id",
                title: "ID",
                render: (value: number) => <TextField value={value ? value : 0} />,
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "name",
                title: translate("accessory.label.field.name"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value ? value : ""}
                        onClick={() => {
                            record.id &&
                                list(`accessory_details?id=${record.id}&name=${record.name}
                    &category_id=${record.category.id}`);
                        }}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
                    ></TextField>
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "image",
                title: translate("accessory.label.field.image"),
                render: (value: string) => {
                    return value ? (
                        <Image width={80} alt="" height={"auto"} src={value} />
                    ) : (
                        ""
                    );
                },
            },
            {
                key: "category",
                title: translate("accessory.label.field.category"),
                render: (value: IAccesstoryRequest) => (
                    <TagField value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("category.name", sorter),
            },
            {
                key: "purchase_date",
                title: translate("accessory.label.field.purchase_date"),
                render: (value: IAccesstoryRequest) =>
                    value ? (
                        <DateField format="LL" value={value ? value.date : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
            },
            {
                key: "warranty_months",
                title: translate("accessory.label.field.insurance"),
                render: (value: IAccesstoryRequest) => (
                    <TagField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
            },
            {
                key: "supplier",
                title: translate("accessory.label.field.supplier"),
                render: (value: IAccesstoryRequest) => (
                    <div dangerouslySetInnerHTML={{ __html: `${value ? value?.name : ""}` }} />
                ),
                defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
            },
            {
                key: "location",
                title: translate("accessory.label.field.location"),
                render: (value: IAccesstoryRequest) => (
                    <TagField value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("location.name", sorter),
            },
            {
                key: "order_number",
                title: translate("accessory.label.field.order_number"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("order_number", sorter),
            },
            {
                key: "qty",
                title: translate("accessory.label.field.total_accessory"),
                render: (value: number) => <TextField value={value ? value : 0} />,
                defaultSortOrder: getDefaultSortOrder("qty", sorter),
            },
            {
                key: "purchase_cost",
                title: translate("accessory.label.field.purchase_cost"),
                render: (value: number) => <TextField value={value ? value : 0} />,
                defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
            },
            {
                key: "notes",
                title: translate("accessory.label.field.notes"),
                render: (value: string) => (
                    <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
                ),
                defaultSortOrder: getDefaultSortOrder("notes", sorter),
            },
        ],
        []
    );

    const edit = (data: IAccesstoryResponse) => {
        const dataConvert: IAccesstoryResponse = {
            id: data.id,
            name: data.name,
            category: {
                id: data?.category?.id,
                name: data?.category?.name,
            },
            supplier: {
                id: data?.supplier?.id,
                name: data?.supplier?.name,
            },
            notes: data?.notes,
            location: {
                id: data?.location?.id,
                name: data?.location?.name,
            },
            purchase_date: {
                date: data?.purchase_date !== null ? data?.purchase_date.date : "",
                formatted:
                    data?.purchase_date !== null ? data?.purchase_date.formatted : "",
            },
            total_accessory: data?.total_accessory,
            manufacturer: {
                id: data?.manufacturer?.id,
                name: data?.manufacturer?.name,
            },
            purchase_cost: data ? data?.purchase_cost : 0,
            image: data ? data?.image : "",
            order_number: data ? data?.order_number : 0,
            qty: data ? data.qty : 0,
            user_can_checkout: data?.user_can_checkout,
            assigned_to: data?.assigned_to,
            remaining_qty: 0,
            checkin_date: data?.checkin_date,
            assigned_pivot_id: data?.assigned_pivot_id,
            warranty_months: data?.warranty_months,
            username: "",
            last_checkout: {
                datetime: "",
                formatted: "",
            },
            checkout_notes: "",
            created_at: {
                datetime: "",
                formatted: "",
            },
            updated_at: {
                datetime: "",
                formatted: "",
            },
        };
        setDetail(dataConvert);
        setIsEditModalVisible(true);
    };

    const checkout = (data: IAccesstoryResponse) => {
        const dataConvert: IAccessoryResponseCheckout = {
            id: data.id,
            name: data.name,
            category: {
                id: data?.category?.id,
                name: data?.category?.name,
            },
            note: "",
            assigned_to: data?.assigned_to,
            user_can_checkout: data?.user_can_checkout,
        };

        setDetailCheckout(dataConvert);
        setIsCheckoutModalVisible(true);
    };


    const handleSearch = () => {
        handleOpenSearchModel();
    };

    const handleOpenSearchModel = () => {
        setIsSearchModalVisible(!isSearchModalVisible);
    };

    const show = (data: IAccesstoryResponse) => {
        setIsShowModalVisible(true);
        setDetail(data);
    };


    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCheckoutModalVisible]);


    useEffect(() => {
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    const onCheckItemAccessory = (value: { key: string }) => {
        if (collumnSelectedAccessory.includes(value.key)) {
            setColumnSelectedAccessory(
                collumnSelectedAccessory.filter((item: any) => item !== value.key)
            );
        } else {
            setColumnSelectedAccessory(collumnSelectedAccessory.concat(value.key));
        }
    };

    useEffect(() => {
        localStorage.setItem(
            "item_accessory_selected",
            JSON.stringify(collumnSelectedAccessory)
        );
    }, [collumnSelectedAccessory]);


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
        setIsTotalDetailReload(!isTotalDetailReload);
    };

    useEffect(() => {
        refreshData();
    }, [isCheckoutModalVisible]);

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    return (

        <List
            title={translate("accessory.label.title.accessory")}
        >
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
                                    title={translate("accessory.label.tooltip.columns")}
                                    color={"#108ee9"}
                                >
                                    <MenuOutlined style={{ color: "black" }} />
                                </Tooltip>
                            </button>
                        </div>
                        <nav className={`menu ${isActive ? "active" : "inactive"}`}>
                            <div className="menu-dropdown">
                                {collumnDetailsAccessory.map((item) => (
                                    <Checkbox
                                        className="checkbox"
                                        key={item.key}
                                        onChange={() => onCheckItemAccessory(item)}
                                        checked={collumnSelectedAccessory.includes(item.key)}
                                    >
                                        {item.title}
                                    </Checkbox>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            <TotalDetail
                links={ACCRSSORY_TOTAL_DETAIL_API}
                filters={filters}
                isReload={isTotalDetailReload}
            ></TotalDetail>

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
                    className={(pageTotal as number) <= 10 ? "list-table" : ""}
                    {...tableProps}
                    rowKey="id"
                    scroll={{ x: 1090 }}
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
                    {collumnDetailsAccessory
                        .filter((collumn) => collumnSelectedAccessory.includes(collumn.key))
                        .map((col) => (
                            <Table.Column dataIndex={col.key} {...col} sorter />
                        ))}
                    <Table.Column<IAccesstoryResponse>
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
                                    title={translate("accessory.label.tooltip.edit")}
                                    color={"#108ee9"}
                                >
                                    <EditButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                        onClick={() => edit(record)}
                                    />
                                </Tooltip>

                                {record.qty === record.remaining_qty ? (
                                    <Tooltip
                                        title={translate("accessory.label.tooltip.delete")}
                                        color={"#108ee9"}
                                    >
                                        <DeleteButton
                                            resourceName={ACCESSORY_API}
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onSuccess={() => {
                                                setIsTotalDetailReload(!isTotalDetailReload);
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <DeleteButton hideText size="small" disabled />
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
                                        {translate("accessory.label.button.checkout")}
                                    </Button>
                                )}

                                {record.user_can_checkout === false && (
                                    <Button
                                        className="ant-btn-checkout"
                                        type="primary"
                                        shape="round"
                                        size="small"
                                        disabled
                                    >
                                        {translate("accessory.label.button.checkout")}
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            )}

            <MModal
                title={translate("accessory.label.title.detail")}
                setIsModalVisible={setIsShowModalVisible}
                isModalVisible={isShowModalVisible}
            >
                <AccessoryShow
                    setIsModalVisible={setIsShowModalVisible}
                    detail={detail}
                />
            </MModal>

            <MModal
                title={translate("accessory.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <AccessoryEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detail}
                />
            </MModal>
            <MModal
                title={translate("accessory.label.title.checkout")}
                setIsModalVisible={setIsCheckoutModalVisible}
                isModalVisible={isCheckoutModalVisible}
            >
                <AccessoryCheckout
                    isModalVisible={isCheckoutModalVisible}
                    setIsModalVisible={setIsCheckoutModalVisible}
                    data={detailCheckout}
                />
            </MModal>
        </List>
    );
};
