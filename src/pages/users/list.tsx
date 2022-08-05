/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ShowButton,
  TagField,
  Popconfirm,
  Button,
  Tooltip,
} from "@pankod/refine-antd";
import { Image } from "antd";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { UserShow } from "./show";
import { IHardwareCreateRequest, IHardwareResponse } from "interfaces/hardware";
import { CancleAsset } from "./cancel";
import { ASSIGN_HARDWARE_API, HARDWARE_API } from "api/baseApi";
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined } from "@ant-design/icons";
import { HardwareCancelMultipleAsset } from "./cancel-multiple-assets";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  image: string;
  assigned_status: number;
  model: any;
  category: any;
  rtd_location: any;
  last_checkout: any;
}

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idConfirm, setidConfirm] = useState<number>(-1);
  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IHardware>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: ASSIGN_HARDWARE_API,
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

  const collumns: ColumnsType<DataType> = [
    {
      dataIndex: "id",
      title: "ID",
      render: (value: IHardware) => <TextField value={value ? value : ""} />,
      defaultSortOrder: getDefaultSortOrder("id", sorter),
    },
    {
      dataIndex: "name",
      title: t("user.label.field.name"),
      render: (value: IHardware) => <TextField value={value ? value : ""} />,
      defaultSortOrder: getDefaultSortOrder("name", sorter),
    },
    {
      dataIndex: "image",
      title: t("user.label.field.image"),
      render: (value: string) => {
        return value ? (
          <Image width={80} alt="" height={"auto"} src={value} />
        ) : (
          ""
        );
      },
    },
    {
      dataIndex: "model",
      title: t("user.label.field.model"),
      render: (value: IHardwareResponse) => (
        <TagField value={value ? value.name : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("model.name", sorter),
    },
    {
      dataIndex: "category",
      title: t("user.label.field.category"),
      render: (value: IHardwareResponse) => (
        <TagField value={value ? value.name : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("category.name", sorter),
    },
    {
      dataIndex: "rtd_location",
      title: t("user.label.field.location"),
      render: (value: IHardwareResponse) => (
        <TagField value={value ? value.name : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
    },

    {
      dataIndex: "assigned_status",
      title: t("user.label.field.condition"),
      render: (value: number) => (
        <TagField
          value={
            value === 0
              ? t("hardware.label.detail.noAssign")
              : value === 1
                ? t("hardware.label.detail.pendingAccept")
                : value === 2
                  ? t("hardware.label.detail.accept")
                  : value === 3
                    ? t("hardware.label.detail.refuse")
                    : ""
          }
          style={{
            background:
              value === 0
                ? "gray"
                : value === 1
                  ? "#f39c12"
                  : value === 2
                    ? "#0073b7"
                    : value === 3
                      ? "red"
                      : "gray",
            color: "white",
          }}
        />
      ),
      defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
      filters: [
        {
          text: t("hardware.label.detail.noAssign"),
          value: 0,
        },
        {
          text: t("hardware.label.detail.pendingAccept"),
          value: 1,
        },
        {
          text: t("hardware.label.detail.accept"),
          value: 2,
        },
        {
          text: t("hardware.label.detail.refuse"),
          value: 3,
        },
      ],
      onFilter: (value, record: any) => record.assigned_status === value
    },

    {
      dataIndex: "last_checkout",
      title: t("user.label.field.dateCheckout"),
      render: (value: IHardware) => (
        <DateField format="LLL" value={value ? value.datetime : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("last_checkout.datetime", sorter),
    },
  ];

  const { mutate, isLoading: isLoadingSendRequest } =
    useCreate<IHardwareCreateRequest>();

  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  const cancle = (data: IHardwareResponse) => {
    setIsCancleModalVisible(true);
    setDetail(data);
  };

  const OnAcceptRequest = (id: number, assigned_status: number) => {
    confirmHardware(id, assigned_status);
  };

  const confirmHardware = (id: number, assigned_status: number) => {
    mutate({
      resource: HARDWARE_API + "/" + id + "?_method=PUT",
      values: {
        send_accept: id,
        assigned_status: assigned_status,
      },
    });
  };

  const confirmMultipleHardware = (assets: {}[], assigned_status: number) => {
    mutate({
      resource: HARDWARE_API + "?_method=PUT",
      values: {
        assets: assets,
        assigned_status: assigned_status,
      },
    });
    setSelectedRowKeys([]);
    localStorage.removeItem("selectedRowKeys_AcceptRefuse")
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    let arr = [...isLoadingArr];
    arr[idConfirm] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    refreshData();
  }, [isLoadingSendRequest]);

  useEffect(() => {
    refreshData();
  }, [isCancleModalVisible]);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [selectedCancel, setSelectedCancel] = useState<boolean>(true);

  const [isCancelManyAssetModalVisible, setIsCancelManyAssetModalVisible] = useState(false);
  const [selectdStoreCancel, setSelectdStoreCancel] = useState<any[]>([]);

  const initselectedRowKeys = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedRowKeys_AcceptRefuse") as string) || [];
  }, [localStorage.getItem("selectedRowKeys_AcceptRefuse")]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    initselectedRowKeys as React.Key[]
  );

  useEffect(() => {
    if (
      initselectedRowKeys.filter((item: any) => item.assigned_status === 1).length >
      0
    ) {
      setSelectedCancel(true);
      setSelectdStoreCancel(
        initselectedRowKeys
          .filter((item: any) => item.assigned_status === 1)
          .map((item: any) => item)
      );
    } else {
      setSelectedCancel(false);
    }

  }, [initselectedRowKeys]);

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys)
  };

  const onSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    if (!selected) {
      localStorage.removeItem("selectedRowKeys_AcceptRefuse");
      setSelectedRowKeys(selectedRows);
    } else {
      localStorage.setItem("selectedRowKeys_AcceptRefuse", JSON.stringify(selectedRows));
      setSelectedRowKeys(selectedRows);
    }
  }

  const onSelect = (record: any, selected: boolean) => {
    if (!selected) {
      const newSelectRow = initselectedRowKeys.filter(
        (item: any) => item.id !== record.id
      );

      localStorage.setItem("selectedRowKeys_AcceptRefuse", JSON.stringify(newSelectRow));
      setSelectedRowKeys(newSelectRow.map((item: any) => item.id));
    } else {
      const newselectedRowKeys = [record, ...initselectedRowKeys];
      localStorage.setItem(
        "selectedRowKeys_AcceptRefuse",
        JSON.stringify(
          newselectedRowKeys.filter(function (item, index) {
            return newselectedRowKeys.findIndex((item) => item.id === index);
          })
        )
      );
      setSelectedRowKeys(newselectedRowKeys.map((item: any) => item.id));
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
    selectedRows,
  };

  const handleRemoveItem = (id: number) => {
    const newSelectRow = initselectedRowKeys.filter(
      (item: any) => item.id !== id
    );
    localStorage.setItem("selectedRowKeys_AcceptRefuse", JSON.stringify(newSelectRow));
    setSelectedRowKeys(newSelectRow.map((item: any) => item.id));
  };

  const handleCancel = () => {
    setIsCancelManyAssetModalVisible(!isCancelManyAssetModalVisible);
  };

  useEffect(() => {
    refreshData();
  }, [isCancelManyAssetModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List title={t("user.label.title.name")}>
      <div className="users">
        <div className="list-users">
          <div className="button-user-accept-refuse">
            <Popconfirm
              title={t("user.label.button.accept")}
              onConfirm={() => confirmMultipleHardware(initselectedRowKeys.map((item: any) => item.id), 2)}
            >
              <Button type="primary" disabled={!selectedCancel}>{t("user.label.button.accept")}</Button>
            </Popconfirm>
            <Button type="primary"
              onClick={handleCancel}
              disabled={!selectedCancel}
            >{t("user.label.button.cancle")}</Button>
          </div>

          <div className={"list-users-accept-refuse"}
            style={
              !selectedCancel ? { display: "none" } : { display: "inline" }
            }
          >
            {initselectedRowKeys
              .map((item: any) => (
                <span className="list-checkin" key={item.id}>
                  <span className="name-checkin">{item.asset_tag}</span>
                  <span
                    className="delete-users-accept-refuse"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <CloseOutlined />
                  </span>
                </span>
              ))}
          </div>
        </div>
        <TableAction searchFormProps={searchFormProps} />
      </div>

      <MModal
        title={t("user.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <UserShow setIsModalVisible={setIsShowModalVisible} detail={detail} />
      </MModal>
      <MModal
        title={t("user.label.title.cancle")}
        setIsModalVisible={setIsCancleModalVisible}
        isModalVisible={isCancleModalVisible}
      >
        <CancleAsset
          setIsModalVisible={setIsCancleModalVisible}
          isModalVisible={isCancleModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCancelManyAssetModalVisible}
        isModalVisible={isCancelManyAssetModalVisible}
      >
        <HardwareCancelMultipleAsset
          isModalVisible={isCancelManyAssetModalVisible}
          setIsModalVisible={setIsCancelManyAssetModalVisible}
          data={selectdStoreCancel}
          setSelectedRowKey={setSelectedRowKeys}
        />
      </MModal>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          position: ["topRight", "bottomRight"],
          total: pageTotal ? pageTotal : 0,
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      >
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col as ColumnsType} sorter />
        ))}
        <Table.Column<IHardwareResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Tooltip
                title={t("hardware.label.tooltip.viewDetail")}
                color={"#108ee9"}
              >
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record)}
                />
              </Tooltip>
              {record.assigned_status === 1 && (
                <Popconfirm
                  title={t("hardware.label.button.accept")}
                  onConfirm={() => OnAcceptRequest(record.id, 2)}
                >
                  {isLoadingArr[record.id] !== false && (
                    <Button
                      className="ant-btn-accept"
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
                      {t("hardware.label.button.accept")}
                    </Button>
                  )}
                </Popconfirm>
              )}

              {record.assigned_status === 1 && (
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
                  onClick={() => cancle(record)}
                >
                  {t("hardware.label.button.refuse")}
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
    </List >
  );
};

