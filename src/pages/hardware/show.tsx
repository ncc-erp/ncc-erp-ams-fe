import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag, MarkdownField, Row, Col } from "@pankod/refine-antd";
import { UserOutlined } from "@ant-design/icons";

import { IHardwareResponse } from "interfaces/hardware";
import "styles/hardware.less";
const { Title, Text } = Typography;

type HardwareShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse | undefined;
};

export const HardwareShow = (props: HardwareShowProps) => {
  const { detail } = props;
  const t = useTranslate();

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={4}>
          <Title level={5}>{t("hardware.label.field.status")}</Title>
        </Col>
        <Col>
          <Text>
            <Tag>
              {detail?.status_label?.name === t("hardware.label.field.assign")
                ? t("hardware.label.detail.assign")
                : detail?.status_label?.name ===
                  t("hardware.label.field.readyToDeploy")
                ? t("hardware.label.detail.readyToDeploy")
                : detail?.status_label?.name ===
                  t("hardware.label.field.broken")
                ? t("hardware.label.detail.broken")
                : detail?.status_label?.name ===
                  t("hardware.label.field.pending")
                ? t("hardware.label.detail.pending")
                : ""}
            </Tag>
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
            {detail && detail?.manufacturer.name}
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
              <Text className="show-asset">
                {detail?.supplier ? detail?.supplier.name : ""}
              </Text>
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
          <Text>
            {detail?.notes ? <MarkdownField value={detail?.notes} /> : ""}
          </Text>
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
            <Text> {detail?.created_at && detail?.created_at.formatted}</Text>
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
          <Text>{detail?.updated_at && detail?.updated_at.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={4}>
          <Title level={5}>{t("hardware.label.field.dateCheckout")}</Title>
        </Col>
        <Col span={18}>
          {detail?.checkout_at ? (
            <>
              <Text>
                {detail?.checkout_at && detail?.checkout_at.formatted}
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
    </>
  );
};
