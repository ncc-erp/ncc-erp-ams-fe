import {
  DateField,
  getDefaultSortOrder,
  TagField,
  TextField,
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { useMemo } from "react";
import { Image } from "antd";
import { IHardwareResponse } from "interfaces/hardware";
import {
  filterAssignedStatus,
  getAssetAssignedStatusDecription,
  getBGAssetAssignedStatusDecription,
} from "untils/assets";

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
        key: "image",
        title: t("hardware.label.field.image"),
        render: (value: string) => {
          return value ? (
            <Image width={80} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "asset_tag",
        title: t("hardware.label.field.propertyCard"),
        render: (value: string) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
      },
      {
        key: "serial",
        title: t("hardware.label.field.serial"),
        render: (value: string) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("serial", sorter),
      },
      {
        key: "model",
        title: t("hardware.label.field.propertyType"),
        render: (value: IHardwareResponse) => (
          <TagField value={value && value.name} />
        ),
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: t("hardware.label.field.category"),
        render: (value: IHardwareResponse) => (
          <TagField value={value && value.name} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
        filters: filterCategory,
        onFilter: (value: number, record: IHardwareResponse) => {
          return record.category.id === value;
        },
      },
      {
        key: "status_label",
        title: t("hardware.label.field.status"),
        render: (_: string, record: IHardwareResponse) => {
          const maintenanceTime = new Date(
            record.maintenance_date?.date as string
          );
          const now = new Date();

          const diffInMs = maintenanceTime.getTime() - now.getTime();
          const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

          let background = "";
          let label = "";

          if (diffInDays < 0) {
            background = "red";
            label = t("hardware.label.field.overdue");
          } else if (diffInDays <= 10) {
            background = "yellow";
            label = t("hardware.label.field.pending");
          }

          return (
            <TagField
              value={label}
              style={{
                background,
                color: background === "yellow" ? "black" : "white",
              }}
            />
          );
        },
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
        filters: filterStatus_Label,
      },
      {
        key: "assigned_to",
        title: t("hardware.label.field.checkoutTo"),
        render: (value: IHardwareResponse) => (
          <TextField strong value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
      },
      {
        key: "location",
        title: t("hardware.label.field.rtd_location"),
        render: (value: IHardwareResponse) => (
          <TextField value={value && value.name} />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "rtd_location",
        title: t("hardware.label.field.locationFix"),
        render: (value: IHardwareResponse, record: IHardwareResponse) => (
          <TextField
            value={value && value.name}
            onClick={() => {
              list(
                `location_details?id=${value.id}&name=${value.name}&status_id=${record.status_label.id}`
              );
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
      },
      {
        key: "manufacturer",
        title: t("hardware.label.field.manufacturer"),
        render: (value: IHardwareResponse, record: IHardwareResponse) => (
          <TextField
            value={value && value.name}
            onClick={() => {
              list(
                `manufactures_details?id=${value.id}&name=${value.name}&status_id=${record.status_label.id}`
              );
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
      },
      {
        key: "supplier",
        title: t("hardware.label.field.supplier"),
        render: (value: IHardwareResponse, record: IHardwareResponse) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value.name : ""}` }}
            onClick={() => {
              list(
                `supplier_details?id=${value.id}&name=${value.name}&status_id=${record.status_label.id}`
              );
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
      },
      {
        key: "purchase_date",
        title: t("hardware.label.field.dateAdd"),
        render: (value: IHardware) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("warranty_expires.date", sorter),
      },
      {
        key: "order_number",
        title: t("hardware.label.field.orderNumber"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("order_number", sorter),
      },
      {
        key: "warranty_months",
        title: t("hardware.label.field.insurance"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        key: "warranty_expires",
        title: t("hardware.label.field.warranty_expires"),
        render: (value: IHardware) =>
          value ? <DateField format="LLL" value={value && value.date} /> : "",
      },
      {
        key: "notes",
        title: t("hardware.label.field.note"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
        ),
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
      {
        key: "checkout_counter",
        title: t("hardware.label.field.checkout_counter"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("hardware.label.field.checkin_counter"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "requestable",
        title: t("hardware.label.field.requestable"),
        render: (value: string) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("requestable", sorter),
      },
      {
        key: "assigned_status",
        title: t("hardware.label.field.condition"),
        render: (value: number) => (
          <TagField
            value={getAssetAssignedStatusDecription(value)}
            style={{
              background: getBGAssetAssignedStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
        filters: filterAssignedStatus,
        onFilter: (value: number, record: IHardwareResponse) =>
          record.assigned_status === value,
      },
      {
        key: "created_at",
        title: t("hardware.label.field.dateCreate"),
        render: (value: IHardware) =>
          value ? (
            <DateField format="LLL" value={value && value.datetime} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
      },
    ],
    [filterCategory, filterStatus_Label]
  );
};
