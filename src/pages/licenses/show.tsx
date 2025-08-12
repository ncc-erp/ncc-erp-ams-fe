import { HttpError, useTranslate } from "@pankod/refine-core";
import {
  Typography,
  Row,
  Col,
  Tabs,
  Table,
  useTable,
  TextField,
  getDefaultSortOrder,
} from "@pankod/refine-antd";
import "styles/hardware.less";
import {
  ILicensesRequestEdit,
  ILicensesUsersReponse,
  ILicenses,
  ILicenseUsers,
} from "interfaces/license";
import { defaultValue } from "constants/permissions";
import { useEffect, useMemo } from "react";
import { LICENSES_CHECKOUT_USER_API } from "api/baseApi";
const { Title, Text } = Typography;

type SoftwareShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: ILicensesRequestEdit | undefined;
  isModalVisible: boolean;
};

export const LicensesShow = (props: SoftwareShowProps) => {
  const { detail, isModalVisible } = props;
  const t = useTranslate();
  const { TabPane } = Tabs;
  const { tableProps, sorter, tableQueryResult } = useTable<
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
  });

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const collumns = useMemo(
    () => [
      {
        key: "user_id",
        title: "ID",
        render: (value: number, record: ILicenseUsers) => (
          <TextField value={record.assigned_user.user_id} />
        ),
        defaultSortOrder: getDefaultSortOrder("user_id", sorter),
      },
      {
        key: "name",
        title: t("licenses.label.field.user"),
        render: (value: number, record: ILicenseUsers) => (
          <TextField value={record.assigned_user.name} />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "checkout_at",
        title: t("licenses.label.field.checkout_at"),
        render: (value: ILicenses) => (
          <TextField value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("checkout_at", sorter),
      },
      {
        key: "location",
        title: t("licenses.label.field.location"),
        render: (value: any, record: ILicenseUsers) => (
          <TextField
            value={
              record.assigned_user.location ? record.assigned_user.location : ""
            }
          />
        ),
        defaultSortOrder: getDefaultSortOrder("location", sorter),
      },
      {
        key: "department",
        title: t("licenses.label.field.department"),
        render: (value: any, record: ILicenseUsers) => (
          <TextField
            value={
              record.assigned_user.department
                ? record.assigned_user.department
                : ""
            }
          />
        ),
        defaultSortOrder: getDefaultSortOrder("department", sorter),
      },
    ],
    []
  );

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isModalVisible]);

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
              <Text className="show-asset">
                {detail && detail?.software.name}
              </Text>
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
              <Title level={5}>
                {t("licenses.label.field.checkout-count")}
              </Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.checkout_count}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("licenses.label.field.purchase_date")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.purchase_date.formatted}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>
                {t("licenses.label.field.expiration_date")}
              </Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.expiration_date.formatted}</Text>
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
              <Text>{detail && detail?.created_at.formatted}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("licenses.label.field.updated_at")}</Title>
            </Col>
            <Col span={18}>
              <div
                dangerouslySetInnerHTML={{
                  __html: `<span>${detail?.updated_at.formatted}</span>`,
                }}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={t("licenses.label.title.users")}>
          <Table
            {...tableProps}
            rowKey="user_id"
            scroll={{ x: 1000 }}
            pagination={{
              position: ["topRight", "bottomRight"],
              total: pageTotal ? pageTotal : 0,
            }}
          >
            {collumns.map((col) => (
              <Table.Column
                dataIndex={col.key}
                {...(col as any)}
                key={col.key}
                sorter
              />
            ))}
          </Table>
        </TabPane>
      </Tabs>
    </>
  );
};
