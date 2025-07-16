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
import { Badge, Checkbox, Image } from "antd";
import "styles/antd.less";
import {
  FileSearchOutlined,
  SyncOutlined,
  CloseOutlined,
  FilterOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ILocationResponse } from "interfaces/location";
import { LocationCreate } from "./create";
import { LocationEdit } from "./edit";
import { LOCATION_API } from "api/baseApi";
import { Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import { LocationSearch } from "./search";
import { trimObjectValues } from "ultils/trimUtils";

export const LocationList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<ILocationResponse>();

  const [searchParams, setSearchParams] = useSearchParams();
  const location_id = searchParams.get("location_id");

  const menuRef = useRef<HTMLDivElement>(null);

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
        const trimmedParams = trimObjectValues(params);
        const { search, name, address, address2, city, state, country } =
          trimmedParams;

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
              address2,
              city,
              state,
              country,
            }),
          }
        );
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
      address2: data?.address2,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      country: data.country,
      currency: data?.currency,
      assets_count: data?.assets_count,
      tools_count: data?.tools_count,
      accessories_count: data?.accessories_count,
      consumables_count: data?.assets_count,
      digital_signatures_count: data?.digital_signatures_count,
      branch_code: data?.branch_code,
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
        key: "branch_code",
        title: t("location.label.field.branch_code"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("branch_code", sorter),
      },
      {
        key: "name",
        title: t("location.label.field.name"),
        render: (value: IHardware, record: any) => (
          <TextField
            value={value ? value : ""}
            onClick={() => {
              if (record.id) {
                list(`location_details?id=${record.id}&name=${record.name}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "assets_count",
        title: t("location.label.field.assets_count"),
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
        key: "tools_count",
        title: t("location.label.field.tools_count"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("tools_count", sorter),
      },
      {
        key: "digital_signatures_count",
        title: t("location.label.field.tax_tokens_count"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder(
          "digital_signatures_count",
          sorter
        ),
      },
      {
        key: "accessories_count",
        title: t("location.label.field.accessories_count"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("accessories_count", sorter),
      },
      {
        key: "consumables_count",
        title: t("location.label.field.consumables_count"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("consumables_count", sorter),
      },
      {
        key: "users_count",
        title: t("location.label.field.users_count"),
        render: (value: number) => <TagField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("users_count", sorter),
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

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

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

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <>
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
                  <Tooltip title={t("buttons.refresh")} color={"#108ee9"}>
                    <SyncOutlined
                      onClick={handleRefresh}
                      style={{ color: "black" }}
                    />
                  </Tooltip>
                </button>
              </div>
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
                  title={t("location.label.title.search_advanced")}
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
                  title={t("location.label.field.resetFilter")}
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
            <Table.Column<ILocationResponse>
              title={t("table.actions")}
              dataIndex="actions"
              render={(_, record) => (
                <Space>
                  <Tooltip
                    title={t("location.label.field.edit")}
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
                      title={t("location.label.field.delete")}
                      color={"red"}
                    >
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
        )}
      </List>
      <MModal
        title={t("location.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <LocationSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
    </>
  );
};
