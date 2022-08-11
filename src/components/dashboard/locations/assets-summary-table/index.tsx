/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Typography } from "antd";
import { ICategoryAsset, ILocation } from "interfaces/dashboard";
import { useNavigation, useTranslate } from "@pankod/refine-core";
import { useSearchParams } from "react-router-dom";

type AssetsSummaryTableProps = {
  id: number;
  categories: ICategoryAsset[];
  data: any;
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
  category_id: number;
  rtd_location_id: number;
};

export const AssetsSummaryTable = (props: AssetsSummaryTableProps) => {
  const { id, categories, data } = props;

  const t = useTranslate();
  const { list } = useNavigation();

  const [dataCategory, setDataCategory] = useState<DataTable[]>([]);
  const [dataAllLocation, setDataAllLocation] = useState<DataTable[]>([]);

  const [searchParams] = useSearchParams();
  const dateFrom = searchParams.get("purchase_date_from");
  const dateTo = searchParams.get("purchase_date_to");

  const response = data?.data.payload || [];
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
        rtd_location_id: id,
        category_id: category.id,
        name: name,
        pending: pending,
        broken: broken,
        assign: assign,
        ready_to_deploy: ready_to_deploy,
        assets_count: assets_count,
      };
    });

    setDataCategory(items);
  }, [categories]);

  const columns = [
    {
      title: `${t("dashboard.field.name")}`,
      dataIndex: "name",
      key: "name",
      render: (text: string, record: DataTable) => (
        <Typography.Text
          strong
          type="success"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}`
                  );
            }
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
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
                  );
            }
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
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={(): void => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
                  );
            }
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
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
                  );
            }
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
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
                  );
            }
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
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}`
                  );
            }
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
  ];

  useEffect(() => {
    const index = response.findIndex(
      (item: any) => item?.categories?.length > 0
    );
    const arrNameAsset = (response[index !== -1 ? index : 0]?.categories).map(
      (item: ICategoryAsset) => item.name
    );

    let dataAll = [] as any;
    arrNameAsset?.forEach((nameAsset: any) => {
      let type = {} as any;
      let category = "" as ICategoryAsset | string | undefined;
      type.type = nameAsset;

      response.forEach((item: ILocation) => {
        category = item.categories.find(
          (c: ICategoryAsset) => c.name === nameAsset
        );
        type["rtd_location_" + item.id] = category && category.assets_count;
        type.category_id = category && category.id;
      });

      dataAll.push(type);
    });

    setDataAllLocation(dataAll);
  }, [response]);

  let columnSum = [
    {
      title: "Tên thiết bị",
      dataIndex: "type",
      key: "type",
      render: (text: string, record: DataTable) => (
        <Typography.Text
          strong
          type="success"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? list(
                    `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(`assets?category_id=${record.category_id}`);
            }
          }}
        >
          {text ? text : ""}
        </Typography.Text>
      ),
    },
  ];

  let columnTypes = response.map((item: ILocation) => {
    return {
      title: item.name,
      dataIndex: "rtd_location_" + item.id,
      key: "rtd_location_" + item.id,
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              dateFrom && dateTo
                ? item.id !== 99999
                  ? list(
                      `assets?rtd_location_id=${item.id}&category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                : item.id !== 99999
                ? list(
                    `assets?rtd_location_id=${item.id}&category_id=${record.category_id}`
                  )
                : list(`assets?category_id=${record.category_id}`);
            }
          }}
        >
          {text ? text : 0}
        </Typography.Text>
      ),
    };
  });

  columnSum = [...columnSum, ...columnTypes];

  return (
    <Table
      columns={id === 99999 ? columnSum : columns}
      dataSource={id === 99999 ? dataAllLocation : dataCategory}
      pagination={categories.length <= 6 ? false : { pageSize: 6 }}
    />
  );
};
