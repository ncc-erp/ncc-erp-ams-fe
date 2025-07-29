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
  DateField,
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";
import { Spin } from "antd";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ManufacturesCreate } from "./create";
import { ManufacturesEdit } from "./edit";
import { IManufacturesResponse } from "interfaces/manufacturers";
import { MANUFACTURES_API, MANUFACTURES_TOTAL_DETAIL_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
import { TotalDetail } from "components/elements/TotalDetail";

export const ManufacturesList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IManufacturesResponse>();
  const [searchParams] = useSearchParams();
  const manufacturer_id = searchParams.get("manufacturer_id");

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
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
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search,
          },
          {
            field: "manufacturer_id",
            operator: "eq",
            value: manufacturer_id,
          }
        );
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
        title: t("manufactures.label.field.name"),
        render: (value: IHardware, record: IManufacturesResponse) => (
          <TextField
            value={value ? value : ""}
            onClick={() => {
              if (record.id) {
                list(
                  `manufactures_details?id=${record.id}&name=${record.name}`
                );
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
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
      <TotalDetail
        filters={filters}
        links={MANUFACTURES_TOTAL_DETAIL_API}
        isReload={false}
      ></TotalDetail>
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
          scroll={{ x: 1100 }}
        >
          {collumns.map((col) => (
            <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
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
