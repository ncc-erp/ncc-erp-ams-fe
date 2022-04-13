import {
  useTranslate,
  IResourceComponentsProps,
} from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  Space,
  EditButton,
  DeleteButton,
  TagField,
  ShowButton,
  Button,
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { count } from "console";

export const RequestList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { tableProps, sorter } = useTable<IHardware>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: "api/v1/finfast-request",
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
          title="Tên yêu cầu"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="branch"
          key="branch"
          title="Nhánh"
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="entry_type"
          key="entry_type"
          title="Loại"
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="supplier"
          key="supplier"
          title="Nhà cung cấp"
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="finfast_request_assets"
          key="finfast_request_assets"
          title="Số lượng thiết bị"
          render={(value) => <TagField value={value.length ? value.length : 0} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
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
              <Button type="primary" shape="round" size="small">
                Gửi
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
