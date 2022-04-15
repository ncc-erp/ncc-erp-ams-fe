import {
  useTranslate,
  IResourceComponentsProps,
  useCreate,
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
    liveMode: "auto",
  });

  const { mutate } = useCreate<any>();

  const onSendRequest = (value: string) => {
    mutate({
      resource: "api/v1/finfast/outcome",
      values: {
        finfast_request_id: value,
      },
    });
  };

  return (
    <List>
      <Table {...tableProps} rowKey="id" >
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
          title={t("request.label.field.nameRequest")}
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="status"
          key="status"
          title={t("request.label.field.status")}
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("status", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="branch"
          key="branch"
          title={t("request.label.field.branchRequest")}
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="entry_type"
          key="entry_type"
          title={t("request.label.field.entryRequest")}
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="supplier"
          key="supplier"
          title={t("request.label.field.supplier")}
          render={(value) => <TagField value={value.name} />}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="finfast_request_assets"
          key="finfast_request_assets"
          title={t("request.label.field.countAsset")}
          render={(value) => (
            <TagField value={value.length ? value.length : 0} />
          )}
          defaultSortOrder={getDefaultSortOrder("model.name", sorter)}
          sorter
        />
        <Table.Column<IHardware>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <Button
                type="primary"
                shape="round"
                size="small"
                onClick={() => {
                  onSendRequest(record.id);
                }}
              >
                {t("request.label.button.send")}
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
