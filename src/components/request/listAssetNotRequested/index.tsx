import React, { useState } from "react";
import { Table } from "antd";
import { IHardwareRequest } from "interfaces/hardware";
import { useList, useTranslate } from "@pankod/refine-core";
import { PlusSquareOutlined } from "@ant-design/icons";
import "./style.less";

import { Button } from "@pankod/refine-antd";

import { useEffect } from "react";
import { CreateAssetModal } from "components/Modal/createAsset";

type ListAssetNotRequestProps = {
  setAssetIds: (data: any[]) => void;
};

export const ListAssetNotRequest = (props: ListAssetNotRequestProps) => {
  const { setAssetIds } = props;

  const t = useTranslate();

  const [assetData, setAssetData] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { data } = useList<IHardwareRequest>({
    resource: "api/v1/hardware",
    config: {
      filters: [
        {
          field: "notRequest",
          value: 1,
          operator: "nnull",
        },
      ],
    },
  });

  const columns = [
    {
      title: t("request.label.field.nameAsset"),
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: t("request.label.field.category"),
      dataIndex: "category",
      render: (value: any) => <p>{value?.name}</p>,
    },
    {
      title: t("request.label.field.note"),
      dataIndex: "notes",
    },
    {
      title: t("request.label.field.location"),
      dataIndex: "location",
      render: (value: any) => <p>{value?.name}</p>,
    },
  ];

  const mapAddKey = () => {
    const dataConvert = data?.data.map((item: any) => {
      item.key = item.id;
      return item;
    });
    setAssetData(dataConvert);
  };

  useEffect(() => {
    mapAddKey();
  }, [data]);
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setAssetIds(selectedRowKeys);
    },
  };

  const onClick = () => {
    console.log("helo");
    setIsModalVisible(true);
  };
  return (
    <div>
      <Button
        className="button"
        icon={<PlusSquareOutlined  />}
        size="large"
        onClick={onClick}
      >
        {t("request.label.button.create")}
      </Button>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={assetData}
      />
      {isModalVisible && (
        <CreateAssetModal
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      )}
    </div>
  );
};
