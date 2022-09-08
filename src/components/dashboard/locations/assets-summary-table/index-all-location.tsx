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
      let type = 0;
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
      if (category.category_type === CategoryType.CONSUMABLE) {
        type = category.consumables_count;
      } else if (category.category_type === CategoryType.ACCESSORY) {
        type = category.accessories_count;
      } else if (category.category_type === CategoryType.ASSET) {
        type = category.assets_count;
      }

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
        type: type,
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
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
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
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`consumables?category_id=${record.category_id}`)
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${rtd_location_id}&category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?location_id=${rtd_location_id}&category_id=${record.category_id}`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`accessory?category_id=${record.category_id}`)
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${rtd_location_id}&category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?location_id=${rtd_location_id}&category_id=${record.category_id}`
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
      dataIndex: "type",
      key: "type",
      render: (text: number, record: DataTable) => (
        <Typography.Text
          strong
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                      )
                    : list(`assets?category_id=${record.category_id}`)
                  : dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&rtd_location_id=${record.rtd_location_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?category_id=${record.category_id}&rtd_location_id=${record.rtd_location_id}`
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`consumables?category_id=${record.category_id}`)
                  : dateFrom && dateTo
                  ? list(
                      `consumables?category_id=${record.category_id}&location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?category_id=${record.category_id}&location_id=${record.rtd_location_id}`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`accessory?category_id=${record.category_id}`)
                  : dateFrom && dateTo
                  ? list(
                      `accessory?category_id=${record.category_id}&location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?category_id=${record.category_id}&location_id=${record.rtd_location_id}`
                    )
                : list(`assets?category_id=${record.category_id}`);
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

  return (
    <Table
      columns={columns}
      dataSource={dataCategory}
      pagination={false}
      className="list-table-dashboard"
    />
  );
};
