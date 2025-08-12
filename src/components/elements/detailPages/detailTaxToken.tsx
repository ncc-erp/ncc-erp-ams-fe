import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  HttpError,
} from "@pankod/refine-core";
import {
  List,
  Table,
  TextField,
  useTable,
  getDefaultSortOrder,
  DateField,
  Space,
  CloneButton,
  EditButton,
  DeleteButton,
  CreateButton,
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
import { filterAssignedStatus } from "untils/assets";
import {
  SUPPLIERS_API,
  TAX_TOKEN_API,
  STATUS_LABELS_API,
  TAX_TOKEN_TOTAL_DETAIL_API,
} from "api/baseApi";
import { Spin } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { IModel } from "interfaces/model";
import { IStatusLabel } from "interfaces/statusLabel";
import {
  ITaxToken,
  ITaxTokenFilterVariables,
  ITaxTokenRequestCheckout,
  ITaxTokenResponse,
  ITaxTokenResponseCheckin,
} from "interfaces/tax_token";
import {
  getBGTaxTokenAssignedStatusDecription,
  getBGTaxTokenStatusDecription,
  getTaxTokenAssignedStatusDecription,
  getTaxTokenStatusDecription,
} from "untils/tax_token";
import { TaxTokenEdit } from "pages/tax_token/edit";
import { TaxTokenSearch } from "pages/tax_token/search";
import { TaxTokenShow } from "pages/tax_token/show";
import { TaxTokenClone } from "pages/tax_token/clone";
import { TaxTokenCheckout } from "pages/tax_token/checkout";
import { TaxTokenCheckin } from "pages/tax_token/checkin";
import { TotalDetail } from "components/elements/TotalDetail";
import { LocalStorageKey } from "enums/LocalStorageKey";

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

type detailTaxTokenProps = {
  id_name: string;
};

export const DetailsTaxToken = (props: detailTaxTokenProps) => {
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const { id_name } = props;
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

  const [searchParams, setSearchParams] = useSearchParams();
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
    [`click`, `touchstart`].forEach((type) => {
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
      permanentFilter: [
        {
          field: id_name,
          operator: "eq",
          value: type_id,
        },
      ],
      resource: TAX_TOKEN_API,
      onSearch: (params) => {
        const filters: CrudFilters = [];
        const { search, name, seri, supplier, purchase_date, expiration_date } =
          params;
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
        render: (value: string, record: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "seri",
        title: t("tax_token.label.field.seri"),
        render: (value: string, record: any) => <TextField value={value} />,
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
        render: (value: string, record: any) => <TextField value={value} />,
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
        render: (value: number, record: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("tax_token.label.field.checkin_counter"),
        render: (value: number, record: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "note",
        title: t("tax_token.label.field.note"),
        render: (value: string, record: any) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("note", sorter),
      },
    ],
    [filterSuppliers]
  );

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem(LocalStorageKey.ITEM_TAX_TOKEN_SELECTED) !== null
      ? JSON.parse(
          localStorage.getItem(
            LocalStorageKey.ITEM_TAX_TOKEN_SELECTED
          ) as string
        )
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

  useEffect(() => {
    localStorage.setItem(
      LocalStorageKey.ITEM_TAX_TOKEN_SELECTED,
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

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
      <TotalDetail
        filters={filters}
        links={`${TAX_TOKEN_TOTAL_DETAIL_API}?${id_name}=${type_id}`}
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
          scroll={{ x: 1850 }}
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
