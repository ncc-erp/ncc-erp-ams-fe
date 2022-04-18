import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
} from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  DateField,
  Space,
  EditButton,
  DeleteButton,
  TagField,
  ShowButton,
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useMemo } from "react";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { tableProps, sorter, searchFormProps } = useTable<IHardware>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: 'api/v1/hardware',
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { search } = params;
      console.log(params,'params');
      
      filters.push(
          {
              field: "search",
              operator: "eq",
              value: search,
          }
      );

      return filters;
    },
  });

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const collumns = useMemo(() => ([
    {
      key: "id",
      title: "ID",
      render: (value: any) => <TextField value={value} />,
      defaultSortOrder: getDefaultSortOrder("id", sorter)
    },
    {
      key: "name",
      title: "Asset Name",
      render: (value: any) => <TextField value={value} />,
      defaultSortOrder: getDefaultSortOrder("name", sorter)
    },
    {
      key: "model",
      title: "Model",
      render: (value: any) => <TagField value={value.name} />,
      defaultSortOrder: getDefaultSortOrder("model.name", sorter)
    },
    {
      key: "category",
      title: "Category",
      render: (value: any) => <TagField value={value.name} />,
      defaultSortOrder: getDefaultSortOrder("category.name", sorter)
    },
    {
      key: "createdAt",
      title: "CreatedAt",
      render: (value: any) => <DateField value={value} format="LLL" />,
      defaultSortOrder: getDefaultSortOrder("createdAt", sorter)
    }
  ]), [])

  return (
    <List>
      <TableAction // todo table action
        // collumns={collumns.map((item) => item.title)}
        // defaultCollumns={['aaaaa']}
        searchFormProps={searchFormProps}
        // actions={[
        //   {
        //     title: "Xoa",
        //     handle: (menu) => {}
        //   }
        // ]}
      />
      <Table {...tableProps} rowKey="id" rowSelection={rowSelection}>
        { collumns.map((col) => <Table.Column
          dataIndex={col.key}
          {...col}
          sorter
        />)}
        <Table.Column<IHardware>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
