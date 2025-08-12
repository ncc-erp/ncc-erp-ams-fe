import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, Grid, TextField } from "@pankod/refine-antd";
import "styles/hardware.less";
import moment from "moment";
import { IWebhookLogsResponse } from "interfaces/webhook_logs";
import { WebhookEventType } from "constants/webhook";
const { Title, Text } = Typography;

type WebhookLogsShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IWebhookLogsResponse | undefined;
};

export const WebhookLogsShow = (props: WebhookLogsShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  const type = (type: string) => {
    if (!type) return "";
    const typeText =
      WebhookEventType[type as keyof typeof WebhookEventType] || type || "";
    return <TextField value={typeText} />;
  };
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.webhook")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.webhook.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.asset")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.asset}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.url")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.url}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.type")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && type(detail?.type)}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.message")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.message}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.response")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.response}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.status_code")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>
            {detail && detail?.status_code === 200
              ? "Success"
              : detail?.status_code === 400
                ? "Fail"
                : "Error"}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("webhook_logs.label.field.created_at")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
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
          <Title level={5}>{t("webhook_logs.label.field.updated_at")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          {detail?.updated_at ? (
            <Text>
              {" "}
              {detail?.updated_at &&
                moment(detail?.updated_at.datetime)
                  .add(moment.duration(moment().format("Z")))
                  .format("ddd MMM D, YYYY h:mmA")}
            </Text>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </>
  );
};
