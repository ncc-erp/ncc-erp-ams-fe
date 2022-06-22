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
  Input,
  EditButton,
} from "@pankod/refine-antd";
import { Image } from "antd";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { UserShow } from "./show";
import { IHardwareCreateRequest, IHardwareResponse } from "interfaces/hardware";
import { CancleAsset } from "./cancel";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [keySearch] = useState<string>();
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
      resource: "api/v1/hardware/assign",
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
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: "Tên tài sản",
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: "Hình ảnh",
        render: (value: string) => {
          return value ? (
            <Image width={80} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "model",
        title: "Kiểu tài sản",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: "Thể loại",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "rtd_location",
        title: "Vị trí",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
      },

      {
        key: "assigned_status",
        title: "Tình trạng",
        render: (value: any) => (
          <TagField
            value={
              value === 0
                ? "Chưa assign"
                : value === 1
                ? "Đang chờ xác nhận"
                : value === 2
                ? "Đã xác nhận"
                : value === 3
                ? "Đã từ chối"
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
                  : "",
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
      },

      {
        key: "last_checkout",
        title: "Ngày cấp phát",
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("last_checkout.datetime", sorter),
      },
    ],
    []
  );

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
      resource: "api/v1/hardware/" + id + "?_method=PUT",
      values: {
        send_accept: id,
        assigned_status: assigned_status,
      },
    });
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

  return (
    <List title={t("user.label.title.name")}>
      <TableAction searchFormProps={searchFormProps} />

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
      <Table {...tableProps} rowKey="id" scroll={{ x: 1250 }}>
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<IHardwareResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => show(record)}
              />
              {record.assigned_status === 1 && (
                <Popconfirm
                  title={t("request.label.button.accept")}
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
                      {t("request.label.button.accept")}
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
                  {t("request.label.button.refuse")}
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
