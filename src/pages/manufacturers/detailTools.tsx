import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
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
    SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import {
    IToolCheckoutRequest,
    IToolFilterVariable,
    IToolResponse
} from "interfaces/tool";

import { Spin } from "antd";
import { DatePicker } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";

import moment from "moment";
import { IModel } from "interfaces/model";
import { MANUFACTURES_API, TOOLS_API, TOOLS_API_CATEGORIES_API } from "api/baseApi";
import { ToolSearch } from "pages/tools/search";
import { ToolCreate } from "pages/tools/create";
import { ToolEdit } from "pages/tools/edit";
import { ToolShow } from "pages/tools/show";
import { ToolCheckout } from "pages/tools/checkout";

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

export const ManufacturesDetailsTools: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
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
    const [detailCheckout, setDetailCheckout] = useState<IToolCheckoutRequest>();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");
    const manufacturer_id = searchParams.get("id");
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
        resource: `${TOOLS_API}?manufacturer_id=${manufacturer_id}`,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            filters.push(
                {
                    field: "search",
                    operator: "eq",
                    value: searchParam,
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

    const filterCategory = categorySelectProps?.options?.map((item) => ({
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
                    <TextField value={value && value.name} />
                ),
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
        [filterCategory]
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

    const show = (data: IToolResponse) => {
        setIsShowModalVisible(true);
        setDetailEdit(data);
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

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleCreate = () => {
        handleOpenModel();
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

    return (
        <List
            title="">
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

            <div className="sum-items">
                <span className="name-sum-assets">
                    {t("tools.label.title.sum-tools")}
                </span>{" "}
                : {tableProps.pagination ? tableProps.pagination?.total : 0}
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
