import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag, MarkdownField } from "@pankod/refine-antd";

import { IHardwareResponse } from "interfaces/hardware";

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
      <Title level={5}>{t("hardware.label.field.assetName")}</Title>
      <Text>{detail && detail?.name}</Text>
      <Title level={5}>{t("hardware.label.field.propertyType")}</Title>
      <Text>{detail?.model && detail?.model.name}</Text>
      <Title level={5}>{t("hardware.label.field.category")}</Title>
      <Text>{detail && detail?.category.name}</Text>
      <Title level={5}>{t("hardware.label.field.status")}</Title>
      <Text>
        <Tag>
          {detail?.status_label?.name === "Assign"
            ? t("hardware.label.detail.assign")
            : detail?.status_label?.name === "Ready to deploy"
            ? t("hardware.label.detail.readyToDeploy")
            : detail?.status_label?.name === "Broken"
            ? t("hardware.label.detail.broken")
            : detail?.status_label?.name === "Pending"
            ? t("hardware.label.detail.pending")
            : ""}
        </Tag>
      </Text>
      <Title level={5}>{t("hardware.label.field.rtd_location")}</Title>
      <Text>{detail?.rtd_location && detail?.rtd_location.name}</Text>
      <Title level={5}>{t("hardware.label.field.supplier")}</Title>
      <Text>{detail?.supplier ? detail?.supplier.name : ""}</Text>
      <Title level={5}>{t("hardware.label.field.insurance")}</Title>
      <Text>{detail?.warranty_months}</Text>
      <Title level={5}>{t("hardware.label.field.notes")}</Title>
      <MarkdownField value={detail?.notes} />
    </>
  );
};
