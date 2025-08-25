import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, Grid } from "@pankod/refine-antd";
import "styles/hardware.less";
import moment from "moment";
import { IWebhookResponse } from "interfaces/webhook";
import { WebhookEventType } from "constants/webhook";
const { Title, Text } = Typography;

type WebhookShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IWebhookResponse | undefined;
};

export const WebhookShow = (props: WebhookShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("webhook.label.field.name")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 20}>
          <Text>{detail && detail?.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("webhook.label.field.url")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 20}>
          <Text>{detail && detail?.url}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 4}>
          <Title level={5}>{t("webhook.label.field.created_at")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 20}>
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
          <Title level={5}>{t("webhook.label.field.type")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 20}>
          {detail?.type && detail?.type.length > 0 ? (
            detail?.type.map((item: string, index: number) => (
              <Text key={index}>
                {WebhookEventType[item as keyof typeof WebhookEventType] ||
                  item}
                {index < detail.type.length - 1 && ", "}
              </Text>
            ))
          ) : (
            <Text>N/A</Text>
          )}
        </Col>
      </Row>
    </>
  );
};
