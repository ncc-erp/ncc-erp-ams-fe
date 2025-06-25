import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, MarkdownField, Grid } from "@pankod/refine-antd";

import "styles/hardware.less";
import { IAccesstoryResponse } from "interfaces/accessory";
import moment from "moment";
const { Title, Text } = Typography;

type AccessoryShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IAccesstoryResponse | undefined;
};

export const AccessoryShow = (props: AccessoryShowProps) => {
  const { detail } = props;
  const translate = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.name")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.category")}</Title>
        </Col>
        <Col span={14}>
          {detail?.category ? (
            <Text className="show-asset">
              {detail?.category && detail?.category.name}
            </Text>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.location")}</Title>
        </Col>
        <Col span={14}>
          {detail?.location ? (
            <Text className="show-asset">
              {detail?.location && detail?.location.name}
            </Text>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.manufacturer")}
          </Title>
        </Col>
        <Col span={14}>
          {detail?.manufacturer ? (
            <>
              <Text className="show-asset">
                {detail?.manufacturer ? detail?.manufacturer.name : ""}
              </Text>
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.supplier")}</Title>
        </Col>
        <Col span={14}>
          {detail?.supplier ? (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${detail?.supplier ? detail?.supplier.name : ""}`,
                }}
              ></div>
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.purchase_cost")}
          </Title>
        </Col>
        <Col span={14}>
          <Text>{detail?.purchase_cost && detail?.purchase_cost}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.purchase_date")}
          </Title>
        </Col>
        <Col span={14}>
          <Text>
            {detail?.purchase_date && detail?.purchase_date.formatted}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.insurance")}
          </Title>
        </Col>
        <Col span={14}>
          <Text>
            {detail?.warranty_months}
            {" months"}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.notes")}</Title>
        </Col>
        <Col span={14}>
          <div
            dangerouslySetInnerHTML={{
              __html: `${detail?.notes ? detail?.notes : ""}`,
            }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.created_at")}
          </Title>
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
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.updated_at")}
          </Title>
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
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{translate("accessory.label.field.qty")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail?.qty && detail?.qty}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>
            {translate("accessory.label.field.remaining_qty")}
          </Title>
        </Col>
        <Col span={14}>
          <Text>{detail?.remaining_qty && detail?.remaining_qty}</Text>
        </Col>
      </Row>
    </>
  );
};
