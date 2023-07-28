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
    let dataAllCategory = [] as any;

    let sumConsumableByLocation = {
      name: t("dashboard.field.typeConsumable"),
      category_type: CategoryType.CONSUMABLE,
    } as any;

    let sumAccessoryByLocation = {
      name: t("dashboard.field.typeAccessory"),
      category_type: CategoryType.ACCESSORY,
    } as any;

    let sumToolByLocation = {
      type: t("dashboard.field.typeTool"),
      category_type: CategoryType.TOOL,
    } as any;

    let sumTaxTokenByLocation = {
      type: t("dashboard.field.typeTaxToken"),
      category_type: CategoryType.TAXTOKEN,
    } as any;

    categories.map((category: ICategoryAsset) => {
      let type = {} as any;
      type.pending = "";
      type.broken = "";
      type.assign = 0;
      type.ready_to_deploy = "";
      type.assets_count = category.assets_count;
      type.category_type = category.category_type;
      type.type = 0;

      if (category.category_type === CategoryType.CONSUMABLE) {
        sumConsumableByLocation.category_id = category.id;
        sumConsumableByLocation.rtd_location_id = id;

        category.status_labels.forEach((status_label) => {
          if (status_label.name === EStatus.ASSIGN) {
            sumConsumableByLocation.assign =
              sumConsumableByLocation.assign !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.BROKEN) {
            sumConsumableByLocation.broken =
              sumConsumableByLocation.broken !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.PENDING) {
            sumConsumableByLocation.pending =
              sumConsumableByLocation.pending !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.READY_TO_DEPLOY) {
            sumConsumableByLocation.ready_to_deploy =
              sumConsumableByLocation.ready_to_deploy !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
        });

        sumConsumableByLocation.type =
          sumConsumableByLocation.type !== undefined
            ? category.consumables_count + sumConsumableByLocation.type
            : category.consumables_count;
      } else if (category.category_type === CategoryType.ACCESSORY) {
        sumAccessoryByLocation.category_id = category.id;
        sumAccessoryByLocation.rtd_location_id = id;
        category.status_labels.forEach((status_label) => {
          if (status_label.name === EStatus.ASSIGN) {
            sumAccessoryByLocation.assign =
              sumAccessoryByLocation.assign !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.BROKEN) {
            sumAccessoryByLocation.broken =
              sumAccessoryByLocation.broken !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.PENDING) {
            sumAccessoryByLocation.pending =
              sumAccessoryByLocation.pending !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.READY_TO_DEPLOY) {
            sumAccessoryByLocation.ready_to_deploy =
              sumAccessoryByLocation.ready_to_deploy !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
        });

        sumAccessoryByLocation.type =
          sumAccessoryByLocation.type !== undefined
            ? category.accessories_count + sumAccessoryByLocation.type
            : category.accessories_count;
      } else if (category.category_type === CategoryType.TOOL) {
        sumToolByLocation.category_id = category.id;
        sumToolByLocation.rtd_location_id = id;
        category.status_labels.forEach((status_label) => {
          if (status_label.name === EStatus.ASSIGN) {
            sumToolByLocation.assign =
              sumToolByLocation.assign !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.BROKEN) {
            sumToolByLocation.broken =
              sumToolByLocation.broken !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.PENDING) {
            sumToolByLocation.pending =
              sumToolByLocation.pending !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.READY_TO_DEPLOY) {
            sumToolByLocation.ready_to_deploy =
              sumToolByLocation.ready_to_deploy !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
        });

        sumToolByLocation.type =
          sumToolByLocation.type !== undefined
            ? category.tools_count + sumToolByLocation.type
            : category.tools_count;
      } else if (category.category_type === CategoryType.TAXTOKEN) {
        sumTaxTokenByLocation.category_id = category.id;
        sumTaxTokenByLocation.rtd_location_id = id;
        category.status_labels.forEach((status_label) => {
          if (status_label.name === EStatus.ASSIGN) {
            sumTaxTokenByLocation.assign =
              sumTaxTokenByLocation.assign !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.BROKEN) {
            sumTaxTokenByLocation.broken =
              sumTaxTokenByLocation.broken !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.PENDING) {
            sumTaxTokenByLocation.pending =
              sumTaxTokenByLocation.pending !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
          if (status_label.name === EStatus.READY_TO_DEPLOY) {
            sumTaxTokenByLocation.ready_to_deploy =
              sumTaxTokenByLocation.ready_to_deploy !== undefined
                ? category.assets_count +
                  +calculation(status_label.assets_count, category.assets_count)
                : category.assets_count;
          }
        });

        sumTaxTokenByLocation.type =
          sumTaxTokenByLocation.type !== undefined
            ? category.digital_signatures_count + sumTaxTokenByLocation.type
            : category.digital_signatures_count;
      } else {
        type.category_id = category.id;
        type.rtd_location_id = id;
        type.name = category.name;
        type.type = category.assets_count;
        category.status_labels.forEach((status_label) => {
          if (status_label.name === EStatus.ASSIGN) {
            type.assign = calculation(
              status_label.assets_count,
              category.assets_count
            );
          }
          if (status_label.name === EStatus.BROKEN) {
            type.broken = calculation(
              status_label.assets_count,
              category.assets_count
            );
          }
          if (status_label.name === EStatus.PENDING) {
            type.pending = calculation(
              status_label.assets_count,
              category.assets_count
            );
          }
          if (status_label.name === EStatus.READY_TO_DEPLOY) {
            type.ready_to_deploy = calculation(
              status_label.assets_count,
              category.assets_count
            );
          }
        });
      }

      dataAllCategory.push(type);
    });

    dataAllCategory = dataAllCategory.filter(
      (item: any) => item.category_type === CategoryType.ASSET
    );

    setDataCategory([
      ...dataAllCategory,
      sumConsumableByLocation,
      sumAccessoryByLocation,
      sumToolByLocation,
      sumAccessoryByLocation
    ]);
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
                ? record.rtd_location_id !== 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?location_id=${rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`consumables?location_id=${rtd_location_id}`)
                  : dateFrom && dateTo
                  ? list(`consumables?date_from=${dateFrom}&date_to=${dateTo}`)
                  : list(`consumables`)
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(`tools?date_from=${dateFrom}&date_to=${dateTo}`)
                    : list(`tools`)
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`tools?location_id=${rtd_location_id}`)
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(`digital_signatures?date_from=${dateFrom}&date_to=${dateTo}`)
                    : list(`digital_signatures`)
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`digital_signatures?location_id=${rtd_location_id}`)
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(`accessory?date_from=${dateFrom}&date_to=${dateTo}`)
                    : list(`accessory`)
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`accessory?location_id=${rtd_location_id}`)
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
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `assets?category_id=${record.category_id}&status_id=1&dateFrom=${dateFrom}&dateTo=${dateTo}`
                      )
                    : list(
                        `assets?category_id=${record.category_id}&status_id=1`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `consumables?category_id=${record.category_id}&status_id=1`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
                    )
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `tools?category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `tools?category_id=${record.category_id}&status_id=1`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
                    )
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `digital_signatures?category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `digital_signatures?category_id=${record.category_id}&status_id=1`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `accessory?category_id=${record.category_id}&status_id=1`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=1`
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
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `assets?category_id=${record.category_id}&status_id=3&dateFrom=${dateFrom}&dateTo=${dateTo}`
                      )
                    : list(
                        `assets?category_id=${record.category_id}&status_id=3`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `consumables?category_id=${record.category_id}&status_id=3`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
                    )
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `tools?category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `tools?category_id=${record.category_id}&status_id=3`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
                    )
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `digital_signatures?category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `digital_signatures?category_id=${record.category_id}&status_id=3`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `accessory?category_id=${record.category_id}&status_id=3`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=3`
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
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `assets?category_id=${record.category_id}&status_id=4&dateFrom=${dateFrom}&dateTo=${dateTo}`
                      )
                    : list(
                        `assets?category_id=${record.category_id}&status_id=4`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `consumables?category_id=${record.category_id}&status_id=4`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
                    )
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `tools?category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `tools?category_id=${record.category_id}&status_id=4`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
                    )
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `digital_signatures?category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `digital_signatures?category_id=${record.category_id}&status_id=4`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `accessory?category_id=${record.category_id}&status_id=4`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=4`
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
              record.category_type === CategoryType.ASSET
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `assets?category_id=${record.category_id}&status_id=5&dateFrom=${dateFrom}&dateTo=${dateTo}`
                      )
                    : list(
                        `assets?category_id=${record.category_id}&status_id=5`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(
                      `assets?rtd_location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
                    )
                : record.category_type === CategoryType.CONSUMABLE
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `consumables?category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `consumables?category_id=${record.category_id}&status_id=5`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `consumables?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
                    )
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `tools?category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `tools?category_id=${record.category_id}&status_id=5`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `tools?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
                    )
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `digital_signatures?category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `digital_signatures?category_id=${record.category_id}&status_id=5`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `digital_signatures?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
                    )
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `accessory?category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `accessory?category_id=${record.category_id}&status_id=5`
                      )
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(
                      `accessory?location_id=${record.rtd_location_id}&category_id=${record.category_id}&status_id=5`
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
                        `consumables?date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`consumables`)
                  : dateFrom && dateTo
                  ? list(
                      `consumables?location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`consumables?location_id=${record.rtd_location_id}`)
                : record.category_type === CategoryType.TOOL
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `tools?date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`tools`)
                  : dateFrom && dateTo
                  ? list(
                      `tools?location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`tools?location_id=${record.rtd_location_id}`)
                : record.category_type === CategoryType.TAXTOKEN
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(
                        `digital_signatures?date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`digital_signatures`)
                  : dateFrom && dateTo
                  ? list(
                      `digital_signatures?location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`digital_signatures?location_id=${record.rtd_location_id}`)
                : record.category_type === CategoryType.ACCESSORY
                ? record.rtd_location_id === 99999
                  ? dateFrom && dateTo
                    ? list(`accessory?date_from=${dateFrom}&date_to=${dateTo}`)
                    : list(`accessory`)
                  : dateFrom && dateTo
                  ? list(
                      `accessory?location_id=${record.rtd_location_id}&date_from=${dateFrom}&date_to=${dateTo}`
                    )
                  : list(`accessory?location_id=${record.rtd_location_id}`)
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
      scroll={{ x: 'calc(400px + 50%)', y: 400 }}

    />
  );
};
