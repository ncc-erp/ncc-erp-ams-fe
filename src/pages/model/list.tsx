import { IModel } from "@antv/l7-core";
import { Tooltip } from "antd";
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
  CloneButton,
  EditButton,
  DeleteButton,
  CreateButton,
  TagField,
} from "@pankod/refine-antd";
import { Spin } from "antd";

import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ModelCreate } from "./create";
import { IModelResponse } from "interfaces/model";
import { ModelEdit } from "./edit";
import { ModelClone } from "./clone";
import { MODELS_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";

export const ModelList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IModelResponse>();
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [detailClone, setDetailClone] = useState<IModelResponse>();

  const [searchParms] = useSearchParams();
  const model_id = searchParms.get("model_id");

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IModel>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: MODELS_API,
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
            field: "model_id",
            operator: "eq",
            value: model_id,
          }
        );
        return filters;
      },
    });

  const { list } = useNavigation();

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: t("model.label.field.name"),
        render: (value: IModel, record: IModelResponse) => (
          <TextField
            value={value}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
            onClick={() => {
              {
                list(`assets?model_id=${record.id}`);
              }
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "manufacturer",
        title: t("model.label.field.manufacturer"),
        render: (value: IModelResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer", sorter),
      },
      {
        key: "category",
        title: t("model.label.field.category"),
        render: (value: IModelResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category", sorter),
      },

      {
        key: "assets_count",
        title: t("model.label.field.assets"),
        render: (value: number) => <TagField value={value} />,
        defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
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

  const edit = (data: IModelResponse) => {
    const dataConvert: IModelResponse = {
      id: data.id,
      name: data.name,
      manufacturer: {
        id: data?.manufacturer?.id,
        name: data?.manufacturer?.name,
      },
      category: {
        id: data?.category.id,
        name: data?.category.name,
      },
      notes: data?.notes,
      requestable: data?.requestable,
      assets_count: data?.assets_count,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IModelResponse) => {
    const dataConvert: IModelResponse = {
      id: data.id,
      name: data.name,
      manufacturer: {
        id: data?.manufacturer?.id,
        name: data?.manufacturer?.name,
      },
      category: {
        id: data?.category.id,
        name: data?.category.name,
      },
      notes: data?.notes,
      requestable: data?.requestable,
      assets_count: data?.assets_count,
    };

    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible]);

  return (
    <List
      title={t("model.label.title.model")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("model.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
      </div>
      <MModal
        title={t("model.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <ModelCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("model.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <ModelEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("model.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <ModelClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
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
          {...tableProps}
          rowKey="id"
          pagination={{
            position: ["topRight", "bottomRight"],
            total: pageTotal ? pageTotal : 0,
          }}
        >
          {collumns.map((col) => (
            <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
          ))}
          <Table.Column<IModelResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("model.label.tooltip.clone")}
                  color={"#108ee9"}
                >
                  <CloneButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => clone(record)}
                  />
                </Tooltip>
                <Tooltip
                  title={t("model.label.tooltip.edit")}
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
                    title={t("model.label.tooltip.delete")}
                    color={"#d73925"}
                  >
                    <DeleteButton
                      resourceName={MODELS_API}
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
