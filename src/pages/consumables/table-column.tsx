import {
  DateField,
  getDefaultSortOrder,
  Tag,
  TagField,
  TextField,
} from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import {
  IConsumablesRequest,
  IConsumablesResponse,
} from "interfaces/consumables";
import moment from "moment";
import { useMemo } from "react";
export const useComsumableColumns = ({
  sorter,
  list,
  filterCategory,
}: {
  sorter: any;
  list: any;
  filterCategory: any;
}) => {
  const translate = useTranslate();
  return useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: translate("consumables.label.field.name"),
        render: (value: string, record: any) => (
          <TextField
            value={value ? value : ""}
            onClick={() => {
              if (record.id) {
                list(`consumable_details?id=${record.id}&name=${record.name}
              &category_id=${record.category.id}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "category",
        title: translate("consumables.label.field.category"),
        render: (value: IConsumablesResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
        filters: filterCategory,
        onFilter: (value: number, record: IConsumablesResponse) => {
          return record.category.id === value;
        },
      },
      {
        key: "manufacturer",
        title: translate("consumables.label.field.manufacturer"),
        render: (value: IConsumablesRequest) => (
          <TagField
            value={value ? value.name : ""}
            onClick={() => {
              if (value) {
                list(`manufactures_details?id=${value.id}&name=${value.name}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
      },
      {
        key: "warranty_months",
        title: translate("consumables.label.field.insurance"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        key: "supplier",
        title: translate("consumables.label.field.supplier"),
        render: (value: IConsumablesRequest) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value?.name : ""}` }}
            onClick={() => {
              list(`supplier_details?id=${value.id}&name=${value.name}`);
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
      },
      {
        key: "location",
        title: translate("consumables.label.field.location"),
        render: (value: IConsumablesRequest) => (
          <TagField
            value={value ? value.name : ""}
            onClick={() => {
              list(`location_details?id=${value.id}&name=${value.name}`);
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "purchase_date",
        title: translate("consumables.label.field.purchase_date"),
        render: (value: IConsumablesRequest) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
      },
      {
        key: "qty",
        title: translate("consumables.label.field.total_consumables"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("qty", sorter),
      },
      {
        key: "purchase_cost",
        title: translate("consumables.label.field.purchase_cost"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
      },
      {
        key: "notes",
        title: translate("consumables.label.field.notes"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
        ),
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
      {
        key: "maintenance_date",
        title: translate("consumables.label.field.maintenance_date"),
        render: (value: IConsumablesRequest) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("maintenance_date.date", sorter),
      },
      {
        key: "maintenance_cycle",
        title: translate("consumables.label.field.maintenance_cycle"),
        render: (value: IConsumablesRequest) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("maintenance_cycle", sorter),
      },
      {
        key: "maintenance_status",
        title: translate("consumables.label.field.maintenance_status"),
        render: (_: string, record: IConsumablesResponse) => {
          if (!record.maintenance_date?.date) return null;

          const maintenanceTime = moment(record.maintenance_date.date);
          const now = moment();
          const daysToMaintenance = maintenanceTime.diff(now, "days");

          let background = "";
          let label = "";

          const labelDaysLeft = `${daysToMaintenance} days`;
          if (daysToMaintenance < 0) {
            background = "red";
            label = translate("hardware.label.field.expired");
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
      },
    ],
    [filterCategory]
  );
};
