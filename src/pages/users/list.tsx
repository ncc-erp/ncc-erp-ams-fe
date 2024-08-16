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
    Spin,
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
  import type { ColumnsType } from "antd/es/table";
  import { CloseOutlined } from "@ant-design/icons";
  import { HardwareCancelMultipleAsset } from "./cancel-multiple-assets";
  import { IUserAssets } from "interfaces/user";
  import { ASSIGNED_STATUS } from "constants/assets";
  import {
    getAssetAssignedStatusDecription,
    getAssetStatusDecription,
    getBGAssetAssignedStatusDecription,
    getBGAssetStatusDecription,
  } from "untils/assets";
  import "styles/request.less";
  
  export const UserList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
    const [detail, setDetail] = useState<IHardwareResponse>();
    const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
    const [idConfirm, setidConfirm] = useState<number>(-1);
    const { tableProps, sorter, searchFormProps, tableQueryResult } =
      useTable<IUserAssets>({
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
  
    const collumns: ColumnsType<IUserAssets> = [
      {
        dataIndex: "name",
        title: t("user.label.field.name"),
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
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
        title: t("user.label.field.locations"),
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
            value={getAssetAssignedStatusDecription(value)}
            style={{
              background: getBGAssetAssignedStatusDecription(value),
              color: "white",
            }}
          />
        ),
        filters: [
          {
            text: t("hardware.label.detail.waitingAcceptCheckout"),
            value: ASSIGNED_STATUS.WAITING_CHECKOUT,
          },
          {
            text: t("hardware.label.detail.waitingAcceptCheckin"),
            value: ASSIGNED_STATUS.WAITING_CHECKIN,
          },
          {
            text: t("hardware.label.detail.accept"),
            value: ASSIGNED_STATUS.ACCEPT,
          },
          {
            text: t("hardware.label.detail.refuse"),
            value: ASSIGNED_STATUS.REFUSE,
          },
        ],
        onFilter: (value, record: IUserAssets) =>
          record.assigned_status === value,
      },
      {
        dataIndex: "purchase_date",
        title: t("user.label.field.dateBuy"),
        render: (value: IHardware) =>
          value ? <DateField format="LLL" value={value ? value.date : ""} /> : "",
        defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
      },
      {
        dataIndex: "warranty_months",
        title: t("user.label.field.warranty_months"),
        render: (value: string) => <TagField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        dataIndex: "last_checkout",
        title: t("user.label.field.dateCheckout"),
        render: (value: IHardware) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
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
      handleRefresh();
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
  
    const initselectedRowKeys = useMemo(() => {
      return (
        JSON.parse(
          localStorage.getItem("selectedRowKeys_AcceptRefuse") as string
        ) || []
      );
    }, [localStorage.getItem("selectedRowKeys_AcceptRefuse")]);
  
    const [selectedRowKeys, setSelectedRowKeys] = useState<
      React.Key[] | IUserAssets[]
    >(initselectedRowKeys as React.Key[]);
  
    useEffect(() => {
      localStorage.removeItem("selectedRowKeys_AcceptRefuse");
    }, [window.location.reload]);
  
    const [selectedRows, setSelectedRows] = useState<IUserAssets[]>([]);
    const [isCancelManyAssetModalVisible, setIsCancelManyAssetModalVisible] =
      useState(false);
  
    const [selectedNotAcceptAndRefuse, setSelectedNotAcceptAndRefuse] =
      useState<boolean>(true);
    const [selectedAcceptAndRefuse, setSelectedAcceptAndRefuse] =
      useState<boolean>(true);
  
    const [selectdStoreAcceptAndRefuse, setSelectedStoreAcceptAndRefuse] =
      useState<any[]>([]);
  
    const [nameAcceptAndRefuse, setNameAcceptAndRefuse] = useState("");
    const [nameNotAcceptAndRefuse, setNameNotAcceptAndRefuse] = useState("");
  
    useEffect(() => {
      if (
        initselectedRowKeys.filter(
          (item: IUserAssets) =>
            item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
            item.assigned_status === ASSIGNED_STATUS.REFUSE
        ).length > 0
      ) {
        setSelectedNotAcceptAndRefuse(true);
        setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
      } else {
        setSelectedNotAcceptAndRefuse(false);
        setNameNotAcceptAndRefuse("");
      }
  
      if (
        initselectedRowKeys.filter(
          (item: IUserAssets) =>
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
        ).length > 0
      ) {
        setSelectedAcceptAndRefuse(true);
        setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
        setSelectedStoreAcceptAndRefuse(
          initselectedRowKeys
            .filter(
              (item: IUserAssets) =>
                item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
                item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
            )
            .map((item: IUserAssets) => item)
        );
      } else {
        setSelectedAcceptAndRefuse(false);
        setNameAcceptAndRefuse("");
      }
  
      if (
        initselectedRowKeys.filter(
          (item: IUserAssets) =>
            item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
            item.assigned_status === ASSIGNED_STATUS.REFUSE
        ).length > 0 &&
        initselectedRowKeys.filter(
          (item: IUserAssets) =>
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
        ).length > 0
      ) {
        setSelectedNotAcceptAndRefuse(false);
        setSelectedAcceptAndRefuse(false);
        setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
        setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
      } else {
      }
    }, [initselectedRowKeys]);
  
    const onSelectChange = (
      selectedRowKeys: React.Key[],
      selectedRows: IUserAssets[]
    ) => {
      setSelectedRowKeys(selectedRowKeys);
    };
  
    const onSelect = (record: IUserAssets, selected: boolean) => {
      if (!selected) {
        const newSelectRow = initselectedRowKeys.filter(
          (item: IUserAssets) => item.id !== record.id
        );
        localStorage.setItem(
          "selectedRowKeys_AcceptRefuse",
          JSON.stringify(newSelectRow)
        );
        setSelectedRowKeys(newSelectRow.map((item: IUserAssets) => item.id));
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
        setSelectedRowKeys(
          newselectedRowKeys.map((item: IUserAssets) => item.id)
        );
      }
    };
  
    const onSelectAll = (
      selected: boolean,
      selectedRows: IUserAssets[],
      changeRows: IUserAssets[]
    ) => {
      if (!selected) {
        const unSelectIds = changeRows.map((item: IUserAssets) => item.id);
        let newSelectRows = initselectedRowKeys.filter(
          (item: IUserAssets) => item
        );
        newSelectRows = initselectedRowKeys.filter(
          (item: IUserAssets) => !unSelectIds.includes(item.id)
        );
        localStorage.setItem(
          "selectedRowKeys_AcceptRefuse",
          JSON.stringify(newSelectRows)
        );
        setSelectedRowKeys(newSelectRows);
      } else {
        selectedRows = selectedRows.filter((item: IUserAssets) => item);
        localStorage.setItem(
          "selectedRowKeys_AcceptRefuse",
          JSON.stringify([...initselectedRowKeys, ...selectedRows])
        );
        setSelectedRowKeys(selectedRows);
      }
    };
  
    const rowSelection = {
      selectedRowKeys: initselectedRowKeys.map((item: IUserAssets) => item.id),
      onChange: onSelectChange,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
      onSelectChange,
    };
  
    const handleRemoveItem = (id: number) => {
      const newSelectRow = initselectedRowKeys.filter(
        (item: IUserAssets) => item.id !== id
      );
      localStorage.setItem(
        "selectedRowKeys_AcceptRefuse",
        JSON.stringify(newSelectRow)
      );
      setSelectedRowKeys(newSelectRow.map((item: IUserAssets) => item.id));
    };
  
    const handleCancel = () => {
      setIsCancelManyAssetModalVisible(!isCancelManyAssetModalVisible);
    };
  
    const [loading, setLoading] = useState(false);
    const handleRefresh = () => {
      setLoading(true);
      setTimeout(() => {
        refreshData();
        setLoading(false);
      }, 2000);
    };
  
    const confirmMultipleHardware = (assets: {}[], assigned_status: number) => {
      mutate({
        resource: HARDWARE_API + "?_method=PUT",
        values: {
          assets: assets,
          assigned_status: assigned_status,
        },
      });
      handleRefresh();
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedRowKeys_AcceptRefuse");
    };
  
    useEffect(() => {
      refreshData();
    }, [isCancelManyAssetModalVisible]);
  
    const pageTotal = tableProps.pagination && tableProps.pagination.total;
  
    return (
      <List title={t("user.label.title.name")}>
        <div className="sum-assets">
          <span className="name-sum-assets">
            {t("user.label.title.sum-assets")}
          </span>{" "}
          : {tableProps.pagination ? tableProps.pagination?.total : 0}
        </div>
        <div className="users">
          <div
            className={pageTotal === 0 ? "list-users-noTotalPage" : "list-users"}
          >
            <div className="button-user-accept-refuse">
              <Popconfirm
                title={t("user.label.button.accept")}
                onConfirm={() =>
                  confirmMultipleHardware(
                    initselectedRowKeys.map((item: IUserAssets) => item.id),
                    ASSIGNED_STATUS.ACCEPT
                  )
                }
              >
                <Button
                  type="primary"
                  disabled={!selectedAcceptAndRefuse}
                  loading={loading}
                  className={selectedAcceptAndRefuse ? "ant-btn-accept" : ""}
                >
                  {t("user.label.button.accept")}
                </Button>
              </Popconfirm>
  
              <Button
                type="primary"
                onClick={handleCancel}
                disabled={!selectedAcceptAndRefuse}
              >
                {t("user.label.button.cancle")}
              </Button>
            </div>
  
            <div
              className={nameAcceptAndRefuse ? "list-users-accept-refuse" : ""}
            >
              <span className="title-remove-name">{nameAcceptAndRefuse}</span>
              {initselectedRowKeys
                .filter(
                  (item: IUserAssets) =>
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
                )
                .map((item: IHardwareResponse) => (
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
  
            <div
              className={nameNotAcceptAndRefuse ? "list-users-accept-refuse" : ""}
            >
              <span className="title-remove-name">{nameNotAcceptAndRefuse}</span>
              {initselectedRowKeys
                .filter(
                  (item: IUserAssets) =>
                    item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
                    item.assigned_status === ASSIGNED_STATUS.REFUSE
                )
                .map((item: IHardwareResponse) => (
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
            ApiLink={HARDWARE_API}
            refreshData={refreshData}
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
            data={selectdStoreAcceptAndRefuse}
            setSelectedRowKey={setSelectedRowKeys}
          />
        </MModal>
  
        {loading ? (
          <>
            <div style={{ paddingTop: "15rem", textAlign: "center" }}>
              <Spin
                tip="Loading..."
                style={{ fontSize: "18px", color: "black" }}
              />
            </div>
          </>
        ) : (
          <Table
            {...tableProps}
            rowKey="id"
            pagination={
              (pageTotal as number) > 10
                ? {
                    position: ["topRight", "bottomRight"],
                    total: pageTotal ? pageTotal : 0,
                    showSizeChanger: true,
                  }
                : false
            }
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            // scroll={{ x: 1550 }}
          >
            {collumns.map((col) => (
              <Table.Column
                dataIndex={col.key}
                {...(col as ColumnsType)}
                sorter
              />
            ))}
            <Table.Column<any>
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
  
                  {record.assigned_to.id !== record.withdraw_from &&
                    record.assigned_status ===
                      ASSIGNED_STATUS.WAITING_CHECKOUT && (
                      <Popconfirm
                        title={t("hardware.label.button.accept_checkout")}
                        onConfirm={() =>
                          OnAcceptRequest(record.id, ASSIGNED_STATUS.ACCEPT)
                        }
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
                            {t("hardware.label.button.accept_checkout")}
                          </Button>
                        )}
                      </Popconfirm>
                    )}
  
                  {record.assigned_to.id === record.withdraw_from &&
                    record.assigned_status ===
                      ASSIGNED_STATUS.WAITING_CHECKIN && (
                      <Popconfirm
                        title={t("hardware.label.button.accept_checkin")}
                        onConfirm={() =>
                          OnAcceptRequest(record.id, ASSIGNED_STATUS.ACCEPT)
                        }
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
                            {t("hardware.label.button.accept_checkin")}
                          </Button>
                        )}
                      </Popconfirm>
                    )}
  
                  {record.assigned_status ===
                    ASSIGNED_STATUS.WAITING_CHECKOUT && (
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
                      {t("hardware.label.button.rejectCheckout")}
                    </Button>
                  )}
  
                  {record.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN && (
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
                      {t("hardware.label.button.rejectCheckin")}
                    </Button>
                  )}
                </Space>
              )}
            />
          </Table>
        )}
      </List>
    );
  };