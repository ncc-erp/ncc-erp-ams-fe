import { Button, Checkbox, DeleteButton, getDefaultSortOrder, List, Space, Table, TextField, Tooltip, useTable } from "@pankod/refine-antd";
import { CrudFilters, IResourceComponentsProps, useTranslate, useCustom } from "@pankod/refine-core";
import { IUser, IUserResponse } from "interfaces/user";
import { useMemo, useRef, useState } from "react";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { TableAction } from "components/elements/tables/TableAction";
import { MenuOutlined } from "@ant-design/icons";
import dataProvider from "providers/dataProvider";

const defaultCheckedList = [
    "id",
    "first_name",
    "last_name",
    "username",
    "category",
    "email",
    "phone",
    "remote"
];

export const Manager_UserList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();

    const [collumnSelected, setColumnSelected] =
        useState<string[]>(defaultCheckedList);
    const [isActive, setIsActive] = useState(false);
    const [hrmLoading, setHrmLoading] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);
    const menuRef = useRef(null);
    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: "api/v1/users",
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

    const syncHrm = () => {
        const { custom } = dataProvider;
        setHrmLoading(true);
        custom && custom({
            url: `api/v1/users/sync-list-user`,
            method: "get",
        }).then(x => {
            setHrmLoading(false);
            tableQueryResult.refetch();
        });
    }

    const collumns = useMemo(
        () => [
            {
                key: "id",
                title: "ID",
                render: (value: number) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "avatar",
                title: translate("user.label.field.image"),
                render: (value: string) => {
                    return value ? (
                        <Image width={80} alt="" height={"auto"} src={value} />
                    ) : (
                        ""
                    );
                },
            },
            {
                key: "name",
                title: translate("user.label.field.nameUser"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "first_name",
                title: translate("user.label.field.first_name"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "last_name",
                title: translate("user.label.field.nameUser"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("last_name", sorter),
            },
            {
                key: "jobtitle",
                title: translate("user.label.field.title"),
                render: (value: string) => <TextField value={value ? value : ""} />,
                defaultSortOrder: getDefaultSortOrder("jobtitle", sorter),
            },
            {
                key: "remote",
                title: translate("user.label.field.remote"),
                render: (value: boolean) => (
                    <TextField
                        value={
                            value === false ? (
                                <CloseOutlined color="#a94442" />
                            ) : (
                                <CheckOutlined />
                            )
                        }
                        style={{
                            color: value === false ? "#a94444" : "#44793f",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
            },
            {
                key: "email",
                title: translate("user.label.field.email"),
                render: (value: string) => <TextField value={value ? value : ""} />,
            },
            {
                key: "phone",
                title: translate("user.label.field.phone"),
                render: (value: number) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("phone", sorter),
            },
            {
                key: "address",
                title: translate("user.label.field.address"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("address", sorter),
            },
            {
                key: "city",
                title: translate("user.label.field.city"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("city", sorter),
            },
            {
                key: "country",
                title: translate("user.label.field.country"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("country", sorter),
            },
            {
                key: "state",
                title: translate("user.label.field.state"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("state", sorter),
            },
            {
                key: "username",
                title: translate("user.label.field.username"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("username", sorter),
            },
            {
                key: "employee_num",
                title: translate("user.label.field.employee_num"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("employee_num", sorter),
            },
            {
                key: "zip",
                title: translate("user.label.field.zip"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("zip", sorter),
            },
            {
                key: "department",
                title: translate("user.label.field.department"),
                render: (value: IUser) => (
                    <TextField value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("department.name", sorter),
            },
            {
                key: "location",
                title: translate("user.label.field.locations"),
                render: (value: IUser) => (
                    <TextField value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("location.name", sorter),
            },
            {
                key: "manager",
                title: translate("user.label.field.user_manager"),
                render: (value: IUser) => (
                    <TextField value={value ? value.name : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("manager.name", sorter),
            },
            {
                key: "activated",
                title: translate("user.label.field.activated"),
                render: (value: boolean) => (
                    <TextField
                        value={
                            value === false ? (
                                <CloseOutlined color="#a94442" />
                            ) : (
                                <CheckOutlined />
                            )
                        }
                        style={{
                            color: value === false ? "#a94444" : "#44793f",
                        }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("activated", sorter),
            },
            {
                key: "assets_count",
                title: translate("user.label.field.assets_count"),
                render: (value: number) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
            },
            {
                key: "accessories_count",
                title: translate("user.label.field.accessories_count"),
                render: (value: number) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("accessories_count", sorter),
            },
            {
                key: "licenses_count",
                title: translate("user.label.field.licenses_count"),
                render: (value: number) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("licenses_count", sorter),
            },
            {
                key: "consumables_count",
                title: translate("user.label.field.consumables_count"),
                render: (value: number) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("consumables_count", sorter),
            },
            {
                key: "notes",
                title: translate("user.label.field.note"),
                render: (value: string) => (
                    <TextField value={value ? value : ""} />
                ),
                defaultSortOrder: getDefaultSortOrder("notes", sorter),
            },
        ],
        []
    );

    const pageTotal = tableProps.pagination && tableProps.pagination.total;
    const isLoading = tableProps.loading || hrmLoading;
    const onCheckItem = (value: any) => {
        if (collumnSelected.includes(value.key)) {
            setColumnSelected(
                collumnSelected.filter((item: any) => item !== value.key)
            );
        } else {
            setColumnSelected(collumnSelected.concat(value.key));
        }
    };


    return (
        <List
            title={translate("")}
        >
            <div className="search" style={{ float: "right" }}>
                <div className="all">
                    <div style={{ display: "flex", marginTop: "3rem", marginRight: "10px" }}>
                        <Button onClick={syncHrm}>{translate("user.label.button.synchronized")}</Button>
                    </div>
                    <TableAction searchFormProps={searchFormProps} />
                    <div className="other_function">
                        <div className="menu-container" ref={menuRef}>
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
                        </div>
                    </div>
                </div>
            </div>
            <Table
                {...tableProps }
                loading={isLoading}
                rowKey="id"
                scroll={{ x: 1500 }}
                pagination={{
                    position: ["topRight", "bottomRight"],
                    total: pageTotal ? pageTotal : 0,
                }}>
                {collumns
                    .filter((collumn) => collumnSelected.includes(collumn.key))
                    .map((col) => (
                        <Table.Column dataIndex={col.key} {...col} sorter />
                    ))}
                <Table.Column<IUserResponse>
                    title={translate("table.actions")}
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            {record.assets_count > 0 ? (
                                <DeleteButton hideText size="small" disabled />
                            ) : (
                                <Tooltip
                                    title={translate("hardware.label.tooltip.delete")}
                                    color={"red"}
                                >
                                    <DeleteButton
                                        resourceName={"api/v1/users"}
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List >
    )
}