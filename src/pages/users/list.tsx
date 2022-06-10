/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  useCreate,
  useCustom,
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

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [keySearch] = useState<string>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idConfirm, setidConfirm] = useState<number>(-1);

  const [payload, setPayload] = useState<FormData>();

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
        title: "Asset Name",
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: "Image",
        render: (value: string) => {
          return value ? (
            <Image width={50} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "model",
        title: "Model",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: "Category",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "rtd_location",
        title: "Location",
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
      },
      // {
      //   key: "status_label",
      //   title: "Status",
      //   render: (value: IHardwareResponse) => (
      //     <TagField value={value ? value.name : ""} />
      //   ),
      //   defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
      // },

      {
        key: "created_at",
        title: "Created At",
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
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

  const OnAcceptRequest = (
    id: number,
    assigned_status: number,
    user_can_checkout: boolean
  ) => {
    // setidConfirm(id);
    confirmHardware(id, assigned_status, user_can_checkout);
  };

  const confirmHardware = (
    id: number,
    assigned_status: number,
    user_can_checkout: boolean
  ) => {
    mutate({
      resource: "api/v1/hardware/" + id + "?_method=PUT",
      values: {
        send_accept: id,
        assigned_status: assigned_status,
        user_can_checkout: user_can_checkout,
      },
    });
  };

  // useEffect(() => {
  //   if (idConfirm !== -1) {
  // confirmHardware(idConfirm);
  //   }
  // }, [idConfirm, mutate]);

  useEffect(() => {
    let arr = [...isLoadingArr];
    arr[idConfirm] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    tableQueryResult.refetch();
  }, [isLoadingSendRequest]);

  return (
    <List title="Tài sản của tôi">
      <TableAction searchFormProps={searchFormProps} />

      <MModal
        title={t("user.label.title.detail")}
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
              <Tooltip title="Xem chi tiết" color={"#108ee9"}>
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record)}
                />
              </Tooltip>
              {record.assigned_status === 0 && (
                <Popconfirm
                  title={t("request.label.button.accept")}
                  onConfirm={() => OnAcceptRequest(record.id, 1, false)}
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
              {record.assigned_status === 0 && (
                <Popconfirm
                  title={t("request.label.button.refuse")}
                  onConfirm={() => OnAcceptRequest(record.id, 2, false)}
                >
                  {isLoadingArr[record.id] !== false && (
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
                      {t("request.label.button.refuse")}
                    </Button>
                  )}
                </Popconfirm>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
