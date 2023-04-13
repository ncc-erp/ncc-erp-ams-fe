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
    Select,
    useSelect,
    Typography,
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
    ISoftwareLicensesFilterVariables,
    ISoftwareLicensesResponse,
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


const defaultCheckedList = [
    "id",
    "licenses",
    "software",
    "purchase_date",
    "expiration_date",
    "purchase_cost"
];

interface ICheckboxChange {
    key: string;
}

export const LicensesList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { Title } = Typography;
    const { RangePicker } = DatePicker;

    const initselectedRowKeys = useMemo(() => {
        return JSON.parse(localStorage.getItem("selectedLicensesRowKeys") as string) || [];
    }, [localStorage.getItem("selectedLicensesRowKeys")]);
    console.log(initselectedRowKeys);


    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");
    const software_id = searchParams.get('id');
    const software_name = searchParams.get('name');

    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
        ISoftwareLicensesResponse,
        HttpError,
        ISoftwareLicensesFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: SOFTWARE_API + "/" + software_id + "/licenses",
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
                licenses,
                seats,
                freeSeats,
                software
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
                        licenses,
                        seats,
                        freeSeats,
                        software
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

    const collumns = useMemo(
        () => [
            {
                key: "id",
                title: "ID",
                render: (value: number) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "licenses",
                title: t("licenses.label.field.licenses"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("licenses", sorter),
            },
            {
                key: "software",
                title: t("licenses.label.field.software"),
                render: (value: string, record: any) => (
                    <TextField
                        value={record.software.name}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("software", sorter),
            },
            {
                key: "seats",
                title: t("licenses.label.field.seats"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("seats", sorter),
            },
            {
                key: "free_seats_count",
                title: t("licenses.label.field.free_seats_count"),
                render: (value: string, record: any) => (
                    <TextField value={value} />
                ),
                defaultSortOrder: getDefaultSortOrder("free_seats_count", sorter),
            },
            {
                key: "purchase_date",
                title: t("licenses.label.field.dateAdd"),
                render: (value: ISoftware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
            },
            {
                key: "expiration_date",
                title: t("licenses.label.field.expiration_date"),
                render: (value: ISoftware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("expiration_date", sorter),
            },
            {
                key: "purchase_cost",
                title: t("licenses.label.field.purchase_cost"),
                render: (value: string, record: any) => (
                    <TextField
                        value={value}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
            },
        ],
        []
    )

    const menuRef = useRef(null);

    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);

    const [collumnSelected, setColumnSelected] = useState<string[]>(
        localStorage.getItem("item_licenses_selected") !== null
            ? JSON.parse(localStorage.getItem("item_licenses_selected") as string)
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
    console.log(collumnSelected);


    useEffect(() => {
        localStorage.setItem("item_licenses_selected", JSON.stringify(collumnSelected));
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
    const [detailClone, setDetailClone] = useState<ISoftwareLicensesResponse>();
    // const clone = (data: ISoftwareLicensesResponse) => {
    //     const dataConvert: ISoftwareLicensesResponse = {
    //         id: data.id,
    //         name: data.name,
    //         software_tag: data.software_tag,
    //         total_licenses: data.total_licenses,
    //         user: {
    //             id: data?.user.id,
    //             name: data?.user.name
    //         },
    //         manufacturer: {
    //             id: data?.manufacturer.id,
    //             name: data?.manufacturer.name
    //         },
    //         notes: data?.notes,
    //         category: {
    //             id: data?.category.id,
    //             name: data?.category.name
    //         },
    //         version: data.version,
    //         created_at: {
    //             datetime: "",
    //             formatted: ""
    //         },
    //         updated_at: {
    //             datetime: "",
    //             formatted: ""
    //         },
    //         deleted_at: {
    //             datetime: "",
    //             formatted: ""
    //         }
    //     };

    //     setDetailClone(dataConvert);
    //     setIsCloneModalVisible(true);
    // };

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    const [detailEdit, setDetailEdit] = useState<ISoftwareLicensesResponse>();

    // const edit = (data: ISoftwareResponse) => {
    //     const dataConvert: ISoftwareResponse = {
    //         id: data.id,
    //         name: data.name,
    //         software_tag: data.software_tag,
    //         total_licenses: data.total_licenses,
    //         user: {
    //             id: data?.user.id,
    //             name: data?.user.name
    //         },
    //         manufacturer: {
    //             id: data?.manufacturer.id,
    //             name: data?.manufacturer.name
    //         },
    //         notes: data?.notes,
    //         category: {
    //             id: data?.category.id,
    //             name: data?.category.name
    //         },
    //         version: data.version,
    //         created_at: {
    //             datetime: "",
    //             formatted: ""
    //         },
    //         updated_at: {
    //             datetime: "",
    //             formatted: ""
    //         },
    //         deleted_at: {
    //             datetime: "",
    //             formatted: ""
    //         }
    //     };
    //     setDetailEdit(dataConvert);
    //     setIsEditModalVisible(true);
    // };

    // const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    // const show = (data: ISoftwareResponse) => {
    //     setIsShowModalVisible(true);
    //     setDetailEdit(data);
    // };

    const [isCheckoutManyKeyModalVisible, setIsCheckoutManyKeyModalVisible] =
        useState(false);

    return (
        <>
            <Title level={3}>{t("licenses.label.title.licenses")} - {software_name}</Title>
            <List
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
                                ]} />
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
                                                style={{ color: "black" }} />
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
                                            style={{ color: "black" }} />
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <MModal
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
    </MModal> */}

                {/* <MModal
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCheckoutManyKeyModalVisible}
        isModalVisible={isCheckoutManyKeyModalVisible}
    >
        <SoftwareCheckoutMultipleKey
            isModalVisible={isCheckoutManyKeyModalVisible}
            setIsModalVisible={setIsCheckoutManyKeyModalVisible}
            data={selectdStoreCheckout}
            setSelectedRowKeys={setSelectedRowKeys}
        />
    </MModal> */}

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
                        >
                            {t("hardware.label.title.checkout")}
                        </Button>
                        {/* <div className={nameCheckout ? "list-checkouts" : ""}>
        <span className="title-remove-name">{nameCheckout}</span>
        {initselectedRowKeys
            // .filter((item: ISoftwareResponse) => item.user_can_checkin)
            .map((item: ISoftwareResponse) => (
                <span className="list-checkin" key={item.id}>
                    <span className="name-checkin">{item.asset_tag}</span>
                    <span
                        className="delete-checkin-checkout"
                        onClick={() => handleRemoveCheckInCheckOutItem(item.id)}
                    >
                        <CloseOutlined />
                    </span>
                </span>
            ))}
    </div> */}
                    </div>
                </div>
                {loading ? (
                    <>
                        <div style={{ paddingTop: "15rem", textAlign: "center" }}>
                            <Spin
                                tip={`${t("loading")}...`}
                                style={{ fontSize: "18px", color: "black" }} />
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
                    >
                        {collumns
                            .filter((collumn) => collumnSelected.includes(collumn.key))
                            .map((col) => (
                                <Table.Column dataIndex={col.key} {...(col as any)} sorter />
                            ))}
                        <Table.Column<ISoftwareLicensesResponse>
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
                                            recordItemId={record.id} />
                                    </Tooltip>

                                    <Tooltip
                                        title={t("software.label.tooltip.clone")}
                                        color={"#108ee9"}
                                    >
                                        <CloneButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id} />
                                    </Tooltip>

                                    <Tooltip
                                        title={t("software.label.tooltip.edit")}
                                        color={"#108ee9"}
                                    >
                                        <EditButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id} />
                                    </Tooltip>

                                    <Tooltip
                                        title={t("software.label.tooltip.delete")}
                                        color={"red"}
                                    >
                                        <DeleteButton
                                            resourceName={SOFTWARE_API}
                                            hideText
                                            size="small"
                                            recordItemId={record.id} />
                                    </Tooltip>
                                    {/* {record.user_can_checkout === true && (
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
                                {t("hardware.label.button.checkout")}
                            </Button>
                        )} */}

                                    {/* {record.user_can_checkin === true && (
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
                                {t("hardware.label.button.checkin")}
                            </Button>
                        )} */}
                                </Space>
                            )} />
                    </Table>
                )}
            </List></>
    )
}
