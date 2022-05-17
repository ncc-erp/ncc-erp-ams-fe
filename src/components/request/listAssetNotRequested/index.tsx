import { Table } from "antd";

import { useTranslate } from "@pankod/refine-core";
import "./style.less";
import { IHardwareRequest } from "../../../interfaces/hardware";

type ListAssetNotRequestProps = {
  assetData: IHardwareRequest[];
};

export const ListAssetNotRequest = (props: ListAssetNotRequestProps) => {
  const { assetData } = props;
  const baseUrl = process.env.REACT_APP_API_PROXY;

  const t = useTranslate();

  const columns = [
    {
      title: t("request.label.field.nameAsset"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) =>
        value.image && (
          <img alt="" width={50} height={50} src={baseUrl + value.image} />
        ),
    },
    {
      title: t("request.label.field.nameAsset"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) => <p>{value.name}</p>,
    },
    {
      title: t("request.label.field.category"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) => <p>{value.asset_tag}</p>,
    },
    {
      title: t("request.label.field.note"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) => <p>{value.notes}</p>,
    },
    {
      title: t("request.label.field.price"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) => <p>{value.purchase_cost}</p>,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={assetData} pagination={false} />
    </div>
  );
};
