import { Table } from "antd";

import { useTranslate } from "@pankod/refine-core";
import "./style.less";
import { IRequestResponse } from "interfaces/request";

type ListAssetNotRequestProps = {
  assetDatas: IRequestResponse[];
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
      render: (value: IRequestResponse) =>
        value
          ? value.image && (
              <img
                alt=""
                width={50}
                height={50}
                src={baseUrl + value.image ? value.image : ""}
              />
            )
          : "",
    },
    {
      title: t("request.label.field.nameAsset"),
      dataIndex: "asset",
      key: "nameAsset",
      render: (value: IRequestResponse) => <p>{value ? value.name : ""}</p>,
    },
    {
      title: t("request.label.field.category"),
      dataIndex: "asset",
      key: "category",
      render: (value: IRequestResponse) => (
        <p>{value ? value.asset_tag : ""}</p>
      ),
    },
    {
      title: t("request.label.field.note"),
      dataIndex: "asset",
      key: "note",
      render: (value: IRequestResponse) => <p>{value ? value.notes : ""}</p>,
    },
    {
      title: t("request.label.field.warranty_months"),
      dataIndex: "asset",
      key: "warranty_months",
      render: (value: IRequestResponse) => (
        <p>{value ? value.warranty_months : ""} </p>
      ),
    },
    {
      title: t("request.label.field.price"),
      dataIndex: "asset",
      key: "price",
      render: (value: IRequestResponse) => (
        <p>{value ? value.purchase_cost : ""}</p>
      ),
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
