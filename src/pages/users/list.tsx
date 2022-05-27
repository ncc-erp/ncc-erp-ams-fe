/* eslint-disable react-hooks/exhaustive-deps */
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
  getDefaultFilter,
  DateField,
  Space,
  ShowButton,
  TagField,
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { IRequestResponse } from "interfaces/request";
import { UserShow } from "./show";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [keySearch] = useState<string>();

  const { tableProps, sorter, searchFormProps, filters } = useTable<IHardware>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    initialFilter: [
      {
        field: "status.id",
        operator: "eq",
        value: "4",
      },
    ],
    permanentFilter: [{ field: "search", operator: "eq", value: keySearch }],
    resource: "api/v1/hardware",
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { search } = params;
      filters.push({
        field: "search",
        operator: "eq",
        value: search,
      });
      return filters;
    },
  });
  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: "Asset Name",
        render: (value: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "model",
        title: "Model",
        render: (value: any) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: "Category",
        render: (value: any) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "status_label",
        title: "Status",
        render: (value: any) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
        defaultFilterValue: getDefaultFilter("status.id", filters, "eq"),
      },
      {
        key: "createdAt",
        title: "CreatedAt",
        render: (value: any) => <DateField value={value} format="LLL" />,
        defaultSortOrder: getDefaultSortOrder("createdAt", sorter),
      },
    ],
    []
  );

  const show = (data: IRequestResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  return (
    <List>
      <TableAction searchFormProps={searchFormProps} />

      <MModal
        title={t("request.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <UserShow setIsModalVisible={setIsModalVisible} detail={detail} />
      </MModal>
      <Table {...tableProps} rowKey="id">
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<IHardware>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => show(record)}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
