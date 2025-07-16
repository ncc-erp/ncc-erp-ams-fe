import { useMemo } from "react";
import { TextField, TagField, DateField } from "@pankod/refine-antd";
import { ILocationResponse } from "interfaces/location";
import { useNavigation, useTranslate } from "@pankod/refine-core";
import { getDefaultSortOrder } from "@pankod/refine-antd";

export const useLocationColumns = (
  sorter: any,
  edit: (record: ILocationResponse) => void
) => {
  const t = useTranslate();
  const { list } = useNavigation();

  return useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: any) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "branch_code",
        title: t("location.label.field.branch_code"),
        render: (value: string) => <TextField value={value || ""} />,
        defaultSortOrder: getDefaultSortOrder("branch_code", sorter),
      },
      {
        key: "name",
        title: t("location.label.field.name"),
        render: (value: any, record: any) => (
          <TextField
            value={value || ""}
            onClick={() => {
              if (record.id) {
                list(`location_details?id=${record.id}&name=${record.name}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "assets_count",
        title: t("location.label.field.assets_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
      },
      {
        key: "assigned_assets_count",
        title: t("location.label.field.assetAssign"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("assigned_assets_count", sorter),
      },
      {
        key: "tools_count",
        title: t("location.label.field.tools_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("tools_count", sorter),
      },
      {
        key: "digital_signatures_count",
        title: t("location.label.field.tax_tokens_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder(
          "digital_signatures_count",
          sorter
        ),
      },
      {
        key: "accessories_count",
        title: t("location.label.field.accessories_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("accessories_count", sorter),
      },
      {
        key: "consumables_count",
        title: t("location.label.field.consumables_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("consumables_count", sorter),
      },
      {
        key: "users_count",
        title: t("location.label.field.users_count"),
        render: (value: number) => <TagField value={value || 0} />,
        defaultSortOrder: getDefaultSortOrder("users_count", sorter),
      },
      {
        key: "created_at",
        title: t("location.label.field.dateCreate"),
        render: (value: any) => (
          <DateField format="LLL" value={value?.datetime || ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
      },
    ],
    [sorter, list, t]
  );
};
