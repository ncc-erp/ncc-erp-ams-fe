import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag } from "@pankod/refine-antd";
import { IHardwareResponse } from "interfaces/hardware";
import { getDetailAssetStatus } from "untils/assets";
import React from "react";

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
        <Tag>{getDetailAssetStatus(detail)}</Tag>
      </Text>
      <Title level={5}>{t("user.label.field.location")}</Title>
      <Text>{detail?.rtd_location?.name}</Text>
      <Title level={5}>{t("user.label.field.insurance")}</Title>
      <Text>{detail?.warranty_months}</Text>
      <Title level={5}>{t("user.label.field.notes")}</Title>
      <Text>{React.createElement("div", { dangerouslySetInnerHTML: { __html: `<span>${detail?.notes ? detail?.notes : ""}</span>` } })}</Text>
    </>
  );
};
