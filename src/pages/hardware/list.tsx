/* eslint-disable react-hooks/exhaustive-deps */
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
  CloneButton,
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
import { HardwareCheckout } from "./checkout";
import {
  IHardwareResponse,
  IHardwareResponseCheckout,
} from "interfaces/hardware";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [detailCheckout, setDetailCheckout] = useState<any>({});
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [detailClone, setDetailClone] = useState<any>({});
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idSend, setIdSend] = useState<number>(-1);
  const [keySearch] = useState<string>();

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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: any) => ({
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
      // model_number: data?.order_number,
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
      order_number: data?.order_number,
      company: {
        id: data?.company?.id,
        name: data?.company?.name,
      },

      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,

      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,

      purchase_date: data?.purchase_date,
      archived: data?.archived,
      rtd_location_id: undefined,
      location: {
        id: 0,
        name: "",
      },
      rtd_location: {
        id: 0,
        name: "",
      },
      assigned_to: 0,
    };
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const checkout = (data: IHardwareResponseCheckout) => {
    const dataConvert: IHardwareResponseCheckout = {
      id: data.id,
      name: data.name,
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
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
      notes: data.notes,
      company: {
        id: data?.company?.id,
        name: data?.company?.name,
      },
      assigned_location: {
        id: data?.assigned_location?.id,
        name: data?.assigned_location?.name,
      },
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: new Date().toISOString().substring(0, 10),
        formatted: new Date().toDateString(),
      },
      assigned_user: data?.assigned_user,
      model_number: data?.model_number,
      assigned_asset: data?.assigned_asset,
      checkout_to_type: {
        assigned_asset: data?.assigned_asset,
        assigned_location: {
          id: data?.assigned_location?.id,
          name: data?.assigned_location?.name,
        },
        assigned_user: data?.assigned_user,
      },
    };
    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
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
        key: "status_label",
        title: "Status",
        render: (value: any) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
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
    tableQueryResult.refetch();
  }, [isLoadingSendRequest]);

  const refreshData = () => {
    tableQueryResult.refetch();
  };
  useEffect(() => {
    tableQueryResult.refetch();
  }, [isCheckoutModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible]);

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
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <HardwareCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
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
              {(record.status_label.name === "Assign" && (
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
                  onClick={() => checkout(record)}
                >
                  {t("hardware.label.button.checkout")}
                </Button>
              )) ||
                (record.status_label.name === "Ready to deploy" && (
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
                    onClick={() => checkout(record)}
                  >
                    {t("hardware.label.button.checkout")}
                  </Button>
                )) ||
                (record.status_label.name === "Pending" && (
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
                    disabled
                  >
                    {t("hardware.label.button.checkout")}
                  </Button>
                )) ||
                (record.status_label.name === "Broken" && (
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
                    disabled
                  >
                    {t("hardware.label.button.checkout")}
                  </Button>
                ))}

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
              <CloneButton
                hideText
                size="small"
                recordItemId={record.id}
                // onClick={() => clone(record)}
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
