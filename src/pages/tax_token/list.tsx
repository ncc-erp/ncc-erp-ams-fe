import {
  FileSearchOutlined,
  MenuOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  CloneButton,
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  Form,
  getDefaultSortOrder,
  List,
  ShowButton,
  Space,
  Table,
  TagField,
  TextField,
  Tooltip,
  useSelect,
  useTable,
} from "@pankod/refine-antd";
import {
  CrudFilters,
  HttpError,
  IResourceComponentsProps,
  useTranslate,
} from "@pankod/refine-core";
import { DatePicker, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  STATUS_LABELS_API,
  SUPPLIERS_API,
  TAX_TOKEN_API,
  TAX_TOKEN_TOTAL_DETAIL_API,
} from "api/baseApi";
import { TableAction } from "components/elements/tables/TableAction";
import { TotalDetail } from "components/elements/TotalDetail";
import { MModal } from "components/Modal/MModal";
import { dateFormat } from "constants/assets";
import { useAppSearchParams } from "hooks/useAppSearchParams";
import { ITaxTokenListSearchParams } from "hooks/useAppSearchParams/types";
import { useRowSelection } from "hooks/useRowSelection";
import { IModel } from "interfaces/model";
import { IStatusLabel } from "interfaces/statusLabel";
import {
  ITaxToken,
  ITaxTokenFilterVariables,
  ITaxTokenRequestCheckout,
  ITaxTokenResponse,
  ITaxTokenResponseCheckin,
} from "interfaces/tax_token";
import { filterAssignedStatus } from "utils/assets";
import {
  getBGTaxTokenAssignedStatusDecription,
  getBGTaxTokenStatusDecription,
  getTaxTokenAssignedStatusDecription,
  getTaxTokenStatusDecription,
} from "utils/tax_token";
import { TaxTokenCheckin } from "./checkin";
import { TaxTokenCheckinMultiple } from "./checkin-multiple";
import { TaxTokenCheckout } from "./checkout";
import { TaxTokenCheckoutMultiple } from "./checkout-multiple";
import { TaxTokenClone } from "./clone";
import { TaxTokenCreate } from "./create";
import { TaxTokenEdit } from "./edit";
import { TaxTokenSearch } from "./search";
import { TaxTokenShow } from "./show";

const defaultCheckedList = [
  "id",
  "name",
  "seri",
  "supplier",
  "status_label",
  "assigned_status",
  "assigned_to",
];

interface ICheckboxChange {
  key: string;
}

