import { Table } from "antd";

import { useTranslate } from "@pankod/refine-core";
import "./style.less";
import { IHardwareRequest } from "../../../interfaces/hardware";

type ListAssetNotRequestProps = {
  assetDatas: IHardwareRequest[];
};

export const ListAssetNotRequest = (props: ListAssetNotRequestProps) => {
  const { assetDatas } = props;
  const baseUrl = process.env.REACT_APP_API_PROXY;

  const t = useTranslate();

  const columns = [
    {
      key: "image",
      title: t("request.label.field.image"),
      dataIndex: "asset",
      render: (value: IHardwareRequest) =>
        value.image && (
          <img
            alt=""
            width={50}
            height={50}
            src={baseUrl + value.image ? value.image : ""}
          />
        ),
    },
    {
      title: t("request.label.field.nameAsset"),
      dataIndex: "asset",
      key: "nameAsset",
      render: (value: IHardwareRequest) => <p>{value.name}</p>,
    },
    {
      title: t("request.label.field.category"),
      dataIndex: "asset",
      key: "category",
      render: (value: IHardwareRequest) => <p>{value.asset_tag}</p>,
    },
    {
      title: t("request.label.field.note"),
      dataIndex: "asset",
      key: "note",
      render: (value: IHardwareRequest) => <p>{value.notes}</p>,
    },
    {
      title: t("request.label.field.price"),
      dataIndex: "asset",
      key: "price",
      render: (value: IHardwareRequest) => <p>{value.purchase_cost}</p>,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={assetDatas.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={false}
      />
    </div>
  );
};
