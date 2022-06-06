import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag } from "@pankod/refine-antd";

const { Title, Text } = Typography;

type UserShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: any;
};

export const UserShow = (props: UserShowProps) => {
  const { detail } = props;
  const t = useTranslate();

  return (
    <div>
      <Title level={5}>{t("request.label.field.name")}</Title>
      <Text>{detail?.name}</Text>
      <Title level={5}>{t("request.label.field.supplier")}</Title>
      <Text>{detail?.supplier?.name}</Text>
      <Title level={5}>Vị trí</Title>
      <Text>{detail?.location?.name}</Text>
      <Title level={5}>Thể loại</Title>
      <Tag>{detail?.category?.name}</Tag>
      <Title level={5}>{t("posts.fields.status.title")}</Title>
      <Tag>{detail?.status_label.name}</Tag>
    </div>
  );
};
