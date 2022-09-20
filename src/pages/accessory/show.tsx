import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, MarkdownField } from "@pankod/refine-antd";

import "styles/hardware.less";
import { IAccesstoryResponse } from "interfaces/accessory";
const { Title, Text } = Typography;

type AccessoryShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IAccesstoryResponse | undefined;
};

export const AccessoryShow = (props: AccessoryShowProps) => {
  const { detail } = props;
  const translate = useTranslate();

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("accessory.label.field.name")}</Title>
        </Col>
        <Col>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("accessory.label.field.category")}</Title>
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
          <Title level={5}>{translate("accessory.label.field.location")}</Title>
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
            {translate("accessory.label.field.manufacturer")}
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
          <Title level={5}>{translate("accessory.label.field.supplier")}</Title>
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
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("accessory.label.field.purchase_cost")}
          </Title>
        </Col>
        <Col>
          <Text>{detail?.purchase_cost && detail?.purchase_cost}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("accessory.label.field.purchase_date")}
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
            {translate("accessory.label.field.insurance")}
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
          <Title level={5}>{translate("accessory.label.field.notes")}</Title>
        </Col>
        <Col span={18}>
          <Text>
            {detail?.notes ? <MarkdownField value={detail?.notes} /> : ""}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("accessory.label.field.created_at")}
          </Title>
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
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("accessory.label.field.updated_at")}
          </Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.updated_at && detail?.updated_at.formatted}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>{translate("accessory.label.field.qty")}</Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.qty && detail?.qty}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Title level={5}>
            {translate("accessory.label.field.remaining_qty")}
          </Title>
        </Col>
        <Col span={18}>
          <Text>{detail?.remaining_qty && detail?.remaining_qty}</Text>
        </Col>
      </Row>
    </>
  );
};
