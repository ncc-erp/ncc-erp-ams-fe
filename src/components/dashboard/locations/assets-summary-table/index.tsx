import { useState, useEffect } from "react";
import { Table, Typography } from "antd";
import { ICategoryAsset } from "interfaces/dashboard";

type AssetsSummaryTableProps = {
  categories: ICategoryAsset[];
};

enum Status {
  "PENDING" = "Pending",
  "BROKEN" = "Broken",
  "ASSIGN" = "Assign",
  "READY_TO_DEPLOY" = "Ready to deploy",
}

type DataTable = {
  name: string;
  pending: string;
  broken: string;
  assign: string;
  ready_to_deploy: string;
};

export const AssetsSummaryTable = (props: AssetsSummaryTableProps) => {
  const { categories } = props;

  const [data, setData] = useState<DataTable[]>([]);

  const calculation = (value: number, sum: number) => {
    if (value === 0) {
      return "0";
    }
    return value + "";
  };

  useEffect(() => {
    const items = categories.map((category: ICategoryAsset) => {
      let name = category.name;
      let pending = "";
      let broken = "";
      let assign = "";
      let ready_to_deploy = "";

      category.status_labels.forEach((status_label) => {
        if (status_label.name === Status.ASSIGN) {
          assign = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === Status.BROKEN) {
          broken = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === Status.PENDING) {
          pending = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === Status.READY_TO_DEPLOY) {
          ready_to_deploy = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
      });
      return {
        name: name,
        pending: pending,
        broken: broken,
        assign: assign,
        key: category.id,
        ready_to_deploy: ready_to_deploy,
      };
    });

    setData(items);
  }, [categories]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Typography.Text strong type="success">
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
    },
    {
      title: "Broken",
      dataIndex: "broken",
      key: "broken",
    },
    {
      title: "Assign",
      dataIndex: "assign",
      key: "assign",
    },
    {
      title: "Ready to deploy",
      key: "ready_to_deploy",
      dataIndex: "ready_to_deploy",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={categories.length <= 10 ? false : { pageSize: 10 }}
    />
  );
};
