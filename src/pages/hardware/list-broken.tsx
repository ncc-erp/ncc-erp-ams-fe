/* eslint-disable react-hooks/exhaustive-deps */
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
  TagField,
  CreateButton,
  Button,
  ShowButton,
  Tooltip,
  Checkbox,
  Form,
  Select,
  useSelect,
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";
import { Spin } from "antd";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareClone } from "./clone";
import { HardwareShow } from "./show";
import {
  MenuOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import {
  IHardwareFilterVariables,
  IHardwareResponse,
  IHardwareResponseCheckin,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { HardwareCheckout } from "./checkout";
import { HardwareCheckin } from "./checkin";
import { HARDWARE_API, LOCATION_API } from "api/baseApi";
import { HardwareSearch } from "./search";
import { ICompany } from "interfaces/company";
import moment from "moment";
import { DatePicker } from "antd";
import { useSearchParams } from "react-router-dom";

const defaultCheckedList = [
  "id",
  "name",
  "image",
  "model",
  "category",
  "status_label",
  "assigned_to",
  "assigned_status",
  "created_at",
];

export const HardwareListBroken: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [detailCheckout, setDetailCheckout] =
    useState<IHardwareResponseCheckout>();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  const [isLoadingArr] = useState<boolean[]>([]);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<IHardwareResponseCheckin>();
  const [detailClone, setDetailClone] = useState<IHardwareResponse>();

  const [collumnSelected, setColumnSelected] =
    useState<string[]>(defaultCheckedList);
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location_id = searchParams.get("location_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

  const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<
    IHardwareResponse,
    HttpError,
    IHardwareFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    initialFilter: [
      {
        field: "status.id",
        operator: "eq",
        value: "3",
      },
    ],
    resource: HARDWARE_API,
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
          field: "location_id",
          operator: "eq",
          value: location ? location : location_id,
        },
        {
          field: "dateFrom",
          operator: "eq",
          value: purchase_date
            ? purchase_date[0].toISOString().substring(0, 10)
            : undefined,
        },
        {
          field: "dateTo",
          operator: "eq",
          value: purchase_date
            ? purchase_date[1].toISOString().substring(0, 10)
            : undefined,
        }
      );

      return filters;
    },
  });

  const edit = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted:
          data?.purchase_date !== null ? data?.purchase_date.formatted : "",
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
      physical: data?.physical,

      note: "",
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: "",
        formatted: "",
      },
      assigned_location: {
        id: 0,
        name: "",
      },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: {
          id: 0,
          name: "",
        },
      },
      user_can_checkout: false,
      assigned_status: 0,
      checkin_at: {
        date: "",
        formatted: "",
      },
      created_at: {
        datetime: "",
        formatted: "",
      },
      updated_at: {
        datetime: "",
        formatted: "",
      },
      manufacturer: {
        id: 0,
        name: "",
      },
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      warranty_expires: {
        date: "",
        formatted: "",
      },
      user_can_checkin: false,
    };
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted:
          data?.purchase_date !== null ? data?.purchase_date.formatted : "",
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
      physical: data?.physical,
      user_can_checkout: data?.user_can_checkout,

      note: "",
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: "",
        formatted: "",
      },
      assigned_location: {
        id: 0,
        name: "",
      },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: {
          id: 0,
          name: "",
        },
      },
      assigned_status: 0,
      checkin_at: {
        date: "",
        formatted: "",
      },
      created_at: {
        datetime: "",
        formatted: "",
      },
      updated_at: {
        datetime: "",
        formatted: "",
      },
      manufacturer: {
        id: 0,
        name: "",
      },
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      warranty_expires: {
        date: "",
        formatted: "",
      },
      user_can_checkin: false,
    };

    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);
  };

  const checkout = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponseCheckout = {
      id: data.id,
      name: data.name,
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      note: data.note,
      assigned_location: {
        id: data?.assigned_location?.id,
        name: data?.assigned_location?.name,
      },
      checkout_at: {
        date: new Date().toISOString().substring(0, 10),
        formatted: new Date().toDateString(),
      },
      assigned_user: data?.assigned_user,
      model_number: data?.model_number,
      assigned_asset: data?.assigned_asset,
      checkout_to_type: data?.checkout_to_type,
      user_can_checkout: data?.user_can_checkout,
    };

    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
  };

  const checkin = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponseCheckin = {
      id: data.id,
      name: data.name,
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      checkin_at: {
        date: new Date().toISOString().substring(0, 10),
        formatted: new Date().toDateString(),
      },
      rtd_location: {
        id: data?.id,
        name: data?.name,
      },
      note: data?.note,
      user_can_checkout: false,
    };

    setDetailCheckin(dataConvert);
    setIsCheckinModalVisible(true);
  };

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
        title: t("hardware.label.field.assetName"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: t("hardware.label.field.image"),
        render: (value: string) => {
          return value ? (
            <Image width={80} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "asset_tag",
        title: t("hardware.label.field.propertyCard"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
      },
      {
        key: "serial",
        title: t("hardware.label.field.serial"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("serial", sorter),
      },
      {
        key: "model",
        title: t("hardware.label.field.propertyType"),
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "model_number",
        title: "Model No",
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("model_number", sorter),
      },
      {
        key: "category",
        title: t("hardware.label.field.category"),
        render: (value: IHardwareResponse) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "status_label",
        title: t("hardware.label.field.status"),
        render: (value: IHardwareResponse) => (
          <TagField
            value={
              value
                ? value.name === t("hardware.label.field.assign")
                  ? t("hardware.label.detail.assign")
                  : value.name === t("hardware.label.field.readyToDeploy")
                  ? t("hardware.label.detail.readyToDeploy")
                  : value.name === t("hardware.label.field.broken")
                  ? t("hardware.label.detail.broken")
                  : value.name === t("hardware.label.field.pending")
                  ? t("hardware.label.detail.pending")
                  : ""
                : ""
            }
            style={{
              background:
                value.name === t("hardware.label.field.assign")
                  ? "#0073b7"
                  : value.name === t("hardware.label.field.readyToDeploy")
                  ? "#00a65a"
                  : value.name === t("hardware.label.field.broken")
                  ? "red"
                  : value.name === t("hardware.label.field.pending")
                  ? "#f39c12"
                  : "",
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
      },
      {
        key: "assigned_to",
        title: t("hardware.label.field.checkoutTo"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
      },
      {
        key: "location",
        title: t("hardware.label.field.rtd_location"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "rtd_location",
        title: t("hardware.label.field.locationFix"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
      },
      {
        key: "manufacturer",
        title: t("hardware.label.field.manufacturer"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
      },
      {
        key: "supplier",
        title: t("hardware.label.field.supplier"),
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
      },
      {
        key: "purchase_date",
        title: t("hardware.label.field.dateBuy"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.date : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("warranty_expires.date", sorter),
      },
      {
        key: "order_number",
        title: t("hardware.label.field.orderNumber"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("order_number", sorter),
      },
      {
        key: "warranty_months",
        title: t("hardware.label.field.insurance"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        key: "warranty_expires",
        title: t("hardware.label.field.warranty_expires"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.date : ""} />
        ),
      },
      {
        key: "notes",
        title: t("hardware.label.field.note"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
      {
        key: "checkout_counter",
        title: t("hardware.label.field.checkout_counter"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
      },
      {
        key: "checkin_counter",
        title: t("hardware.label.field.checkin_counter"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
      },
      {
        key: "requestable",
        title: t("hardware.label.field.requestable"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("requestable", sorter),
      },
      {
        key: "assigned_status",
        title: t("hardware.label.field.condition"),
        render: (value: number) => (
          <TagField
            value={
              value === 0
                ? t("hardware.label.detail.noAssign")
                : value === 1
                ? t("hardware.label.detail.pendingAccept")
                : value === 2
                ? t("hardware.label.detail.accept")
                : value === 3
                ? t("hardware.label.detail.refuse")
                : ""
            }
            style={{
              background:
                value === 0
                  ? "gray"
                  : value === 1
                  ? "#f39c12"
                  : value === 2
                  ? "#0073b7"
                  : value === 3
                  ? "red"
                  : "gray",
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
      },
      {
        key: "created_at",
        title: t("hardware.label.field.dateCreate"),
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

  const handleSearch = () => {
    handleOpenSearchModel();
  };

  const handleOpenSearchModel = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  const onCheckItem = (value: any) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };

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

  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const { RangePicker } = DatePicker;

  const searchValuesByDateFrom = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(0, 10);
  }, [localStorage.getItem("purchase_date")]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(11, 21);
  }, [localStorage.getItem("purchase_date")]);

  let searchValuesLocation = useMemo(() => {
    return Number(localStorage.getItem("location"));
  }, [localStorage.getItem("location")]);

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    const [from, to] = Array.from(val || []);
    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    searchParams.set(
      "dateFrom",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams.set(
      "dateTo",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    setSearchParams(searchParams);

    searchFormProps.form?.submit();
  };

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const dateFormat = "YYYY/MM/DD";

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

  const { Option } = Select;
  return (
    <List
      title={t("hardware.label.title.list-broken")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("hardware.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search">
        <Form
          {...searchFormProps}
          initialValues={{
            location:
              localStorage.getItem("location") !== null ??
              searchValuesLocation !== 0
                ? searchValuesLocation
                : location_id ?? Number(location_id),
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
          <Form.Item
            label={t("hardware.label.title.location")}
            name="location"
            className={
              searchValuesLocation !== 0
                ? "search-month-location-null"
                : "search-month-location-null"
            }
          >
            <Select
              onChange={() => {
                localStorage.setItem(
                  "location",
                  searchFormProps.form?.getFieldsValue()?.location !== undefined
                    ? searchFormProps.form?.getFieldsValue()?.location
                    : ""
                );
                searchFormProps.form?.submit();
                searchParams.set(
                  "location",
                  JSON.stringify(
                    searchFormProps.form?.getFieldsValue()?.location
                  )
                );
                setSearchParams(searchParams);
              }}
              placeholder="Tất cả"
            >
              <Option value={0}>{"Tất cả"}</Option>
              {locationSelectProps.options?.map((item: any) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
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
        title={t("hardware.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <HardwareSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <HardwareCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <HardwareEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <HardwareClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <HardwareCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <HardwareShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
        />
      </MModal>{" "}
      <MModal
        title={t("hardware.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <HardwareCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
        />
      </MModal>
      <div className="sum-assets">
        <span className="name-sum-assets">
          {t("hardware.label.title.sum-assets")}
        </span>{" "}
        : {tableProps.pagination ? tableProps.pagination?.total : 0}
      </div>
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
          scroll={{ x: 1850 }}
          pagination={{
            position: ["topRight", "bottomRight"],
            total: pageTotal ? pageTotal : 0,
          }}
        >
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column dataIndex={col.key} {...col} sorter />
            ))}
          <Table.Column<IHardwareResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("hardware.label.tooltip.viewDetail")}
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
                  title={t("hardware.label.tooltip.clone")}
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
                  title={t("hardware.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>
                <Tooltip
                  title={t("hardware.label.tooltip.delete")}
                  color={"red"}
                >
                  <DeleteButton
                    resourceName={HARDWARE_API}
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Tooltip>
                {record.user_can_checkout === true &&
                  record.status_label.id === 4 && (
                    <Button
                      className="ant-btn-checkout"
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
                      onClick={() => checkout(record)}
                    >
                      {t("hardware.label.button.checkout")}
                    </Button>
                  )}

                {record.assigned_status === 2 ? (
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
                    onClick={() => checkin(record)}
                  >
                    {t("hardware.label.button.checkin")}
                  </Button>
                ) : record.assigned_status === 3 ? (
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
                    onClick={() => checkin(record)}
                  >
                    {t("hardware.label.button.checkin")}
                  </Button>
                ) : (
                  ""
                )}
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
