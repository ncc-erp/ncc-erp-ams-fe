import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, Tag, Grid } from "@pankod/refine-antd";
import "styles/hardware.less";
import { UserOutlined } from "@ant-design/icons";
import { ITaxTokenResponse } from "interfaces/tax_token";
import { getDetailTaxTokenStatus } from "utils/tax_token";
import moment from "moment";
const { Title, Text } = Typography;

type TaxTokenShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: ITaxTokenResponse | undefined;
  isModalVisible: boolean;
};

export const TaxTokenShow = (props: TaxTokenShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.status")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {(() => {
              const { label, color } = getDetailTaxTokenStatus(detail, t);
              return (
                <Tag style={{ background: color, color: "white" }}>{label}</Tag>
              );
            })()}
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
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.name")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.seri")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.seri}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.supplier")}</Title>
        </Col>
        <Col span={14}>
          {detail?.supplier ? (
            <>
              <div
                className="show-asset"
                dangerouslySetInnerHTML={{
                  __html: `<span>${detail?.supplier ? detail?.supplier.name : ""}</span>`,
                }}
              />
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.location")}</Title>
        </Col>
        <Col span={14}>
          {detail?.location ? (
            <>
              <div
                className="show-asset"
                dangerouslySetInnerHTML={{
                  __html: `<span>${detail?.location ? detail?.location.name : ""}</span>`,
                }}
              />
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.category")}</Title>
        </Col>
        <Col span={14}>
          {detail?.category ? (
            <>
              <div
                className="show-asset"
                dangerouslySetInnerHTML={{
                  __html: `<span>${detail?.category ? detail?.category.name : ""}</span>`,
                }}
              />
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.purchase_date")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {detail?.purchase_date && detail?.purchase_date.formatted}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.expiration_date")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {detail?.purchase_date && detail?.expiration_date.formatted}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.note")}</Title>
        </Col>
        <Col span={14}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<span>${detail?.note ? detail?.note : ""}</span>`,
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.title.dateCreate")}</Title>
        </Col>
        <Col span={14}>
          {detail?.created_at ? (
            <Text>
              {" "}
              {detail?.created_at &&
                moment(detail?.created_at.datetime)
                  .add(moment.duration(moment().format("Z")))
                  .format("ddd MMM D, YYYY h:mmA")}
            </Text>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.title.updateAt")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {" "}
            {detail?.updated_at &&
              moment(detail?.updated_at.datetime)
                .add(moment.duration(moment().format("Z")))
                .format("ddd MMM D, YYYY h:mmA")}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.checkout_at")}</Title>
        </Col>
        <Col span={14}>
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
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.checkin_counter")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.checkin_counter}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.checkout_counter")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.checkout_counter}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.warranty_months")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {detail?.warranty_months} ({t("tax_token.label.field.month")})
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.qty")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.qty}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("tax_token.label.field.purchase_cost")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail?.purchase_cost && detail?.purchase_cost}</Text>
        </Col>
      </Row>
    </>
  );
};
