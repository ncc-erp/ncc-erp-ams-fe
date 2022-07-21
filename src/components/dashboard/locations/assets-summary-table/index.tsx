import { useState, useEffect } from "react";
import { Table, Typography } from "antd";
import { ICategoryAsset } from "interfaces/dashboard";
import { useNavigation, useTranslate } from "@pankod/refine-core";

type AssetsSummaryTableProps = {
  categories: ICategoryAsset[];
};

enum Status {
  "PENDING" = "Check Lại - Bảo Hành",
  "BROKEN" = "Hỏng",
  "ASSIGN" = "Bàn Giao",
  "READY_TO_DEPLOY" = "Trong Kho",
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
  const t = useTranslate();

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
      let assets_count = category.assets_count;

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
        assets_count: assets_count,
      };
    });

    setData(items);
  }, [categories]);

  const { list } = useNavigation();

  const columns = [
    {
      title: `${t("dashboard.field.name")}`,
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Typography.Text
          strong
          type="success"
          className="field-category"
          onClick={(): void => {
            text === "PC"
              ? list("assets?location_id=5")
              : text === "Monitor"
              ? list(`assets?location_id=6`)
              : text === "Mouse"
              ? list(`assets?location_id=7`)
              : text === "Keyboard"
              ? list(`assets?location_id=8`)
              : text === "Headphone"
              ? list(`assets?location_id=10`)
              : text === "Device"
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: `${t("dashboard.field.pending")}`,
      dataIndex: "pending",
      key: "pending",
      render: (text: number) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={(): void => {
            text === 5
              ? list("assets?location_id=5")
              : text === 6
              ? list(`assets?location_id=6`)
              : text === 7
              ? list(`assets?location_id=7`)
              : text === 8
              ? list(`assets?location_id=8`)
              : text === 10
              ? list(`assets?location_id=10`)
              : text === 13
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: `${t("dashboard.field.broken")}`,
      dataIndex: "broken",
      key: "broken",
      render: (text: number) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={(): void => {
            text === 5
              ? list(`assets?location_id=5`)
              : text === 6
              ? list(`assets?location_id=6`)
              : text === 7
              ? list(`assets?location_id=7`)
              : text === 8
              ? list(`assets?location_id=8`)
              : text === 10
              ? list(`assets?location_id=10`)
              : text === 13
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: `${t("dashboard.field.assign")}`,
      dataIndex: "assign",
      key: "assign",
      render: (text: number) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={(): void => {
            text === 5
              ? list(`assets?location_id=5`)
              : text === 6
              ? list(`assets?location_id=6`)
              : text === 7
              ? list(`assets?location_id=7`)
              : text === 8
              ? list(`assets?location_id=8`)
              : text === 10
              ? list(`assets?location_id=10`)
              : text === 13
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: `${t("dashboard.field.ready-to-deploy")}`,
      key: "ready_to_deploy",
      dataIndex: "ready_to_deploy",
      render: (text: number) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={(): void => {
            text === 5
              ? list(`assets?location_id=5`)
              : text === 6
              ? list(`assets?location_id=6`)
              : text === 7
              ? list(`assets?location_id=7`)
              : text === 8
              ? list(`assets?location_id=8`)
              : text === 10
              ? list(`assets?location_id=10`)
              : text === 13
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: `${t("dashboard.field.sum")}`,
      dataIndex: "assets_count",
      key: "assets_count",
      render: (text: number) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={(): void => {
            text === 5
              ? list(`assets?location_id=5`)
              : text === 6
              ? list(`assets?location_id=6`)
              : text === 7
              ? list(`assets?location_id=7`)
              : text === 8
              ? list(`assets?location_id=8`)
              : text === 10
              ? list(`assets?location_id=10`)
              : text === 13
              ? list(`assets?location_id=13`)
              : list(`assets?location_id=5`);
          }}
        >
          {text}
        </Typography.Text>
      ),
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
