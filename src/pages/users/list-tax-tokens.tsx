import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  HttpError,
  useCreate,
  useNotification
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
  Tooltip,
  Checkbox,
  Form,
  useSelect,
  TagField,
  Popconfirm,
  Button
} from "@pankod/refine-antd";
import {
  MenuOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { dateFormat } from "constants/assets";
import { filterAssignedStatus } from "untils/assets";
import {
  SUPPLIERS_API,
  TAX_TOKEN_ASSIGN_API,
  STATUS_LABELS_API,
  TAX_TOKEN_TOTAL_DETAIL_API,
  TAX_TOKEN_API
} from "api/baseApi";
import { Spin } from "antd";
import { DatePicker } from "antd";
import React from "react";
import { TableAction } from "components/elements/tables/TableAction";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { IModel } from "interfaces/model";
import { IStatusLabel } from "interfaces/statusLabel";
import {
  ITaxToken,
  ITaxTokenFilterVariables,
  ITaxTokenResponse,
  ITaxTokenCreateRequest
} from "interfaces/tax_token";
import {
  getBGTaxTokenAssignedStatusDecription,
  getBGTaxTokenStatusDecription,
  getTaxTokenAssignedStatusDecription,
  getTaxTokenStatusDecription
} from "untils/tax_token";

import { TaxTokenShow } from "pages/tax_token/show";
import { TotalDetail } from "components/elements/TotalDetail";
import { ASSIGNED_STATUS } from "constants/assets";
import { CancleAsset } from "./cancel";

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

export const UserListTaxToken: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);

  const [detailEdit, setDetailEdit] = useState<ITaxTokenResponse>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const [detail, setDetail] = useState<ITaxTokenResponse>();

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
  const [idConfirm, setidConfirm] = useState<number>(-1);
  const { open } = useNotification();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search");
  const purchaseDateFromParam = searchParams.get("purchaseDateFrom");
  const purchaseDateToParam = searchParams.get("purchaseDateTo");
  const expirationDateFromParam = searchParams.get("expirationDateFrom");
  const expirationDateToParam = searchParams.get("expirationDateTo");

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

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } = useTable<
    ITaxTokenResponse,
    HttpError,
    ITaxTokenFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: TAX_TOKEN_ASSIGN_API,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      let {
        name,
        seri,
        supplier,
        purchase_date,
        expiration_date
      } = params;
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
        },
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
        render: (value: string, record: any) => (
          <TextField
            value={value}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "seri",
        title: t("tax_token.label.field.seri"),
        render: (value: string, record: any) => (
          <TextField value={value} />
        ),
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
        render: (value: ITaxToken) => (
          <TextField value={value && value.name} />
        ),
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
        render: (value: string, record: any) => (
          <TextField
            value={value}
          />
        ),
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
          <TextField value={record.assigned_to ? record.assigned_to.username : ''} />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to", sorter),
      },
      {
        key: "checkout_counter",
        title: t("tax_token.label.field.checkout_counter"),
        render: (value: number, record: any) => (
          <TextField value={value} />
        ),
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("tax_token.label.field.checkin_counter"),
        render: (value: number, record: any) => (
          <TextField value={value} />
        ),
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "note",
        title: t("tax_token.label.field.note"),
        render: (value: string, record: any) => (
          <TextField value={value} />
        ),
        defaultSortOrder: getDefaultSortOrder("note", sorter),
      },
    ],
    [filterSuppliers]
  )

  const { mutate, isLoading: isLoadingSendRequest } =
    useCreate<ITaxTokenCreateRequest>();

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

  const show = (data: ITaxTokenResponse) => {
    setIsShowModalVisible(true);
    setDetailEdit(data);
  };


  const initselectedRowKeys = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedTaxTokenRowKeys") as string) || [];
  }, [localStorage.getItem("selectedTaxTokenRowKeys")]);


  const [selectedRowKeys, setSelectedRowKeys] = useState<
    React.Key[] | ITaxTokenResponse[]
  >(initselectedRowKeys as React.Key[]);

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: ITaxTokenResponse[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onSelect = (record: any, selected: boolean) => {
    if (!selected) {
      const newSelectRow = initselectedRowKeys.filter(
        (item: ITaxToken) => item.id !== record.id
      );
      localStorage.setItem("selectedTaxTokenRowKeys", JSON.stringify(newSelectRow));
      setSelectedRowKeys(newSelectRow.map((item: ITaxToken) => item.id));
    } else {
      const newselectedRowKeys = [record, ...initselectedRowKeys];
      localStorage.setItem(
        "selectedTaxTokenRowKeys",
        JSON.stringify(
          newselectedRowKeys.filter(function (item, index) {
            return newselectedRowKeys;
          })
        )
      );
      setSelectedRowKeys(newselectedRowKeys.map((item: ITaxToken) => item.id));
    }
  };

  const onSelectAll = (
    selected: boolean,
    selectedRows: ITaxTokenResponse[],
    changeRows: ITaxTokenResponse[]
  ) => {
    if (!selected) {
      const unSelectIds = changeRows.map((item: ITaxTokenResponse) => item.id);
      let newSelectedRows = initselectedRowKeys.filter(
        (item: ITaxTokenResponse) => item
      );
      newSelectedRows = initselectedRowKeys.filter(
        (item: any) => !unSelectIds.includes(item.id)
      );

      localStorage.setItem("selectedTaxTokenRowKeys", JSON.stringify(newSelectedRows));
    } else {
      selectedRows = selectedRows.filter((item: ITaxTokenResponse) => item);
      localStorage.setItem(
        "selectedTaxTokenRowKeys",
        JSON.stringify([...initselectedRowKeys, ...selectedRows])
      );
      setSelectedRowKeys(selectedRows);
    }
  };

  const rowSelection = {
    selectedRowKeys: initselectedRowKeys.map((item: ITaxToken) => item.id),
    onChange: onSelectChange,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
    onSelectChange,
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const handleDateChange = (val: any, dateFrom: string, dateTo: string) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      searchParams.set(
        dateFrom,
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParams.set(
        dateTo,
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete(dateFrom);
      searchParams.delete(dateTo);
    }
    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  const purchaseDateChange = (val: any, formatString: any) => {
    const dateFrom = "purchaseDateFrom";
    const dateTo = "purchaseDateTo";
    handleDateChange(val, dateFrom, dateTo);
  }

  const expirationDateChange = (val: any, formatString: any) => {
    const dateFrom = "expirationDateFrom";
    const dateTo = "expirationDateTo";
    handleDateChange(val, dateFrom, dateTo);
  }

  useEffect(() => {
    localStorage.setItem("item_tax_token_selected", JSON.stringify(collumnSelected));
  }, [collumnSelected]);

  useEffect(() => {
    let arr = [...isLoadingArr];
    arr[idConfirm] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    refreshData();
  }, [isLoadingSendRequest]);

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  const OnAcceptRequest = (id: number, assigned_status: number) => {
    confirmTaxToken(id, assigned_status);
  };
  const confirmTaxToken = (id: number, assigned_status: number) => {
    mutate({
      resource: TAX_TOKEN_API + "/" + id + "?_method=PUT",
      values: {
        send_accept: id,
        assigned_status: assigned_status,
      },
      successNotification: false
    }, {
      onSuccess(data, variables, context) {
        open?.({
          type: 'success',
          description: 'Success',
          message: data?.data.messages
        })
      },
    });
    handleRefresh();
  };

  const cancle = (data: ITaxTokenResponse) => {
    setIsCancleModalVisible(true);
    setDetail(data);
  };

  useEffect(() => {
    refreshData();
  }, [isCancleModalVisible]);

  return (
    <List
      title={t("tax_token.label.title.my-tax-token")}
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
            </div>
          </div>
        </div>
      </div>

      <MModal
        title={t("tax_token.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <TaxTokenShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detailEdit}
          isModalVisible={isShowModalVisible} />
      </MModal>
      <MModal
        title={t("user.label.title.cancle")}
        setIsModalVisible={setIsCancleModalVisible}
        isModalVisible={isCancleModalVisible}
      >
        <CancleAsset
          setIsModalVisible={setIsCancleModalVisible}
          isModalVisible={isCancleModalVisible}
          data={detail}
          ApiLink={TAX_TOKEN_API}
          refreshData={refreshData}
        />
      </MModal>

      <TotalDetail
        filters={filters}
        links={TAX_TOKEN_TOTAL_DETAIL_API}
        additional_filter="user_list=true"
      ></TotalDetail>
      <div className="checkout-checkin-multiple">

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
            .map((col) => (
              <Table.Column dataIndex={col.key} {...(col as any)} sorter />
            ))}
          <Table.Column<any>
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

                {record.assigned_to.id !== record.withdraw_from &&
                  record.assigned_status ===
                  ASSIGNED_STATUS.WAITING_CHECKOUT && (
                    <Popconfirm
                      title={t("hardware.label.button.accept_checkout")}
                      onConfirm={() =>
                        OnAcceptRequest(record.id, ASSIGNED_STATUS.ACCEPT)
                      }
                    >
                      {isLoadingArr[record.id] !== false && (
                        <Button
                          className="ant-btn-accept"
                          type="primary"
                          shape="round"
                          size="small"
                          loading={
                            isLoadingArr[record.id] === undefined
                              ? false
                              : isLoadingArr[record.id] === false
                                ? false
                                : true
                          }
                        >
                          {t("hardware.label.button.accept_checkout")}
                        </Button>
                      )}
                    </Popconfirm>
                  )}

                {record.assigned_to.id === record.withdraw_from &&
                  record.assigned_status ===
                  ASSIGNED_STATUS.WAITING_CHECKIN && (
                    <Popconfirm
                      title={t("hardware.label.button.accept_checkin")}
                      onConfirm={() =>
                        OnAcceptRequest(record.id, ASSIGNED_STATUS.ACCEPT)
                      }
                    >
                      {isLoadingArr[record.id] !== false && (
                        <Button
                          className="ant-btn-accept"
                          type="primary"
                          shape="round"
                          size="small"
                          loading={
                            isLoadingArr[record.id] === undefined
                              ? false
                              : isLoadingArr[record.id] === false
                                ? false
                                : true
                          }
                        >
                          {t("hardware.label.button.accept_checkin")}
                        </Button>
                      )}
                    </Popconfirm>
                  )}

                {record.assigned_status ===
                  ASSIGNED_STATUS.WAITING_CHECKOUT && (
                    <Button
                      type="primary"
                      shape="round"
                      size="small"
                      loading={
                        isLoadingArr[record.id] === undefined
                          ? false
                          : isLoadingArr[record.id] === false
                            ? false
                            : true
                      }
                      onClick={() => cancle(record)}
                    >
                      {t("hardware.label.button.rejectCheckout")}
                    </Button>
                  )}

                {record.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN && (
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    loading={
                      isLoadingArr[record.id] === undefined
                        ? false
                        : isLoadingArr[record.id] === false
                          ? false
                          : true
                    }
                    onClick={() => cancle(record)}
                  >
                    {t("hardware.label.button.rejectCheckin")}
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  )
}
