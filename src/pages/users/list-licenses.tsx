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
  DateField,
  Space,
  ShowButton,
  TagField,
  Tooltip,
  Spin,
} from "@pankod/refine-antd";
import { SyncOutlined } from "@ant-design/icons";
import { TableAction } from "components/elements/tables/TableAction";
import { useRef, useState } from "react";
import { ASSIGN_LICENSES_API } from "api/baseApi";
import type { ColumnsType } from "antd/es/table";
import { ILicensesResponse } from "interfaces/license";
import { MModal } from "components/Modal/MModal";
import { LicensesUserShow } from "./show-licenses";
import { IModelSoftware } from "interfaces/software";
import { IModel } from "interfaces/model";

export const UserListLicenses: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const menuRef = useRef(null);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detail, setDetail] = useState<ILicensesResponse>();
  const [loading, setLoading] = useState(false);

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<ILicensesResponse>({
      initialSorter: [
        {
          field: "checkout_at",
          order: "desc",
        },
      ],
      resource: ASSIGN_LICENSES_API,
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

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const collumns: ColumnsType<ILicensesResponse> = [
    {
      key: "id",
      title: "ID",
      render: (value: number) => <TextField value={value ? value : ""} />,
      defaultSortOrder: getDefaultSortOrder("name", sorter),
    },
    {
      key: "licenses",
      title: t("licenses.label.field.licenses"),
      render: (value: string) => <TextField value={value ? value : ""} />,
      defaultSortOrder: getDefaultSortOrder("licenses", sorter),
    },
    {
      key: "software",
      title: t("licenses.label.field.software"),
      render: (value: IModelSoftware) => (
        <TextField value={value ? value.name : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("software", sorter),
    },
    {
      key: "category",
      title: t("licenses.label.field.category"),
      render: (value: IModel) => <TagField value={value ? value.name : ""} />,
      defaultSortOrder: getDefaultSortOrder("category", sorter),
    },
    {
      key: "manufacturer",
      title: t("licenses.label.field.manufacturer"),
      render: (value: IModel) => <TagField value={value ? value.name : ""} />,
      defaultSortOrder: getDefaultSortOrder("manufacturer", sorter),
    },
    {
      key: "purchase_date",
      title: t("licenses.label.field.purchase_date"),
      render: (value: any) =>
        value ? <DateField format="LLL" value={value ? value.date : ""} /> : "",
      defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
    },
    {
      key: "expiration_date",
      title: t("licenses.label.field.expiration_date"),
      render: (value: any) =>
        value ? <DateField format="LLL" value={value ? value.date : ""} /> : "",
      defaultSortOrder: getDefaultSortOrder("expiration_date", sorter),
    },
    {
      key: "checkout_at",
      title: t("licenses.label.field.checkout_at"),
      render: (value: any) => (
        <DateField format="LLL" value={value ? value.datetime : ""} />
      ),
      defaultSortOrder: getDefaultSortOrder("checkout_at", sorter),
    },
    {
      key: "notes",
      title: t("licenses.label.field.notes"),
      render: (value: any) => <TextField value={value ? value : ""} />,
      defaultSortOrder: getDefaultSortOrder("notes", sorter),
    },
  ];

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 2000);
  };

  const show = (data: ILicensesResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  return (
    <List title={t("licenses.label.title.my-licenses")}>
      <div className="sum-assets">
        <span className="name-sum-assets">
          {t("licenses.label.title.sum-licenses")}
        </span>{" "}
        : {tableProps.pagination ? tableProps.pagination?.total : 0}
      </div>
      <div className="users">
        <div
          className={pageTotal === 0 ? "list-users-noTotalPage" : "list-users"}
        ></div>
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
                    title={t("licenses.label.tooltip.refresh")}
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
          </div>
        </div>
      </div>

      <MModal
        title={t("user.label.title.detail_licenses")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <LicensesUserShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
          isModalVisible={isShowModalVisible}
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
          {collumns.map((col, index) => (
            <Table.Column
              key={index}
              dataIndex={col.key}
              {...(col as ColumnsType)}
              sorter
            />
          ))}
          <Table.Column<any>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("licenses.label.tooltip.viewDetail")}
                  color={"#108ee9"}
                >
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => show(record)}
                  />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
