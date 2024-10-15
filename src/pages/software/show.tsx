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
  IModelSoftware,
  ISoftwareResponse,
  ISoftwareUsesResponse,
} from "interfaces/software";
import { defaultValue } from "constants/permissions";
import { useMemo } from "react";
import { SOFTWARE_API } from "api/baseApi";
import { ILicenseUsers } from "interfaces/license";
const { Title, Text } = Typography;

type SoftwareShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: ISoftwareResponse | undefined;
};

export const SoftwareShow = (props: SoftwareShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const { TabPane } = Tabs;
  const { tableProps, sorter } = useTable<ISoftwareUsesResponse, HttpError>({
    initialSorter: [
      {
        field: "checkout_at",
        order: "desc",
      },
    ],
    resource: SOFTWARE_API + "/" + detail?.id + "/users",
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
        title: t("software.label.field.user"),
        render: (value: number, record: ILicenseUsers) => (
          <TextField value={record.assigned_user.name} />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "checkout_at",
        title: t("software.label.field.checkout_at"),
        render: (value: IModelSoftware, record: any) => (
          <TextField value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("checkout_at", sorter),
      },
      {
        key: "location",
        title: t("software.label.field.location"),
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
        title: t("software.label.field.department"),
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
              <Title level={5}>
                {t("software.label.field.total_licenses")}
              </Title>
            </Col>
            <Col span={18}>
              <Text className="show-asset">
                {detail && detail?.total_licenses}
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>
                {t("software.label.field.checkout-count")}
              </Title>
            </Col>
            <Col span={18}>
              <Text className="show-asset">
                {detail && detail?.checkout_count}
              </Text>
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
              <Text>{detail && detail?.notes}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("software.label.title.dateCreate")}</Title>
            </Col>
            <Col span={18}>
              {detail?.created_at ? (
                <Text>
                  {" "}
                  {detail?.created_at && detail?.created_at.formatted}
                </Text>
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
              {detail?.updated_at ? (
                <Text>
                  {" "}
                  {detail?.updated_at && detail?.updated_at.formatted}
                </Text>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={t("software.label.title.users")}>
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
