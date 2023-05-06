import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
} from "@pankod/refine-core";
import {
    List,
    Table,
    TextField,
    useTable,
    getDefaultSortOrder,
    DateField,
    Space,
    ShowButton,
    TagField,
    Tooltip,
    Spin,
} from "@pankod/refine-antd";
import { SyncOutlined } from "@ant-design/icons";
import { TableAction } from "components/elements/tables/TableAction";
import { useRef, useState } from "react";
import { ASSIGN_TOOLS_API } from "api/baseApi";
import type { ColumnsType } from "antd/es/table";
import { MModal } from "components/Modal/MModal";
import { IModel } from "interfaces/model";
import { IToolResponse } from "interfaces/tool";
import { ToolShow } from "pages/tools/show";

export const UserListTool: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const menuRef = useRef(null);
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [detail, setDetail] = useState<IToolResponse>();
    const [loading, setLoading] = useState(false);

    const { tableProps, sorter, searchFormProps, tableQueryResult } =
        useTable<IToolResponse>({
            initialSorter: [
                {
                    field: "checkout_at",
                    order: "desc",
                },
            ],
            resource: ASSIGN_TOOLS_API,
            onSearch: (params: any) => {
                const filters: CrudFilters = [];
                const { search } = params;
                filters.push({
                    field: "search",
                    operator: "eq",
                    value: search,
                });
                return filters;
            },
        });

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    const collumns: ColumnsType<IToolResponse> = [
        {
            key: "id",
            title: "ID",
            render: (value: number) => <TextField value={value} />,
            defaultSortOrder: getDefaultSortOrder("id", sorter),
        },
        {
            key: "name",
            title: t("tools.label.field.name"),
            render: (value: string) => (
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
            key: "category",
            title: t("tools.label.field.category"),
            render: (value: IToolResponse) =>   <TagField value={value ? value.name : ""} />,
            defaultSortOrder: getDefaultSortOrder("category", sorter),
        },
        {
            key: "manufacturer",
            title: t("tools.label.field.manufacturer"),
            render: (value: IToolResponse) => (
                <TagField value={value ? value.name : ""} />
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
            key: "checkout_at",
            title: t("tools.label.field.checkout_at"),
            render: (value: IModel) =>
                value ? (
                    <DateField format="LL" value={value ? value.datetime : ""} />
                ) : (
                    ""
                ),
            defaultSortOrder: getDefaultSortOrder("checkout_at", sorter),
        },
        {
            key: "notes",
            title: t("tools.label.field.notes"),
            render: (value: string, record: any) => (
                <TextField value={value} />
            ),
            defaultSortOrder: getDefaultSortOrder("notes", sorter),
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
    ];

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            refreshData();
            setLoading(false);
        }, 2000);
    };

    const show = (data: IToolResponse) => {
        setIsShowModalVisible(true);
        setDetail(data);
    };

    return (
        <List title={t("tools.label.title.my-tool")}>
            <div className="sum-assets">
                <span className="name-sum-assets">
                    {t("tools.label.title.sum-tools")}
                </span>{" "}
                : {tableProps.pagination ? tableProps.pagination?.total : 0}
            </div>
            <div className="users">
                <div
                    className={pageTotal === 0 ? "list-users-noTotalPage" : "list-users"}
                >
                </div>
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
                                            style={{ color: "black" }} />
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <MModal
                title={t("user.label.title.detail_Tool")}
                setIsModalVisible={setIsShowModalVisible}
                isModalVisible={isShowModalVisible}
            >
                <ToolShow
                    setIsModalVisible={setIsShowModalVisible}
                    detail={detail} />
            </MModal>

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
                    {collumns.map((col) => (
                        <Table.Column
                            dataIndex={col.key}
                            {...(col as ColumnsType)}
                            sorter
                        />
                    ))}
                    <Table.Column<any>
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
                            </Space>
                        )}
                    />
                </Table>
            )}
        </List>
    );
};
