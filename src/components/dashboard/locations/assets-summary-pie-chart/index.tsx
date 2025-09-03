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
    const category_const = (CategoryType as { [key: string]: string })[
      category.toUpperCase()
    ];
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
        );

        sumCategory = dataCategory.reduce((total: number, object: any) => {
          return total + Number(object[columnCount]);
        }, 0);
      }
    });

    return sumCategory;
  };

  useEffect(() => {
    let dataClone = { ...dataActive };

    const sumConsumable = sumEachCategory("Consumable");
    const sumAccessory = sumEachCategory("Accessory");
    const sumTool = sumEachCategory("Tool");
    const sumTaxToken = sumEachCategory("TaxToken");
    const sumClientAsset = sumEachCategory("Asset", true);

    for (let i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].name]: !!(
          data.slice(0, 6)[i] && data.slice(0, 6)[i].assets_count > 0
        ),
      };
    }

    dataClone = {
      ...dataClone,
      [t("dashboard.field.typeConsumable")]: sumConsumable ? true : false,
      [t("dashboard.field.typeAccessory")]: sumAccessory ? true : false,
      [t("dashboard.field.typeTool")]: sumTool ? true : false,
      [t("dashboard.field.typeTaxToken")]: sumTaxToken ? true : false,
      [t("dashboard.field.typeClientAsset")]: sumClientAsset ? true : false,
    };

    setDataActive(dataClone);
  }, []);

  useEffect(() => {
    const consumable = { label: t("dashboard.field.typeConsumable") } as any;
    const accessory = { label: t("dashboard.field.typeAccessory") } as any;
    const tool = { label: t("dashboard.field.typeTool") } as any;
    const taxtoken = { label: t("dashboard.field.typeTaxToken") } as any;
    const clientAsset = { label: t("dashboard.field.typeClientAsset") } as any;

    consumable.value = sumEachCategory("Consumable");
    accessory.value = sumEachCategory("Accessory");
    tool.value = sumEachCategory("Tool");
    taxtoken.value = sumEachCategory("TaxToken");
    clientAsset.value = sumEachCategory("Asset", true);

    const dataAsset = [] as any;

    data.forEach((item: any) => {
      const asset = {} as any;

      if (item.category_type === CategoryType.ASSET) {
        asset.label = item.name;
        asset.value = item.assets_count;
      }

      dataAsset.push(asset);
    });
    setDataPie([
      ...dataAsset,
      consumable,
      accessory,
      tool,
      taxtoken,
      clientAsset,
    ]);
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
        fill: "#FFFFFF",
      },
    },
    legend: {
      selected: dataActive,
      itemName: {
        style: ({ checked }: { checked: boolean }) => ({
          fontSize: 12,
          fill: checked ? "#4A5568" : "#A0AEC0",
          fontWeight: checked ? 600 : 400,
        }),
      },
      onChange: (selected: Record<string, boolean>) => {
        setDataActive(selected);
      },
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
          fill: "#4A5568",
          fontWeight: "bold",
        },
        customHtml: (container, view, datum, dataPieChart) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${name} ${datum.value}`
            : dataPieChart
              ? `${name} ${dataPieChart.reduce((r, d) => r + d.value, 0)}`
              : `${name} 0`;
          return renderStatistic(width, text, "#4A5568");
        },
      },
    },
  };

  return <Pie {...config} />;
};

function renderStatistic(
  width: number,
  text: string,
  textColor: string
): string {
  return `<div style="color: ${textColor}; text-align: center; font-size: 25px; font-weight: bold; line-height: 1.2;">${text}</div>`;
}
