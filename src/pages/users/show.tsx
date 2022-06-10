import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag } from "@pankod/refine-antd";
import { IHardwareResponse } from "interfaces/hardware";

const { Title, Text } = Typography;

type UserShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse;
};

export const UserShow = (props: UserShowProps) => {
  const { detail } = props;
  const t = useTranslate();

  return (
    <div>
      <Title level={5}>{t("user.label.field.name")}</Title>
      <Text>{detail?.name}</Text>
      <Title level={5}>{t("user.label.field.supplier")}</Title>
      <Text>{detail?.supplier?.name}</Text>
      <Title level={5}>{t("user.label.field.location")}</Title>
      <Text>{detail?.location?.name}</Text>
      <Title level={5}>{t("user.label.field.model")}</Title>
      <Text>{detail?.model?.name}</Text>
      <Title level={5}>{t("user.label.field.category")}</Title>
      <Text>{detail?.category?.name}</Text>
      <Title level={5}>{t("user.label.field.status")}</Title>
      <Text>
        <Tag>{detail?.status_label?.name}</Tag>
      </Text>
      <Title level={5}>{t("user.label.field.notes")}</Title>
      <Text>{detail?.notes}</Text>
    </div>
  );
};
