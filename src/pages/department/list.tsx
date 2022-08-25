/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "antd";
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
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { DepartmentCreate } from "./create";
import { DEPARTMENT_API } from "api/baseApi";
import { IDepartment, IDepartmentResponse } from "interfaces/department";
import { DepartmentEdit } from "./edit";
import { Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";

export const DepartmentList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IDepartmentResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IDepartment>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: DEPARTMENT_API,
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
        title: t("department.label.field.name"),
        render: (value: IDepartment) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "manager",
        title: t("department.label.field.manager"),
        render: (value: IDepartment) => (
          <TextField value={value ? value.name : ""} />
        ),
      },
      {
        key: "users_count",
        title: t("department.label.field.user"),
        render: (value: IDepartment) => <TagField value={value} />,
      },
      {
        key: "location",
        title: t("department.label.field.location"),
        render: (value: IDepartment) => (
          <TextField value={value ? value.name : ""} />
        ),
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

  const edit = (data: IDepartmentResponse) => {
    const dataConvert: IDepartmentResponse = {
      id: data.id,
      name: data.name,
      image: data.image,
      company: {
        id: data?.company?.id,
        name: data?.company?.name,
      },
      manager: {
        id: data?.manager?.id,
        name: data?.manager?.name,
      },
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      users_count: data?.users_count,
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
      title={t("department.label.title.department")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("department.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
      </div>
      <MModal
        title={t("department.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <DepartmentCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("department.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <DepartmentEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>

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
        <Table.Column<IDepartmentResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Tooltip
                title={t("department.label.tooltip.edit")}
                color={"#108ee9"}
              >
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => edit(record)}
                />
              </Tooltip>
              {record.users_count > 0 ? (
                <DeleteButton hideText size="small" disabled />
              ) : (
                <Tooltip
                  title={t("department.label.tooltip.delete")}
                  color={"#d73925"}
                >
                  <DeleteButton
                    resourceName={DEPARTMENT_API}
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
