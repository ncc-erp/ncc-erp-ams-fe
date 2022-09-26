/* eslint-disable react-hooks/exhaustive-deps */
import { Image, Tooltip } from "antd";
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
  CreateButton,
  TagField,
} from "@pankod/refine-antd";
import { Spin } from "antd";

import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ISupplier, ISupplierRequest } from "interfaces/supplier";
import { SupplierCreate } from "./create";
import { SupplierEdit } from "./edit";
import { SUPPLIERS_API } from "api/baseApi";

export const SupplierList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ISupplierRequest>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<ISupplier>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: SUPPLIERS_API,
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
        key: "name",
        title: t("supplier.label.field.name"),
        render: (value: ISupplier) => (
          <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: t("supplier.label.field.images"),
        render: (value: string) => {
          return value ? <Image width={50} height={"auto"} src={value} /> : "";
        },
      },
      {
        key: "address",
        title: t("supplier.label.field.address"),
        render: (value: ISupplier) => <TextField value={value} />,
      },

      {
        key: "assets_count",
        title: t("supplier.label.field.assets"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "accessories_count",
        title: t("supplier.label.field.accessories"),
        render: (value: number) => <TagField value={value} />,
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

  const edit = (data: ISupplierRequest) => {
    const dataConvert: ISupplierRequest = {
      id: data.id,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zip: data.zip,
      contact: data.contact,
      phone: data.phone,
      fax: data.fax,
      email: data.email,
      url: data.url,
      notes: data.notes !== "null" ? data.notes : "",
      image: data.image,
      assets_count: data.assets_count,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
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
      title={t("supplier.label.title.supplier")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("supplier.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
      </div>
      <MModal
        title={t("supplier.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <SupplierCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("supplier.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <SupplierEdit
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
          <Table.Column<ISupplierRequest>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("supplier.label.tooltip.edit")}
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
                    title={t("supplier.label.tooltip.delete")}
                    color={"#d73925"}
                  >
                    <DeleteButton
                      resourceName={SUPPLIERS_API}
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