export const TaxTokenList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);

  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [detailClone, setDetailClone] = useState<ITaxTokenResponse>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detailEdit, setDetailEdit] = useState<ITaxTokenResponse>();

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [detailCheckout, setDetailCheckout] =
    useState<ITaxTokenRequestCheckout>();

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<ITaxTokenResponseCheckin>();

  const [
    isCheckoutManyTaxTokenModalVisible,
    setIsCheckoutManyTaxTokenModalVisible,
  ] = useState(false);
  const [
    isCheckinManyTaxTokenModalVisible,
    setIsCheckinManyTaxTokenModalVisible,
  ] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState<boolean>(true);
  const [selectedCheckin, setSelectedCheckin] = useState<boolean>(true);
  const [selectdStoreCheckout, setSelectdStoreCheckout] = useState<any[]>([]);
  const [selectdStoreCheckin, setSelectdStoreCheckin] = useState<any[]>([]);

  const {
    params: {
      search: searchParam,
      purchaseDateFrom: purchaseDateFromParam,
      purchaseDateTo: purchaseDateToParam,
      expirationDateFrom: expirationDateFromParam,
      expirationDateTo: expirationDateToParam,
    },
    setParams,
    clearParam,
  } = useAppSearchParams("taxTokenList");

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
    useTable<ITaxTokenResponse, HttpError, ITaxTokenFilterVariables>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: TAX_TOKEN_API,
      onSearch: (params) => {
        const filters: CrudFilters = [];
        const { name, seri, supplier, purchase_date, expiration_date } = params;
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
              seri,
              supplier,
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
          }
        );
        return filters;
      },
    });

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const { selectProps: suppliersSelectProps } = useSelect<IModel>({
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
        title: t("tax_token.label.field.name"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "seri",
        title: t("tax_token.label.field.seri"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("seri", sorter),
      },
      {
        key: "supplier",
        title: t("tax_token.label.field.supplier"),
        render: (value: IModel) => <TextField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("supplier", sorter),
        filters: filterSuppliers,
        onFilter: (value: number, record: ITaxTokenResponse) => {
          return record.supplier.id === value;
        },
      },
      {
        key: "location",
        title: t("tax_token.label.field.location"),
        render: (value: ITaxToken) => <TextField value={value && value.name} />,
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "category",
        title: t("tax_token.label.field.category"),
        render: (value: ITaxToken) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "purchase_date",
        title: t("tax_token.label.field.purchase_date"),
        render: (value: ITaxToken) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date", sorter),
      },
      {
        key: "expiration_date",
        title: t("tax_token.label.field.expiration_date"),
        render: (value: ITaxToken) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("expiration_date", sorter),
      },
      {
        key: "purchase_cost",
        title: t("tax_token.label.field.purchase_cost"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
      },
      {
        key: "qty",
        title: t("tax_token.label.field.qty"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("qty", sorter),
      },
      {
        key: "warranty_months",
        title: t("tax_token.label.field.warranty_months"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        key: "status_label",
        title: t("tax_token.label.field.status"),
        render: (value: ITaxTokenResponse) => (
          <TagField
            value={getTaxTokenStatusDecription(value)}
            style={{
              background: getBGTaxTokenStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("status_label", sorter),
        filters: filterStatus_Label,
        onFilter: (value: number, record: ITaxTokenResponse) => {
          return record.status_label.id === value;
        },
      },
      {
        key: "assigned_status",
        title: t("tax_token.label.field.assigned_status"),
        render: (value: number) => (
          <TagField
            value={getTaxTokenAssignedStatusDecription(value)}
            style={{
              background: getBGTaxTokenAssignedStatusDecription(value),
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
        filters: filterAssignedStatus,
        onFilter: (value: number, record: ITaxTokenResponse) =>
          record.assigned_status === value,
      },
      {
        key: "assigned_to",
        title: t("tax_token.label.field.checkoutTo"),
        render: (value: string, record: ITaxTokenResponse) => (
          <TextField
            value={record.assigned_to ? record.assigned_to.username : ""}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to", sorter),
      },
      {
        key: "checkout_counter",
        title: t("tax_token.label.field.checkout_counter"),
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("tax_token.label.field.checkin_counter"),
        render: (value: number) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "note",
        title: t("tax_token.label.field.note"),
        render: (value: string) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("note", sorter),
      },
    ],
    [filterSuppliers]
  );

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_tax_token_selected") !== null
      ? JSON.parse(localStorage.getItem("item_tax_token_selected") as string)
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

  const clone = (data: ITaxTokenResponse) => {
    const dataConvert: ITaxTokenResponse = {
      id: data.id,
      name: data.name,
      seri: data.seri,
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
      note: data?.note,
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
      location: {
        id: data?.location.id,
        name: data?.location.name,
      },
      category: {
        id: data?.category.id,
        name: data?.category.name,
      },
      qty: data?.qty,
      warranty_months: data?.warranty_months,
    };

    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);
  };

  const edit = (data: ITaxTokenResponse) => {
    const dataConvert: ITaxTokenResponse = {
      id: data.id,
      name: data.name,
      seri: data.seri,
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
      note: data?.note,
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
      warranty_months: data?.warranty_months,
    };
    setDetailEdit(dataConvert);
    setIsEditModalVisible(true);
  };

  const show = (data: ITaxTokenResponse) => {
    setIsShowModalVisible(true);
    setDetailEdit(data);
  };

  const checkout = (data: ITaxTokenResponse) => {
    const dataConvert: ITaxTokenRequestCheckout = {
      id: data?.id,
      name: data?.name,
      supplier: data?.supplier.name,
      checkout_date: "",
      assigned_user: "",
      note: "",
    };
    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
  };

  const checkin = (data: ITaxTokenResponse) => {
    const dataConvert: ITaxTokenResponseCheckin = {
      id: data?.id,
      name: data?.name,
      assigned_to: data?.assigned_to,
      status_label: data?.status_label,
      checkin_at: {
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      user_can_checkout: false,
      note: "",
    };
    setDetailCheckin(dataConvert);
    setIsCheckinModalVisible(true);
  };

  const {
    selectedRowKeys,
    selectedRows,
    onSelect,
    onSelectAll,
    clearSelection,
  } = useRowSelection<ITaxTokenResponse>("selectedTaxTokenRowKeys");

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
  };

  const handleCheckout = () => {
    setIsCheckoutManyTaxTokenModalVisible(!isCheckoutManyTaxTokenModalVisible);
  };

  const handleCheckin = () => {
    setIsCheckinManyTaxTokenModalVisible(!isCheckinManyTaxTokenModalVisible);
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

  const handleOpenModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCreate = () => {
    handleOpenModel();
  };

  const handleDateChange = (
    val: moment.Moment[] | null,
    dateFrom: keyof ITaxTokenListSearchParams,
    dateTo: keyof ITaxTokenListSearchParams
  ) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      setParams({
        [dateFrom]: from?.format("YY-MM-DD")
          ? from?.format("YY-MM-DD").toString()
          : "",
        [dateTo]: to?.format("YY-MM-DD")
          ? to?.format("YY-MM-DD").toString()
          : "",
      });
    } else {
      clearParam([dateFrom, dateTo]);
    }
    searchFormProps.form?.submit();
  };

  const purchaseDateChange = (val: any) => {
    const dateFrom = "purchaseDateFrom";
    const dateTo = "purchaseDateTo";
    handleDateChange(val, dateFrom, dateTo);
  };

  const expirationDateChange = (val: any) => {
    const dateFrom = "expirationDateFrom";
    const dateTo = "expirationDateTo";
    handleDateChange(val, dateFrom, dateTo);
  };

  useEffect(() => {
    localStorage.setItem(
      "item_tax_token_selected",
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  useEffect(() => {
    clearSelection();
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  useEffect(() => {
    setIsTotalDetailReload(!isTotalDetailReload);
  }, [isModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutManyTaxTokenModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckinManyTaxTokenModalVisible]);

  useEffect(() => {
    if (
      selectedRows.filter((item: ITaxTokenResponse) => item.user_can_checkout)
        .length > 0
    ) {
      setSelectedCheckout(true);
      setSelectdStoreCheckout(
        selectedRows
          .filter((item: ITaxTokenResponse) => item.user_can_checkout)
          .map((item: ITaxTokenResponse) => item)
      );
    } else {
      setSelectedCheckout(false);
    }

    if (
      selectedRows.filter((item: ITaxTokenResponse) => item.user_can_checkin)
        .length > 0
    ) {
      setSelectedCheckin(true);
      setSelectdStoreCheckin(
        selectedRows
          .filter((item: ITaxTokenResponse) => item.user_can_checkin)
          .map((item: ITaxTokenResponse) => item)
      );
    } else {
      setSelectedCheckin(false);
    }

    if (
      selectedRows.filter((item: ITaxTokenResponse) => item.user_can_checkout)
        .length > 0 &&
      selectedRows.filter((item: ITaxTokenResponse) => item.user_can_checkin)
        .length > 0
    ) {
      setSelectedCheckout(false);
      setSelectedCheckin(false);
    }
  }, [selectedRows]);

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  return (
    <List
      title={t("tax_token.label.title.tax_token")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("tax_token.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search">
        <Form
          {...searchFormProps}
          initialValues={{
            purchase_date:
              purchaseDateFromParam && purchaseDateToParam
                ? [
                    moment(purchaseDateFromParam, "YYYY/MM/DD"),
                    moment(purchaseDateToParam, "YYYY/MM/DD"),
                  ]
                : "",
            expiration_date:
              expirationDateFromParam && expirationDateToParam
                ? [
                    moment(expirationDateFromParam, "YYYY/MM/DD"),
                    moment(expirationDateToParam, "YYYY/MM/DD"),
                  ]
                : "",
          }}
          layout="vertical"
          className="search-month-location"
          onValuesChange={() => searchFormProps.form?.submit()}
        >
          <Form.Item
            label={t("tax_token.label.title.time-purchase-date")}
            name="purchase_date"
          >
            <RangePicker
              format={dateFormat}
              placeholder={[
                `${t("tax_token.label.field.start-date")}`,
                `${t("tax_token.label.field.end-date")}`,
              ]}
              onCalendarChange={purchaseDateChange}
            />
          </Form.Item>
          <Form.Item
            label={t("tax_token.label.title.time-expiration-date")}
            name="expiration_date"
          >
            <RangePicker
              format={dateFormat}
              placeholder={[
                `${t("tax_token.label.field.start-date")}`,
                `${t("tax_token.label.field.end-date")}`,
              ]}
              onCalendarChange={expirationDateChange}
            />
          </Form.Item>
        </Form>
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
                    title={t("tax_token.label.tooltip.refresh")}
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
                    title={t("tax_token.label.tooltip.columns")}
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
                  title={t("tax_token.label.tooltip.search")}
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
      </div>

      <MModal
        title={t("tax_token.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <TaxTokenCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <TaxTokenEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detailEdit}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.search")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <TaxTokenSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <TaxTokenShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detailEdit}
          isModalVisible={isShowModalVisible}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <TaxTokenClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <TaxTokenCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>
      <MModal
        title={t("tax_token.label.title.checkout")}
        setIsModalVisible={setIsCheckoutManyTaxTokenModalVisible}
        isModalVisible={isCheckoutManyTaxTokenModalVisible}
      >
        <TaxTokenCheckoutMultiple
          isModalVisible={isCheckoutManyTaxTokenModalVisible}
          setIsModalVisible={setIsCheckoutManyTaxTokenModalVisible}
          data={selectdStoreCheckout}
          clearSelection={clearSelection}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <TaxTokenCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
        />
      </MModal>
      <MModal
        title={t("token_tax.label.title.checkin")}
        setIsModalVisible={setIsCheckinManyTaxTokenModalVisible}
        isModalVisible={isCheckinManyTaxTokenModalVisible}
      >
        <TaxTokenCheckinMultiple
          isModalVisible={isCheckinManyTaxTokenModalVisible}
          setIsModalVisible={setIsCheckinManyTaxTokenModalVisible}
          data={selectdStoreCheckin}
          clearSelection={clearSelection}
        />
      </MModal>

      <TotalDetail
        filters={filters}
        links={TAX_TOKEN_TOTAL_DETAIL_API}
        isReload={isTotalDetailReload}
      ></TotalDetail>
      <div className="checkout-checkin-multiple">
        <div className="checkout-multiple-asset">
          <Button
            type="primary"
            className="btn-select-checkout ant-btn-checkout"
            onClick={handleCheckout}
            disabled={!selectedCheckout}
          >
            {t("tax_token.label.title.checkout")}
          </Button>
        </div>
        <div className="checkin-multiple-asset">
          <Button
            type="primary"
            className="btn-select-checkout"
            disabled={!selectedCheckin}
            onClick={handleCheckin}
          >
            {t("hardware.label.title.checkin")}
          </Button>
        </div>
      </div>
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
          scroll={{ x: 1850 }}
          pagination={{
            position: ["topRight", "bottomRight"],
            total: pageTotal ? pageTotal : 0,
          }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        >
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col, index) => (
              <Table.Column
                key={index}
                dataIndex={col.key}
                {...(col as any)}
                sorter
              />
            ))}
          <Table.Column<ITaxTokenResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("tax_token.label.tooltip.viewDetail")}
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
                  title={t("tax_token.label.tooltip.clone")}
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
                  title={t("tax_token.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>

                {record.assigned_to !== null ? (
                  <DeleteButton hideText size="small" disabled />
                ) : (
                  <Tooltip
                    title={t("tax_token.label.tooltip.delete")}
                    color={"red"}
                  >
                    <DeleteButton
                      resourceName={TAX_TOKEN_API}
                      hideText
                      size="small"
                      recordItemId={record.id}
                      onSuccess={() => {
                        setIsTotalDetailReload(!isTotalDetailReload);
                      }}
                    />
                  </Tooltip>
                )}
                {record.user_can_checkout && (
                  <Button
                    className="ant-btn-checkout"
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => checkout(record)}
                  >
                    {t("tax_token.label.button.checkout")}
                  </Button>
                )}

                {record.user_can_checkin === true && (
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => checkin(record)}
                  >
                    {t("tax_token.label.button.checkin")}
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
