import { Pie } from "@ant-design/plots";
import { useTranslate } from "@pankod/refine-core";
import { CategoryType } from "constants/assets";
import { IAssetHistory } from "interfaces/dashboard";
import { useEffect, useState } from "react";

type AssetsSummaryPieChartProps = {
  assets_statistic: IAssetHistory[];
};

export const AssetsSummaryPieChartCheckOut = (
  props: AssetsSummaryPieChartProps
) => {
  const { assets_statistic } = props;

  const translate = useTranslate();
  const data = assets_statistic;

  const [dataCheckOutActive, setDataCheckOutActive] = useState({});

  useEffect(() => {
    let dataClone = { ...dataCheckOutActive };
    for (let i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].type]:
          data.slice(0, 6)[i] &&
          data.slice(0, 6)[i].count > 0 &&
          data.slice(0, 6)[i].category_type === CategoryType.ASSET
            ? true
            : false,
      };
    }
    setDataCheckOutActive(dataClone);
  }, [data]);

  const config = {
    appendPadding: [10, 10, 45, 10],
    data,
    angleField: "count",
    colorField: "type",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    autoFit: true,

    label: {
      type: "inner",
      offset: "-50%",
      content: (datum: any) => {
        const percentage = (datum.percent * 100).toFixed(2);

        if (parseFloat(percentage) >= 5) {
          return `${datum.count}`;
        }

        return "";
      },
      style: {
        textAlign: "center",
        fontSize: 12,
      },
    },

    legend: {
      selected: dataCheckOutActive,
      position: "bottom" as const,
      layout: "horizontal" as const,
      itemSpacing: 4,
      itemWidth: 80,
      flipPage: false,
      offsetY: -20,
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
      formatter: (datum: any) => {
        const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

        const percentage =
          total > 0 ? ((datum.count / total) * 100).toFixed(2) : "0.00";

        return {
          name: datum.type,
          value: `${datum.count} (${percentage}%)`,
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
        content: translate("report.label.title.nameReportCheckOut"),
      },
    },
  };

  return <Pie {...config} />;
};

export const AssetsSummaryPieChartCheckIn = (
  props: AssetsSummaryPieChartProps
) => {
  const { assets_statistic } = props;

  const translate = useTranslate();
  const data = assets_statistic;

  const [dataCheckInActive, setDataCheckInActive] = useState({});

  useEffect(() => {
    let dataClone = { ...dataCheckInActive };
    for (let i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].type]:
          data.slice(0, 6)[i] &&
          data.slice(0, 6)[i].count > 0 &&
          data.slice(0, 6)[i].category_type === CategoryType.ASSET
            ? true
            : false,
      };
    }
    setDataCheckInActive(dataClone);
  }, [data]);

  const config = {
    appendPadding: [10, 10, 45, 10],
    data,
    angleField: "count",
    colorField: "type",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    autoFit: true,

    label: {
      type: "inner",
      offset: "-50%",
      content: (datum: any) => {
        const percentage = (datum.percent * 100).toFixed(2);
        if (parseFloat(percentage) >= 5) {
          return `${datum.count}`;
        }
        return "";
      },
      style: {
        textAlign: "center",
        fontSize: 12,
      },
    },

    legend: {
      selected: dataCheckInActive,
      position: "bottom" as const,
      layout: "horizontal" as const,
      itemSpacing: 4,
      itemWidth: 80,
      flipPage: false,
      offsetY: -20,
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
      follow: true,
      formatter: (datum: any) => {
        const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
        const percentage =
          total > 0 ? ((datum.count / total) * 100).toFixed(2) : "0.00";

        return {
          name: datum.type,
          value: `${datum.count} (${percentage}%)`,
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
        content: translate("report.label.title.nameReportCheckIn"),
      },
    },
  };
  return <Pie {...config} />;
};
