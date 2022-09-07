import { Pie, PieConfig } from "@ant-design/plots";
import { renderToString } from "react-dom/server";
import { ICategoryAsset, IStatusAsset } from "interfaces/dashboard";
import { useEffect, useState } from "react";
import { CategoryType } from "constants/assets";

type AssetsSummaryPieChartProps = {
  name: string;
  count: number;
  categories: ICategoryAsset[];
};

export const AssetsSummaryPieChart = (props: AssetsSummaryPieChartProps) => {
  const { categories, name, count } = props;
  const data = categories;
  const [dataActive, setDataActive] = useState({});

  useEffect(() => {
    let dataClone = { ...dataActive };
    for (var i = 0; i < data.length; i++) {
      dataClone = {
        ...dataClone,
        [data[i].name]: data[i].assets_count > 0 ? true : false,
      };
    }
    setDataActive(dataClone);
  }, []);

  let dataPie = data.map((item: any) => {
    if (item.category_type === CategoryType.CONSUMABLE) {
      return {
        label: item.name,
        value: item.consumables_count,
      };
    } else if (item.category_type === CategoryType.ACCESSORY) {
      return {
        label: item.name,
        value: item.accessories_count,
      };
    }
    return {
      label: item.name,
      value: item.assets_count,
    };
  });

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
        content: `${name} ${count}`,
      },
    },
  };

  return <Pie {...config} />;
};
