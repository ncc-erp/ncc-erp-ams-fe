import {
  CloseOutlined,
  FileSearchOutlined,
  MenuOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DateField,
  Form,
  getDefaultSortOrder,
  List,
  Popconfirm,
  Space,
  Spin,
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
  useCreate,
  useNotification,
  usePermissions,
  useTranslate,
} from "@pankod/refine-core";
import { DatePicker } from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  STATUS_LABELS_API,
  SUPPLIERS_API,
  TOOLS_API,
  TOOLS_TOTAL_DETAIL_API,
} from "api/baseApi";
import { TableAction } from "components/elements/tables/TableAction";
import { TotalDetail } from "components/elements/TotalDetail";
import { MModal } from "components/Modal/MModal";
import { EPermissions } from "constants/permissions";
import { useAppSearchParams } from "hooks/useAppSearchParams";
import { IToolListSearchParams } from "hooks/useAppSearchParams/types";
import { useRowSelection } from "hooks/useRowSelection";
import { ICategory } from "interfaces/categories";
import { IStatusLabel } from "interfaces/statusLabel";
import {
  ITool,
  IToolCreateRequest,
  IToolFilterVariable,
  IToolResponse,
} from "interfaces/tool";
import "styles/request.less";
import { filterAssignedStatus } from "utils/assets";
import {
  getBGToolAssignedStatusDecription,
  getToolAssignedStatusDecription,
  getToolStatusDecription,
} from "utils/tools";
import {
  ASSIGNED_STATUS,
  dateFormat,
  defaultCheckedListWaitingConfirm,
} from "../../constants/assets";
import { CancleTool } from "./cancel";
import { ToolCancelMultiple } from "./multi-cancel";
import { ToolSearch } from "./search";
import { LocalStorageKey } from "enums/LocalStorageKey";

export const ToolListWaitingConfirm: React.FC<
  IResourceComponentsProps
