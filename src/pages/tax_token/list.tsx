import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
    useNavigation,
} from "@pankod/refine-core";
import {
    List,
    Table,
    TextField,
    useTable,
    getDefaultSortOrder,
    DateField,
    Space,
    CloneButton,
    EditButton,
    DeleteButton,
    CreateButton,
    Button,
    ShowButton,
    Tooltip,
    Checkbox,
    Form,
    useSelect,
    TagField,
} from "@pankod/refine-antd";
import {
    MenuOutlined,
    FileSearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { dateFormat } from "constants/assets";
import {
    SUPPLIERS_API,
    TAX_TOKEN_API,
} from "api/baseApi";
import { Spin } from "antd";
import { DatePicker } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { IModel } from "interfaces/model";
import { ITaxToken, ITaxTokenFilterVariables, ITaxTokenRequestCheckout, ITaxTokenResponse } from "interfaces/tax_token";
import { getBGTaxTokenAssignedStatusDecription, getBGTaxTokenStatusDecription, getTaxTokenAssignedStatusDecription, getTaxTokenStatusDecription } from "untils/tax_token";
import { TaxTokenCreate } from "./create";
import { TaxTokenEdit } from "./edit";
import { TaxTokenSearch } from "./search";
import { TaxTokenShow } from "./show";
import { TaxTokenClone } from "./clone";
import { TaxTokenCheckout } from "./checkout";
import { TaxTokenCheckoutMultiple } from "./checkout-multiple";

const defaultCheckedList = [
    "id",
    "name",
    "seri",
    "supplier",
    "status_id",
    "assigned_status",
    "assigned_to",
];

interface ICheckboxChange {
    key: string;
}

export const TaxTokenList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { list } = useNavigation();
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
    const [detailClone, setDetailClone] = useState<ITaxTokenResponse>();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detailEdit, setDetailEdit] = useState<ITaxTokenResponse>();
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [isCheckoutManyTaxTokenModalVisible, setIsCheckoutManyTaxTokenModalVisible] = useState(false);
    const [selectedCheckout, setSelectedCheckout] = useState<boolean>(true);
    const [selectdStoreCheckout, setSelectdStoreCheckout] = useState<any[]>([]);
    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [detailCheckout, setDetailCheckout] = useState<ITaxTokenRequestCheckout>();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    const [listening, setListening] = useState(false);
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

    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
        ITaxTokenResponse,
        HttpError,
        ITaxTokenFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: TAX_TOKEN_API,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
                name,
                seri,
                supplier,
                purchase_date
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
                        seri,
                        supplier,
                        purchase_date
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
            );
            return filters;
        },
    });

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    const { selectProps: suppliersSelectProps } = useSelect<IModel>({
        resource: SUPPLIERS_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const filterSuppliers = suppliersSelectProps?.options?.map((item) => ({
        text: item.label,
        value: item.value,
    }));

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
                title: t("tax_token.label.field.name"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "seri",
                title: t("tax_token.label.field.seri"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("seri", sorter),
            },
            {
                key: "supplier",
                title: t("tax_token.label.field.supplier"),
                render: (value: IModel) => <TextField value={value.name} />,
                defaultSortOrder: getDefaultSortOrder("supplier", sorter),
                filters: filterSuppliers,
                onFilter: (value: number, record: ITaxTokenResponse) => {
                    return record.supplier.id === value;
                },
            },
            {
                key: "purchase_date",
                title: t("tax_token.label.field.purchase_date"),
                render: (value: ITaxToken) =>
                    value ? (
                        <DateField format="LL" value={value ? value.date : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
            },
            {
                key: "expiration_date",
                title: t("tax_token.label.field.expiration_date"),
                render: (value: ITaxToken) =>
                    value ? (
                        <DateField format="LL" value={value ? value.date : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("expiration_date", sorter),
            },
            {
                key: "purchase_cost",
                title: t("tax_token.label.field.purchase_cost"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
            },
            {
                key: "status_id",
                title: t("tax_token.label.field.status"),
                render: (value: number) => (
                    <TagField
                        value={getTaxTokenStatusDecription(value)}
                        style={{
                            background: getBGTaxTokenStatusDecription(value),
                            color: "white",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("status_id", sorter),
            },
            {
                key: "assigned_status",
                title: t("tax_token.label.field.assigned_status"),
                render: (value: number) => (
                    <TagField
                        value={getTaxTokenAssignedStatusDecription(value)}
                        style={{
                            background: getBGTaxTokenAssignedStatusDecription(value),
                            color: "white",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
            },
            {
                key: "assigned_to",
                title: t("tax_token.label.field.checkoutTo"),
                render: (value: string, record: ITaxTokenResponse) => (
                    <TextField value={record.assigned_to ? record.assigned_to.username : ''} />
                ),
                defaultSortOrder: getDefaultSortOrder("assigned_to", sorter),
            },
            {
                key: "checkout_counter",
                title: t("tax_token.label.field.checkout_counter"),
                render: (value: number, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
            },
            {
                key: "checkin_counter",
                title: t("tax_token.label.field.checkin_counter"),
                render: (value: number, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
            },
            {
                key: "note",
                title: t("tax_token.label.field.note"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("note", sorter),
            },
        ],
        [filterSuppliers]
    )

    const [collumnSelected, setColumnSelected] = useState<string[]>(
        localStorage.getItem("item_tax_token_selected") !== null
            ? JSON.parse(localStorage.getItem("item_tax_token_selected") as string)
            : defaultCheckedList
    );

    const onCheckItem = (value: ICheckboxChange) => {
        if (collumnSelected.includes(value.key)) {
            setColumnSelected(
                collumnSelected.filter((item: any) => item !== value.key)
            );
        } else {
            setColumnSelected(collumnSelected.concat(value.key));
        }
    };

    const clone = (data: ITaxTokenResponse) => {
        const dataConvert: ITaxTokenResponse = {
            id: data.id,
            name: data.name,
            seri: data.seri,
            status_id: data?.status_id,
            assigned_to: data?.assigned_to,
            purchase_date: {
                date: data?.purchase_date.date,
                formatted: data?.purchase_date.formatted
            },
            purchase_cost: data?.purchase_cost,
            expiration_date: {
                date: data?.expiration_date.date,
                formatted: data?.expiration_date.formatted
            },
            supplier: {
                id: data?.supplier.id,
                name: data?.supplier.name
            },
            last_checkout: {
                datetime: "",
                formatted: ""
            },
            checkin_date: {
                datetime: "",
                formatted: ""
            },
            note: data?.note,
            user_can_checkout: false,
            user_can_checkin: false,
            checkout_counter: 0,
            checkin_counter: 0,
            assigned_status: data?.assigned_status,
            withdraw_from: data?.withdraw_from,
            created_at: {
                datetime: "",
                formatted: ""
            },
            updated_at: {
                datetime: "",
                formatted: ""
            }
        };

        setDetailClone(dataConvert);
        setIsCloneModalVisible(true);
    };

    const edit = (data: ITaxTokenResponse) => {
        const dataConvert: ITaxTokenResponse = {
            id: data.id,
            name: data.name,
            seri: data.seri,
            status_id: data?.status_id,
            assigned_to: data?.assigned_to,
            purchase_date: {
                date: data?.purchase_date.date,
                formatted: data?.purchase_date.formatted
            },
            purchase_cost: data?.purchase_cost,
            expiration_date: {
                date: data?.expiration_date.date,
                formatted: data?.expiration_date.formatted
            },
            supplier: {
                id: data?.supplier.id,
                name: data?.supplier.name
            },
            last_checkout: {
                datetime: "",
                formatted: ""
            },
            checkin_date: {
                datetime: "",
                formatted: ""
            },
            note: data?.note,
            user_can_checkout: false,
            user_can_checkin: false,
            checkout_counter: 0,
            checkin_counter: 0,
            assigned_status: data?.assigned_status,
            withdraw_from: data?.withdraw_from,
            created_at: {
                datetime: "",
                formatted: ""
            },
            updated_at: {
                datetime: "",
                formatted: ""
            }
        };
        setDetailEdit(dataConvert);
        setIsEditModalVisible(true);
    };

    const show = (data: ITaxTokenResponse) => {
        setIsShowModalVisible(true);
        setDetailEdit(data);
    };

    const checkout = (data: ITaxTokenResponse) => {
        const dataConvert: ITaxTokenRequestCheckout = {
            id: data?.id,
            name: data?.name,
            supplier: data?.supplier.name,
            checkout_date: "",
            assigned_user: "",
            note: ""
        };
        setDetailCheckout(dataConvert);
        setIsCheckoutModalVisible(true);
    };

    const initselectedRowKeys = useMemo(() => {
        return JSON.parse(localStorage.getItem("selectedTaxTokenRowKeys") as string) || [];
    }, [localStorage.getItem("selectedTaxTokenRowKeys")]);


    const [selectedRowKeys, setSelectedRowKeys] = useState<
        React.Key[] | ITaxTokenResponse[]
    >(initselectedRowKeys as React.Key[]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: ITaxTokenResponse[]
    ) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onSelect = (record: any, selected: boolean) => {
        if (!selected) {
            const newSelectRow = initselectedRowKeys.filter(
                (item: ITaxToken) => item.id !== record.id
            );
            localStorage.setItem("selectedTaxTokenRowKeys", JSON.stringify(newSelectRow));
            setSelectedRowKeys(newSelectRow.map((item: ITaxToken) => item.id));
        } else {
            const newselectedRowKeys = [record, ...initselectedRowKeys];
            localStorage.setItem(
                "selectedTaxTokenRowKeys",
                JSON.stringify(
                    newselectedRowKeys.filter(function (item, index) {
                        return newselectedRowKeys;
                    })
                )
            );
            setSelectedRowKeys(newselectedRowKeys.map((item: ITaxToken) => item.id));
        }
    };

    const onSelectAll = (
        selected: boolean,
        selectedRows: ITaxTokenResponse[],
        changeRows: ITaxTokenResponse[]
    ) => {
        if (!selected) {
            const unSelectIds = changeRows.map((item: ITaxTokenResponse) => item.id);
            let newSelectedRows = initselectedRowKeys.filter(
                (item: ITaxTokenResponse) => item
            );
            newSelectedRows = initselectedRowKeys.filter(
                (item: any) => !unSelectIds.includes(item.id)
            );

            localStorage.setItem("selectedTaxTokenRowKeys", JSON.stringify(newSelectedRows));
        } else {
            selectedRows = selectedRows.filter((item: ITaxTokenResponse) => item);
            localStorage.setItem(
                "selectedTaxTokenRowKeys",
                JSON.stringify([...initselectedRowKeys, ...selectedRows])
            );
            setSelectedRowKeys(selectedRows);
        }
    };

    const rowSelection = {
        selectedRowKeys: initselectedRowKeys.map((item: ITaxToken) => item.id),
        onChange: onSelectChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        onSelectChange,
    };

    const handleCheckout = () => {
        setIsCheckoutManyTaxTokenModalVisible(!isCheckoutManyTaxTokenModalVisible);
    };

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            refreshData();
            setLoading(false);
        }, 300);
    };

    const handleSearch = () => {
        handleOpenSearchModel();
    };

    const handleOpenSearchModel = () => {
        setIsSearchModalVisible(!isSearchModalVisible);
    };

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleCreate = () => {
        handleOpenModel();
    };

    const handleDateChange = (val: any, formatString: any) => {
        if (val !== null) {
            const [from, to] = Array.from(val || []);
            searchParams.set(
                "dateFrom",
                from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
            );
            searchParams.set(
                "dateTo",
                to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
            );
        } else {
            searchParams.delete("dateFrom");
            searchParams.delete("dateTo");
        }

        setSearchParams(searchParams);
        searchFormProps.form?.submit();
    };

    useEffect(() => {
        localStorage.setItem("item_TaxToken_selected", JSON.stringify(collumnSelected));
    }, [collumnSelected]);

    useEffect(() => {
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);


    useEffect(() => {
        refreshData();
    }, [isCheckoutModalVisible])

    useEffect(() => {
        refreshData();
    }, [isCheckoutManyTaxTokenModalVisible])

    useEffect(() => {
        if (
            initselectedRowKeys.filter(
                (item: ITaxTokenResponse) => item.user_can_checkout
            ).length > 0
        ) {
            setSelectedCheckout(true);
            setSelectdStoreCheckout(
                initselectedRowKeys
                    .filter((item: ITaxTokenResponse) => item.user_can_checkout)
                    .map((item: ITaxTokenResponse) => item)
            );
        } else {
            setSelectedCheckout(false);
        }
    }, [initselectedRowKeys]);

    useEffect(() => {
        const aboutController = new AbortController();
        listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
        return function cleanup() {
            aboutController.abort();
        };
    }, []);

    return (
        <List
            title={t("tax_token.label.title.tax_token")}
            pageHeaderProps={{
                extra: (
                    <CreateButton onClick={handleCreate}>
                        {t("tax_token.label.tooltip.create")}
                    </CreateButton>
                ),
            }}>
            <div className="search">
                <Form
                    {...searchFormProps}
                    initialValues={{
                        created_at:
                            dateFromParam && dateToParam
                                ? [
                                    moment(dateFromParam, "YYYY/MM/DD"),
                                    moment(dateToParam, "YYYY/MM/DD"),
                                ]
                                : "",
                    }}
                    layout="vertical"
                    className="search-month-location"
                    onValuesChange={() => searchFormProps.form?.submit()}
                >
                    <Form.Item
                        label={t("tax_token.label.title.time")}
                        name="created_at"
                    >
                        <RangePicker
                            format={dateFormat}
                            placeholder={[
                                `${t("tax_token.label.field.start-date")}`,
                                `${t("tax_token.label.field.end-date")}`,
                            ]}
                            onCalendarChange={handleDateChange}
                        />
                    </Form.Item>
                </Form>
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
                                        title={t("tax_token.label.tooltip.refresh")}
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
                                        title={t("tax_token.label.tooltip.columns")}
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
                                    title={t("tax_token.label.tooltip.search")}
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
            </div>

            <MModal
                title={t("tax_token.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <TaxTokenCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                />
            </MModal>
            <MModal
                title={t("tax_token.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <TaxTokenEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detailEdit}
                />
            </MModal>
            <MModal
                title={t("tax_token.label.title.search")}
                setIsModalVisible={setIsSearchModalVisible}
                isModalVisible={isSearchModalVisible}
            >
                <TaxTokenSearch
                    isModalVisible={isSearchModalVisible}
                    setIsModalVisible={setIsSearchModalVisible}
                    searchFormProps={searchFormProps}
                />
            </MModal>
            <MModal
                title={t("tax_token.label.title.detail")}
                setIsModalVisible={setIsShowModalVisible}
                isModalVisible={isShowModalVisible}
            >
                <TaxTokenShow
                    setIsModalVisible={setIsShowModalVisible}
                    detail={detailEdit}
                    isModalVisible={isShowModalVisible} />
            </MModal>
            <MModal
                title={t("tax_token.label.title.clone")}
                setIsModalVisible={setIsCloneModalVisible}
                isModalVisible={isCloneModalVisible}
            >
                <TaxTokenClone
                    isModalVisible={isCloneModalVisible}
                    setIsModalVisible={setIsCloneModalVisible}
                    data={detailClone}
                />
            </MModal>
            <MModal
                title={t("tax_token.label.title.checkout")}
                setIsModalVisible={setIsCheckoutModalVisible}
                isModalVisible={isCheckoutModalVisible}
            >
                <TaxTokenCheckout
                    isModalVisible={isCheckoutModalVisible}
                    setIsModalVisible={setIsCheckoutModalVisible}
                    data={detailCheckout}
                />
            </MModal>
            <MModal
                title={t("tax_token.label.title.checkout")}
                setIsModalVisible={setIsCheckoutManyTaxTokenModalVisible}
                isModalVisible={isCheckoutManyTaxTokenModalVisible}
            >
                <TaxTokenCheckoutMultiple
                    isModalVisible={isCheckoutManyTaxTokenModalVisible}
                    setIsModalVisible={setIsCheckoutManyTaxTokenModalVisible}
                    data={selectdStoreCheckout}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </MModal>

            <div className="checkout-checkin-multiple">
                <div className="sum-assets">
                    <span className="name-sum-assets">
                        {t("tax_token.label.title.sum-tax_token")}
                    </span>{" "}
                    : {tableProps.pagination ? tableProps.pagination?.total : 0}
                </div>
                <div className="checkout-multiple-asset">
                    <Button
                        type="primary"
                        className="btn-select-checkout ant-btn-checkout"
                        onClick={handleCheckout}
                        disabled={!selectedCheckout}
                    >
                        {t("tax_token.label.title.checkout")}
                    </Button>
                </div>
            </div>
            {loading ? (
                <>
                    <div style={{ paddingTop: "15rem", textAlign: "center" }}>
                        <Spin
                            tip={`${t("loading")}...`}
                            style={{ fontSize: "18px", color: "black" }}
                        />
                    </div>
                </>
            ) : (
                <Table
                    {...tableProps}
                    rowKey="id"
                    scroll={{ x: 1850 }}
                    pagination={{
                        position: ["topRight", "bottomRight"],
                        total: pageTotal ? pageTotal : 0,
                    }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                >
                    {collumns
                        .filter((collumn) => collumnSelected.includes(collumn.key))
                        .map((col) => (
                            <Table.Column dataIndex={col.key} {...(col as any)} sorter />
                        ))}
                    <Table.Column<ITaxTokenResponse>
                        title={t("table.actions")}
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
                                <Tooltip
                                    title={t("tax_token.label.tooltip.viewDetail")}
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
                                    title={t("tax_token.label.tooltip.clone")}
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
                                    title={t("tax_token.label.tooltip.edit")}
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
                                        title={t("tax_token.label.tooltip.delete")}
                                        color={"red"}
                                    >
                                        <DeleteButton
                                            resourceName={TAX_TOKEN_API}
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                        />
                                    </Tooltip>
                                )}
                                {record.user_can_checkout && (
                                    <Button
                                        className="ant-btn-checkout"
                                        type="primary"
                                        shape="round"
                                        size="small"
                                        onClick={() => checkout(record)}
                                    >
                                        {t("tax_token.label.button.checkout")}
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            )}
        </List>
    )
}
