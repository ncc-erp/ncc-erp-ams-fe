/* eslint-disable no-lone-blocks */
import {
    Button,
    DateField,
    Form,
    List,
    Popconfirm,
    Select,
    Space,
    Table,
    TextField,
    useTable,
} from "@pankod/refine-antd";
import {
    CrudFilters,
    IResourceComponentsProps,
    useCreate,
    useNotification,
    useTranslate,
} from "@pankod/refine-core";
import { useEffect, useMemo, useState } from "react";
import { IW2Request } from "interfaces/w2request";
import { W2REQUEST_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
// import { TableAction } from "components/elements/tables/TableAction"; 
import { RequestStatus, StatusType } from "constants/w2request";
import { MModal } from "components/Modal/MModal";
import { CancelRequest } from "./cancel";


export const W2RequestList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();

    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [requestId, setRequestId] = useState<string>('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isBtnAcceptLoading, setIsBtnAcceptLoading] = useState<Record<string, boolean>>({});
    const { open } = useNotification();

    // const workflowId = searchParams.get("type");
    const statusParam = searchParams.get("status");

    const setIsBtnAcceptLoadingByKey = (key: string, value: boolean) => {
        setIsBtnAcceptLoading((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const { mutate, isLoading: isLoadingSendRequest } = useCreate();
    const onAcceptRequest = (id: string) => {
        setIsBtnAcceptLoadingByKey(id, true);

        mutate({
            resource: W2REQUEST_API + "/approve-request",
            values: {
                id: id
            },
            successNotification: false,
            errorNotification: false,
        }, {
            onSuccess(data) {
                open?.({
                    type: 'success',
                    description: 'Success',
                    message: data?.data.messages
                })
                setIsBtnAcceptLoadingByKey(id, false);
            },
            onError(error) {
                open?.({
                    type: 'error',
                    description: 'Error',
                    message: error?.response?.data.messages
                })
                setIsBtnAcceptLoadingByKey(id, false);
            }
        })
    }

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    useEffect(() => {
        refreshData();
    }, [isLoadingSendRequest])

    useEffect(() => {
        searchFormProps.form?.submit();
    }, [window.location.reload]);

    const cancel = (data: IW2Request) => {
        setIsCancelModalVisible(true);
        setRequestId(data.id);
    }

    const { Option } = Select;

    const { tableProps, searchFormProps, tableQueryResult } = useTable<IW2Request>({
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
                // {
                //     field: "type",
                //     operator: "eq",
                //     value: workflowId,
                // },
                {
                    field: "status",
                    operator: "eq",
                    value: (status == "all") ? [] : [status],
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
                key: "status",
                title: translate("w2request.label.field.status"),
                render: (value: string) => (
                    <TextField value={translate(`w2request.label.status.${StatusType[value]}`)} />
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
            // {
            //     key: "lastExecutedAt",
            //     title: translate("w2request.label.field.lastExecutedAt"),
            //     render: (value: IW2Request) =>
            //         value ? (
            //             <DateField format="LL" value={value ? value.lastExecutedAt : ""} />
            //         ) : (
            //             ""
            //         ),
            // },
        ],
        []
    );

    /*
    const handleTypeChange = (value: {
        value: string;
        label: React.ReactNode;
    }) => {
        if (JSON.stringify(value) === JSON.stringify("all")) {
            searchParams.delete("type");
        } else searchParams.set("type", JSON.stringify(value));
        searchFormProps.form?.submit();
        setSearchParams(searchParams);
    }; */

    const handleStatusChange = (value: string) => {
        if (value == "all") {
            searchParams.delete("status");
        }
        else {
            searchParams.set("status", value);
        }
        searchFormProps.form?.submit();
        setSearchParams(searchParams);
    };

    return (
        <List title={translate("w2request.label.title.name")}>
            <div className="search" style={{ marginBottom: "20px" }}>
                <Form
                    {...searchFormProps}
                    layout="vertical"
                    className="search-month-location"
                    initialValues={{
                        status: statusParam ? statusParam : "all",
                        // type: workflowId ? workflowId : translate("all"),
                    }}
                >
                    {/*  
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
                    </Form.Item> */}

                    <Form.Item
                        label={translate("w2request.label.title.status")}
                        name="status"
                        className="search-month-location-null"
                    >
                        <Select
                            onChange={handleStatusChange}
                            placeholder={translate("w2request.label.field.status")}
                        >
                            <Option value={"all"}>{translate("all")}</Option>
                            {Object.entries(StatusType).map(([key, value]) => {
                                return <Option value={key}>{translate(`w2request.label.status.${value}`)}</Option>;
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
                {/* 
                 <div className="search-report">
                    <TableAction searchFormProps={searchFormProps} />
                </div> */}
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
                <Table.Column<IW2Request>
                    title={translate("table.actions")}
                    dataIndex="actions"
                    render={(_, record) => {
                        if (!isBtnAcceptLoading.hasOwnProperty(record.id)) {
                            isBtnAcceptLoading[record.id] = false;
                        }

                        return (
                            <Space align="start">
                                <Popconfirm
                                    title={translate("w2request.label.button.accept")}
                                    onConfirm={() => onAcceptRequest(record.id)}
                                    disabled={record.status != RequestStatus.PENDING || isBtnAcceptLoading[record.id]}
                                    style={{ display: "block" }}
                                >
                                    <Button
                                        className={(record.status == RequestStatus.PENDING) ? "ant-btn-accept" : ""}
                                        type="primary"
                                        shape="round"
                                        size="small"
                                        disabled={record.status != RequestStatus.PENDING}
                                        loading={isBtnAcceptLoading[record.id]}
                                    >
                                        {translate("w2request.label.button.accept")}
                                    </Button>
                                </Popconfirm>

                                <Button
                                    type="primary"
                                    shape="round"
                                    size="small"
                                    onClick={() => cancel(record)}
                                    disabled={record.status != RequestStatus.PENDING || isBtnAcceptLoading[record.id]}
                                >
                                    {translate("w2request.label.button.reject")}
                                </Button>
                            </Space>
                        )
                    }}
                />
            </Table>

            <MModal
                title={translate("w2request.label.title.cancel")}
                setIsModalVisible={setIsCancelModalVisible}
                isModalVisible={isCancelModalVisible}
            >
                <CancelRequest
                    refreshData={refreshData}
                    setIsModalVisible={setIsCancelModalVisible}
                    id={requestId}
                />
            </MModal>
        </List>
    );
};
