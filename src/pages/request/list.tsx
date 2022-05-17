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
} from "@pankod/refine-antd";
import { IHardware } from "interfaces";
import { IHardwareRequest } from "interfaces/hardware";
import { useEffect, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { RequestCreate } from "./create";
import { RequestShow } from "./show";
import { TableAction } from "components/elements/tables/TableAction";
import { IHardwareResponse } from "interfaces/hardware";

export const RequestList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idSend, setIdSend] = useState<number>(-1);

  const { mutate: muteDelete, data: dataDelete } = useDelete();

  const useHardwareNotRequest = useCustom<IHardwareRequest>({
    url: "api/v1/hardware",
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
      resource: "api/v1/finfast-request",
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

  const { mutate, isLoading: isLoadingSendRequest } = useCreate<any>();

  const onSendRequest = (value: number) => {
    setIdSend(value);
  };

  useEffect(() => {
    if (idSend !== -1) {
      mutate({
        resource: "api/v1/finfast/outcome",
        values: {
          finfast_request_id: idSend,
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

  const handleDelete = (id: BaseKey) => {
    muteDelete({
      resource: "api/v1/finfast-request",
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

  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  return (
    <List
      pageHeaderProps={{
        extra: <CreateButton onClick={handleCreate} />,
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
      <Table {...tableProps} rowKey="id">
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
          render={(value) => <TextField value={value} />}
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
              {record.status === "Pending" && (
                <Popconfirm
                  title={t("request.label.button.delete")}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button size="small">
                    <DeleteOutlined />
                  </Button>
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
