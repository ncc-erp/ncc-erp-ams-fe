import { useTranslate } from "@pankod/refine-core";
import { Typography, Row, Col, Grid } from "@pankod/refine-antd";
import "styles/hardware.less";
import moment from "moment";
import { IKomuLogsResponse } from "interfaces/komu_logs";
import { STATUS_KOMU_LOGS } from "constants/komu_logs";
const { Title, Text } = Typography;

type KomuLogsShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IKomuLogsResponse | undefined;
};

export const KomuLogsShow = (props: KomuLogsShowProps) => {
  const { detail } = props;
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  const formatMessage = (message: string) => {
    if (!message) return "";

    let formatted = message;
    formatted = formatted.replace(/\*\*/g, "");
    formatted = formatted.replace(/\\n/g, "\n");
    formatted = formatted.replace(/\\u[\dA-F]{4}/gi, "");
    formatted = formatted.replace(/\\\//g, "/");
    formatted = formatted.replace(/\\([\\\/'"])/g, "$1");

    return <span style={{ whiteSpace: "pre-line" }}>{formatted.trim()}</span>;
  };
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.send_to")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.send_to}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.message")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && formatMessage(detail.message)}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.creator")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.creator.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.company")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.company.name}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.system_response")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>{detail && detail?.system_response}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.status")}</Title>
        </Col>
        <Col span={isMobile ? 14 : 18}>
          <Text>
            {detail
              ? detail.status === STATUS_KOMU_LOGS.SUCCESS
                ? "Success"
                : "Fail"
              : "N/A"}
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={isMobile ? 10 : 6}>
          <Title level={5}>{t("komu_logs.label.field.created_at")}</Title>
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
          <Title level={5}>{t("komu_logs.label.field.updated_at")}</Title>
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
