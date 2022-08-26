/* eslint-disable react-hooks/exhaustive-deps */
import {
  DateField,
  getDefaultSortOrder,
  List,
  Table,
  TextField,
  Typography,
  useTable,
} from "@pankod/refine-antd";
import {
  HttpError,
  IResourceComponentsProps,
  useTranslate,
} from "@pankod/refine-core";
import {
  IConsumables,
  IConsumablesFilterVariables,
  IConsumablesResponse,
} from "interfaces/consumables";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";

export const ConsumableDetails: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [searchParams] = useSearchParams();
  const nameConsumable = searchParams.get("name");

  const { tableProps, sorter } = useTable<
    IConsumablesResponse,
    HttpError,
    IConsumablesFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: `api/v1/consumables/view/${searchParams.get("id")}/users`,
  });

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: translate("consumables.label.field.users"),
        render: (value: string) => (
          <TextField value={value.split(">")[1].split("<")[0] ?? ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },

      {
        key: "created_at",
        title: translate("consumables.label.field.checkout_date"),
        render: (value: IConsumables) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
      },
      {
        key: "admin",
        title: translate("consumables.label.field.admin"),
        render: (value: string) => (
          <TextField value={value.split(">")[1].split("<")[0] ?? ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("admin", sorter),
      },
    ],
    []
  );

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const { Title } = Typography;

  return (
    <List
      title={
        nameConsumable + " " + translate("consumables.label.title.consumables")
      }
    >
      <Title level={5}>{nameConsumable}</Title>
      <Table
        className="list-table"
        {...tableProps}
        rowKey="id"
        pagination={
          (pageTotal as number) > 10
            ? {
                position: ["topRight", "bottomRight"],
                total: pageTotal ? pageTotal : 0,
                showSizeChanger: true,
              }
            : false
        }
      >
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
      </Table>
    </List>
  );
};
