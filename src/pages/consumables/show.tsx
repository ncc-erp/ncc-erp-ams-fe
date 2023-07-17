import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, MarkdownField } from "@pankod/refine-antd";

import "styles/hardware.less";
import { IConsumablesResponse } from "interfaces/consumables";
import moment from "moment";
const { Title, Text } = Typography;

type ConsumablesShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IConsumablesResponse | undefined;
};

export const ConsumablesShow = (props: ConsumablesShowProps) => {
  const { detail } = props;
  const translate = useTranslate();

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("consumables.label.field.name")}</Title>
        </Col>
        <Col span={18}>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.category")}
          </Title>
        </Col>
        <Col span={18}>
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
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.location")}
          </Title>
        </Col>
        <Col span={18}>
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
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.manufacturer")}
          </Title>
        </Col>
        <Col>
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
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.supplier")}
          </Title>
        </Col>
        <Col span={18}>
          {detail?.supplier ? (
            <>
              <div dangerouslySetInnerHTML={{__html: `${detail?.supplier ? detail?.supplier.name : ""}`}} />
            </>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.purchase_cost")}
          </Title>
        </Col>
        <Col>
          <Text>{detail?.purchase_cost && detail?.purchase_cost}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.purchase_date")}
          </Title>
        </Col>
        <Col>
          <Text>
            {detail?.purchase_date && detail?.purchase_date.formatted}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.insurance")}
          </Title>
        </Col>
        <Col span={18}>
          <Text>
            {detail?.warranty_months}
            {" months"}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("consumables.label.field.notes")}</Title>
        </Col>
        <Col span={18}>
          <div dangerouslySetInnerHTML={{__html: `${detail?.notes ? detail?.notes : ""}`}} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.created_at")}
          </Title>
        </Col>
        <Col span={18}>
          {detail?.created_at ? (
            <Text> {detail?.created_at && moment(detail?.created_at.datetime).add(7, 'hours').format('ddd MMM D, YYYY h:mmA')}</Text>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.updated_at")}
          </Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.updated_at && detail?.updated_at.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("consumables.label.field.qty")}</Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.qty && detail?.qty}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("consumables.label.field.remaining")}
          </Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.remaining && detail?.remaining}</Text>
        </Col>
      </Row>
    </>
  );
};
