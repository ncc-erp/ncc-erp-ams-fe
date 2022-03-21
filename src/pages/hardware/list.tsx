import {
  useTranslate,
  IResourceComponentsProps,
  useMany,
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
  useSelect,
  TagField,
  FilterDropdown,
  Select,
  ShowButton,
} from "@pankod/refine-antd";
import { IHardware, ICategory } from "interfaces";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { tableProps, sorter } = useTable<IHardware>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: 'api/v1/hardware',
  });

  
  // const categoryIds = tableProps?.dataSource?.map((item) => item.category.id) ?? [];
  const categoryIds: string[] = [];
  const { data: categoriesData, isLoading } = useMany<ICategory>({
    resource: "api/v1/models",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "api/v1/models",
  });
  
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          key="id"
          title="ID"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("id", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="name"
          key="name"
          title="Asset Name"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="model"
          key="model"
          title="Model"
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="category"
          key="category"
          title="Category"
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("category.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="createdAt"
          key="createdAt"
          title={t("posts.fields.createdAt")}
          render={(value) => <DateField value={value} format="LLL" />}
          defaultSortOrder={getDefaultSortOrder("createdAt", sorter)}
          sorter
        />
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
