import React from "react";
import {
  Table,
  Space,
  Tooltip,
  ShowButton,
  EditButton,
  DeleteButton,
} from "@pankod/refine-antd";
import { IHardwareResponse, ITableProps } from "interfaces/hardware";
import { useTranslate } from "@pankod/refine-core";

export const HardwareTable: React.FC<ITableProps> = ({
  columns,
  selectedColumns,
  tableProps,
  onShow,
  onEdit,
  onDeleteSuccess,
  resourceName,
}) => {
  const t = useTranslate();
  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <Table
      className={
        typeof pageTotal === "number" && pageTotal <= 10 ? "list-table" : ""
      }
      {...tableProps}
      rowKey="id"
      scroll={{ x: 1850 }}
      pagination={
        typeof pageTotal === "number" && pageTotal > 10
          ? {
              position: ["topRight", "bottomRight"],
              total: pageTotal || 0,
              showSizeChanger: true,
            }
          : false
      }
    >
      {columns
        .filter((col) => selectedColumns.includes(col.key))
        .map((col) => (
          <Table.Column
            dataIndex={col.key}
            {...(col as any)}
            key={col.key}
            sorter
          />
        ))}

      <Table.Column<IHardwareResponse>
        title={t("table.actions")}
        dataIndex="actions"
        render={(_, record) => (
          <Space>
            <Tooltip
              title={t("hardware.label.tooltip.viewDetail")}
              color="#108ee9"
            >
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => onShow(record)}
              />
            </Tooltip>

            <Tooltip title={t("hardware.label.tooltip.edit")} color="#108ee9">
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => onEdit(record)}
              />
            </Tooltip>

            <Tooltip title={t("hardware.label.tooltip.delete")} color="red">
              <DeleteButton
                resourceName={resourceName}
                hideText
                size="small"
                recordItemId={record.id}
                onSuccess={onDeleteSuccess}
              />
            </Tooltip>
          </Space>
        )}
      />
    </Table>
  );
};
