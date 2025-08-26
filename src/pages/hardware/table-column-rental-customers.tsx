import {
  DateField,
  TextField,
  getDefaultSortOrder,
  TagField,
} from "@pankod/refine-antd";
import { Image } from "antd";
import { useMemo } from "react";
import { useNavigation } from "@pankod/refine-core";
import { IHardwareResponse } from "interfaces/hardware";
import { IHardware } from "interfaces";
import {
  getAssetAssignedStatusDecription,
  getAssetStatusDecription,
  getBGAssetAssignedStatusDecription,
  getBGAssetStatusDecription,
  filterAssignedStatus,
} from "utils/assets";
import { useTranslate } from "@pankod/refine-core";

export const useRentalCustomerColumns = ({
  sorter,
  filterCategory,
  filterStatus_Label,
}: {
  sorter: any;
  filterCategory?: { text: string; value: string }[];
  filterStatus_Label?: { text: string; value: string }[];
}) => {
  const t = useTranslate();

  const { list } = useNavigation();

  return useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
        width: 100,
      },
      {
        key: "name",
        title: t("hardware.label.field.assetName"),
        render: (value: string) => <TextField value={value || ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
        width: 200,
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
        width: 120,
      },
      {
        key: "asset_tag",
        title: t("hardware.label.field.propertyCard"),
        render: (value: string) => <TextField value={value || ""} />,
        defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
        width: 150,
      },
      {
        key: "serial",
        title: t("hardware.label.field.serial"),
        render: (value: string) => <TextField value={value || ""} />,
        defaultSortOrder: getDefaultSortOrder("serial", sorter),
        width: 150,
      },
      {
        key: "model",
        title: t("hardware.label.field.propertyType"),
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
        width: 150,
      },
      {
        key: "category",
        title: t("hardware.label.field.category"),
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
        filters: filterCategory,
        onFilter: (value: number, record: IHardwareResponse) => {
          return record.category.id === value;
        },
        width: 150,
      },
      {
        key: "status_label",
        title: t("hardware.label.field.status"),
        render: (value: IHardwareResponse) => {
          // Lấy mô tả trạng thái và màu sắc từ hàm getAssetStatusDecription
          const { label, color } = getAssetStatusDecription(value);
          return (
            <TagField
              value={label}
              style={{
                background: color,
                color: "white",
              }}
            />
          );
        },
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
        filters: filterStatus_Label,
        onFilter: (value: number, record: IHardwareResponse) => {
          return record.status_label.id === value;
        },
      },
      {
        key: "assigned_to",
        title: t("hardware.label.field.checkoutTo"),
        render: (value: IHardwareResponse) => (
          <TextField strong value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
        width: 180,
      },
      {
        key: "location",
        title: t("hardware.label.field.rtd_location"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
        width: 150,
      },
      {
        key: "rtd_location",
        title: t("hardware.label.field.locationFix"),
        render: (value: IHardwareResponse, record: IHardwareResponse) => (
          <TextField
            value={value ? value.name : ""}
            onClick={() => {
              list(
                `location_details?id=${value.id}&name=${value.name}&status_id=${record.status_label.id}`
              );
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
        width: 150,
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
        defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
        width: 150,
      },
      {
        key: "isCustomerRenting",
        title: t("hardware.label.field.isCustomerRenting"),
        render: (value: boolean) => (
          <TagField
            value={
              value
                ? t("hardware.label.field.yes")
                : t("hardware.label.field.no")
            }
            color={value ? "green" : "red"}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("isCustomerRenting", sorter),
        width: 250,
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
        width: 150,
      },
      {
        key: "created_at",
        title: t("hardware.label.field.dateCreate"),
        render: (value: IHardware) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
        width: 180,
      },
      {
        key: "startRentalDate",
        title: t("hardware.label.field.startRentalDate"),
        render: (value: { formatted?: string }) =>
          value?.formatted ? (
            <DateField format="LL" value={value.formatted} />
          ) : (
            <TextField value={t("hardware.label.field.notAvailable")} />
          ),
        defaultSortOrder: getDefaultSortOrder("startRentalDate.date", sorter),
        width: 150,
      },
    ],
    [filterCategory, filterStatus_Label, t, sorter, list]
  );
};
