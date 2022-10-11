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

  useEffect(() => {
    let dataClone = { ...dataActive };
    for (var i = 0; i < data.length; i++) {
      let dataConsumable = categories.filter(
        (item) => item.category_type === CategoryType.CONSUMABLE
      ) as any;
      let dataAccessory = categories.filter(
        (item) => item.category_type === CategoryType.ACCESSORY
      ) as any;
      let sumConsumable = dataConsumable.reduce(
        (total: number, object: any) => {
          return total + object.consumables_count;
        },
        0
      );

      let sumAccessory = dataAccessory.reduce((total: number, object: any) => {
        return total + object.accessories_count;
      }, 0);

      dataClone = {
        ...dataClone,
        [data[i].name]:
          data.slice(0, 6)[i] && data.slice(0, 6)[i].assets_count > 0
            ? true
            : false,
        [t("dashboard.field.typeConsumable")]: sumConsumable ? false : true,
        [t("dashboard.field.typeAccessory")]: sumAccessory ? false : true,
      };
    }
    
    setDataActive(dataClone);
  }, []);

  useEffect(() => {
    let consumable = { label: t("dashboard.field.typeConsumable") } as any;
    let accessory = { label: t("dashboard.field.typeAccessory") } as any;

    let dataAsset = [] as any;

    data.map((item: any) => {
      let asset = {} as any;

      if (item.category_type === CategoryType.CONSUMABLE) {
        let dataConsumable = categories.filter(
          (item) => item.category_type === CategoryType.CONSUMABLE
        ) as any;
        let sumConsumable = dataConsumable.reduce(
          (total: number, object: any) => {
            return total + object.consumables_count;
          },
          0
        );
        consumable.value = sumConsumable;
      } else if (item.category_type === CategoryType.ACCESSORY) {
        let dataAccessory = categories.filter(
          (item) => item.category_type === CategoryType.ACCESSORY
        ) as any;
        let sumAccessory = dataAccessory.reduce(
          (total: number, object: any) => {
            return total + object.accessories_count;
          },
          0
        );
        accessory.value = sumAccessory;
      } else {
        asset.label = item.name;
        asset.value = item.assets_count;
      }
      dataAsset.push(asset);
    });
    setDataPie([...dataAsset, consumable, accessory]);
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
