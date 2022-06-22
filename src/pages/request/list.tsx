/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined } from "@ant-design/icons";

import {
  useTranslate,
  IResourceComponentsProps,
  useCreate,
  useDelete,
  BaseKey,
  CrudFilters,
  useCustom,
} from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  Space,
  Popconfirm,
  TagField,
  ShowButton,
  Button,
  CreateButton,
  Tooltip,
} from "@pankod/refine-antd";

import { IHardware } from "interfaces";
import { IHardwareCreateRequest } from "interfaces/hardware";
import { useEffect, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { RequestCreate } from "./create";
import { RequestShow } from "./show";
import { TableAction } from "components/elements/tables/TableAction";
import { IRequestResponse } from "interfaces/request";
import { FINFAST_REQUEST_API, HARDWARE_API, SEND_REQUEST_API } from "api/baseApi";

export const RequestList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<IRequestResponse | undefined>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idSend, setIdSend] = useState<number>(-1);

  const { mutate: muteDelete, data: dataDelete } = useDelete();
  const useHardwareNotRequest = useCustom<IHardwareCreateRequest>({
    url: HARDWARE_API,
    method: "get",
    config: {
      filters: [
        {
          field: "notRequest",
          operator: "null",
          value: 1,
        },
      ],
    },
  });

  const { refetch } = useHardwareNotRequest;

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IHardware>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: FINFAST_REQUEST_API,
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

  const { mutate, isLoading: isLoadingSendRequest } =
    useCreate<IHardwareCreateRequest>();

  const onSendRequest = (value: number) => {
    setIdSend(value);
  };

  useEffect(() => {
    if (idSend !== -1) {
      mutate({
        resource: SEND_REQUEST_API,
        values: {
          finfast_request_id: idSend,
        },
      });
    }
  }, [idSend, mutate]);

  useEffect(() => {
    let arr = [...isLoadingArr];
    arr[idSend] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    tableQueryResult.refetch();
  }, [isLoadingSendRequest]);

  const handleDelete = (id: BaseKey) => {
    muteDelete({
      resource: FINFAST_REQUEST_API,
      id: id,
      mutationMode: "optimistic",
    });
  };

  useEffect(() => {
    if (dataDelete !== undefined) {
      refetch();
    }
  }, [dataDelete, refetch]);

  const handleOpenModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCreate = () => {
    handleOpenModel();
  };

  const show = (data: IRequestResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  return (
    <List
      title={t("request.label.title.create")}
      pageHeaderProps={{
        extra: (
          <Tooltip title={t("request.label.title.create")} color={"#108ee9"}>
            <CreateButton onClick={handleCreate} />
          </Tooltip>
        ),
      }}
    >
      <TableAction searchFormProps={searchFormProps} />
      <MModal
        title={t("request.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <RequestCreate
          setIsModalVisible={setIsModalVisible}
          useHardwareNotRequest={useHardwareNotRequest}
        />
      </MModal>

      <MModal
        title={t("request.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <RequestShow setIsModalVisible={setIsModalVisible} detail={detail} />
      </MModal>
      <Table {...tableProps} rowKey="id" scroll={{ x: 1170 }}>
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
        />

        <Table.Column
          dataIndex="status"
          key="status"
          title={t("request.label.field.status")}
          render={(value) => (
            <TagField
              value={value}
              style={{
                background:
                  value === "Sent"
                    ? "#0073b7"
                    : value === "Approved"
                    ? "red"
                    : "#f39c12",
                color: "white",
                border: "none",
              }}
            />
          )}
          defaultSortOrder={getDefaultSortOrder("status", sorter)}
          sorter
        />

        <Table.Column
          dataIndex="branch"
          key="branch"
          title={t("request.label.field.branchRequest")}
          render={(value) => <TagField value={value.name} />}
        />
        <Table.Column
          dataIndex="entry_type"
          key="entry_type"
          title={t("request.label.field.entryRequest")}
          render={(value) => <TagField value={value.name} />}
        />

        <Table.Column
          dataIndex="supplier"
          key="supplier"
          title={t("request.label.field.supplier")}
          render={(value) => <TagField value={value.name} />}
        />

        <Table.Column
          dataIndex="finfast_request_assets"
          key="finfast_request_assets"
          title={t("request.label.field.countAsset")}
          render={(value) => (
            <TagField value={value.length ? value.length : 0} />
          )}
        />
        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: IRequestResponse) => (
            <Space>
              <Tooltip
                title={t("request.label.button.viewDetail")}
                color={"#108ee9"}
              >
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record)}
                />
              </Tooltip>

              {record.status === "Pending" && (
                <Popconfirm
                  title={t("request.label.button.delete")}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Tooltip
                    title={t("request.label.button.delete")}
                    color={"red"}
                  >
                    <Button size="small">
                      <DeleteOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              )}
              {record.status === "Pending" && (
                <Popconfirm
                  title={t("request.label.button.send")}
                  onConfirm={() => onSendRequest(record.id)}
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
                      {t("request.label.button.send")}
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
