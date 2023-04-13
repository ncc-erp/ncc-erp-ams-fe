import { CrudFilters, HttpError, useTranslate } from "@pankod/refine-core";
import { Typography, Tag, Row, Col, Tabs, Table, useTable, Spin, TextField, getDefaultSortOrder, DateField, Space, Tooltip, ShowButton, CloneButton, EditButton, DeleteButton } from "@pankod/refine-antd";
import "styles/hardware.less";
import { ISoftware, ISoftwareLicensesFilterVariables, ISoftwareLicensesResponse, ISoftwareResponse } from "interfaces/software";
import { defaultValue } from "constants/permissions";
import { useMemo, useState } from "react";
import { SOFTWARE_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
const { Title, Text } = Typography;

type SoftwareShowProps = {
    setIsModalVisible: (data: boolean) => void;
    detail: ISoftwareResponse | undefined;
};

export const SoftwareShow = (props: SoftwareShowProps) => {
    const { detail } = props;
    const t = useTranslate();
    const { TabPane } = Tabs;

    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");
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
        resource: SOFTWARE_API + "/" + detail?.id + "/licenses",
        onSearch: (params) => {
            const filters: CrudFilters = [];
            let {
                search,
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
                    }),
                },
            );
            return filters;
        },
    });

    const initselectedRowKeys = useMemo(() => {
        return JSON.parse(localStorage.getItem("selectedRowKeys") as string) || [];
    }, [localStorage.getItem("selectedRowKeys")]);
    const pageTotal = tableProps.pagination && tableProps.pagination.total;
    // const [selectedRowKeys, setSelectedRowKeys] = useState<
    //     React.Key[] | ISoftwareLicensesResponse[]
    // >(initselectedRowKeys as React.Key[]);
    // const onSelectChange = (
    //     selectedRowKeys: React.Key[],
    //     selectedRows: ISoftwareResponse[]
    // ) => {
    //     setSelectedRowKeys(selectedRowKeys);
    // };
    
    // const onSelect = (record: any, selected: boolean) => {
    //     if (!selected) {
    //         const newSelectRow = initselectedRowKeys.filter(
    //             (item: ISoftware) => item.id !== record.id
    //         );
    //         localStorage.setItem("selectedRowKeys", JSON.stringify(newSelectRow));
    //         setSelectedRowKeys(newSelectRow.map((item: ISoftware) => item.id));
    //     } else {
    //         const newselectedRowKeys = [record, ...initselectedRowKeys];
    //         localStorage.setItem(
    //             "selectedRowKeys",
    //             JSON.stringify(
    //                 newselectedRowKeys.filter(function (item, index) {
    //                     return newselectedRowKeys.findIndex((item) => item.id === index);
    //                 })
    //             )
    //         );
    //         setSelectedRowKeys(newselectedRowKeys.map((item: ISoftware) => item.id));
    //     }
    // };
    // const onSelectAll = (
    //     selected: boolean,
    //     selectedRows: ISoftwareLicensesResponse[],
    //     changeRows: ISoftwareLicensesResponse[]
    // ) => {
    //     if (!selected) {
    //         const unSelectIds = changeRows.map((item: ISoftwareLicensesResponse) => item.id);
    //         let newSelectedRows = initselectedRowKeys.filter(
    //             (item: ISoftwareLicensesResponse) => item
    //         );
    //         newSelectedRows = initselectedRowKeys.filter(
    //             (item: any) => !unSelectIds.includes(item.id)
    //         );

    //         localStorage.setItem("selectedRowKeys", JSON.stringify(newSelectedRows));
    //     } else {
    //         selectedRows = selectedRows.filter((item: ISoftwareLicensesResponse) => item);
    //         localStorage.setItem(
    //             "selectedRowKeys",
    //             JSON.stringify([...initselectedRowKeys, ...selectedRows])
    //         );
    //         setSelectedRowKeys(selectedRows);
    //     }
    // };
    // const rowSelection = {
    //     selectedRowKeys: initselectedRowKeys.map((item: ISoftware) => item.id),
    //     onChange: onSelectChange,
    //     onSelect: onSelect,
    //     onSelectAll: onSelectAll,
    //     onSelectChange,
    // };

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
                title: t("software.label.field.keyName"),
                render: (value: number, record: any) => (
                    <TextField
                        value={value}
                        style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("licenses", sorter),
            },
            {
                key: "seats",
                title: "Seats",
                render: (value: number) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("seats", sorter),
            },
            {
                key: "free_seats_count",
                title: "Free Seats",
                render: (value: number) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("freeSeats", sorter),
            },
            {
                key: "software",
                title: t("software.label.field.softwareName"),
                render: (value: ISoftwareResponse) => <TextField value={value.name} />,
                defaultSortOrder: getDefaultSortOrder("software.name", sorter),
                onFilter: (value: number, record: ISoftwareResponse) => {
                    return record.category.id === value;
                },
            },
            {
                key: "purchase_date",
                title: t("software.label.field.purchase_date"),
                render: (value: ISoftware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("purchase_date.datetime", sorter),
            },
            {
                key: "expiration_date",
                title: t("software.label.field.expiration_date"),
                render: (value: ISoftware) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("expiration_date.datetime", sorter),
            },
            {
                key: "purchase_cost",
                title: t("software.label.field.purchase_cost"),
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

    return (
        <>
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={t("software.label.title.info")} key={defaultValue.active}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.softwareName")}</Title>
                        </Col>
                        <Col>
                            <Text>{detail && detail?.name}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.software_tag")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>{detail && detail?.software_tag}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.version")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>{detail && detail?.version}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.manufacturer")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text className="show-asset">
                                {detail && detail?.manufacturer.name}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.category")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text className="show-asset">
                                {detail && detail?.category.name}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.field.notes")}</Title>
                        </Col>
                        <Col span={18}>
                            <div dangerouslySetInnerHTML={{ __html: `<span>${detail?.notes ? detail?.notes : ""}</span>` }} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.title.dateCreate")}</Title>
                        </Col>
                        <Col span={18}>
                            {detail?.created_at ? (
                                <Text> {detail?.created_at && detail?.created_at.formatted}</Text>
                            ) : (
                                ""
                            )}
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("software.label.title.updateAt")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>{detail?.updated_at && detail?.updated_at.formatted}</Text>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab={t("software.label.title.key")}>
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
                        >
                            {collumns
                                // .filter((collumn) => collumnSelected.includes(collumn.key))
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
                                                // onClick={() => show(record)}
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
                                                // onClick={() => clone(record)}
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
                                                // onClick={() => edit(record)}
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
                                )}
                            />
                        </Table>
                    )}
                </TabPane>
            </Tabs>
        </>
    );
};
