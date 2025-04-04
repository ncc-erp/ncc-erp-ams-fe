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
  Checkbox,
  DateField,
} from "@pankod/refine-antd";

import { IHardware } from "interfaces";
import { IHardwareCreateRequest, IHardwareResponse } from "interfaces/hardware";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { RequestCreate } from "./create";
import { RequestShow } from "./show";
import { TableAction } from "components/elements/tables/TableAction";
import { IRequestResponse } from "interfaces/request";
import {
  FINFAST_REQUEST_API,
  HARDWARE_API,
  SEND_REQUEST_API,
} from "api/baseApi";
import "styles/antd.less";
import { MenuOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

const defaultCheckedList = [
  "id",
  "name",
  "status",
  "branch",
  "entry_type",
  "supplier",
  "finfast_request_assets",
];

export const RequestList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<IRequestResponse | undefined>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [idSend, setIdSend] = useState<number>(-1);

  const [collumnSelected, setColumnSelected] =
    useState<string[]>(defaultCheckedList);
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

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
    const arr = [...isLoadingArr];
    arr[idSend] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    tableQueryResult.refetch();
  }, [isLoadingSendRequest]);

  useEffect(() => {
    tableQueryResult.refetch();
  }, [isLoadingSendRequest, refetch]);

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
  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: t("request.label.field.nameRequest"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "status",
        title: t("request.label.field.status"),
        render: (value: string) => (
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
        ),
      },
      {
        key: "branch",
        title: t("request.label.field.branchRequest"),
        render: (value: IHardwareResponse) => <TextField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("branch", sorter),
      },
      {
        key: "entry_type",
        title: t("request.label.field.entryRequest"),
        render: (value: IHardwareResponse) => <TextField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("entry_type", sorter),
      },
      {
        key: "supplier",
        title: t("request.label.field.supplier"),
        render: (value: IHardwareResponse) => <TextField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("supplier", sorter),
      },
      {
        key: "finfast_request_assets",
        title: t("request.label.field.countAsset"),
        render: (value: any) => (
          <TagField value={value.length ? value.length : 0} />
        ),
      },
      {
        key: "note",
        title: t("request.label.field.note"),
        render: (value: string) => <TextField value={value} />,
      },
      {
        key: "created_at",
        title: t("request.label.field.dateCreate"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value.datetime} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
      },
    ],
    []
  );

  const onCheckItem = (value: any) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };

  const listenForOutsideClicks = (
    listening: boolean,
    setListening: (arg0: boolean) => void,
    menuRef: { current: any },
    setIsActive: (arg0: boolean) => void
  ) => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(`click`, (event) => {
        const current = menuRef.current;
        const node = event.target;
        if (current && current.contains(node)) return;
        setIsActive(false);
      });
    });
  };

  useEffect(() => {
    const aboutController = new AbortController();

    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);

    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  return (
    <List
      title={t("request.label.field.create")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("request.label.title.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
        <div className="menu-container" ref={menuRef}>
          <button onClick={onClickDropDown} className="menu-trigger">
            <MenuOutlined />
          </button>
          <nav className={`menu ${isActive ? "active" : "inactive"}`}>
            <div className="menu-dropdown">
              {collumns.map((item) => (
                <Checkbox
                  className="checkbox"
                  key={item.key}
                  onChange={(e) => onCheckItem(item)}
                  checked={collumnSelected.includes(item.key)}
                >
                  {item.title}
                </Checkbox>
              ))}
            </div>
          </nav>
        </div>
      </div>
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
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1250 }}
        pagination={{
          position: ["topRight", "bottomRight"],
          total: pageTotal ? pageTotal : 0,
        }}
      >
        {collumns
          .filter((collumn) => collumnSelected.includes(collumn.key))
          .map((col) => (
            <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
          ))}

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
