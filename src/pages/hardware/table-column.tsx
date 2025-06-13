import { DateField, getDefaultSortOrder, TextField } from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { useMemo } from "react";
import { Tag } from "antd";
import { IHardwareResponse } from "interfaces/hardware";
import moment from "moment";

export const useHardwareColumns = ({
  sorter,
  t,
  list,
  filterCategory,
  filterStatus_Label,
}: {
  sorter: any;
  t: any;
  list: any;
  filterCategory: any;
  filterStatus_Label: any;
}) => {
  return useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: t("hardware.label.field.assetName"),
        render: (value: string) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "maintenance_date",
        title: t("hardware.label.field.maintenance_date"),
        render: (value: IHardware) =>
          value ? <DateField format="LL" value={value && value.date} /> : "",
        defaultSortOrder: getDefaultSortOrder("maintenance_date", sorter),
      },
      {
        key: "maintenance_cycle",
        title: t("hardware.label.field.maintenance_cycle"),
        render: (value: string) => <TextField value={value && value} />,
        defaultSortOrder: getDefaultSortOrder("maintenance_cycle", sorter),
      },
      {
        key: "status_label",
        title: t("hardware.label.field.status"),
        render: (_: string, record: IHardwareResponse) => {
          const maintenanceTime = moment(record.maintenance_date?.date);
          const now = moment();
          const daysToMaintenance = maintenanceTime
            .startOf("day")
            .diff(now.startOf("day"), "days");

          let background = "";
          let label = "";

          const labelDaysLeft = `${daysToMaintenance} days`;
          if (daysToMaintenance < 0) {
            background = "red";
            label = t("hardware.label.field.expired");
          } else if (daysToMaintenance <= 10) {
            background = "yellow";
            label = labelDaysLeft;
          } else if (daysToMaintenance > 10) {
            background = "green";
            label = labelDaysLeft;
          }

          return <Tag color={background}>{label}</Tag>;
        },
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
        filters: filterStatus_Label,
      },
      {
        key: "webhook",
        title: t("hardware.label.field.webhook"),
        render: (value: IHardwareResponse) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value.name : ""}` }}
            onClick={() => {
              list(`webhook_details?id=${value.id}&name=${value.name}`);
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
      },
    ],
    [filterCategory, filterStatus_Label]
  );
};
