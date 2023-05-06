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
    EditButton,
    DeleteButton,
    CreateButton,
    Button,
    ShowButton,
    Tooltip,
    Checkbox,
    Form,
    useSelect,
} from "@pankod/refine-antd";
import {
    MenuOutlined,
    FileSearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import {
    IToolCheckoutRequest,
    IToolFilterVariable,
    IToolResponse
} from "interfaces/tool";
import { dateFormat } from "constants/assets";

import { Spin } from "antd";
import { DatePicker } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";

import moment from "moment";
import { IModel } from "interfaces/model";
import { MANUFACTURES_API, TOOLS_API, TOOLS_API_CATEGORIES_API } from "api/baseApi";
import { ToolSearch } from "./search";
import { ToolCreate } from "./create";
import { ToolEdit } from "./edit";
import { ToolShow } from "./show";
import { ToolCheckout } from "./checkout";
import { ToolMultiCheckout } from "./multi-checkout";

const defaultCheckedList = [
    "id",
    "name",
    "category",
    'checkout_count',
    "version",
];

interface ICheckboxChange {
    key: string;
}

export const ToolList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { list } = useNavigation();
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detailEdit, setDetailEdit] = useState<IToolResponse>();
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [isCheckoutToolModalVisible, setIsCheckoutToolModalVisible] = useState(false);
    const [selectedCheckout, setSelectedCheckout] = useState<boolean>(true);
    const [detailCheckout, setDetailCheckout] = useState<IToolCheckoutRequest>();
    const [isCheckoutMultiToolsModalVisible, setIsCheckoutMultiToolsModalVisible] = useState(false);
    const [selectdStoreCheckout, setSelectdStoreCheckout] = useState<any[]>([]);

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
        IToolResponse,
        HttpError,
        IToolFilterVariable
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: TOOLS_API,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                name,
                key,
                category,
                manufacturer,
                version,
                created_at
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
                        key,
                        category,
                        manufacturer,
                        version
                    }),
                },
                {
                    field: "dateFrom",
                    operator: "eq",
                    value: created_at
                        ? created_at[0].format().substring(0, 10)
                        : undefined,
                },
                {
                    field: "dateTo",
                    operator: "eq",
                    value: created_at
                        ? created_at[1].format().substring(0, 10)
                        : undefined,
                },
            );
            return filters;
        },
    });

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    const { selectProps: categorySelectProps } = useSelect<IModel>({
        resource: TOOLS_API_CATEGORIES_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const { selectProps: manufacturesSelectProps } = useSelect<IModel>({
        resource: MANUFACTURES_API,
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

    const filterManufactures = manufacturesSelectProps?.options?.map((item) => ({
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
                title: t("tools.label.field.name"),
                render: (value: string, record: IModel) => (
                    <TextField
                        value={value}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "purchase_cost",
                title: t("tools.label.field.purchase_cost"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
            },
            {
                key: "version",
                title: t("tools.label.field.version"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("version", sorter),
            },
            {
                key: "checkout_count",
                title: t("tools.label.field.checkout_count"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("checkout_count", sorter),
            },
            {
                key: "category",
                title: t("tools.label.field.category"),
                render: (value: IToolResponse) => <TextField value={value.name} />,
                defaultSortOrder: getDefaultSortOrder("category", sorter),
                filters: filterCategory,
                onFilter: (value: number, record: IToolResponse) => {
                    return record.category.id === value;
                },
            },
            {
                key: "manufacturer",
                title: t("tools.label.field.manufacturer"),
                render: (value: IToolResponse) => (
                    <TextField value={value && value.name}
                        onClick={() => {
                            list(`manufactures_details?id=${value.id}&name=${value.name}`);
                        }}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }} />
                ),
                onFilter: (value: number, record: IToolResponse) => {
                    return record.manufacturer.id === value;
                },
                filters: filterManufactures,
                defaultSortOrder: getDefaultSortOrder("manufacturer", sorter),
            },
            {
                key: "purchase_date",
                title: t("tools.label.field.purchase_date"),
                render: (value: any) =>
                    value ? (
                        <DateField format="LL" value={value ? value.date : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
            },
            {
                key: "created_at",
                title: t("tools.label.field.dateCreate"),
                render: (value: IModel) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("created_at", sorter),
            },
        ],
        [filterCategory, filterManufactures]
    )

    const [collumnSelected, setColumnSelected] = useState<string[]>(
        localStorage.getItem("item_tools_selected") !== null
            ? JSON.parse(localStorage.getItem("item_tools_selected") as string)
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

    const edit = (data: IToolResponse) => {
        const dataConvert: IToolResponse = {
            id: data.id,
            name: data.name,
            tool_id: data?.tool_id,
            purchase_cost: data.purchase_cost,
            checkout_count: data.checkout_count,
            user: {
                id: data?.user.id,
                name: data?.user.name
            },
            manufacturer: {
                id: data?.manufacturer.id,
                name: data?.manufacturer.name
            },
            notes: data?.notes,
            category: {
                id: data?.category.id,
                name: data?.category.name
            },
            version: data.version,
            user_can_checkout: false,
            user_can_checkin: false,
            assigned_to: data?.assigned_to,
            purchase_date: data?.purchase_date,
            created_at: {
                datetime: "",
                formatted: ""
            },
            updated_at: {
                datetime: "",
                formatted: ""
            },
            deleted_at: {
                datetime: "",
                formatted: ""
            },
            checkout_at: {
                datetime: "",
                formatted: ""
            }
        };
        setDetailEdit(dataConvert);
        setIsEditModalVisible(true);
    }

    const checkout = (data: IToolResponse) => {
        const dataConvert: IToolCheckoutRequest = {
            id: data.id,
            name: data.name,
            checkout_at: {
                datetime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            },
            assigned_users: [],
            notes: ""
        };
        setDetailCheckout(dataConvert);
        setIsCheckoutToolModalVisible(true);
    };

    const initselectedRowKeys = useMemo(() => {
        return JSON.parse(localStorage.getItem("selectedToolsRowKeys") as string) || [];
    }, [localStorage.getItem("selectedToolsRowKeys")]);


    const [selectedRowKeys, setSelectedRowKeys] = useState<
        React.Key[] | IToolResponse[]
    >(initselectedRowKeys as React.Key[]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: IToolResponse[]
    ) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onSelect = (record: any, selected: boolean) => {
        if (!selected) {
            const newSelectRow = initselectedRowKeys.filter(
                (item: IModel) => item.id !== record.id
            );
            localStorage.setItem("selectedToolsRowKeys", JSON.stringify(newSelectRow));
            setSelectedRowKeys(newSelectRow.map((item: IModel) => item.id));
        } else {
            const newselectedRowKeys = [record, ...initselectedRowKeys];
            localStorage.setItem(
                "selectedToolsRowKeys",
                JSON.stringify(
                    newselectedRowKeys.filter(function (item, index) {
                        return newselectedRowKeys;
                    })
                )
            );
            setSelectedRowKeys(newselectedRowKeys.map((item: IModel) => item.id));
        }
    };

    const onSelectAll = (
        selected: boolean,
        selectedRows: IToolResponse[],
        changeRows: IToolResponse[]
    ) => {
        if (!selected) {
            const unSelectIds = changeRows.map((item: IToolResponse) => item.id);
            let newSelectedRows = initselectedRowKeys.filter(
                (item: IToolResponse) => item
            );
            newSelectedRows = initselectedRowKeys.filter(
                (item: any) => !unSelectIds.includes(item.id)
            );

            localStorage.setItem("selectedToolsRowKeys", JSON.stringify(newSelectedRows));
        } else {
            selectedRows = selectedRows.filter((item: IToolResponse) => item);
            localStorage.setItem(
                "selectedToolsRowKeys",
                JSON.stringify([...initselectedRowKeys, ...selectedRows])
            );
            setSelectedRowKeys(selectedRows);
        }
    };

    const rowSelection = {
        selectedRowKeys: initselectedRowKeys.map((item: IModel) => item.id),
        onChange: onSelectChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        onSelectChange,
    };

    const show = (data: IToolResponse) => {
        setIsShowModalVisible(true);
        setDetailEdit(data);
    };

    const handleCheckout = () => {
        setIsCheckoutMultiToolsModalVisible(!isCheckoutMultiToolsModalVisible);
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
        localStorage.setItem("item_tools_selected", JSON.stringify(collumnSelected));
    }, [collumnSelected]);

    useEffect(() => {
        localStorage.removeItem("selectedToolsRowKeys");
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCheckoutToolModalVisible])

    useEffect(() => {
        localStorage.removeItem("selectedToolsRowKeys");
        refreshData();
    }, [isCheckoutMultiToolsModalVisible])

    useEffect(() => {
        if (
            initselectedRowKeys.filter(
                (item: IToolResponse) => item.user_can_checkout
            ).length > 0
        ) {
            setSelectedCheckout(true);
            setSelectdStoreCheckout(
                initselectedRowKeys
                    .filter((item: IToolResponse) => item.user_can_checkout)
                    .map((item: IToolResponse) => item)
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
            title={t("tools.label.title.tools")}
            pageHeaderProps={{
                extra: (
                    <CreateButton onClick={handleCreate}>
                        {t("tools.label.tooltip.create")}
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
                        label={t("tools.label.title.time")}
                        name="created_at"
                    >
                        <RangePicker
                            format={dateFormat}
                            placeholder={[
                                `${t("tools.label.field.start-date")}`,
                                `${t("tools.label.field.end-date")}`,
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
                                        title={t("tools.label.tooltip.refresh")}
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
                                        title={t("tools.label.tooltip.columns")}
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
                                    title={t("tools.label.tooltip.search")}
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
                title={t("tools.label.title.search_advanced")}
                setIsModalVisible={setIsSearchModalVisible}
                isModalVisible={isSearchModalVisible}
            >
                <ToolSearch
                    isModalVisible={isSearchModalVisible}
                    setIsModalVisible={setIsSearchModalVisible}
                    searchFormProps={searchFormProps}
                />
            </MModal>
            <MModal
                title={t("tools.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <ToolCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                />
            </MModal>

            <MModal
                title={t("tools.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <ToolEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detailEdit}
                />
            </MModal>

            <MModal
                title={t("tools.label.title.detail")}
                setIsModalVisible={setIsShowModalVisible}
                isModalVisible={isShowModalVisible}
            >
                <ToolShow
                    setIsModalVisible={setIsShowModalVisible}
                    detail={detailEdit}
                />
            </MModal>

            <MModal
                title={t("tools.label.title.checkout")}
                setIsModalVisible={setIsCheckoutToolModalVisible}
                isModalVisible={isCheckoutToolModalVisible}
            >
                <ToolCheckout
                    isModalVisible={isCheckoutToolModalVisible}
                    setIsModalVisible={setIsCheckoutToolModalVisible}
                    data={detailCheckout}
                />
            </MModal>

            <MModal
                title={t("hardware.label.title.checkout")}
                setIsModalVisible={setIsCheckoutMultiToolsModalVisible}
                isModalVisible={isCheckoutMultiToolsModalVisible}
            >
                <ToolMultiCheckout
                    isModalVisible={isCheckoutMultiToolsModalVisible}
                    setIsModalVisible={setIsCheckoutMultiToolsModalVisible}
                    data={selectdStoreCheckout}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </MModal>

            <div className="checkout-checkin-multiple">
                <div className="sum-assets">
                    <span className="name-sum-assets">
                        {t("tools.label.title.sum-tools")}
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
                        {t("tools.label.title.checkout")}
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
                    scroll={{ x: 1500 }}
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
                    <Table.Column<IToolResponse>
                        title={t("table.actions")}
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
                                <Tooltip
                                    title={t("tools.label.tooltip.viewDetail")}
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
                                    title={t("tools.label.tooltip.edit")}
                                    color={"#108ee9"}
                                >
                                    <EditButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                        onClick={() => edit(record)}
                                    />
                                </Tooltip>

                                <Tooltip
                                    title={t("tools.label.tooltip.delete")}
                                    color={"red"}
                                >
                                    <DeleteButton
                                        resourceName={TOOLS_API}
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                </Tooltip>
                                {record.user_can_checkout && (
                                    <Button
                                        className="ant-btn-checkout"
                                        type="primary"
                                        shape="round"
                                        size="small"
                                        onClick={() => checkout(record)}
                                    >
                                        {t("tools.label.button.checkout")}
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
