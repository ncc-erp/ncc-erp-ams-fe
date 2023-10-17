/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Typography } from "antd";
import { DataTable, ICategoryAsset, ILocation } from "interfaces/dashboard";
import { useNavigation, useTranslate } from "@pankod/refine-core";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "constants/assets";

type AssetsSummaryTableProps = {
  id: number;
  categories: ICategoryAsset[];
  data: any;
};

export const AssetsSummaryTable = (props: AssetsSummaryTableProps) => {
  const { id, data } = props;

  const t = useTranslate();
  const { list } = useNavigation();

  const [dataAllLocation, setDataAllLocation] = useState<DataTable[]>([]);

  const [searchParams] = useSearchParams();
  const dateFrom = searchParams.get("purchase_date_from");
  const dateTo = searchParams.get("purchase_date_to");

  const response = data?.data.payload || [];

  const sumEachCategoryByLocation = (type: string, arrNameAsset: any, index: any, is_client = false) => {

    let dataAll = [] as any;
    let categoryKeyTranslate = type;
    let category_const = (CategoryType as { [key: string]: string })[type.toUpperCase()]
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

    let sumCategory = {
      type: t("dashboard.field.type" + categoryKeyTranslate),
      category_type: category_const,
    } as any;

    arrNameAsset?.forEach((nameAsset: any) => {
      let categoryType = {} as any;
      let category = "" as ICategoryAsset | string | undefined;
      categoryType.type = nameAsset;

      response.forEach((item: ILocation) => {
        category = item.categories.find(
          (c: ICategoryAsset) => c.name === nameAsset
        );

        if (category?.category_type === category_const) {

          if (type === "Asset" && !is_client) {
            categoryType["rtd_location_" + item?.id] = category && category?.[columnCount];
            categoryType["category_id"] = category && category?.id;
            categoryType["category_type"] = category && category?.category_type;
          } else {
            sumCategory["rtd_location_" + item?.id] = (sumCategory["rtd_location_" + item?.id] ?? 0) + category?.[columnCount];
          }

        }
      })

      if (type === "Asset" && !is_client) {
        const dataAsset = (response[index !== -1 ? index : 0]?.categories).filter(
          (item: ICategoryAsset) => item.category_type === CategoryType.ASSET
        );

        const arrNameAsset = dataAsset.map((item: any) => item.name);
        if (arrNameAsset.includes(nameAsset)) {
          dataAll.push({ ...categoryType });
        }
      }
    });

    if (type === "Asset" && !is_client) {
      return dataAll;
    }

    return sumCategory;
  }

  const getUrlForOnClick = (record: DataTable, dateFrom: string | null, dateTo: string | null, item = {} as ILocation) => {
    let url = "";
    console.log(record)

    switch (record.category_type) {
      case CategoryType.ASSET:
        if (record.type === t("dashboard.field.typeClientAsset")) {
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
        url += "tools-all?";
        break;
    }

    if (item && item?.id !== 99999) {

      if (record.category_type === CategoryType.ASSET) {
        url += `rtd_location_id=${item?.id}&`;
      } else {
        url += `location_id=${item?.id}&`;
      }

    }

    if (dateFrom && dateTo) {
      url += `date_from=${dateFrom}&date_to=${dateTo}`
    }

    return list(url);
  }

  useEffect(() => {
    const index = response.findIndex(
      (item: any) => item?.categories?.length > 0
    );
    const arrNameAsset = (response[index !== -1 ? index : 0]?.categories).map(
      (item: ICategoryAsset) => item.name
    );

    let sumConsumable = sumEachCategoryByLocation("Consumable", arrNameAsset, index);
    let sumAccessory = sumEachCategoryByLocation("Accessory", arrNameAsset, index);
    let sumTool = sumEachCategoryByLocation("Tool", arrNameAsset, index);
    let sumTaxToken = sumEachCategoryByLocation("TaxToken", arrNameAsset, index);
    let sumClientAsset = sumEachCategoryByLocation("Asset", arrNameAsset, index, true);
    let dataAll = sumEachCategoryByLocation("Asset", arrNameAsset, index);

    setDataAllLocation([...dataAll, sumConsumable, sumAccessory, sumTool, sumTaxToken, sumClientAsset]);
  }, [response]);

  let columnSum = [
    {
      title: "Tên thiết bị",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text: string, record: DataTable) => (
        <Typography.Text
          strong
          type="success"
          className="field-category"
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo)}
        >
          {text ?? ""}
        </Typography.Text>
      ),
    },
  ];


  let columnTypes = response.map((item: ILocation) => {
    return {
      title: item.name,
      dataIndex: "rtd_location_" + item.id,
      key: "rtd_location_" + item.id,
      width: 100,
      render: (text: number, record: DataTable) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={() => getUrlForOnClick(record, dateFrom, dateTo, item)}
        >
          {text ?? 0}
        </Typography.Text>
      ),
    };
  });

  columnSum = [...columnSum, ...columnTypes];

  return (
    <Table
      columns={id === 99999 ? columnSum : []}
      dataSource={id === 99999 ? dataAllLocation : []}
      pagination={false}
      scroll={{ x: 'calc(500px + 50%)', y: 400 }}
    />
  );
};
