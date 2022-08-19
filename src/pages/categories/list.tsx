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
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";
import { SyncOutlined } from "@ant-design/icons";
import { Spin } from "antd";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { CategoryCreate } from "./create";
import { CategoryEdit } from "./edit";
import { ICategoryResponse } from "interfaces/categories";
import { CATEGORIES_API } from "api/baseApi";

export enum ECategory {
  ACCESSORY = "Accessory",
  ASSET = "Asset",
  CONSUMABLE = "Consumable",
}

export const CategoryList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ICategoryResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<ICategoryResponse>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: CATEGORIES_API,
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

  const edit = (data: ICategoryResponse) => {
    const dataConvert: ICategoryResponse = {
      id: data.id,
      name: data.name,
      category_type: data?.category_type,
      eula: data?.eula ?? "",
      image: data?.image,

      require_acceptance: data?.require_acceptance,
      checkin_email: data?.checkin_email,
      use_default_eula: data?.use_default_eula,
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
        title: t("category.label.table.nameAsset"),
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: t("category.label.table.image"),
        render: (value: string) => {
          return value ? (
            <Image width={50} alt="" height={"auto"} src={value ? value : ""} />
          ) : (
            ""
          );
        },
      },
      {
        key: "category_type",
        title: t("category.label.table.category"),
        render: (value: string) => (
          <TagField
            value={
              value
                ? value === ECategory.ACCESSORY
                  ? t("category.label.options.accessory")
                  : value === ECategory.ASSET
                  ? t("category.label.options.asset")
                  : value === ECategory.CONSUMABLE
                  ? t("category.label.options.consumable")
                  : ""
                : ""
            }
          />
        ),
        defaultSortOrder: getDefaultSortOrder("category_type", sorter),
      },
      {
        key: "item_count",
        title: t("category.label.table.assetCount"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("item_count", sorter),
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
      title={t("category.label.title.nameTitle")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {" "}
            {t("category.label.field.create")}{" "}
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
        title={t("category.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <CategoryCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("category.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <CategoryEdit
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
        >
          {collumns.map((col) => (
            <Table.Column dataIndex={col.key} {...col} sorter />
          ))}
          <Table.Column<ICategoryResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("category.label.field.edit")}
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
                    title={t("category.label.field.delete")}
                    color={"red"}
                  >
                    <DeleteButton
                      resourceName={CATEGORIES_API}
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
