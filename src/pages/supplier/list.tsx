import { Badge, Checkbox, Image, Tooltip } from "antd";
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
  CreateButton,
  TagField,
} from "@pankod/refine-antd";
import { Spin } from "antd";

import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ISupplier, ISupplierRequest } from "interfaces/supplier";
import { SupplierCreate } from "./create";
import { SupplierEdit } from "./edit";
import { SUPPLIERS_API } from "api/baseApi";
import { SupplierSearch } from "./search";
import {
  FileSearchOutlined,
  SyncOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { MenuOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { trimObjectValues } from "ultils/trimUtils";
import { getSupplierColumns } from "./column";
import { SupplierListToolbar } from "./list-toolbar";
import { SupplierModal } from "./modal";

const defaultCheckedList = [
  "name",
  "image",
  "address",
  "assets_count",
  "accessories_count",
  "consumables_count",
  "tools_count",
  "digital_signatures_count",
];
export const SupplierList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ISupplierRequest>();
  const [isActive, setIsActive] = useState(false);
  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_suppliers_selected") !== null
      ? JSON.parse(localStorage.getItem("item_suppliers_selected") as string)
      : defaultCheckedList
  );
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
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
        const trimmedParams = trimObjectValues(params);
        const { search, name, address, phone, email, contact } = trimmedParams;

        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search,
          },
          {
            field: "filter",
            operator: "eq",
            value: JSON.stringify({
              name,
              address,
              phone,
              email,
              contact,
            }),
          }
        );
        return filters;
      },
    });

  const { list } = useNavigation();

  const collumns = getSupplierColumns({
    t,
    list,
    getDefaultSortOrder,
    sorter,
  });

  const handleCreate = () => {
    handleOpenModel();
  };

  const handleOpenSearchModal = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };
  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const onCheckItem = (item: any) => {
    const newCheckedList = [...collumnSelected];
    if (newCheckedList.includes(item.key)) {
      newCheckedList.splice(newCheckedList.indexOf(item.key), 1);
    } else {
      newCheckedList.push(item.key);
    }
    setColumnSelected(newCheckedList);
    localStorage.setItem(
      "item_suppliers_selected",
      JSON.stringify(newCheckedList)
    );
  };

  const handleResetFilter = () => {
    localStorage.removeItem("search");

    searchParams.delete("search");
    setSearchParams(searchParams);

    searchFormProps.form?.resetFields();
    searchFormProps.form?.setFieldsValue({
      search: undefined,
    });

    setTimeout(() => {
      searchFormProps.form?.submit();
    }, 0);
  };

  const handleOpenModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const edit = (data: ISupplierRequest) => {
    const dataConvert: ISupplierRequest = {
      id: data.id,
      name: data.name,
      address: data.address,
      contact: data.contact,
      phone: data.phone,
      assets_count: data.assets_count,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    localStorage.setItem(
      "item_suppliers_selected",
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

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
        <SupplierListToolbar
          t={t}
          menuRef={menuRef}
          handleRefresh={handleRefresh}
          handleOpenSearchModal={handleOpenSearchModal}
          handleResetFilter={handleResetFilter}
          onClickDropDown={onClickDropDown}
          isActive={isActive}
          collumns={collumns}
          onCheckItem={onCheckItem}
          collumnSelected={collumnSelected}
        />
      </div>
      <SupplierModal
        t={t}
        isSearchModalVisible={isSearchModalVisible}
        setIsSearchModalVisible={setIsSearchModalVisible}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        searchFormProps={searchFormProps}
        isEditModalVisible={isEditModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
        detail={detail}
      />

      {tableProps.loading || loading ? (
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
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
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
