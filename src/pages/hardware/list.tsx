import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  useCreate,
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
  CreateButton,
  Popconfirm,
  Button,
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import {
  IHardwareResponse,
  IHardwareResponseConvert,
} from "interfaces/hardware";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idSend, setIdSend] = useState<number>(-1);
  const [keySearch, setKeySearch] = useState<string>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IHardware>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
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

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  const edit = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponseConvert = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial,
      model: {
          value: data?.model?.id.toString(),
          label: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        value: data?.status_label.id.toString(),
        label: data?.status_label.name,
      },
      category: {
        value: data?.category?.id.toString(),
        label: data?.category?.name,
      },
      supplier: {
        value: data?.supplier?.id.toString(),
        label: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data?.order_number,
      company: {
        value: data?.company?.id.toString(),
        label: data?.company?.name,
      },
      location: {
        value: data?.location?.id.toString(),
        label: data?.location?.name,
      },
      rtd_location: {
        value: data?.rtd_location?.id.toString(),
        label: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
          date: data?.purchase_date?.date,
          formatted: data?.purchase_date?.formatted,
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,
    };
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

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
        key: "createdAt",
        title: "CreatedAt",
        render: (value: any) => <DateField value={value} format="LLL" />,
        defaultSortOrder: getDefaultSortOrder("createdAt", sorter),
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

  const onSendRequest = async (value: number) => {
    await setIdSend(-1);
    await setIdSend(value);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };
  const { mutate, isLoading: isLoadingSendRequest } = useCreate<any>();

  useEffect(() => {
    if (idSend !== -1) {
      mutate({
        resource: "api/v1/hardware/clone",
        values: {
          id: idSend,
        },
      });
    }
  }, [idSend]);

  useEffect(() => {
    let arr = [...isLoadingArr];
    arr[idSend] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    refreshData();
  }, [isLoadingSendRequest]);

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
      <Table {...tableProps} rowKey="id" rowSelection={rowSelection}>
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<IHardware>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <Popconfirm
                title={t("request.label.button.send")}
                onConfirm={() => onSendRequest(record.id)}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="small"
                  loading={
                    isLoadingArr[record.id] === undefined
                      ? false
                      : isLoadingArr[record.id] === false
                      ? false
                      : true
                  }
                >
                  {t("hardware.label.button.clone")}
                </Button>
              </Popconfirm>
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
