/* eslint-disable no-loop-func */
import { Pie, PieConfig } from "@ant-design/plots";
import { renderToString } from "react-dom/server";
import { ICategoryAsset, IStatusAsset } from "interfaces/dashboard";
import { useEffect, useState } from "react";
import { CategoryType } from "constants/assets";
import { useTranslate } from "@pankod/refine-core";

type AssetsSummaryPieChartProps = {
  name: string;
  count: number;
  categories: ICategoryAsset[];
};

export const AssetsSummaryPieChart = (props: AssetsSummaryPieChartProps) => {
  const { categories, name } = props;
  const data = categories;

  const [dataActive, setDataActive] = useState<any>({});
  const [dataPie, setDataPie] = useState<any>([]);
  const t = useTranslate();

  const sumEachCategory = (category: string, is_client = false) => {
    let category_const = (CategoryType as { [key: string]: string })[category.toUpperCase()];
    let columnCount = category.toLowerCase() + "s_count";

    if (category === "Asset" && is_client) {
      columnCount = "client_" + columnCount;
    }
    if (category === "TaxToken") {
      columnCount = "digital_signatures_count";
    }
    if (category === "Accessory") {
      columnCount = "accessories_count";
    }

    let dataCategory: any;
    let sumCategory: any;

    data.forEach((item: any) => {
      if (item?.category_type === category_const) {
        dataCategory = categories.filter(
          (item1) => item1?.category_type === category_const
        )

        sumCategory = dataCategory.reduce(
          (total: number, object: any) => {
            return total + Number(object[columnCount])
          },
          0
        )
      }
    })

    return sumCategory;
  }

  useEffect(() => {
    let dataClone = { ...dataActive };

    let sumConsumable = sumEachCategory("Consumable");
    let sumAccessory = sumEachCategory("Accessory");
    let sumTool = sumEachCategory("Tool");
    let sumTaxToken = sumEachCategory("TaxToken");
    let sumClientAsset = sumEachCategory("Asset", true);

    for (let i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].name]: !!(data.slice(0, 6)[i] && data.slice(0, 6)[i].assets_count > 0),
      };
    }

    dataClone = {
      ...dataClone,
      [t("dashboard.field.typeConsumable")]: sumConsumable ? true : false,
      [t("dashboard.field.typeAccessory")]: sumAccessory ? true : false,
      [t("dashboard.field.typeTool")]: sumTool ? true : false,
      [t("dashboard.field.typeTaxToken")]: sumTaxToken ? true : false,
      [t("dashboard.field.typeClientAsset")]: sumClientAsset ? true : false,
    }

    setDataActive(dataClone);
  }, []);

  useEffect(() => {
    let consumable = { label: t("dashboard.field.typeConsumable") } as any;
    let accessory = { label: t("dashboard.field.typeAccessory") } as any;
    let tool = { label: t("dashboard.field.typeTool") } as any;
    let taxtoken = { label: t("dashboard.field.typeTaxToken") } as any;
    let clientAsset = { label: t("dashboard.field.typeClientAsset") } as any;

    consumable.value = sumEachCategory("Consumable");
    accessory.value = sumEachCategory("Accessory");
    tool.value = sumEachCategory("Tool");
    taxtoken.value = sumEachCategory("TaxToken");
    clientAsset.value = sumEachCategory("Asset", true);

    let dataAsset = [] as any;

    data.forEach((item: any) => {
      let asset = {} as any;

      if (item.category_type === CategoryType.ASSET) {
        asset.label = item.name;
        asset.value = item.assets_count;
      }

      dataAsset.push(asset);
    });
    setDataPie([...dataAsset, consumable, accessory, tool, taxtoken, clientAsset]);
  }, [data]);

  const config: PieConfig = {
    appendPadding: 10,
    data: dataPie,
    angleField: "value",
    colorField: "label",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    legend: {
      selected: dataActive,
    },
    tooltip: {
      customContent: (title, data) => {
        const calculation = (value: number, sum: number) => {
          if (value === 0) {
            return "0";
          }
          return value + " (" + ((value / sum) * 100).toFixed(2) + "%)";
        };
        const Ul = (
          <ul>
            {data[0]?.data?.status_labels.map((item: IStatusAsset) => (
              <li key={item.id}>
                <span>{item.name}: </span>

                <strong>
                  {calculation(item.assets_count, data[0]?.data?.assets_count)}
                </strong>
              </li>
            ))}
          </ul>
        );
        const Text = <strong>{title}</strong>;
        return `<div>
                  ${renderToString(Text)}
                  ${renderToString(Ul)}
                </div>`;
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "25px",
        },
        customHtml: (container, view, datum, dataPieChart) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${name} ${datum.value}`
            : dataPieChart
              ? `${name} ${dataPieChart.reduce((r, d) => r + d.value, 0)}`
              : `${name} 0`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
  };

  return <Pie {...config} />;
};

function renderStatistic(
  width: number,
  text: string,
  arg2: { fontSize: number }
): string {
  return text;
}
