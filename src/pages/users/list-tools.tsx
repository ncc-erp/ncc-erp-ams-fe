import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  useCreate,
  useNotification,
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
  Tooltip,
  Spin,
  Button,
  Popconfirm,
} from "@pankod/refine-antd";
import {
  getBGToolAssignedStatusDecription,
  getToolAssignedStatusDecription,
} from "untils/tools";
import { CancleAsset } from "./cancel";
import { SyncOutlined } from "@ant-design/icons";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useRef, useState, useMemo } from "react";
import { ASSIGN_TOOLS_API, TOOLS_API } from "api/baseApi";
import { MModal } from "components/Modal/MModal";
import { IModel } from "interfaces/model";
import { IToolCreateRequest, IToolResponse } from "interfaces/tool";
import { ToolShow } from "pages/tools/show";
import { ASSIGNED_STATUS } from "constants/assets";
import { filterAssignedStatus } from "untils/assets";

export const UserListTool: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const menuRef = useRef(null);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<IToolResponse>();
  const [loading, setLoading] = useState(false);
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const idConfirm = -1;
  const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
  const { open } = useNotification();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IToolResponse>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: ASSIGN_TOOLS_API,
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

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  // const collumns: ColumnsType<IToolResponse> = [
  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: t("tools.label.field.name"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "purchase_cost",
        title: t("tools.label.field.purchase_cost"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
      },
      {
        key: "category",
        title: t("tools.label.field.category"),
        render: (value: IToolResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category", sorter),
      },
      {
        key: "supplier",
        title: t("tools.label.field.supplier"),
        render: (value: IToolResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier", sorter),
      },
      {
        key: "purchase_date",
        title: t("tools.label.field.purchase_date"),
        render: (value: any) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
      },
      {
        key: "checkout_at",
        title: t("tools.label.field.checkout_at"),
        render: (value: IModel) =>
          value ? (
            <DateField format="LL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("checkout_at", sorter),
      },
      {
        key: "assigned_status",
        title: t("tools.label.field.assigned_status"),
        render: (value: number) => (
          <TagField
            value={getToolAssignedStatusDecription(value)}
            style={{
              background: getBGToolAssignedStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
        filters: filterAssignedStatus,
        onFilter: (value: number, record: IToolResponse) =>
          record.assigned_status === value,
      },
      {
        key: "notes",
        title: t("tools.label.field.notes"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
      {
        key: "created_at",
        title: t("tools.label.field.dateCreate"),
        render: (value: IModel) =>
          value ? (
            <DateField format="LL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("created_at", sorter),
      },
    ],
    []
  );

  const { mutate, isLoading: isLoadingSendRequest } =
    useCreate<IToolCreateRequest>();

  const OnAcceptRequest = (id: number, assigned_status: number) => {
    confirmTool(id, assigned_status);
  };

  const cancle = (data: IToolResponse) => {
    setIsCancleModalVisible(true);
    setDetail(data);
  };

  const confirmTool = (id: number, assigned_status: number) => {
    mutate(
      {
        resource: TOOLS_API + "/" + id + "?_method=PUT",
        values: {
          send_accept: id,
          assigned_status: assigned_status,
        },
        successNotification: false,
      },
      {
        onSuccess(data) {
          open?.({
            type: "success",
            description: "Success",
            message: data?.data.messages,
          });
        },
      }
    );
    handleRefresh();
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    const arr = [...isLoadingArr];
    arr[idConfirm] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    refreshData();
  }, [isLoadingSendRequest]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 2000);
  };

  const show = (data: IToolResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  useEffect(() => {
    refreshData();
  }, [isCancleModalVisible]);

  return (
    <List title={t("tools.label.title.my-tool")}>
      <div className="sum-assets">
        <span className="name-sum-assets">
          {t("tools.label.title.sum-tools")}
        </span>{" "}
        : {tableProps.pagination ? tableProps.pagination?.total : 0}
      </div>
      <div className="users">
        <div
          className={pageTotal === 0 ? "list-users-noTotalPage" : "list-users"}
        ></div>
        <div className="all">
          <TableAction searchFormProps={searchFormProps} />
          <div className="other_function">
            <div className="menu-container" ref={menuRef}>
              <div>
                <button
                  className="menu-trigger"
                  style={{
                    borderTopLeftRadius: "3px",
                    borderBottomLeftRadius: "3px",
                  }}
                >
                  <Tooltip
                    title={t("tools.label.tooltip.refresh")}
                    color={"#108ee9"}
                  >
                    <SyncOutlined
                      onClick={handleRefresh}
                      style={{ color: "black" }}
                    />
                  </Tooltip>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MModal
        title={t("user.label.title.detail_Tool")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <ToolShow setIsModalVisible={setIsShowModalVisible} detail={detail} />
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
          ApiLink={TOOLS_API}
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
        >
          {collumns.map((col, index) => (
            <Table.Column
              key={index}
              dataIndex={col.key}
              {...(col as any)}
              sorter
            />
          ))}
          <Table.Column<any>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("tools.label.tooltip.viewDetail")}
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
