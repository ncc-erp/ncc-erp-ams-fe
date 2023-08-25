/* eslint-disable no-lone-blocks */
import {
    DateField,
    Form,
    List,
    Select,
    Table,
    TextField,
    useSelect,
    useTable,
} from "@pankod/refine-antd";
import {
    CrudFilters,
    IResourceComponentsProps,
    useNavigation,
    useTranslate,
} from "@pankod/refine-core";
import { useEffect, useMemo, useState } from "react";
import { IW2Request } from "interfaces/w2request";
import { W2REQUEST_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
import { TableAction } from "components/elements/tables/TableAction";
import { StatusType, RequestType } from "constants/w2request";


export const W2RequestList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { list } = useNavigation();

    const [searchParams, setSearchParams] = useSearchParams();

    // const location = searchParams.get("location_id");
    const workflowId = searchParams.get("type");
    const statusParam = searchParams.get("status");

    const { Option } = Select;

    const { tableProps, searchFormProps } = useTable<IW2Request>({
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        resource: W2REQUEST_API,
        onSearch: (params: any) => {
            const filters: CrudFilters = [];
            let { type, status } = params;
            filters.push(
                {
                    field: "type",
                    operator: "eq",
                    value: workflowId,
                },
                {
                    field: "status",
                    operator: "eq",
                    value: statusParam,
                },
            );
            return filters;
        },
    });

    const pageTotal = tableProps.pagination && tableProps.pagination.total;

    const collumns = useMemo(
        () => [
            {
                key: "id",
                title: translate("w2request.label.field.id"),
                render: (value: IW2Request) => <TextField value={value ? value : ""} />,
            },
            {
                key: "type",
                title: translate("w2request.label.field.type"),
                render: (value: IW2Request) => (
                    <TextField value={value ? value : ""} />
                ),
            },
            {
                key: "userRequestName",
                title: translate("w2request.label.field.userRequestName"),
                render: (value: IW2Request) => (
                    <TextField value={value ? value : ""} />
                ),
            },
            {
                key: "createdAt",
                title: translate("w2request.label.field.createdAt"),
                render: (value: IW2Request) =>
                    value ? (
                        <DateField format="LL" value={value ? value.createdAt : ""} />
                    ) : (
                        ""
                    ),
            },
            {
                key: "lastExecutedAt",
                title: translate("w2request.label.field.lastExecutedAt"),
                render: (value: IW2Request) =>
                    value ? (
                        <DateField format="LL" value={value ? value.lastExecutedAt : ""} />
                    ) : (
                        ""
                    ),
            },
            {
                key: "status",
                title: translate("w2request.label.field.status"),
                render: (value: IW2Request) => (
                    <TextField value={value ? value : ""} />
                ),
            }
        ],
        []
    );

    const handleTypeChange = (value: {
        value: string;
        label: React.ReactNode;
    }) => {
        if (JSON.stringify(value) === JSON.stringify("all")) {
            searchParams.delete("type");
        } else searchParams.set("type", JSON.stringify(value));
        searchFormProps.form?.submit();
        setSearchParams(searchParams);
    };

    const handleStatusChange = (value: {
        value: string;
        label: React.ReactNode;
      }) => {
        if (JSON.stringify(value) === JSON.stringify("all")) {
          searchParams.delete("status");
        } else searchParams.set("status", JSON.stringify(value));
        searchFormProps.form?.submit();
        setSearchParams(searchParams);
      };

    return (
        <List title={translate("w2request.label.title.name")}>
            <div className="search" style={{ marginBottom: "20px" }}>
                <Form
                    layout="vertical"
                    className="search-month-location"
                    initialValues={{
                        status: statusParam ? statusParam : translate("all"),
                        type: workflowId ? workflowId : translate("all"),
                    }}
                >
                    <Form.Item
                        label={translate("w2request.label.title.type")}
                        name="type"
                        initialValue={"all"}
                        className="search-month-location-null"
                    >
                        <Select onChange={handleTypeChange} placeholder="xxx">
                            <Option value={"all"}>{translate("all")}</Option>
                            {Object.entries(RequestType).map(([key, value]) => {
                                return <Option value={value}>{value}</Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={translate("w2request.label.title.status")}
                        name="status"
                        initialValue={"all"}
                        className="search-month-location-null"
                    >
                        <Select
                            onChange={handleStatusChange}
                            placeholder={translate("w2request.label.field.status")}
                        >
                            <Option value={"all"}>{translate("all")}</Option>
                            {Object.entries(StatusType).map(([key, value]) => {
                                return <Option value={key}>{value}</Option>;
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className="report">
                <div className="sum-report">
                    <span className="name-sum-report">
                        {translate("dashboard.field.sum-report")}
                    </span>{" "}
                    : {tableProps.pagination ? tableProps.pagination?.total : 0}
                </div>
                <div className="search-report">
                    <TableAction searchFormProps={searchFormProps} />
                </div>
            </div>
            <Table
                {...tableProps}
                rowKey="id"
                scroll={{ x: 1100 }}
                pagination={{
                    position: ["topRight", "bottomRight"],
                    total: pageTotal ? pageTotal : 0,
                }}
            >
                {collumns.map((col) => (
                    <Table.Column dataIndex={col.key} {...(col as any)} sorter />
                ))}
            </Table>
        </List>
    );
};
