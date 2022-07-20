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

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ILocationResponse } from "interfaces/location";
import { LocationCreate } from "./create";
import { LocationEdit } from "./edit";
import { LOCATION_API } from "api/baseApi";

export const LocationList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ILocationResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<ILocationResponse>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: LOCATION_API,
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

  const edit = (data: ILocationResponse) => {
    const dataConvert: ILocationResponse = {
      id: data.id,
      name: data.name,
      image: data?.image,
      parent: {
        id: data.parent !== null ? data.parent.id : 0,
        name: data.parent !== null ? data.parent.name : "",
      },
      manager: {
        id: data.manager !== null ? data.manager.id : 0,
        name: data.manager !== null ? data.manager.name : "",
      },
      address: data?.address,
      city: data?.city,
      state: data?.state,
      zip: data?.zip,
      country: data.country,
      currency: data?.currency,
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
        title: t("location.label.field.name"),
        render: (value: IHardware) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: t("location.label.field.imageTable"),
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
        title: t("location.label.field.assetCount"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
      },

      {
        key: "assigned_assets_count",
        title: t("location.label.field.assetAssign"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("assigned_assets_count", sorter),
      },
      {
        key: "created_at",
        title: t("location.label.field.dateCreate"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
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

  return (
    <List
      title={t("location.label.title.nameTitle")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("location.label.field.create")}
          </CreateButton>
        ),
      }}
    >
      <TableAction searchFormProps={searchFormProps} />
      <MModal
        title={t("location.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <LocationCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("location.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <LocationEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>

      <Table {...tableProps} rowKey="id">
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<ILocationResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Tooltip title={t("location.label.field.edit")} color={"#108ee9"}>
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
                <Tooltip title={t("location.label.field.delete")} color={"red"}>
                  <DeleteButton
                    resourceName={LOCATION_API}
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
    </List>
  );
};