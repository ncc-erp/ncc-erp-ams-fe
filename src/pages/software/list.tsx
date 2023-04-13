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
    TagField,
    CreateButton,
    Button,
    ShowButton,
    Tooltip,
    Checkbox,
    Form,
    Select,
    useSelect,
} from "@pankod/refine-antd";
import {
    MenuOutlined,
    FileSearchOutlined,
    SyncOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import {
    ISoftware,
    ISoftwareFilterVariables,
    ISoftwareResponse,
} from "interfaces/software";
import { dateFormat } from "constants/assets";
import {
    CATEGORIES_SELECT_SOFTWARE_LIST_API,
    SOFTWARE_API,
} from "api/baseApi";
import { Spin } from "antd";
import { DatePicker } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";
import { SoftwareCreate } from "./create";
import { SoftwareSearch } from "./search";
import { SoftwareClone } from "./clone";
import { SoftwareEdit } from "./edit";
import { SoftwareShow } from "./show";
import { SoftwareCheckout } from "./checkout";

const defaultCheckedList = [
    "id",
    "name",
    "category",
    "total_licenses",
    "version",
    "created_at",
];

interface ICheckboxChange {
    key: string;
}

export const SoftwareList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { RangePicker } = DatePicker;
    const { Option } = Select;

    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");

    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
        ISoftwareResponse,
        HttpError,
        ISoftwareFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: SOFTWARE_API,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
                name,
                software_tag,
                category,
                manufacturer
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
                        software_tag,
                        category,
                        manufacturer
                    }),
                },
            );
            return filters;
        },
    });

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            refreshData();
            setLoading(false);
        }, 300);
    };

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    const { selectProps: categorySelectProps } = useSelect<ISoftware>({
        resource: CATEGORIES_SELECT_SOFTWARE_LIST_API,
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

    const { list } = useNavigation();

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
                title: t("software.label.field.softwareName"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
                        onClick={() => {
                            list(`licenses?id=${record.id}&name=${value}`);
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "software_tag",
                title: t("software.label.field.software_tag"),
                render: (value: string, record: any) => (
                    <TextField value={value}/>
                ),
                defaultSortOrder: getDefaultSortOrder("software_tag", sorter),
            },
            {
                key: "version",
                title: t("software.label.field.version"),
                render: (value: string, record: any) => (
                    <TextField value={value}/>
                ),
                defaultSortOrder: getDefaultSortOrder("version", sorter),
            },
            {
                key: "total_licenses",
                title: t("software.label.field.total_licenses"),
                render: (value: string, record: any) => (
                    <TextField value={value}/>
                ),
                defaultSortOrder: getDefaultSortOrder("total_licenses", sorter),
            },
            {
                key: "category",
                title: t("software.label.field.category"),
                render: (value: ISoftwareResponse) => <TextField value={value.name} />,
                defaultSortOrder: getDefaultSortOrder("category.name", sorter),
                filters: filterCategory,
                onFilter: (value: number, record: ISoftwareResponse) => {
                    return record.category.id === value;
                },
            },
            {
                key: "manufacturer",
                title: t("software.label.field.manufacturer"),
                render: (value: ISoftwareResponse) => (
                    <TextField value={value && value.name}
                        onClick={() => {
                            list(`manufactures_details?id=${value.id}&name=${value.name}`);
                        }}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }} />
                ),
                defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
            },
            {
                key: "created_at",
                title: t("software.label.field.dateAdd"),
                render: (value: ISoftware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
            },
        ],
        [filterCategory]
    )

    const menuRef = useRef(null);

    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);

    const [collumnSelected, setColumnSelected] = useState<string[]>(
        localStorage.getItem("item_software_selected") !== null
            ? JSON.parse(localStorage.getItem("item_software_selected") as string)
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

    useEffect(() => {
        localStorage.setItem("item_software_selected", JSON.stringify(collumnSelected));
    }, [collumnSelected]);

    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    const handleSearch = () => {
        handleOpenSearchModel();
    };

    const handleOpenSearchModel = () => {
        setIsSearchModalVisible(!isSearchModalVisible);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleCreate = () => {
        handleOpenModel();
    };

    const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);

    const [detailClone, setDetailClone] = useState<ISoftwareResponse>();
    const clone = (data: ISoftwareResponse) => {
        const dataConvert: ISoftwareResponse = {
            id: data.id,
            name: data.name,
            software_tag: data.software_tag,
            total_licenses: data.total_licenses,
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
            user_can_checkout: false
        };

        setDetailClone(dataConvert);
        setIsCloneModalVisible(true);
    };

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    const [detailEdit, setDetailEdit] = useState<ISoftwareResponse>();

    const edit = (data: ISoftwareResponse) => {
        const dataConvert: ISoftwareResponse = {
            id: data.id,
            name: data.name,
            software_tag: data.software_tag,
            total_licenses: data.total_licenses,
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
            }
        };
        setDetailEdit(dataConvert);
        setIsEditModalVisible(true);
    };

    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const show = (data: ISoftwareResponse) => {
        setIsShowModalVisible(true);
        setDetailEdit(data);
    };

    const initselectedRowKeys = useMemo(() => {
        return JSON.parse(localStorage.getItem("selectedSoftwareRowKeys") as string) || [];
    }, [localStorage.getItem("selectedSoftwareRowKeys")]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<
        React.Key[] | ISoftwareResponse[]
    >(initselectedRowKeys as React.Key[]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: ISoftwareResponse[]
    ) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onSelect = (record: any, selected: boolean) => {
        if (!selected) {
            const newSelectRow = initselectedRowKeys.filter(
                (item: ISoftware) => item.id !== record.id
            );
            localStorage.setItem("selectedSoftwareRowKeys", JSON.stringify(newSelectRow));
            setSelectedRowKeys(newSelectRow.map((item: ISoftware) => item.id));
        } else {
            const newselectedRowKeys = [record, ...initselectedRowKeys];
            localStorage.setItem(
                "selectedSoftwareRowKeys",
                JSON.stringify(
                    newselectedRowKeys.filter(function (item, index) {
                        return newselectedRowKeys.findIndex((item) => item.id === index);
                    })
                )
            );
            setSelectedRowKeys(newselectedRowKeys.map((item: ISoftware) => item.id));
        }
    };

    const onSelectAll = (
        selected: boolean,
        selectedRows: ISoftwareResponse[],
        changeRows: ISoftwareResponse[]
    ) => {
        if (!selected) {
            const unSelectIds = changeRows.map((item: ISoftwareResponse) => item.id);
            let newSelectedRows = initselectedRowKeys.filter(
                (item: ISoftwareResponse) => item
            );
            newSelectedRows = initselectedRowKeys.filter(
                (item: any) => !unSelectIds.includes(item.id)
            );

            localStorage.setItem("selectedSoftwareRowKeys", JSON.stringify(newSelectedRows));
        } else {
            selectedRows = selectedRows.filter((item: ISoftwareResponse) => item);
            localStorage.setItem(
                "selectedSoftwareRowKeys",
                JSON.stringify([...initselectedRowKeys, ...selectedRows])
            );
            setSelectedRowKeys(selectedRows);
        }
    };

    const rowSelection = {
        selectedRowKeys: initselectedRowKeys.map((item: ISoftware) => item.id),
        onChange: onSelectChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        onSelectChange,
    };

    const [ isCheckoutManySoftwareModalVisible, setIsCheckoutManySoftwareModalVisible ] = useState(false);

    const handleCheckout = () => {
        setIsCheckoutManySoftwareModalVisible(!isCheckoutManySoftwareModalVisible);
    };

    const [selectedCheckout, setSelectedCheckout] = useState<boolean>(true);
    const [selectdStoreCheckout, setSelectdStoreCheckout] = useState<any[]>([]);

    useEffect(() => {
        if (
            initselectedRowKeys.filter(
                (item: ISoftwareResponse) => item.user_can_checkout
            ).length > 0
        ) {
            setSelectedCheckout(true);
            setSelectdStoreCheckout(
                initselectedRowKeys
                  .filter((item: ISoftwareResponse) => item.user_can_checkout)
                  .map((item: ISoftwareResponse) => item)
              );
        } else {
            setSelectedCheckout(false);
        }
    }, [initselectedRowKeys]);



    return (
        <List
            title={t("software.label.title.all_software")}
            pageHeaderProps={{
                extra: (
                    <CreateButton onClick={handleCreate}>
                        {t("software.label.tooltip.create")}
                    </CreateButton>
                ),
            }}>
            <div className="search">
                <Form
                    layout="vertical"
                    className="search-month-location"
                >
                    <Form.Item
                        label={t("software.label.title.time")}
                        name="purchase_date"
                    >
                        <RangePicker
                            format={dateFormat}
                            placeholder={[
                                `${t("software.label.field.start-date")}`,
                                `${t("software.label.field.end-date")}`,
                            ]}
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
                                        title={t("hardware.label.tooltip.refresh")}
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
                                        title={t("hardware.label.tooltip.columns")}
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
                                    title={t("hardware.label.tooltip.search")}
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
                title={t("software.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <SoftwareCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                />
            </MModal>
            <MModal
                title={t("software.label.title.clone")}
                setIsModalVisible={setIsCloneModalVisible}
                isModalVisible={isCloneModalVisible}
            >
                <SoftwareClone
                    isModalVisible={isCloneModalVisible}
                    setIsModalVisible={setIsCloneModalVisible}
                    data={detailClone}
                />
            </MModal>
            <MModal
                title={t("software.label.title.search_advanced")}
                setIsModalVisible={setIsSearchModalVisible}
                isModalVisible={isSearchModalVisible}
            >
                <SoftwareSearch
                    isModalVisible={isSearchModalVisible}
                    setIsModalVisible={setIsSearchModalVisible}
                    searchFormProps={searchFormProps}
                />
            </MModal>
            <MModal
                title={t("software.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <SoftwareEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detailEdit}
                />
            </MModal>
            <MModal
                title={t("software.label.title.detail")}
                setIsModalVisible={setIsShowModalVisible}
                isModalVisible={isShowModalVisible}
            >
                <SoftwareShow
                    setIsModalVisible={setIsShowModalVisible}
                    detail={detailEdit}
                />
            </MModal>

            <MModal
                title={t("hardware.label.title.checkout")}
                setIsModalVisible={setIsCheckoutManySoftwareModalVisible}
                isModalVisible={isCheckoutManySoftwareModalVisible}
            >
                <SoftwareCheckout
                    isModalVisible={isCheckoutManySoftwareModalVisible}
                    setIsModalVisible={setIsCheckoutManySoftwareModalVisible}
                    data={selectdStoreCheckout}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </MModal>

            <div className="checkout-checkin-multiple">
                <div className="sum-assets">
                    <span className="name-sum-assets">
                        {t("software.label.title.sum-assets")}
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
                        {t("hardware.label.title.checkout")}
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
                    <Table.Column<ISoftwareResponse>
                        title={t("table.actions")}
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
                                <Tooltip
                                    title={t("software.label.tooltip.viewDetail")}
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
                                    title={t("software.label.tooltip.clone")}
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
                                    title={t("software.label.tooltip.edit")}
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
                                    title={t("software.label.tooltip.delete")}
                                    color={"red"}
                                >
                                    <DeleteButton
                                        resourceName={SOFTWARE_API}
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            )}
        </List>
    )
}
