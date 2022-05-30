import {
  useTranslate,
} from "@pankod/refine-core";
import {  Typography, Tag } from "@pankod/refine-antd";


import { ListAssetNotRequest } from "components/request/listAssetNotRequested";

const { Title, Text } = Typography;

type RequestShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: any;
};

export const RequestShow = (props: RequestShowProps) => {
  const { setIsModalVisible, detail } = props;
  const t = useTranslate();

  return (
    <div>
      <Title level={5}>{t("request.label.field.name")}</Title>
      <Text>{detail?.name}</Text>
      <Title level={5}>{t("request.label.field.supplier")}</Title>
      <Text>{detail?.supplier?.name}</Text>
      <Title level={5}>{t("request.label.field.branch")}</Title>
      <Text>{detail?.branch?.name}</Text>
      <Title level={5}>{t("request.label.field.entry")}</Title>
      <Text>{detail?.entry_type?.code}</Text>
      <Title level={5}>{t("posts.fields.status.title")}</Title>
      <Text>
        <Tag>{detail?.status}</Tag>
      </Text>
      <Title level={5}>{t("request.label.field.countAsset")}</Title>
      <Text>{detail?.finfast_request_assets?.length}</Text>
      {detail?.finfast_request_assets.length > 0 && (
        <ListAssetNotRequest assetData={detail?.finfast_request_assets} />
      )}
    </div>
  );
};
