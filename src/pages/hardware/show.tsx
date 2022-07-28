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
          <Title level={5}>{t("hardware.label.field.assetName")}</Title>
          {detail?.serial ? (
            <Title level={5}>{t("hardware.label.field.serial")}</Title>
          ) : (
            ""
          )}

          <Title level={5}>{t("hardware.label.field.manufacturer")}</Title>
          <Title level={5}>{t("hardware.label.field.category")}</Title>
          <Title level={5}>{t("hardware.label.field.propertyType")}</Title>
          <Title level={5}>{t("hardware.label.field.purchase_date")}</Title>
          {detail?.supplier ? (
            <Title level={5}>{t("hardware.label.field.supplier")}</Title>
          ) : (
            ""
          )}
          <Title level={5}>{t("hardware.label.field.insurance")}</Title>
          <Title level={5}>{t("hardware.label.field.notes")}</Title>
          <Title level={5}>{t("hardware.label.field.rtd_location")}</Title>
          <Title level={5}>{t("hardware.label.title.dateCreate")}</Title>
          <Title level={5}>{t("hardware.label.title.updateAt")}</Title>
          {detail?.checkout_at ? (
            <Title level={5}>{t("hardware.label.field.dateCheckout")}</Title>
          ) : (
            ""
          )}
          <Title level={5}>{t("hardware.label.field.checkin_counter")}</Title>
          <Title level={5}>{t("hardware.label.field.checkout_counter")}</Title>
          <Title level={5}>{t("hardware.label.field.requestable")}</Title>
        </Col>
        <Col className="gutter-row" span={18}>
          {" "}
          <Text>
            <Tag>
              {detail?.status_label?.name === t("hardware.label.field.assign")
                ? t("hardware.label.detail.assign")
                : detail?.status_label?.name === t("hardware.label.field.readyToDeploy")
                  ? t("hardware.label.detail.readyToDeploy")
                  : detail?.status_label?.name === t("hardware.label.field.broken")
                    ? t("hardware.label.detail.broken")
                    : detail?.status_label?.name === t("hardware.label.field.pending")
                      ? t("hardware.label.detail.pending")
                      : ""}
            </Tag>
            {detail?.assigned_to ? (
              <>
                <UserOutlined />{" "}
                <Text className="show-asset">
                  {detail?.assigned_to ? detail?.assigned_to.name : ""}
                </Text>
              </>
            ) : (
              ""
            )}
          </Text>
          <br />
          <br />
          <Text>{detail && detail?.name}</Text>
          {detail?.serial ? (
            <>
              <br />
              <br />
              <Text>{detail && detail?.serial}</Text>
            </>
          ) : (
            ""
          )}
          <br />
          <br />
          <Text className="show-asset">
            {detail && detail?.manufacturer.name}
          </Text>{" "}
          <br />
          <br />
          <Text className="show-asset">
            {detail && detail?.category.name}
          </Text>{" "}
          <br />
          <br />
          <Text className="show-asset">
            {detail?.model && detail?.model.name}
          </Text>{" "}
          <br />
          <br />
          <Text>
            {detail?.purchase_date && detail?.purchase_date.formatted}
          </Text>
          {detail?.supplier ? (
            <>
              <Text className="show-asset">
                {detail?.supplier ? detail?.supplier.name : ""}
              </Text>
            </>
          ) : (
            ""
          )}{" "}
          <br />
          <br />
          <Text>
            {detail?.warranty_months} (
            {t("hardware.label.field.warranty_expires")}{" "}
            {detail?.warranty_expires ? detail?.warranty_expires.date : ""})
          </Text>{" "}
          <br />
          <br />
          <MarkdownField value={detail?.notes} />
          <Text className="show-asset">
            {detail?.rtd_location && detail?.rtd_location.name}
          </Text>{" "}
          <br />
          <br />
          <Text>{detail?.created_at && detail?.created_at.formatted}</Text>{" "}
          <br />
          <br />
          <Text>{detail?.updated_at && detail?.updated_at.formatted}</Text>{" "}
          <br />
          <br />
          {detail?.checkout_at ? (
            <>
              <Text>
                {detail?.checkout_at && detail?.checkout_at.formatted}
              </Text>
            </>
          ) : (
            ""
          )}{" "}
          <Text>{detail && detail?.checkin_counter}</Text> <br />
          <br />
          <Text>{detail && detail?.checkout_counter}</Text> <br />
          <br />
          <Text>{detail && detail?.requests_counter}</Text>
        </Col>
      </Row>
    </>
  );
};
