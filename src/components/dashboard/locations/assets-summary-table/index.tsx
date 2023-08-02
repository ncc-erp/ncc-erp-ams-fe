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
  const { id, categories, data } = props;

  const t = useTranslate();
  const { list } = useNavigation();

  const [dataAllLocation, setDataAllLocation] = useState<DataTable[]>([]);

  const [searchParams] = useSearchParams();
  const dateFrom = searchParams.get("purchase_date_from");
  const dateTo = searchParams.get("purchase_date_to");

  const response = data?.data.payload || [];

  useEffect(() => {
    const index = response.findIndex(
      (item: any) => item?.categories?.length > 0
    );
    const arrNameAsset = (response[index !== -1 ? index : 0]?.categories).map(
      (item: ICategoryAsset) => item.name
    );

    let dataAll = [] as any;

    let sumConsumable = {
      type: t("dashboard.field.typeConsumable"),
      category_type: CategoryType.CONSUMABLE,
    } as any;

    let sumAccessory = {
      type: t("dashboard.field.typeAccessory"),
      category_type: CategoryType.ACCESSORY,
    } as any;

    let sumTool = {
      type: t("dashboard.field.typeTool"),
      category_type: CategoryType.TOOL,
    } as any;

    let sumTaxToken = {
      type: t("dashboard.field.typeTaxToken"),
      category_type: CategoryType.TAXTOKEN,
    } as any;

    arrNameAsset?.forEach((nameAsset: any) => {
      let type = {} as any;
      let category = "" as ICategoryAsset | string | undefined;
      type.type = nameAsset;

      response.forEach((item: ILocation) => {
        category = item.categories.find(
          (c: ICategoryAsset) => c.name === nameAsset
        );

        if (category?.category_type === CategoryType.CONSUMABLE) {
          sumConsumable["rtd_location_" + item.id] =
            sumConsumable["rtd_location_" + item.id] !== undefined
              ? category?.consumables_count +
                sumConsumable["rtd_location_" + item.id]
              : category?.consumables_count;
        } else if (category?.category_type === CategoryType.ACCESSORY) {
          sumAccessory["rtd_location_" + item.id] =
            sumAccessory["rtd_location_" + item.id] !== undefined
              ? category?.accessories_count +
                sumAccessory["rtd_location_" + item.id]
              : category?.accessories_count;
        } else if (category?.category_type === CategoryType.TOOL) {
          sumTool["rtd_location_" + item.id] =
            sumTool["rtd_location_" + item.id] !== undefined
              ? category?.tools_count +
                sumTool["rtd_location_" + item.id]
              : category?.tools_count;
        } else if (category?.category_type === CategoryType.TAXTOKEN) {
          sumTaxToken["rtd_location_" + item.id] =
            sumTaxToken["rtd_location_" + item.id] !== undefined
              ? category?.digital_signatures_count +
                sumTaxToken["rtd_location_" + item.id]
              : category?.digital_signatures_count;
        } else {
          type["rtd_location_" + item.id] = category && category.assets_count;
          type.category_id = category && category.id;
          type.category_type = category && category.category_type;
        }
      });

      const dataAsset = (response[index !== -1 ? index : 0]?.categories).filter(
        (item: ICategoryAsset) => item.category_type === CategoryType.ASSET
      );

      const arrNameAsset = dataAsset.map((item: any) => item.name);
      if (arrNameAsset.includes(nameAsset)) {
        dataAll.push(type);
      }
    });

    setDataAllLocation([...dataAll, sumConsumable, sumAccessory,sumTool,sumTaxToken]);
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
          onClick={() => {
            {
              record.category_type === CategoryType.ASSET
                ? dateFrom && dateTo
                  ? list(
                      `assets?category_id=${record.category_id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                    )
                  : list(`assets?category_id=${record.category_id}`)
                : record.category_type === CategoryType.CONSUMABLE
                ? dateFrom && dateTo
                  ? list(`consumables?date_from=${dateFrom}&date_to=${dateTo}`)
                  : list(`consumables`)
                : record.category_type === CategoryType.ACCESSORY
                ? dateFrom && dateTo
                  ? list(`accessory?date_from=${dateFrom}&date_to=${dateTo}`)
                  : list(`accessory`)
                : record.category_type === CategoryType.TOOL
                ? dateFrom && dateTo
                  ? list(`tools?date_from=${dateFrom}&date_to=${dateTo}`)
                  : list(`tools`)
                : record.category_type === CategoryType.TAXTOKEN
                ? dateFrom && dateTo
                  ? list(`digital_signatures?date_from=${dateFrom}&date_to=${dateTo}`)
                  : list(`digital_signatures`)
                : dateFrom && dateTo
                ? list(
                    `assets?category_id=${record.category_id}&dateTo=${dateFrom}&dateTo=${dateTo}`
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
      width: 100,
      render: (text: number, record: DataTable) => (
        <Typography.Text
          type="secondary"
          className="field-category"
          onClick={() => {
            {
              record.category_type === CategoryType.ASSET
                ? dateFrom && dateTo
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
                  : list(`assets?category_id=${record.category_id}`)
                : record.category_type === CategoryType.CONSUMABLE
                ? dateFrom && dateTo
                  ? item.id !== 99999
                    ? list(
                        `consumables?location_id=${item.id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(
                        `consumables?date_from=${dateFrom}&date_to=${dateTo}`
                      )
                  : item.id !== 99999
                  ? list(`consumables?location_id=${item.id}`)
                  : list(`consumables`)
                : record.category_type === CategoryType.ACCESSORY
                ? dateFrom && dateTo
                  ? item.id !== 99999
                    ? list(
                        `accessory?location_id=${item.id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`accessory?date_from=${dateFrom}&date_to=${dateTo}`)
                  : item.id !== 99999
                  ? list(`accessory?location_id=${item.id}`)
                  : list(`accessory`)
                : record.category_type === CategoryType.TOOL
                ? dateFrom && dateTo
                  ? item.id !== 99999
                    ? list(
                        `tools?location_id=${item.id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`tools?date_from=${dateFrom}&date_to=${dateTo}`)
                  : item.id !== 99999
                  ? list(`tools?location_id=${item.id}`)
                  : list(`tools`)
                : record.category_type === CategoryType.TAXTOKEN
                ? dateFrom && dateTo
                  ? item.id !== 99999
                    ? list(
                        `digital_signatures?location_id=${item.id}&date_from=${dateFrom}&date_to=${dateTo}`
                      )
                    : list(`digital_signatures?date_from=${dateFrom}&date_to=${dateTo}`)
                  : item.id !== 99999
                  ? list(`digital_signatures?location_id=${item.id}`)
                  : list(`digital_signatures`)
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
      columns={id === 99999 ? columnSum : []}
      dataSource={id === 99999 ? dataAllLocation : []}
      pagination={false}
      scroll={{ x: 'calc(500px + 50%)', y: 400 }}
    />
  );
};
