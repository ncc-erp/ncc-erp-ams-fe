/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  useNavigation,
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
import { Spin } from "antd";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { CategoryCreate } from "./create";
import { CategoryEdit } from "./edit";
import { ICategoryRequest, ICategoryResponse } from "interfaces/categories";
import { CATEGORIES_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";

export enum ECategory {
  ACCESSORY = "Accessory",
  ASSET = "Asset",
  CONSUMABLE = "Consumable",
  TAXTOKEN = "Taxtoken"
}

export const CategoryList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ICategoryResponse>();

  const [searchParams, setSearchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");

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
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search,
          },
          {
            field: "category_id",
            operator: "eq",
            value: category_id,
          }
        );
        return filters;
      },
    });

  const edit = (data: ICategoryResponse) => {
    const dataConvert: ICategoryResponse = {
      id: data.id,
      name: data.name,
      category_type: data?.category_type,
      eula:
        typeof data?.eula === "string"
          ? data?.eula.split(">")[1].split("<")[0]
          : "",
      image: data?.image,

      require_acceptance: data?.require_acceptance,
      checkin_email: data?.checkin_email,
      use_default_eula: data?.use_default_eula,
      assets_count: data?.assets_count,
      item_count: data?.item_count,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };
  const { list } = useNavigation();

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
        render: (value: string, record: ICategoryRequest) => (
          <TextField
            value={value ? value : ""}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
            onClick={() => {
              {
                record.category_type === "Asset"
                  ? list(`assets?category_id=${record.id}`)
                  : record.category_type === "Consumable"
                    ? list(`consumables?category_id=${record.id}`)
                    : record.category_type === "Accessory"
                      ? list(`accessory?category_id=${record.id}`)
                      : list(`assets?category_id=${record.id}`);
              }
            }}
          />
        ),

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
                      : value === ECategory.TAXTOKEN
                        ? t("category.label.options.taxtoken")
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
      {tableProps.loading ? (
        <>
          <div style={{ paddingTop: "15rem", textAlign: "center" }}>
            <Spin
              tip={`${t("loading")}...`}
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
                {record.item_count > 0 ? (
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
