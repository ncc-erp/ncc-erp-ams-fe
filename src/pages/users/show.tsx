import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag, Row, Col, Grid } from "@pankod/refine-antd";
import { IHardwareResponse } from "interfaces/hardware";
import { getDetailAssetStatus } from "utils/assets";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type UserShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse | undefined;
};

export const UserShow = (props: UserShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.name")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.model")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.model?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.category")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.category?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.status")}</Title>
        </Col>
        <Col span={14}>
          <Text>
            {(() => {
              const { label, color } = getDetailAssetStatus(detail, t);
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
          <Title level={5}>{t("user.label.field.location")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.rtd_location?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.insurance")}</Title>
        </Col>
        <Col span={14}>
          <Text>{detail && detail?.warranty_months}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("user.label.field.notes")}</Title>
        </Col>
        <Col span={14}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<span>${detail?.notes ? detail?.notes : ""}</span>`,
            }}
          />
        </Col>
      </Row>
    </>
  );
};
