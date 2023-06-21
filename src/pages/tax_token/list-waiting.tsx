/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    useCreate,
    HttpError,
    usePermissions,
  } from "@pankod/refine-core";
  import {
    List,
    Table,
    TextField,
    useTable,
    getDefaultSortOrder,
    DateField,
    Space,
    TagField,
    Popconfirm,
    Button,
    Spin,
    Form,
    Select,
    useSelect,
    Tooltip,
    Checkbox,
  } from "@pankod/refine-antd";
  import { Image } from "antd";
  import { TableAction } from "components/elements/tables/TableAction";
  import { useEffect, useMemo, useRef, useState } from "react";
  import { MModal } from "components/Modal/MModal";
  import {
      ITaxToken,
    ITaxTokenCreateRequest,
    ITaxTokenFilterVariables,
    ITaxTokenResponse,
  } from "interfaces/tax_token";
  import { CancleAsset } from "./cancel";
  import { TaxTokenSearch } from "./search";
  import {
    CATEGORIES_API,
    HARDWARE_API,
    LOCATION_API,
    STATUS_LABELS_API,
    SUPPLIERS_API,
    TAX_TOKEN_API
  } from "api/baseApi";
  import {
    CloseOutlined,
    SyncOutlined,
    MenuOutlined,
    FileSearchOutlined,
  } from "@ant-design/icons";
  // import { TaxTokenCancelMultipleAsset } from "../users/cancel-multiple-assets";
  import {
    ASSIGNED_STATUS,
    dateFormat,
    defaultCheckedListWaitingConfirm,
  } from "../../constants/assets";
  import moment from "moment";
  import { DatePicker } from "antd";
  import { useSearchParams } from "react-router-dom";
  import { ICompany } from "interfaces/company";
  import {
    getAssetAssignedStatusDecription,
    getAssetStatusDecription,
    getBGAssetAssignedStatusDecription,
    getBGAssetStatusDecription,
  } from "untils/assets";
  import "styles/request.less";
  import { ICategory } from "interfaces/categories";
  import { IStatusLabel } from "interfaces/statusLabel";
  import { EPermissions } from "constants/permissions";
  import { IModel } from "interfaces/model";
  import { IAssetsWaiting } from "interfaces/hardware";
  import { getBGTaxTokenAssignedStatusDecription, getBGTaxTokenStatusDecription, getTaxTokenAssignedStatusDecription, getTaxTokenStatusDecription } from "untils/tax_token";
  
  export const TaxTokenListWaitingConfirm: React.FC<
    IResourceComponentsProps
  > = () => {
    const t = useTranslate();
    const [isCancleModalVisible, setIsCancleModalVisible] = useState(false);
    const [detail, setDetail] = useState<ITaxTokenResponse>();
    const [isLoadingArr, setIsLoadingArr] = useState<boolean[]>([]);
    const [idConfirm, setidConfirm] = useState<number>(-1);
  
    const { data: permissionsData } = usePermissions();
  
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      if (permissionsData?.admin === EPermissions.ADMIN) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }, [permissionsData])
  
    
    const [collumnSelected, setColumnSelected] = useState<string[]>(
      localStorage.getItem("item_selected") !== null
        ? JSON.parse(localStorage.getItem("item_selected") as string)
        : defaultCheckedListWaitingConfirm
    );
    const [isActive, setIsActive] = useState(false);
    const onClickDropDown = () => setIsActive(!isActive);
    const menuRef = useRef(null);
    const [listening, setListening] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  
    const [searchParams, setSearchParams] = useSearchParams();
    const rtd_location_id = searchParams.get("rtd_location_id");
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");
    const searchParam = searchParams.get("search");
  
    const { RangePicker } = DatePicker;
  
    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
      any,
      HttpError,
      ITaxTokenFilterVariables
    >({
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
      resource: TAX_TOKEN_API,
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const {
          search,
          name,
          asset_tag,
          serial,
          model,
          location,
          status_label,
          purchase_date,
          assigned_to,
        } = params;
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
              asset_tag,
              serial,
              model,
              status_label,
              assigned_to,
            }),
          },
          {
            field: "rtd_location_id",
            operator: "eq",
            value: location ? location : rtd_location_id,
          },
          {
            field: "dateFrom",
            operator: "eq",
            value: purchase_date
              ? purchase_date[0].format().substring(0, 10)
              : undefined,
          },
          {
            field: "dateTo",
            operator: "eq",
            value: purchase_date
              ? purchase_date[1].format().substring(0, 10)
              : undefined,
          }
        );
        return filters;
      },
    });
  
  
    const handleOpenModel = () => {
      setIsModalVisible(!isModalVisible);
    };
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
  
    const filterSuppliers =  suppliersSelectProps?.options?.map((item) => ({
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
                key: "status_id",
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
                defaultSortOrder: getDefaultSortOrder("status_id", sorter),
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
                key: "last_checkout",
                title: t("tax_token.label.field.checkout_at"),
                render: (value: ITaxToken) =>
                    value ? (
                        <DateField format="LL" value={value ? value.datetime : ""} />
                    ) : (
                        ""
                    ),
                defaultSortOrder: getDefaultSortOrder("last_checkout", sorter),
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
  
    const cancle = (data: ITaxTokenResponse) => {
      setIsCancleModalVisible(true);
      setDetail(data);
    };
  
    const OnAcceptRequest = (id: number, assigned_status: number) => {
      confirmTaxToken(id, assigned_status);
    };
  
    const confirmTaxToken = (id: number, assigned_status: number) => {
      mutate({
        resource: TAX_TOKEN_API + "/" + id + "?_method=PUT",
        values: {
          assigned_status: assigned_status,
        },
      });
    };
  
    const refreshData = () => {
      tableQueryResult.refetch();
    };
  
    useEffect(() => {
      let arr = [...isLoadingArr];
      arr[idConfirm] = isLoadingSendRequest;
      setIsLoadingArr(arr);
      refreshData();
    }, [isLoadingSendRequest]);
  
    useEffect(() => {
      refreshData();
    }, [isCancleModalVisible]);
  
    const initselectedRowKeys = useMemo(() => {
      return (
        JSON.parse(localStorage.getItem("selectedRow_AcceptRefuse") as string) ||
        []
      );
    }, [localStorage.getItem("selectedRow_AcceptRefuse")]);
  
    const [selectedRowKeys, setSelectedRowKeys] = useState<
      React.Key[] | ITaxTokenResponse []
    >(initselectedRowKeys as React.Key[]);
  
    useEffect(() => {
      localStorage.removeItem("selectedRow_AcceptRefuse");
    }, [window.location.reload]);
  
    const [selectedRows, setSelectedRows] = useState<ITaxTokenResponse[]>([]);
    const [isCancelManyAssetModalVisible, setIsCancelManyAssetModalVisible] =
      useState(false);
  
    const [selectedNotAcceptAndRefuse, setSelectedNotAcceptAndRefuse] =
      useState<boolean>(true);
    const [selectedAcceptAndRefuse, setSelectedAcceptAndRefuse] =
      useState<boolean>(true);
  
    const [selectdStoreAcceptAndRefuse, setSelectedStoreAcceptAndRefuse] =
      useState<ITaxTokenResponse[]>([]);
  
    const [nameAcceptAndRefuse, setNameAcceptAndRefuse] = useState("");
    const [nameNotAcceptAndRefuse, setNameNotAcceptAndRefuse] = useState("");
  
    useEffect(() => {
      if (
        initselectedRowKeys.filter(
          (item: ITaxTokenResponse) =>
            item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
            item.assigned_status === ASSIGNED_STATUS.REFUSE
        ).length > 0 && isAdmin
      ) {
        setSelectedNotAcceptAndRefuse(true);
        setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
      } else {
        setSelectedNotAcceptAndRefuse(false);
        setNameNotAcceptAndRefuse("");
      }
  
      if (
        initselectedRowKeys.filter(
          (item: ITaxTokenResponse) =>
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
        ).length > 0 && isAdmin
      ) {
        setSelectedAcceptAndRefuse(true);
        setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
        setSelectedStoreAcceptAndRefuse(
          initselectedRowKeys
            .filter(
              (item: ITaxTokenResponse) =>
                item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
                item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
            )
            .map((item: ITaxTokenResponse) => item)
        );
      } else {
        setSelectedAcceptAndRefuse(false);
        setNameAcceptAndRefuse("");
      }
  
      if (
        initselectedRowKeys.filter(
          (item: ITaxTokenResponse) =>
            item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
            item.assigned_status === ASSIGNED_STATUS.REFUSE
        ).length > 0 && isAdmin &&
        initselectedRowKeys.filter(
          (item: ITaxTokenResponse) =>
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
            item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
        ).length > 0
      ) {
        setSelectedNotAcceptAndRefuse(false);
        setSelectedAcceptAndRefuse(false);
        setNameNotAcceptAndRefuse(t("hardware.label.detail.not-confirm-refuse"));
        setNameAcceptAndRefuse(t("hardware.label.detail.confirm-refuse"));
      } else {
      }
    }, [initselectedRowKeys]);
  
    const onSelectChange = (
      selectedRowKeys: React.Key[],
      selectedRows: ITaxTokenResponse[]
    ) => {
      setSelectedRowKeys(selectedRowKeys);
    };
  
    const onSelect = (record: ITaxTokenResponse, selected: boolean) => {
      if (!selected) {
        const newSelectRow = initselectedRowKeys.filter(
          (item: ITaxTokenResponse) => item.id !== record.id
        );
        localStorage.setItem(
          "selectedRow_AcceptRefuse",
          JSON.stringify(newSelectRow)
        );
        setSelectedRowKeys(newSelectRow.map((item: ITaxTokenResponse) => item.id));
      } else {
        const newselectedRowKeys = [record, ...initselectedRowKeys];
        localStorage.setItem(
          "selectedRow_AcceptRefuse",
          JSON.stringify(
            newselectedRowKeys.filter(function (item, index) {
              return newselectedRowKeys.findIndex((item) => item.id === index);
            })
          )
        );
        setSelectedRowKeys(
          newselectedRowKeys.map((item: ITaxTokenResponse) => item.id)
        );
      }
    };
  
    const onSelectAll = (
      selected: boolean,
      selectedRows: ITaxTokenResponse[],
      changeRows: ITaxTokenResponse[]
    ) => {
      if (!selected) {
        const unSelectIds = changeRows.map((item: ITaxTokenResponse) => item.id);
        let newSelectRows = initselectedRowKeys.filter(
          (item: ITaxTokenResponse) => item
        );
        newSelectRows = initselectedRowKeys.filter(
          (item: ITaxTokenResponse) => !unSelectIds.includes(item.id)
        );
        localStorage.setItem(
          "selectedRow_AcceptRefuse",
          JSON.stringify(newSelectRows)
        );
        setSelectedRowKeys(newSelectRows);
      } else {
        selectedRows = selectedRows.filter((item: ITaxTokenResponse) => item);
        localStorage.setItem(
          "selectedRow_AcceptRefuse",
          JSON.stringify([...initselectedRowKeys, ...selectedRows])
        );
        setSelectedRowKeys(selectedRows);
      }
    };
  
    const rowSelection = {
      selectedRowKeys: initselectedRowKeys.map((item: ITaxTokenResponse) => item.id),
      onChange: onSelectChange,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
      onSelectChange,
    };
  
    const handleRemoveItem = (id: number) => {
      const newSelectRow = initselectedRowKeys.filter(
        (item: ITaxTokenResponse) => item.id !== id
      );
      localStorage.setItem(
        "selectedRow_AcceptRefuse",
        JSON.stringify(newSelectRow)
      );
      setSelectedRowKeys(newSelectRow.map((item: ITaxTokenResponse) => item.id));
    };
  
    const handleCancel = () => {
      setIsCancelManyAssetModalVisible(!isCancelManyAssetModalVisible);
    };
  
    const [loading, setLoading] = useState(false);
    const handleRefresh = () => {
      setLoading(true);
      setTimeout(() => {
        refreshData();
        setLoading(false);
      }, 1300);
    };
  
    const confirmMultipleTaxToken = (assets: {}[], assigned_status: number) => {
      mutate({
        resource: HARDWARE_API + "?_method=PUT",
        values: {
          assets: assets,
          assigned_status: assigned_status,
        },
      });
      handleRefresh();
      setSelectedRowKeys([]);
      localStorage.removeItem("selectedRow_AcceptRefuse");
    };
  
    useEffect(() => {
      refreshData();
    }, [isCancelManyAssetModalVisible]);
  
    const pageTotal = tableProps.pagination && tableProps.pagination.total;
  
    const { Option } = Select;
    const searchValuesByDateFrom = useMemo(() => {
      return localStorage.getItem("purchase_date")?.substring(0, 10);
    }, [localStorage.getItem("purchase_date")]);
  
    const searchValuesByDateTo = useMemo(() => {
      return localStorage.getItem("purchase_date")?.substring(11, 21);
    }, [localStorage.getItem("purchase_date")]);
  
    let searchValuesLocation = useMemo(() => {
      return Number(localStorage.getItem("rtd_location_id"));
    }, [localStorage.getItem("rtd_location_id")]);
  
    useEffect(() => {
      searchFormProps.form?.submit();
    }, [window.location.reload]);
  
    const handleChangePickerByMonth = (val: any, formatString: any) => {
      if (val !== null) {
        const [from, to] = Array.from(val || []);
        localStorage.setItem("purchase_date", formatString ?? "");
        searchParams.set(
          "dateFrom",
          from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
        );
        searchParams.set(
          "dateTo",
          to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
        );
      } else {
        searchParams.delete("dateFrom");
        searchParams.delete("dateTo");
        localStorage.setItem("purchase_date", formatString ?? "");
      }
  
      setSearchParams(searchParams);
      searchFormProps.form?.submit();
    };
  
    const { selectProps: locationSelectProps } = useSelect<ICompany>({
      resource: LOCATION_API,
      optionLabel: "name",
      optionValue: "id",
      onSearch: (value) => [
        {
          field: "search",
          operator: "containss",
          value,
        },
      ],
    });
  
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
      localStorage.setItem("item_selected", JSON.stringify(collumnSelected));
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
      [`click`, `touchstart`].forEach((type) => {
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
  
    return (
      <List title={t("hardware.label.title.list-waiting-confirm")}>
        <div className="users">
          <Form
            {...searchFormProps}
            initialValues={{
              location: localStorage.getItem("rtd_location_id")
                ? searchValuesLocation
                : Number(rtd_location_id),
              purchase_date:
                localStorage.getItem("purchase_date") !== null
                  ? searchValuesByDateFrom !== "" && searchValuesByDateTo !== ""
                    ? [
                      moment(searchValuesByDateFrom),
                      moment(searchValuesByDateTo),
                    ]
                    : dateFromParam && dateToParam
                      ? [moment(dateFromParam), moment(dateToParam)]
                      : ""
                  : "",
            }}
            layout="vertical"
            onValuesChange={() => searchFormProps.form?.submit()}
            className="search-month-location"
          >
            <Form.Item
              label={t("hardware.label.title.time")}
              name="purchase_date"
            >
              <RangePicker
                onChange={handleChangePickerByMonth}
                format={dateFormat}
                placeholder={[
                  `${t("hardware.label.field.start-date")}`,
                  `${t("hardware.label.field.end-date")}`,
                ]}
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
          <CancleAsset
            setIsModalVisible={setIsCancleModalVisible}
            isModalVisible={isCancleModalVisible}
            data={detail}
          />
        </MModal>
        <MModal
          title={t("user.label.title.cancle")}
          setIsModalVisible={setIsCancelManyAssetModalVisible}
          isModalVisible={isCancelManyAssetModalVisible}
        >
          {/* <TaxTokenCancelMultipleAsset
            isModalVisible={isCancelManyAssetModalVisible}
            setIsModalVisible={setIsCancelManyAssetModalVisible}
            data={selectdStoreAcceptAndRefuse}
            setSelectedRowKey={setSelectedRowKeys}
          /> */}
        </MModal>
        <MModal
          title={t("hardware.label.title.search_advanced")}
          setIsModalVisible={setIsSearchModalVisible}
          isModalVisible={isSearchModalVisible}
        >
          <TaxTokenSearch
            isModalVisible={isSearchModalVisible}
            setIsModalVisible={setIsSearchModalVisible}
            searchFormProps={searchFormProps}
          />
        </MModal>
        <div className="list-waiting-confirm">
          <div className="sum-assets">
            <span className="name-sum-assets">
              {t("hardware.label.title.sum-assets")}
            </span>{" "}
            : {tableProps.pagination ? tableProps.pagination?.total : 0}
          </div>
          <div className="list-users">
            <div className="button-list-accept-refuse">
              <Popconfirm
                title={t("user.label.button.accept")}
                onConfirm={() =>
                  confirmMultipleTaxToken(
                    initselectedRowKeys.map((item: IAssetsWaiting) => item.id),
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
              {isAdmin && initselectedRowKeys
                .filter(
                  (item: IAssetsWaiting) =>
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKOUT ||
                    item.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN
                )
                .map((item: ITaxTokenResponse) => (
                  <span className="list-checkin" key={item.id}>
                    <span className="name-checkin">{item.name}</span>
                    <span
                      className="delete-users-accept-refuse"
                      onClick={() => handleRemoveItem(item.id)}
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
              {initselectedRowKeys
                .filter(
                  (item: IAssetsWaiting) =>
                    item.assigned_status === ASSIGNED_STATUS.ACCEPT ||
                    item.assigned_status === ASSIGNED_STATUS.REFUSE
                )
                .map((item: ITaxTokenResponse) => (
                  <span className="list-checkin" key={item.id}>
                    <span className="name-checkin">{item.name}</span>
                    <span
                      className="delete-users-accept-refuse"
                      onClick={() => handleRemoveItem(item.id)}
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
            rowSelection={isAdmin ? {
              type: "checkbox",
              ...rowSelection,
            } : undefined}
            scroll={{ x: 1800 }}
          >
            {collumns
              .filter((collumn) => collumnSelected.includes(collumn.key))
              .map((col) => (
                <Table.Column dataIndex={col.key} {...(col as any)} sorter />
              ))}
            <Table.Column<ITaxTokenResponse>
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
  
                  {record.assigned_status ===
                    ASSIGNED_STATUS.WAITING_CHECKOUT &&
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
  
                  {record.assigned_status === ASSIGNED_STATUS.WAITING_CHECKIN && isAdmin && (
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
  