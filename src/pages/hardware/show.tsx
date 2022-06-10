import {
  useTranslate,
  IResourceComponentsProps,
  useOne,
  useShow,
} from "@pankod/refine-core";
import { Show, Typography, Tag, MarkdownField } from "@pankod/refine-antd";

import { IPost, ICategory } from "interfaces";
import { IHardwareResponse } from "interfaces/hardware";

const { Title, Text } = Typography;

type HardwareShowProps = {
  setIsModalVisible: (data: boolean) => void;
  detail: IHardwareResponse | undefined;
};

export const HardwareShow = (props: HardwareShowProps) => {
  const { detail } = props;
  const t = useTranslate();

  const { queryResult } = useShow<IPost>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: categoryData } = useOne<ICategory>({
    resource: "categories",
    id: record?.category.id ?? "",
    queryOptions: {
      enabled: !!record?.category.id,
    },
  });

  return (
    <>
      {/* <Show isLoading={isLoading}> */}
      <Title level={5}>{t("hardware.label.field.assetName")}</Title>
      <Text>{detail?.name}</Text>
      <Title level={5}>{t("hardware.label.field.propertyType")}</Title>
      <Text>{detail?.model.name}</Text>
      <Title level={5}>{t("hardware.label.field.category")}</Title>
      <Text>{detail?.category.name}</Text>
      <Title level={5}>{t("hardware.label.field.status")}</Title>
      <Text>
        <Tag>
          {detail?.status_label.name === "Assign"
            ? "Đã xác nhận"
            : detail?.status_label.name === "Ready to deploy"
            ? "Đang đợi xác nhận"
            : detail?.status_label.name === "Broken"
            ? "Đã từ chối"
            : detail?.status_label.name === "Pending"
            ? "Chưa assign"
            : ""}{" "}
        </Tag>
      </Text>
      <Title level={5}>{t("hardware.label.field.rtd_location")}</Title>
      <Text>{detail?.rtd_location.name}</Text>
      <Title level={5}>{t("hardware.label.field.supplier")}</Title>
      <Text>{detail?.supplier ? detail?.supplier.name : ""}</Text>
      <Title level={5}>{t("hardware.label.field.cost")}</Title>
      <Text>{detail?.purchase_cost}</Text>
      <Title level={5}>{t("hardware.label.field.insurance")}</Title>
      <Text>{detail?.warranty_months}</Text>
      <Title level={5}>{t("hardware.label.field.notes")}</Title>
      <MarkdownField value={detail?.notes} />

      {/* </Show> */}
    </>
  );
};
