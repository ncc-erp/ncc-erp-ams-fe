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

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: t("supplier.label.field.name"),
        render: (value: ISupplier, record: any) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }}
            onClick={() => {
              if (record.id) {
                list(`supplier_details?id=${record.id}&name=${record.name}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
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
        key: "phone",
        title: t("supplier.label.field.phone"),
        render: (value: ISupplier) => <TextField value={value} />,
      },
      {
        key: "email",
        title: t("supplier.label.field.email"),
        render: (value: ISupplier) => <TextField value={value} />,
      },
      {
        key: "contact",
        title: t("supplier.label.field.contact"),
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
      {
        key: "consumables_count",
        title: t("supplier.label.field.consumables"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "tools_count",
        title: t("supplier.label.field.tools"),
        render: (value: number) => <TagField value={value} />,
      },
      {
        key: "digital_signatures_count",
        title: t("supplier.label.field.tax_tokens"),
        render: (value: number) => <TagField value={value} />,
      },
    ],
    []
  );

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
        <div className="other_function">
          <div className="menu-container" ref={menuRef}>
            <div>
              <button
                className="menu-trigger"
                style={{
                  borderTopLeftRadius: "3px",
                  borderBottomLeftRadius: "3px",
                }}
              >
                <Tooltip
                  title={t("supplier.label.tooltip.refresh")}
                  color={"#108ee9"}
                >
                  <SyncOutlined
                    onClick={handleRefresh}
                    style={{ color: "black" }}
                  />
                </Tooltip>
              </button>
            </div>
            <div>
              <button onClick={onClickDropDown} className="menu-trigger">
                <Tooltip
                  title={t("supplier.label.tooltip.columns")}
                  color={"#108ee9"}
                >
                  <MenuOutlined style={{ color: "black" }} />
                </Tooltip>
              </button>
            </div>
            <nav className={`menu ${isActive ? "active" : "inactive"}`}>
              <div className="menu-dropdown">
                {collumns.map((item) => (
                  <Checkbox
                    className="checkbox"
                    key={item.key}
                    onChange={() => onCheckItem(item)}
                    checked={collumnSelected.includes(item.key)}
                  >
                    {item.title}
                  </Checkbox>
                ))}
              </div>
            </nav>
          </div>
          <div>
            <button
              className="menu-trigger"
              style={{
                borderTopRightRadius: "3px",
                borderBottomRightRadius: "3px",
              }}
            >
              <Tooltip
                title={t("supplier.label.tooltip.search_advanced")}
                color={"#108ee9"}
              >
                <FileSearchOutlined
                  onClick={handleOpenSearchModal}
                  style={{ color: "black" }}
                />
              </Tooltip>
            </button>
          </div>
          <div>
            <button
              className="menu-trigger"
              onClick={() => handleResetFilter()}
            >
              <Tooltip
                title={t("supplier.label.tooltip.resetFilter")}
                color="#108ee9"
              >
                <Badge
                  count={
                    <CloseOutlined style={{ fontSize: 8, color: "white" }} />
                  }
                  size="small"
                  offset={[-5, 5]}
                  style={{
                    backgroundColor: "#ff4d4f",
                    boxShadow: "0 0 0 1px white",
                  }}
                >
                  <FilterOutlined style={{ fontSize: 15, color: "black" }} />
                </Badge>
              </Tooltip>
            </button>
          </div>
        </div>
      </div>
      <MModal
        title={t("supplier.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <SupplierSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
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
