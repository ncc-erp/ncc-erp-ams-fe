import { ISupplier } from "interfaces/supplier";
import { useMemo } from "react";
import { Image } from "antd";
import { TextField, TagField } from "@pankod/refine-antd";

interface IColumnProps {
  t: any;
  list: any;
  getDefaultSortOrder: any;
  sorter: any;
}

export const getSupplierColumns = (props: IColumnProps) =>
  useMemo(
    () => [
      {
        key: "name",
        title: props.t("supplier.label.field.name"),
        render: (value: ISupplier, record: any) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }}
            onClick={() => {
              if (record.id) {
                props.list(
                  `supplier_details?id=${record.id}&name=${record.name}`
                );
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: props.getDefaultSortOrder("name", props.sorter),
      },
      {
        key: "image",
        title: props.t("supplier.label.field.images"),
        render: (value: string) => {
          return value ? <Image width={50} height={"auto"} src={value} /> : "";
        },
      },
      {
        key: "address",
        title: props.t("supplier.label.field.address"),
        render: (value: ISupplier) => <TextField value={value} />,
      },
      {
        key: "phone",
        title: props.t("supplier.label.field.phone"),
        render: (value: ISupplier) => <TextField value={value} />,
      },
      {
        key: "email",
        title: props.t("supplier.label.field.email"),
        render: (value: ISupplier) => <TextField value={value} />,
      },
      {
        key: "contact",
        title: props.t("supplier.label.field.contact"),
        render: (value: ISupplier) => <TextField value={value} />,
      },

      {
        key: "assets_count",
        title: props.t("supplier.label.field.assets"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "accessories_count",
        title: props.t("supplier.label.field.accessories"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "consumables_count",
        title: props.t("supplier.label.field.consumables"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "tools_count",
        title: props.t("supplier.label.field.tools"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "digital_signatures_count",
        title: props.t("supplier.label.field.tax_tokens"),
        render: (value: number) => <TagField value={value} />,
      },
    ],
    []
  );
