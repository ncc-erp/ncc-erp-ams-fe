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
    appendPadding: [10, 10, 45, 10],
    data: dataPie,
    angleField: "value",
    colorField: "label",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    autoFit: true,

    // Display label inside each pie slice
    label: {
      type: "inner", // Use inner label
      offset: "-50%", // Move label towards the center
      content: (datum) => {
        // datum already has percent calculated by the chart library (label, percent, value)
        const percentage = (datum.percent * 100).toFixed(2);

        // Only display label if percentage of pie >= 5%
        if (parseFloat(percentage) >= 5) {
          return `${datum.value}`;
        }

        return ""; // Return empty string to hide small slices
      },
      style: {
        textAlign: "center",
        fontSize: 12,
      },
    },

    // Custom legends
    legend: {
      selected: dataActive,
      position: "bottom" as const,
      layout: "horizontal" as const,
      itemSpacing: 4,
      flipPage: false, // Show all legends in 1 page
      offsetY: -20,
      itemWidth: 80,
      itemName: {
        style: {
          fontSize: 12,
          fill: "#666",
        },
      },
      maxRow: 2,
    },

    tooltip: {
      domStyles: {
        "g2-tooltip": {
          maxWidth: "300px",
          whiteSpace: "nowrap",
          zIndex: "9999",
          position: "absolute",
        },
      },
      follow: true, // Tooltip follow cursor
      formatter: (datum) => {
        // Calculate percentage manually
        const total = dataPie.reduce(
          (sum: number, item: any) => sum + (item.value || 0),
          0
        );
        const percentage =
          total > 0 ? ((datum.value / total) * 100).toFixed(2) : "0.00";

        return {
          name: datum.label,
          value: `${datum.value} (${percentage}%)`,
        };
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

    // Configure for statistic in the center of pie chart
    statistic: {
      title: undefined,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "clamp(14px, 2vw, 20px)",
          fontWeight: "bold",
        },
        customHtml: (container, view, datum, dataPieChart) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${name} ${datum.value}`
            : dataPieChart
              ? `${name} ${dataPieChart.reduce((r, d) => r + d.value, 0)}`
              : `${name} 0`;
          return renderStatistic(width, text);
        },
      },
    },
  };

  return <Pie {...config} />;
};

function renderStatistic(width: number, text: string): string {
  return text;
}
