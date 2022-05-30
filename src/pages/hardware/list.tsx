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
  CloneButton,
  EditButton,
  DeleteButton,
  TagField,
  CreateButton,
} from "@pankod/refine-antd";
import { Image } from 'antd';
import { ICheckboxProps, IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareClone } from "./clone";
import {
  IHardwareResponse,
} from "interfaces/hardware";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();

  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [detailClone, setDetailClone] = useState<IHardwareResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<IHardware>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IHardware[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: ICheckboxProps) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),

  };

  const edit = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      company: {
        id: data?.company?.id,
        name: data?.company?.name,
      },
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted: data?.purchase_date !== null ? data?.purchase_date.formatted : ""
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      company: {
        id: data?.company?.id,
        name: data?.company?.name,
      },
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted: data?.purchase_date !== null ? data?.purchase_date.formatted : ""
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
    };
    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);

  };

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: IHardware) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: "Asset Name",
        render: (value: IHardware) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "model",
        title: "Model",
        render: (value: IHardware) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: "Category",
        render: (value: IHardware) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "created_at",
        title: "Created At",
        render: (value: IHardware) => <DateField format="LLL" value={value.datetime} />,
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
      },
    ],
    []
  );

  const handleCreate = () => {
    handleOpenModel();
  };

  const handleOpenModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible])

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible])

  return (
    <List
      pageHeaderProps={{
        extra: <CreateButton onClick={handleCreate} />,
      }}
    >
      <TableAction searchFormProps={searchFormProps} />
      <MModal
        title={t("hardware.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <HardwareCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <HardwareEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <HardwareClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
        />
      </MModal>
      <Table {...tableProps} rowKey="id" rowSelection={rowSelection}>
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<IHardwareResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <CloneButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => clone(record)}
              />
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => edit(record)}
              />
              <DeleteButton
                resourceName="api/v1/hardware"
                hideText
                size="small"
                recordItemId={record.id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