> = () => {
  const t = useTranslate();
  const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);
  const [detail, setDetail] = useState<IToolResponse>();
  const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
  const idConfirm = -1;

  const { data: permissionsData } = usePermissions();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (permissionsData?.admin === EPermissions.ADMIN) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [permissionsData]);

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem(LocalStorageKey.ITEM_SELECTED) !== null
      ? JSON.parse(
          localStorage.getItem(LocalStorageKey.ITEM_SELECTED) as string
        )
      : defaultCheckedListWaitingConfirm
  );
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const {
    params: {
      purchaseDateFrom: purchaseDateFromParam,
      purchaseDateTo: purchaseDateToParam,
      expirationDateFrom: expirationDateFromParam,
      expirationDateTo: expirationDateToParam,
      search: searchParam,
      rtd_location_id,
    },
    setParams,
    clearParam,
  } = useAppSearchParams("toolList");

  const { open } = useNotification();

  const { RangePicker } = DatePicker;

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<any, HttpError, IToolFilterVariable>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      initialFilter: [
        {
          field: "WAITING_CHECKOUT",
          operator: "eq",
          value: ASSIGNED_STATUS.WAITING_CHECKOUT,
        },
        {
          field: "WAITING_CHECKIN",
          operator: "eq",
          value: ASSIGNED_STATUS.WAITING_CHECKIN,
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
          }
        );
        return filters;
      },
    });

  const handleOpenSearchModel = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };
  const handleSearch = () => {
    handleOpenSearchModel();
  };

  const { selectProps: suppliersSelectProps } = useSelect<ICategory>({
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
        render: (value: IToolResponse) => {
          const { label, color } = getToolStatusDecription(value, t);
          return (
            <TagField
              value={label}
              style={{
                background: color,
                color: "white",
              }}
            />
          );
        },
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
    [filterSuppliers]
  );

  const {
    mutate,
    isLoading: isLoadingSendRequest,
    isSuccess: isMutateSuccess,
  } = useCreate<IToolCreateRequest>();

  const cancle = (data: IToolResponse) => {
    setIsCancleModalVisible(true);
    setDetail(data);
  };

  const OnAcceptRequest = (id: number, assigned_status: number) => {
    confirmTool(id, assigned_status);
  };

  const confirmTool = (id: number, assigned_status: number) => {
    mutate(
      {
        resource: TOOLS_API + "/" + id + "?_method=PUT",
        values: {
          assigned_status: assigned_status,
        },
        successNotification: false,
      },
      {
        onSuccess(data) {
          open?.({
            type: "success",
            description: "Success",
            message: data?.data.messages,
          });
        },
      }
    );
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    const arr = [...isLoadingArr];
    arr[idConfirm] = isLoadingSendRequest;
    setIsLoadingArr(arr);
    refreshData();
  }, [isLoadingSendRequest]);

  useEffect(() => {
    refreshData();
  }, [isCancleModalVisible]);

  const {
    selectedRowKeys,
    selectedRows,
    onSelect,
    onSelectAll,
    removeItem,
    clearSelection,
  } = useRowSelection<IToolResponse>("selectedRow_AcceptRefuse");

  useEffect(() => {
    clearSelection();
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const [isCancelManyToolVisible, setisCancelManyToolVisible] = useState(false);

  const [, setSelectedNotAcceptAndRefuse] = useState<boolean>(true);
  const [selectedAcceptAndRefuse, setSelectedAcceptAndRefuse] =
    useState<boolean>(true);

  const [selectdStoreAcceptAndRefuse, setSelectedStoreAcceptAndRefuse] =
    useState<IToolResponse[]>([]);

  const [nameAcceptAndRefuse, setNameAcceptAndRefuse] = useState("");
  const [nameNotAcceptAndRefuse, setNameNotAcceptAndRefuse] = useState("");

  useEffect(() => {
    if (
      selectedRows.filter(
        (item: IToolResponse) =>
          item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
          item.assigned_status === ASSIGNED_STATUS.REFUSE
      ).length > 0 &&
      isAdmin
    ) {
      setSelectedNotAcceptAndRefuse(true);
      setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
    } else {
      setSelectedNotAcceptAndRefuse(false);
      setNameNotAcceptAndRefuse("");
    }

    if (
      selectedRows.filter(
        (item: IToolResponse) =>
          item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
          item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
      ).length > 0 &&
      isAdmin
    ) {
      setSelectedAcceptAndRefuse(true);
      setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
      setSelectedStoreAcceptAndRefuse(
        selectedRows
          .filter(
            (item: IToolResponse) =>
              item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
              item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
          )
          .map((item: IToolResponse) => item)
      );
    } else {
      setSelectedAcceptAndRefuse(false);
      setNameAcceptAndRefuse("");
    }

    if (
      selectedRows.filter(
        (item: IToolResponse) =>
          item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
          item.assigned_status === ASSIGNED_STATUS.REFUSE
      ).length > 0 &&
      isAdmin &&
      selectedRows.filter(
        (item: IToolResponse) =>
          item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
          item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
      ).length > 0
    ) {
      setSelectedNotAcceptAndRefuse(false);
      setSelectedAcceptAndRefuse(false);
      setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
      setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
    }
  }, [selectedRows]);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
  };

  const handleCancel = () => {
    setisCancelManyToolVisible(!isCancelManyToolVisible);
  };

  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 1300);
  };

  const confirmMultipleTools = (tools: any[], assigned_status: number) => {
    mutate(
      {
        resource: TOOLS_API + "?_method=PUT",
        values: {
          tools: tools,
          assigned_status: assigned_status,
        },
        successNotification: false,
      },
      {
        onSuccess(data) {
          open?.({
            type: "success",
            description: "Success",
            message: data?.data.messages,
          });
        },
      }
    );
    handleRefresh();
    clearSelection();
  };

  useEffect(() => {
    refreshData();
  }, [isCancelManyToolVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const searchValuesByDateFrom = useMemo(() => {
    return localStorage
      .getItem(LocalStorageKey.PURCHASE_DATE)
      ?.substring(0, 10);
  }, [localStorage.getItem(LocalStorageKey.PURCHASE_DATE)]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage
      .getItem(LocalStorageKey.PURCHASE_DATE)
      ?.substring(11, 21);
  }, [localStorage.getItem(LocalStorageKey.PURCHASE_DATE)]);

  const searchValuesLocation = useMemo(() => {
    return Number(localStorage.getItem(LocalStorageKey.RTD_LOCATION_ID));
  }, [localStorage.getItem(LocalStorageKey.RTD_LOCATION_ID)]);

  const handleDateChange = (
    val: moment.Moment[] | null,
    dateFrom: keyof IToolListSearchParams,
    dateTo: keyof IToolListSearchParams
  ) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      // localStorage.setItem("purchase_date", formatString ?? "");
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
      // localStorage.setItem("purchase_date", formatString ?? "");
    }

    searchFormProps.form?.submit();
  };

  const purchaseDateChange = (val: any, formatString: any) => {
    localStorage.setItem(LocalStorageKey.PURCHASE_DATE, formatString ?? "");
    const dateFrom = "purchaseDateFrom";
    const dateTo = "purchaseDateTo";
    handleDateChange(val, dateFrom, dateTo);
  };

  const expirationDateChange = (val: any, formatString: any) => {
    localStorage.setItem(LocalStorageKey.PURCHASE_DATE, formatString ?? "");
    const dateFrom = "expirationDateFrom";
    const dateTo = "expirationDateTo";
    handleDateChange(val, dateFrom, dateTo);
  };

  const onCheckItem = (value: any) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };
  useEffect(() => {
    localStorage.setItem(
      LocalStorageKey.ITEM_SELECTED,
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

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

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  useEffect(() => {
    setIsTotalDetailReload(!isTotalDetailReload);
  }, [isMutateSuccess, isCancleModalVisible, isCancelManyToolVisible]);

  return (
    <List title={t("hardware.label.title.list-waiting-confirm")}>
      <div className="users">
        <Form
          {...searchFormProps}
          initialValues={{
            location: localStorage.getItem(LocalStorageKey.RTD_LOCATION_ID)
              ? searchValuesLocation
              : Number(rtd_location_id),
            purchase_date:
              localStorage.getItem(LocalStorageKey.PURCHASE_DATE) !== null
                ? searchValuesByDateFrom !== "" && searchValuesByDateTo !== ""
                  ? [
                      moment(searchValuesByDateFrom),
                      moment(searchValuesByDateTo),
                    ]
                  : purchaseDateFromParam && purchaseDateToParam
                    ? [
                        moment(purchaseDateFromParam),
                        moment(purchaseDateToParam),
                      ]
                    : ""
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
          onValuesChange={() => searchFormProps.form?.submit()}
          className="search-month-location"
        >
          <Form.Item
            label={t("tools.label.title.time-purchase-date")}
            name="purchase_date"
          >
            <RangePicker
              format={dateFormat}
              placeholder={[
                `${t("tools.label.field.start-date")}`,
                `${t("tools.label.field.end-date")}`,
              ]}
              onCalendarChange={purchaseDateChange}
            />
          </Form.Item>
          <Form.Item
            label={t("tools.label.title.time-expiration-date")}
            name="expiration_date"
          >
            <RangePicker
              format={dateFormat}
              placeholder={[
                `${t("tools.label.field.start-date")}`,
                `${t("tools.label.field.end-date")}`,
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
                    title={t("hardware.label.tooltip.refresh")}
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
                    title={t("hardware.label.tooltip.columns")}
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
                  title={t("hardware.label.tooltip.search")}
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
        title={t("user.label.title.cancle")}
        setIsModalVisible={setIsCancleModalVisible}
        isModalVisible={isCancleModalVisible}
      >
        <CancleTool
          setIsModalVisible={setIsCancleModalVisible}
          isModalVisible={isCancleModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("user.label.title.cancle")}
        setIsModalVisible={setisCancelManyToolVisible}
        isModalVisible={isCancelManyToolVisible}
      >
        <ToolCancelMultiple
          isModalVisible={isCancelManyToolVisible}
          setIsModalVisible={setisCancelManyToolVisible}
          data={selectdStoreAcceptAndRefuse}
          clearSelection={clearSelection}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <ToolSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>

      <TotalDetail
        filters={filters}
        links={TOOLS_TOTAL_DETAIL_API}
        isReload={isTotalDetailReload}
      ></TotalDetail>
      <div className="list-waiting-confirm">
        <div className="list-users">
          <div className="button-list-accept-refuse">
            <Popconfirm
              title={t("user.label.button.accept")}
              onConfirm={() =>
                confirmMultipleTools(
                  selectedRows.map((item) => item.id),
                  ASSIGNED_STATUS.ACCEPT
                )
              }
            >
              {isAdmin && (
                <Button
                  type="primary"
                  disabled={!selectedAcceptAndRefuse}
                  loading={loading}
                  className={selectedAcceptAndRefuse ? "ant-btn-accept" : ""}
                >
                  {t("user.label.button.accept")}
                </Button>
              )}
            </Popconfirm>
            {isAdmin && (
              <Button
                type="primary"
                onClick={handleCancel}
                disabled={!selectedAcceptAndRefuse}
              >
                {t("user.label.button.cancle")}
              </Button>
            )}
          </div>

          <div
            className={nameAcceptAndRefuse ? "list-asset-waiting-confirm" : ""}
          >
            <span className="title-remove-name">{nameAcceptAndRefuse}</span>
            {isAdmin &&
              selectedRows
                .filter(
                  (item) =>
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
                )
                .map((item) => (
                  <span className="list-checkin" key={item.id}>
                    <span className="name-checkin">{item.name}</span>
                    <span
                      className="delete-users-accept-refuse"
                      onClick={() => removeItem(item.id)}
                    >
                      <CloseOutlined />
                    </span>
                  </span>
                ))}
          </div>

          <div
            className={
              nameNotAcceptAndRefuse ? "list-asset-waiting-confirm" : ""
            }
          >
            <span className="title-remove-name">{nameNotAcceptAndRefuse}</span>
            {selectedRows
              .filter(
                (item) =>
                  item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
                  item.assigned_status === ASSIGNED_STATUS.REFUSE
              )
              .map((item) => (
                <span className="list-checkin" key={item.id}>
                  <span className="name-checkin">{item.name}</span>
                  <span
                    className="delete-users-accept-refuse"
                    onClick={() => removeItem(item.id)}
                  >
                    <CloseOutlined />
                  </span>
                </span>
              ))}
          </div>
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
          rowSelection={
            isAdmin
              ? {
                  type: "checkbox",
                  ...rowSelection,
                }
              : undefined
          }
          scroll={{ x: 1800 }}
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
          <Table.Column<IToolResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                {record.assigned_to &&
                  record.assigned_to.id !== null &&
                  isAdmin &&
                  record.assigned_to.id !== record.withdraw_from &&
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

                {record.assigned_to &&
                  record.assigned_to.id !== null &&
                  record.assigned_to.id === record.withdraw_from &&
                  isAdmin &&
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

                {record.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT &&
                  isAdmin && (
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

                {record.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN &&
                  isAdmin && (
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
  );
};
