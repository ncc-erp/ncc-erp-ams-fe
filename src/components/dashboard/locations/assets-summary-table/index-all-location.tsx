/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Typography } from "antd";
import { DataTable, ICategoryAsset, ILocation } from "interfaces/dashboard";
import { useNavigation, useTranslate } from "@pankod/refine-core";
import { useSearchParams } from "react-router-dom";
import { CategoryType, EStatus } from "constants/assets";

type AssetsSummaryTableAllLocation = {
  id: number;
  categories: ICategoryAsset[];
};

export const AssetsSummaryTableAllLocation = (
  props: AssetsSummaryTableAllLocation
) => {
  const { id, categories } = props;

  const t = useTranslate();
  const { list } = useNavigation();

  const [dataCategory, setDataCategory] = useState<DataTable[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFrom = searchParams.get("purchase_date_from1");
  const dateTo = searchParams.get("purchase_date_to1");
  const rtd_location_id = searchParams.get("rtd_location_id");

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
      let category_type = category.category_type;

      category.status_labels.forEach((status_label) => {
        if (status_label.name === EStatus.ASSIGN) {
          assign = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === EStatus.BROKEN) {
          broken = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === EStatus.PENDING) {
          pending = calculation(
            status_label.assets_count,
            category.assets_count
          );
        }
        if (status_label.name === EStatus.READY_TO_DEPLOY) {
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
        category_type: category_type,
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}`)
                : dateFrom && dateTo
                ? list(
                    `assets?rtd_location_id=${rtd_location_id}&category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                  )
                : list(
                    `assets?rtd_location_id=${rtd_location_id}&category_id=${record.category_id}`
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&status_id=1&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}&status_id=1`)
                : dateFrom && dateTo
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&status_id=3&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}&status_id=3`)
                : dateFrom && dateTo
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?&category_id=${record.category_id}&status_id=4&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}&status_id=4`)
                : dateFrom && dateTo
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&status_id=5&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}&status_id=5`)
                : dateFrom && dateTo
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
              record.rtd_location_id === 99999
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}`)
                : dateFrom && dateTo
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
    setSearchParams(searchParams);
  }, [dateFrom, dateTo]);

  const dataCategoryByStatus = dataCategory.filter(
    (item: any) => item.category_type === CategoryType.ASSET
  );

  return (
    <Table
      columns={columns}
      dataSource={dataCategoryByStatus}
      pagination={false}
      className="list-table-dashboard"
    />
  );
};
