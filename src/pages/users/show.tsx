import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag } from "@pankod/refine-antd";
import { IHardwareResponse } from "interfaces/hardware";

const { Title, Text } = Typography;

type UserShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse | undefined;
};

export const UserShow = (props: UserShowProps) => {
  const { detail } = props;
  const t = useTranslate();

  return (
    <>
      <Title level={5}>{t("user.label.field.name")}</Title>
      <Text>{detail?.name}</Text>
      <Title level={5}>{t("user.label.field.model")}</Title>
      <Text>{detail?.model?.name}</Text>
      <Title level={5}>{t("user.label.field.category")}</Title>
      <Text>{detail?.category?.name}</Text>
      <Title level={5}>{t("user.label.field.status")}</Title>
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
      <Title level={5}>{t("user.label.field.location")}</Title>
      <Text>{detail?.rtd_location?.name}</Text>
      <Title level={5}>{t("user.label.field.insurance")}</Title>
      <Text>{detail?.warranty_months}</Text>
      <Title level={5}>{t("user.label.field.notes")}</Title>
      <Text>{detail?.notes}</Text>
    </>
  );
};
