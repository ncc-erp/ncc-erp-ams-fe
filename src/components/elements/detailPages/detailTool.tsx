import { useTranslate, CrudFilters, HttpError } from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  DateField,
  Space,
  EditButton,
  DeleteButton,
  CloneButton,
  Button,
  ShowButton,
  Tooltip,
  Checkbox,
  useSelect,
  TagField,
} from "@pankod/refine-antd";
import {
  MenuOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import {
  IToolCheckoutRequest,
  IToolFilterVariable,
  IToolResponse,
  IToolResponseCheckin,
  ITool,
} from "interfaces/tool";
import {
  getBGToolAssignedStatusDecription,
  getBGToolStatusDecription,
  getToolAssignedStatusDecription,
  getToolStatusDecription,
} from "utils/tools";
import { filterAssignedStatus } from "utils/assets";

import { Spin } from "antd";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";

import moment from "moment";
import { IStatusLabel } from "interfaces/statusLabel";
import {
  STATUS_LABELS_API,
  TOOLS_API,
  TOOLS_CATEGORIES_API,
  SUPPLIERS_API,
  TOOLS_TOTAL_DETAIL_API,
} from "api/baseApi";
import { ToolSearch } from "pages/tools/search";
import { ToolEdit } from "pages/tools/edit";
import { ToolShow } from "pages/tools/show";
import { ToolClone } from "pages/tools/clone";
import { ToolCheckout } from "pages/tools/checkout";
import { ToolCheckin } from "pages/tools/checkin";
import { TotalDetail } from "components/elements/TotalDetail";

const defaultCheckedList = [
  "id",
  "name",
  "supplier",
  "status_label",
  "assigned_status",
  "assigned_to",
];

interface ICheckboxChange {
  key: string;
}

type detailToolProps = {
  id_name: string;
};

export const DetailsTool = (props: detailToolProps) => {
  const t = useTranslate();
  const menuRef = useRef(null);
  const { id_name } = props;
  const [loading, setLoading] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);

  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detailEdit, setDetailEdit] = useState<IToolResponse>();

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [isCheckoutToolModalVisible, setIsCheckoutToolModalVisible] =
    useState(false);
  const [detailCheckout, setDetailCheckout] = useState<IToolCheckoutRequest>();

  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [detailClone, setDetailClone] = useState<IToolResponse>();

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] = useState<IToolResponseCheckin>();

  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const searchParam = searchParams.get("search");
  const type_id = searchParams.get("id");

  const [listening, setListening] = useState(false);
  const listenForOutsideClicks = (
    listening: boolean,
    setListening: (arg0: boolean) => void,
    menuRef: { current: any },
    setIsActive: (arg0: boolean) => void
  ) => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);
    [`click`, `touchstart`].forEach(() => {
      document.addEventListener(`click`, (event) => {
        const current = menuRef.current;
        const node = event.target;
        if (current && current.contains(node)) return;
        setIsActive(false);
      });
    });
  };

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<IToolResponse, HttpError, IToolFilterVariable>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      permanentFilter: [
        {
          field: id_name,
          operator: "eq",
          value: type_id,
        },
      ],
      resource: TOOLS_API,
      onSearch: (params) => {
        const filters: CrudFilters = [];
        const { name, key, category, purchase_date, expiration_date } = params;
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: searchParam,
          },
          {
            field: "filter",
            operator: "eq",
            value: JSON.stringify({
              name,
              key,
              category,
            }),
          },
          {
            field: "purchaseDateFrom",
            operator: "eq",
            value: purchase_date
              ? purchase_date[0].format().substring(0, 10)
              : undefined,
          },
          {
            field: "purchaseDateTo",
            operator: "eq",
            value: purchase_date
              ? purchase_date[1].format().substring(0, 10)
              : undefined,
          },
          {
            field: "expirationDateFrom",
            operator: "eq",
            value: expiration_date
              ? expiration_date[0].format().substring(0, 10)
              : undefined,
          },
          {
            field: "expirationDateTo",
            operator: "eq",
            value: expiration_date
              ? expiration_date[1].format().substring(0, 10)
              : undefined,
          },
          {
            field: "category_id",
            operator: "eq",
            value: category ? category : category_id,
          }
        );
        return filters;
      },
    });

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const { selectProps: categorySelectProps } = useSelect<ITool>({
    resource: TOOLS_CATEGORIES_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const filterCategory = categorySelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { selectProps: suppliersSelectProps } = useSelect<ITool>({
    resource: SUPPLIERS_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const filterSuppliers = suppliersSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { selectProps: statusLabelSelectProps } = useSelect<IStatusLabel>({
    resource: STATUS_LABELS_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const filterStatus_Label = statusLabelSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: t("tools.label.field.name"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "supplier",
        title: t("tools.label.field.supplier"),
        render: (value: ITool) => <TextField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("supplier", sorter),
        filters: filterSuppliers,
        onFilter: (value: number, record: IToolResponse) => {
          return record.supplier.id === value;
        },
      },
      {
        key: "location",
        title: t("tools.label.field.location"),
        render: (value: ITool) => <TextField value={value && value.name} />,
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "category",
        title: t("tools.label.field.category"),
        render: (value: ITool) => <TagField value={value ? value.name : ""} />,
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "purchase_date",
        title: t("tools.label.field.purchase_date"),
        render: (value: ITool) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
      },
      {
        key: "expiration_date",
        title: t("tools.label.field.expiration_date"),
        render: (value: ITool) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("expiration_date", sorter),
      },
      {
        key: "purchase_cost",
        title: t("tools.label.field.purchase_cost"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
      },
      {
        key: "qty",
        title: t("tools.label.field.qty"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("qty", sorter),
      },
      {
        key: "status_label",
        title: t("tools.label.field.status"),
        render: (value: IToolResponse) => (
          <TagField
            value={getToolStatusDecription(value)}
            style={{
              background: getBGToolStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("status_label", sorter),
        filters: filterStatus_Label,
        onFilter: (value: number, record: IToolResponse) => {
          return record.status_label.id === value;
        },
      },
      {
        key: "assigned_status",
        title: t("tools.label.field.assigned_status"),
        render: (value: number) => (
          <TagField
            value={getToolAssignedStatusDecription(value)}
            style={{
              background: getBGToolAssignedStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
        filters: filterAssignedStatus,
        onFilter: (value: number, record: IToolResponse) =>
          record.assigned_status === value,
      },
      {
        key: "assigned_to",
        title: t("tools.label.field.checkoutTo"),
        render: (value: string, record: IToolResponse) => (
          <TextField
            value={record.assigned_to ? record.assigned_to.username : ""}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to", sorter),
      },
      {
        key: "checkout_counter",
        title: t("tools.label.field.checkout_counter"),
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("tools.label.field.checkin_counter"),
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "notes",
        title: t("tools.label.field.notes"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
    ],
    [filterCategory, filterSuppliers, filterStatus_Label]
  );

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_tools_selected") !== null
      ? JSON.parse(localStorage.getItem("item_tools_selected") as string)
      : defaultCheckedList
  );

  const onCheckItem = (value: ICheckboxChange) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };

  const edit = (data: IToolResponse) => {
    const dataConvert: IToolResponse = {
      id: data.id,
      name: data.name,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      assigned_to: data?.assigned_to,
      purchase_date: {
        date: data?.purchase_date.date,
        formatted: data?.purchase_date.formatted,
      },
      purchase_cost: data?.purchase_cost,
      expiration_date: {
        date: data?.expiration_date.date,
        formatted: data?.expiration_date.formatted,
      },
      supplier: {
        id: data?.supplier.id,
        name: data?.supplier.name,
      },
      location: {
        id: data?.location.id,
        name: data?.location.name,
      },
      category: {
        id: data?.category.id,
        name: data?.category.name,
      },
      last_checkout: {
        datetime: "",
        formatted: "",
      },
      checkin_date: {
        datetime: "",
        formatted: "",
      },
      notes: data?.notes,
      user_can_checkout: false,
      user_can_checkin: false,
      checkout_counter: 0,
      checkin_counter: 0,
      assigned_status: data?.assigned_status,
      withdraw_from: data?.withdraw_from,
      created_at: {
        datetime: "",
        formatted: "",
      },
      updated_at: {
        datetime: "",
        formatted: "",
      },
      qty: data?.qty,
    };
    setDetailEdit(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IToolResponse) => {
    const dataConvert: IToolResponse = {
      id: data.id,
      name: data.name,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      assigned_to: data?.assigned_to,
      purchase_date: {
        date: data?.purchase_date.date,
        formatted: data?.purchase_date.formatted,
      },
      purchase_cost: data?.purchase_cost,
      expiration_date: {
        date: data?.expiration_date.date,
        formatted: data?.expiration_date.formatted,
      },
      supplier: {
        id: data?.supplier.id,
        name: data?.supplier.name,
      },
      last_checkout: {
        datetime: "",
        formatted: "",
      },
      checkin_date: {
        datetime: "",
        formatted: "",
      },
      notes: data?.notes,
      user_can_checkout: false,
      user_can_checkin: false,
      withdraw_from: data?.withdraw_from,
      checkout_counter: 0,
      checkin_counter: 0,
      assigned_status: data?.assigned_status,
      created_at: {
        datetime: "",
        formatted: "",
      },
      updated_at: {
        datetime: "",
        formatted: "",
      },
      location: {
        id: data?.location.id,
        name: data?.location.name,
      },
      category: {
        id: data?.category.id,
        name: data?.category.name,
      },
      qty: data?.qty,
    };

    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);
  };

  const checkout = (data: IToolResponse) => {
    const dataConvert: IToolCheckoutRequest = {
      id: data.id,
      name: data.name,
      checkout_at: {
        datetime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      assigned_to: "",
      notes: "",
    };
    setDetailCheckout(dataConvert);
    setIsCheckoutToolModalVisible(true);
  };

  const checkin = (data: IToolResponse) => {
    const dataConvert: IToolResponseCheckin = {
      id: data?.id,
      name: data?.name,
      assigned_to: data?.assigned_to,
      status_label: data?.status_label,
      checkin_at: {
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      user_can_checkout: false,
      notes: "",
    };
    setDetailCheckin(dataConvert);
    setIsCheckinModalVisible(true);
  };

  const show = (data: IToolResponse) => {
    setIsShowModalVisible(true);
    setDetailEdit(data);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
    setIsTotalDetailReload(!isTotalDetailReload);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    handleOpenSearchModel();
  };

  const handleOpenSearchModel = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };

  useEffect(() => {
    localStorage.setItem(
      "item_tools_selected",
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  useEffect(() => {
    localStorage.removeItem("selectedToolsRowKeys");
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutToolModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  return (
    <List title={t("tools.label.title.tool")}>
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
                  title={t("tools.label.tooltip.refresh")}
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
                  title={t("tools.label.tooltip.columns")}
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
                title={t("tools.label.tooltip.search")}
                color={"#108ee9"}
              >
                <FileSearchOutlined
                  onClick={handleSearch}
                  style={{ color: "black" }}
                />
              </Tooltip>
            </button>
          </div>
        </div>
      </div>

      <MModal
        title={t("tools.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <ToolSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
      <MModal
        title={t("tools.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <ToolEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detailEdit}
        />
      </MModal>

      <MModal
        title={t("tools.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <ToolShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detailEdit}
        />
      </MModal>

      <MModal
        title={t("tools.label.title.checkout")}
        setIsModalVisible={setIsCheckoutToolModalVisible}
        isModalVisible={isCheckoutToolModalVisible}
      >
        <ToolCheckout
          isModalVisible={isCheckoutToolModalVisible}
          setIsModalVisible={setIsCheckoutToolModalVisible}
          data={detailCheckout}
        />
      </MModal>
      <MModal
        title={t("tools.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <ToolCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
        />
      </MModal>
      <MModal
        title={t("tools.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <ToolClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
        />
      </MModal>

      <TotalDetail
        filters={filters}
        links={`${TOOLS_TOTAL_DETAIL_API}?${id_name}=${type_id}`}
        isReload={isTotalDetailReload}
      ></TotalDetail>
      {loading ? (
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
          scroll={{ x: 1500 }}
          pagination={{
            position: ["topRight", "bottomRight"],
            total: pageTotal ? pageTotal : 0,
          }}
        >
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column
                dataIndex={col.key}
                {...(col as any)}
                key={col.key}
                sorter
              />
            ))}
          <Table.Column<IToolResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("tools.label.tooltip.viewDetail")}
                  color={"#108ee9"}
                >
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => show(record)}
                  />
                </Tooltip>

                <Tooltip
                  title={t("tools.label.tooltip.clone")}
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
                  title={t("tools.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>

                <Tooltip title={t("tools.label.tooltip.delete")} color={"red"}>
                  <DeleteButton
                    resourceName={TOOLS_API}
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onSuccess={() => {
                      setIsTotalDetailReload(!isTotalDetailReload);
                    }}
                  />
                </Tooltip>
                {record.user_can_checkout && (
                  <Button
                    className="ant-btn-checkout"
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => checkout(record)}
                  >
                    {t("tools.label.button.checkout")}
                  </Button>
                )}
                {record.user_can_checkin === true && (
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => checkin(record)}
                  >
                    {t("tools.label.button.checkin")}
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
