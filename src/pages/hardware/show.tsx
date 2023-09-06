import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag, Row, Col, List, TextField, Table, useTable } from "@pankod/refine-antd";
import { UserOutlined } from "@ant-design/icons";
import { IHardwareResponse } from "interfaces/hardware";
import "styles/hardware.less";
import { getDetailAssetStatus } from "untils/assets";
import moment from "moment";
import { HARDWARE_API } from "api/baseApi";
import { IAssetHistories } from "interfaces/report";
import { useMemo } from "react";
const { Title, Text } = Typography;

type HardwareShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse | undefined;
};

export const HardwareShow = (props: HardwareShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const { tableProps } = useTable<IAssetHistories>({
    resource: HARDWARE_API + `/${ detail?.id }/report`,
    metaData: {
      pagination: false,
    }
  });

  const collumns = useMemo(
    () => [
      {
        key: "created_at",
        title: t("report.label.field.datetime"),
        render: (value: any) => <TextField value={value ? moment(value?.datetime).add(moment.duration(moment().format('Z'))).format('DD-MM-YYYY hh:mmA') : ""} />,
      },
      {
        key: "action_type",
        title: t("report.label.field.type"),
        render: (value: IAssetHistories) => <TextField value={value ? value : ""} />,
      },
      {
        key: "user",
        title: t("report.label.field.user"),
        render: (value: IAssetHistories) => <TextField value={value ? value : ""} />,
      },
    ],
    []
  );

  return (
    <div className="hardware-detail">
      <div className="hardware-information">
        <>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.status")}</Title>
            </Col>
            <Col>
              <Text>
                <Tag>{getDetailAssetStatus(detail)}</Tag>
                {detail?.assigned_to ? (
                  <>
                    <UserOutlined />{" "}
                    <span className="show-asset">
                      {detail?.assigned_to ? detail?.assigned_to.name : ""}
                    </span>
                  </>
                ) : (
                  ""
                )}
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.assetName")}</Title>
            </Col>
            <Col>
              <Text>{detail && detail?.name}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.serial")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.serial}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.manufacturer")}</Title>
            </Col>
            <Col span={18}>
              <Text className="show-asset">
                {detail?.manufacturer ? (
                  <>
                    <Text className="show-asset">
                      {detail && detail?.manufacturer.name}
                    </Text>
                  </>
                ) : (
                  ""
                )}
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.category")}</Title>
            </Col>
            <Col span={18}>
              <Text className="show-asset">{detail && detail?.category.name}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.propertyType")}</Title>
            </Col>
            <Col span={18}>
              <Text className="show-asset">
                {detail?.model && detail?.model.name}
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.purchase_date")}</Title>
            </Col>
            <Col span={18}>
              <Text>
                {detail?.purchase_date && detail?.purchase_date.formatted}
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.supplier")}</Title>
            </Col>
            <Col span={18}>
              {detail?.supplier ? (
                <>
                  <div className="show-asset" dangerouslySetInnerHTML={{ __html: `<span>${detail?.supplier ? detail?.supplier.name : ""}</span>` }} />
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.insurance")}</Title>
            </Col>
            <Col span={18}>
              <Text>
                {detail?.warranty_months} (
                {t("hardware.label.field.warranty_expires")}{" "}
                {detail?.warranty_expires ? detail?.warranty_expires.date : ""})
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.notes")}</Title>
            </Col>
            <Col span={18}>
              <div dangerouslySetInnerHTML={{ __html: `<span>${detail?.notes ? detail?.notes : ""}</span>` }} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.rtd_location")}</Title>
            </Col>
            <Col span={18}>
              {detail?.rtd_location ? (
                <Text className="show-asset">
                  {detail?.rtd_location && detail?.rtd_location.name}
                </Text>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.title.dateCreate")}</Title>
            </Col>
            <Col span={18}>
              {detail?.created_at ? (
                <Text> {detail?.created_at && moment(detail?.created_at.datetime).add(moment.duration(moment().format('Z'))).format('ddd MMM D, YYYY h:mmA')}</Text>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.title.updateAt")}</Title>
            </Col>
            <Col span={18}>
              <Text> {detail?.updated_at && moment(detail?.updated_at.datetime).add(moment.duration(moment().format('Z'))).format('ddd MMM D, YYYY h:mmA')}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.dateCheckout")}</Title>
            </Col>
            <Col span={18}>
              {detail?.last_checkout ? (
                <>
                  <Text>
                    {detail?.last_checkout && detail?.last_checkout.formatted}
                  </Text>
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.checkin_counter")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.checkin_counter}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.checkout_counter")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.checkout_counter}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.requestable")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail && detail?.requests_counter}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={4}>
              <Title level={5}>{t("hardware.label.field.purchase_cost")}</Title>
            </Col>
            <Col span={18}>
              <Text>{detail?.purchase_cost && detail?.purchase_cost}</Text>
            </Col>
          </Row>
        </>
      </div>
      <div className="hardware-history">
        <List
          title={t("hardware.label.title.asset-history")}
        >
          <Table
            {...tableProps}
            rowKey="id"
            pagination={ false }
            scroll={{ x: 500 }}
          >
            {collumns.map((col) => (
              <Table.Column dataIndex={col.key} {...(col as any)} />
            ))}
          </Table>
        </List>
      </div>
    </div>

  );
};
