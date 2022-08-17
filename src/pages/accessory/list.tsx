import { Button, Checkbox, CreateButton, DateField, DeleteButton, EditButton, Form, getDefaultSortOrder, List, Select, Space, Spin, Table, TagField, TextField, Tooltip, useSelect, useTable } from "@pankod/refine-antd";
import { CrudFilters, HttpError, IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import { ACCESSORY_API, LOCATION_API } from "api/baseApi";
import { TableAction } from "components/elements/tables/TableAction";
import { MModal } from "components/Modal/MModal";
import { IAccessoryFilterVariables, IAccessoryResponseCheckout, IAccesstoryRequest, IAccesstoryResponse } from "interfaces/accessory";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AccessoryCheckout } from "./checkout";
import { AccessoryCreate } from "./create";
import { AccessoryEdit } from "./edit";
import { SyncOutlined, MenuOutlined } from "@ant-design/icons";
import { Image, DatePicker } from "antd";
import { ILocation } from "interfaces/dashboard";
import moment from "moment";

const defaultCheckedList = [
    "id",
    "name",
    "category",
    "purchase_date",
    "supplier",
    "location",
    "qty",
    "notes",
];

export const AccessoryList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detail, setDetail] = useState<IAccesstoryResponse>();

    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [detailCheckout, setDetailCheckout] = useState<IAccessoryResponseCheckout>();
    const [isLoadingArr] = useState<boolean[]>([]);

    const [collumnSelected, setColumnSelected] =
        useState<string[]>(localStorage.getItem('item_accessory_selected') !== null ? JSON.parse
            (localStorage.getItem('item_accessory_selected') as string) : defaultCheckedList);
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);
    const menuRef = useRef(null);
    const [listening, setListening] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const location_id = searchParams.get("location_id");
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");
    const searchParam = searchParams.get("search");

    const { tableProps, searchFormProps, sorter, tableQueryResult } = useTable<
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
        resource: ACCESSORY_API,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
                location,
                purchase_date,
            } = params;
            filters.push(
                {
                    field: "search",
                    operator: "eq",
                    value: search ? search : searchParam,
                },
                {
                    field: "location_id",
                    operator: "eq",
                    value: location ? location : location_id,
                },
                {
                    field: "dateFrom",
                    operator: "eq",
                    value: purchase_date
                        ? purchase_date[0].toISOString().substring(0, 10)
                        : undefined,
                },
                {
                    field: "dateTo",
                    operator: "eq",
                    value: purchase_date
                        ? purchase_date[1].toISOString().substring(0, 10)
                        : undefined,
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
                render: (value: number) => <TextField value={value ? value : 0} />,
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "name",
                title: translate("accessory.label.field.name"),
                render: (value: string) => <TextField value={value ? value : ""} />,
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
                render: (value: IAccesstoryRequest) => <TagField value={value ? value.name : ""} />,
                defaultSortOrder: getDefaultSortOrder("category.name", sorter),
            },
            {
                key: "purchase_date",
                title: translate("accessory.label.field.purchase_date"),
                render: (value: IAccesstoryRequest) => (
                    value ? <DateField format="LLL" value={value ? value.date : ""} /> : ""
                ),
                defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
            },
            {
                key: "supplier",
                title: translate("accessory.label.field.supplier"),
                render: (value: IAccesstoryRequest) => <TagField value={value ? value.name : ""} />,
                defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
            },
            {
                key: "location",
                title: translate("accessory.label.field.location"),
                render: (value: IAccesstoryRequest) => <TagField value={value ? value.name : ""} />,
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
                key: "notes",
                title: translate("accessory.label.field.notes"),
                render: (value: string) => <TextField value={value ? value : ""} />,
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
            notes: data.notes,
            location: {
                id: data?.location?.id,
                name: data?.location?.name,
            },
            purchase_date: {
                date: data?.purchase_date !== null ? data?.purchase_date.date : "",
                formatted: data?.purchase_date !== null ? data?.purchase_date.formatted : "",
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
            remaining_qty: 0
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

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    const handleCreate = () => {
        handleOpenModel();
    };

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    const onCheckItem = (value: { key: string }) => {
        if (collumnSelected.includes(value.key)) {
            setColumnSelected(
                collumnSelected.filter((item: any) => item !== value.key)
            );
        } else {
            setColumnSelected(collumnSelected.concat(value.key));
        }
    };

    useEffect(() => {
        localStorage.setItem("item_accessory_selected", JSON.stringify(collumnSelected));
    }, [collumnSelected])

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

    const { RangePicker } = DatePicker;
    const { Option } = Select;

    const { selectProps: locationSelectProps } = useSelect<ILocation>({
        resource: LOCATION_API,
        optionLabel: "name",
        optionValue: "id",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });

    const handleLocationChange = (value: {
        value: string;
        label: React.ReactNode;
    }) => {
        if (JSON.stringify(value) === JSON.stringify(0)) {
            searchParams.delete("location_id");
        } else searchParams.set("location_id", JSON.stringify(value));
        setSearchParams(searchParams);

        searchFormProps.form?.submit();
    };

    const handleDateChange = (val: any, formatString: any) => {
        const [from, to] = Array.from(val || []);

        if (val !== null) {
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
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    return (
        <List
            title={translate("accessory.label.title.accessory")}
            pageHeaderProps={{
                extra: (
                    <CreateButton onClick={handleCreate}>
                        {translate("accessory.label.tooltip.create")}
                    </CreateButton>
                ),
            }}
        >
            <div className="search">
                <Form
                    {...searchFormProps}
                    initialValues={{
                        location: location_id ? Number(location_id) : 0,
                        purchase_date:
                            dateFromParam && dateToParam
                                ? [
                                    moment(dateFromParam, "YYYY/MM/DD"),
                                    moment(dateToParam, "YYYY/MM/DD"),
                                ]
                                : "",
                    }}
                    layout="vertical"
                    onValuesChange={() => searchFormProps.form?.submit()}
                    className="search-month-location"
                >
                    <Form.Item
                        label={translate("accessory.label.title.time")}
                        name="purchase_date"
                    >
                        <RangePicker
                            format="YYYY/MM/DD"
                            placeholder={[
                                `${translate("accessory.label.field.start-date")}`,
                                `${translate("accessory.label.field.end-date")}`,
                            ]}
                            onCalendarChange={handleDateChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={translate("accessory.label.field.location")}
                        name="location"
                        className="search-month-location-null"
                        initialValue={0}
                    >
                        <Select onChange={handleLocationChange} placeholder="Vị trí">
                            <Option value={0}>{translate("all")}</Option>
                            {locationSelectProps.options?.map((item: any) => (
                                <Option value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
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
            </div>

            {loading ? (
                <>
                    <div style={{ paddingTop: "15rem", textAlign: "center" }}>
                        <Spin
                            tip="Loading..."
                            style={{ fontSize: "18px", color: "black" }}
                        />
                    </div>
                </>
            ) : (
                <Table
                    {...tableProps}
                    rowKey="id"
                    scroll={{ x: 1220 }}
                    pagination={{
                        position: ["topRight", "bottomRight"],
                        total: pageTotal ? pageTotal : 0,
                    }}
                >
                    {collumns
                        .filter((collumn) => collumnSelected.includes(collumn.key))
                        .map((col) => (
                            <Table.Column dataIndex={col.key} {...col} sorter />
                        ))}
                    <Table.Column<IAccesstoryResponse>
                        title={translate("table.actions")}
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
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

                                {record.qty === record.remaining_qty ?
                                    <Tooltip
                                        title={translate("accessory.label.tooltip.delete")}
                                        color={"#108ee9"}
                                    >
                                        <DeleteButton
                                            resourceName={ACCESSORY_API}
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                        />
                                    </Tooltip>
                                    :
                                    <DeleteButton
                                        hideText
                                        size="small"
                                        disabled
                                    />
                                }

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
                title={translate("accessory.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <AccessoryCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
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
        </List >
    )
}