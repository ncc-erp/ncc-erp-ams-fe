import React from "react";
import { Pie, PieConfig } from "@ant-design/plots";
import { renderToString } from "react-dom/server";
import { Typography } from "@pankod/refine-antd";
import { ICategoryAsset, IStatusAsset } from "interfaces/dashboard";

type AssetsSummaryPieChartProps = {
  name: string;
  count: number;
  categories: ICategoryAsset[];
};

export const AssetsSummaryPieChart = (props: AssetsSummaryPieChartProps) => {
  const { categories, name, count } = props;

  const data = categories;

  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: "assets_count",
    colorField: "name",
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
    tooltip: {
      customContent: (title, data) => {
        const calculation = (value: number, sum: number) => {
          if (value === 0) {
            return "0";
          }
          return value + "(" + ((value / sum) * 100).toFixed(2) + "%)";
        };
        const Ul = (
          <ul>
            {data[0]?.data?.status_labels.map((item: IStatusAsset) => (
              <li>
                {item.name}{" "}
                <Typography.Text strong>
                  {calculation(item.assets_count, data[0]?.data?.assets_count)}
                </Typography.Text>
              </li>
            ))}
          </ul>
        );
        const Text = <Typography.Text strong>{title}</Typography.Text>;
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
        },
        content: `${name} ${count}`,
      },
    },
  };
  return <Pie {...config} />;
};
