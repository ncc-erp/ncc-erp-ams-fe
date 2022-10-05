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
    for (var i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].type]:
        data.slice(0, 6)[i] && data.slice(0, 6)[i].count > 0 && data.slice(0, 6)[i].category_type === CategoryType.ASSET
            ? true
            : false,
      };
    }
    setDataCheckOutActive(dataClone);
  }, [data]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "count",
    colorField: "type",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 12,
      },
    },
    legend: {
      selected: dataCheckOutActive,
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
          fontSize: "22px",
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
    for (var i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].type]:
        data.slice(0, 6)[i] && data.slice(0, 6)[i].count > 0 && data.slice(0, 6)[i].category_type === CategoryType.ASSET
            ? true
            : false,
      };
    }
    setDataCheckInActive(dataClone);
  }, [data]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "count",
    colorField: "type",
    color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 12,
      },
    },
    legend: {
      selected: dataCheckInActive,
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
          fontSize: "22px",
        },
        content: translate("report.label.title.nameReportCheckIn"),
      },
    },
  };
  return <Pie {...config} />;
};
