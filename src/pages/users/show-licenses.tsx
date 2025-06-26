import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, Grid } from "@pankod/refine-antd";
import "styles/hardware.less";
import { ILicensesResponse } from "interfaces/license";
const { Title, Text } = Typography;

type LicensesUserShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: ILicensesResponse | undefined;
  isModalVisible: boolean;
};

export const LicensesUserShow = (props: LicensesUserShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.licenses")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.licenses}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.software")}</Title>
        </Col>
        <Col span={14}>
          <Text className="show-asset">{detail && detail?.software.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.seats")}</Title>
        </Col>
        <Col span={14}>
          <Text> {detail && detail?.seats} </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.checkout-count")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.checkout_count}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.purchase_date")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.purchase_date.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.expiration_date")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.expiration_date.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.purchase_cost")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.purchase_cost}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.created_at")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.created_at.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("licenses.label.field.updated_at")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.updated_at.formatted}</Text>
        </Col>
      </Row>
    </>
  );
};
