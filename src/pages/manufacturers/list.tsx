/* eslint-disable react-hooks/exhaustive-deps */
import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
} from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  Space,
  EditButton,
  DeleteButton,
  TagField,
  CreateButton,
  Tooltip,
  DateField,
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";
import { Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ManufacturesCreate } from "./create";
import { ManufacturesEdit } from "./edit";
import { IManufacturesResponse } from "interfaces/manufacturers";
import { MANUFACTURES_API } from "api/baseApi";

export const ManufacturesList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IManufacturesResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IManufacturesResponse>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: MANUFACTURES_API,
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

  const edit = (data: IManufacturesResponse) => {
    const dataConvert: IManufacturesResponse = {
      id: data.id,
      name: data.name,
      url: data?.url,
      support_url: data?.support_url,
      support_email: data?.support_email,
      support_phone: data?.support_phone,
      image: data?.image,
      assets_count: data?.assets_count,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

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
        title: t("manufactures.label.field.name"),
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: t("manufactures.label.field.imageTable"),
        render: (value: string) => {
          return value ? (
            <Image width={50} alt="" height={"auto"} src={value ? value : ""} />
          ) : (
            ""
          );
        },
      },

      {
        key: "assets_count",
        title: t("manufactures.label.field.assetCount"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
      },
      {
        key: "accessories_count",
        title: t("manufactures.label.field.accessoriesCount"),
        render: (value: number) => <TagField value={value} />,
        defaultSortOrder: getDefaultSortOrder("accessories_count", sorter),
      },
      {
        key: "consumables_count",
        title: t("manufactures.label.field.consumableCount"),
        render: (value: number) => <TagField value={value} />,
        defaultSortOrder: getDefaultSortOrder("consumables_count", sorter),
      },

      {
        key: "created_at",
        title: t("manufactures.label.field.dateCreate"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value.datetime} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
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

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List
      title={t("manufactures.label.title.nameTitle")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("manufactures.label.field.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
        <div>
          <button
            className="menu-trigger"
            style={{
              borderTopLeftRadius: "3px",
              borderBottomLeftRadius: "3px",
            }}
          >
            <Tooltip
              title={t("hardware.label.tooltip.refresh")}
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
      <MModal
        title={t("manufactures.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <ManufacturesCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("manufactures.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <ManufacturesEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
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
          className={(pageTotal as number) <= 10 ? "list-table" : ""}
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
          scroll={{ x: 1100 }}
        >
          {collumns.map((col) => (
            <Table.Column dataIndex={col.key} {...col} sorter />
          ))}
          <Table.Column<IManufacturesResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("manufactures.label.field.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>
                {record.assets_count > 0 ? (
                  <DeleteButton hideText size="small" disabled />
                ) : (
                  <Tooltip
                    title={t("manufactures.label.field.delete")}
                    color={"red"}
                  >
                    <DeleteButton
                      resourceName={MANUFACTURES_API}
                      hideText
                      size="small"
                      recordItemId={record.id}
                    />
                  </Tooltip>
                )}
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
