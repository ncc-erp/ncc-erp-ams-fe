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

  const sumEachCategoryByLocation = (type: string, is_client = false) => {
    let dataAllCategory = [] as any;
    let categoryKeyTranslate = type;
    let categoryType = (CategoryType as { [key: string]: string })[type.toUpperCase()];
    let columnCount = type.toLowerCase() + "s_count";

    if (type === "Asset" && is_client) {
      columnCount = "client_" + columnCount;
      categoryKeyTranslate = "ClientAsset";
    }
    if (type === "TaxToken") {
      columnCount = "digital_signatures_count";
    }
    if (type === "Accessory") {
      columnCount = "accessories_count";
    }

    let sumCategoryByLocation = {
      name: t("dashboard.field.type" + categoryKeyTranslate),
      category_type: categoryType,
    } as any

    categories.forEach((category: ICategoryAsset) => {
      if (category.category_type === categoryType) {

        sumCategoryByLocation.category_id = category.id;
        sumCategoryByLocation.rtd_location_id = id;

        if (type === "Asset" && !is_client) {
          sumCategoryByLocation.pending = 0;
          sumCategoryByLocation.broken = 0;
          sumCategoryByLocation.assign = 0;
          sumCategoryByLocation.ready_to_deploy = 0;
          sumCategoryByLocation[columnCount] = category[columnCount];
          sumCategoryByLocation.category_type = category.category_type;
          sumCategoryByLocation.name = category.name;
          sumCategoryByLocation.type = Number(category[columnCount]);
        }

        category.status_labels.forEach((status_label) => {

          switch (status_label.name) {
            case EStatus.ASSIGN:
              sumCategoryByLocation.assign = (type === "Asset" && is_client)
                ? (sumCategoryByLocation.assign ?? 0) + Number(status_label[columnCount])
                : Number(status_label[columnCount])
              break;

            case EStatus.BROKEN:
              sumCategoryByLocation.broken = (type === "Asset" && is_client)
                ? (sumCategoryByLocation.broken ?? 0) + Number(status_label[columnCount])
                : Number(status_label[columnCount])
              break;

            case EStatus.PENDING:
              sumCategoryByLocation.pending = (type === "Asset" && is_client)
                ? (sumCategoryByLocation.pending ?? 0) + Number(status_label[columnCount])
                : Number(status_label[columnCount])
              break;

            case EStatus.READY_TO_DEPLOY:
              sumCategoryByLocation.ready_to_deploy = (type === "Asset" && is_client)
                ? (sumCategoryByLocation.ready_to_deploy ?? 0) + Number(status_label[columnCount])
                : Number(status_label[columnCount])
              break;
          }
        });

        if (!(type === "Asset" && !is_client)) {
          sumCategoryByLocation.type = (sumCategoryByLocation.type ?? 0) + Number(category[columnCount]);
        }
      }

      if (category.category_type === CategoryType.ASSET && !is_client && type === "Asset") {
        dataAllCategory.push({ ...sumCategoryByLocation });
      }
    })

    if (!is_client && type === "Asset") {
      return dataAllCategory;
    }
    return sumCategoryByLocation;
  }

  const getUrlForOnClick = (record: DataTable, dateFrom: string | null, dateTo: string | null, status_id = -1) => {
    let url = "";
    switch (record.category_type) {
      case CategoryType.ASSET:
        if (record.name === t("dashboard.field.typeClientAsset")) {
          url += `client-assets?`;
        }
        else {
          url += `assets?category_id=${record.category_id}&`;
        }
        break;

      case CategoryType.CONSUMABLE:
        url += "consumables?";
        break;

      case CategoryType.ACCESSORY:
        url += "accessory?";
        break;

      case CategoryType.TAXTOKEN:
        url += "tax_token?";
        break;

      case CategoryType.TOOL:
        url += "tool-all?";
        break;
    }

    if (record.rtd_location_id !== 99999) {

      if (record.category_type === CategoryType.ASSET) {
        url += `rtd_location_id=${rtd_location_id}&`;
      } else {
        url += `location_id=${rtd_location_id}&`;
      }

    }

    if (status_id !== -1) {
      url += `status_id=${status_id}&`
    }

    if (dateFrom && dateTo) {
      url += `date_from=${dateFrom}&date_to=${dateTo}`
    }

    return list(url);
  }

  useEffect(() => {
    let sumConsumableByLocation = sumEachCategoryByLocation("Consumable");
    let sumAccessoryByLocation = sumEachCategoryByLocation("Accessory");
    let sumToolByLocation = sumEachCategoryByLocation("Tool");
    let sumTaxTokenByLocation = sumEachCategoryByLocation("TaxToken");
    let sumClientAssetByLocation = sumEachCategoryByLocation("Asset", true);
    let dataAllCategory = sumEachCategoryByLocation("Asset", false);

    dataAllCategory = dataAllCategory.filter(
      (item: any) => item.category_type === CategoryType.ASSET
    );

    setDataCategory([
      ...dataAllCategory,
      sumConsumableByLocation,
      sumAccessoryByLocation,
      sumToolByLocation,
      sumTaxTokenByLocation,
      sumClientAssetByLocation,
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo)}
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo, 1)}
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo, 3)}
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo, 4)}
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo, 5)}
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
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo)}
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
