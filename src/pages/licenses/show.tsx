import { CrudFilters, HttpError, useTranslate } from "@pankod/refine-core";
import { Typography, Tag, Row, Col, Tabs, Table, useTable, Spin, TextField, getDefaultSortOrder, DateField, Space, Tooltip, ShowButton, CloneButton, EditButton, DeleteButton } from "@pankod/refine-antd";
import "styles/hardware.less";
import { ILicensesRequestEdit, ILicensesUsersReponse, IModelSoftware } from "interfaces/software";
import { defaultValue } from "constants/permissions";
import { useEffect, useMemo, useState } from "react";
import { LICENSES_CHECKOUT_USER_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
const { Title, Text } = Typography;

type SoftwareShowProps = {
    setIsModalVisible: (data: boolean) => void;
    detail: ILicensesRequestEdit | undefined;
    isModalVisible: boolean
};

export const LicensesShow = (props: SoftwareShowProps) => {
    const { detail, isModalVisible } = props;
    const t = useTranslate();
    const { TabPane } = Tabs;

    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search");
    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
        ILicensesUsersReponse,
        HttpError
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: LICENSES_CHECKOUT_USER_API + "/" + detail?.id + "/users",
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

    const collumns = useMemo(
        () => [
            {
                key: "id",
                title: "ID",
                render: (value: number, record: any) => (
                    <TextField
                        value={record.assigned_user.id}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("id", sorter),
            },
            {
                key: "name",
                title: t("licenses.label.field.user"),
                render: (value: number, record: any) => (
                    <TextField
                        value={record.assigned_user.name}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "checkout_at",
                title: t("licenses.label.field.dateCheckout"),
                render: (value: IModelSoftware, record: any) => (
                    <TextField
                        value={value.datetime}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("department.name", sorter),
            },
            {
                key: "assigned_user",
                title: t("licenses.label.field.location"),
                render: (value: any, record: any) => (
                    <TextField
                        value={value.department.location.name}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("location.name", sorter),
            },
            {
                key: "assigned_user",
                title: t("licenses.label.field.department"),
                render: (value: any, record: any) => (
                    <TextField
                        value={value.department.name}
                    />
                ),
                defaultSortOrder: getDefaultSortOrder("location.name", sorter),
            },
            
        ],
        []
    )

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    useEffect(() => {
        refreshData();
    }, [isModalVisible])

    return (
        <>
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={t("licenses.label.title.info")} key={defaultValue.active}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.licenses")}</Title>
                        </Col>
                        <Col>
                            <Text>{detail && detail?.licenses}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.software")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text className="show-asset">{detail && detail?.software.name}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.seats")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text> {detail && detail?.seats} </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.allocated_seats_count")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>
                                {detail && detail?.allocated_seats_count}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.dateAdd")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>
                                {detail && detail?.purchase_date.formatted}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.expiration_date")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>
                                {detail && detail?.expiration_date.formatted}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.purchase_cost")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>{detail && detail?.purchase_cost}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.created_at")}</Title>
                        </Col>
                        <Col span={18}>
                            <Text>
                                {detail && detail?.created_at.formatted}
                            </Text>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                            <Title level={5}>{t("licenses.label.field.updated_at")}</Title>
                        </Col>
                        <Col span={18}>
                            <div dangerouslySetInnerHTML={{ __html: `<span>${detail?.updated_at.formatted}</span>` }} />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab={t("licenses.label.title.users")}>
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
                            scroll={{ x: 1000 }}
                            pagination={{
                                position: ["topRight", "bottomRight"],
                                total: pageTotal ? pageTotal : 0,
                            }}
                        >
                            {collumns
                                .map((col) => (
                                    <Table.Column dataIndex={col.key} {...(col as any)} sorter />
                                ))}
                        </Table>
                    )}
                </TabPane>
            </Tabs>
        </>
    );
};
