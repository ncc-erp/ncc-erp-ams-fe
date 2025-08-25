import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  HttpError,
  usePermissions,
} from "@pankod/refine-core";
import {
  List,
  Table,
  useTable,
  Space,
  CloneButton,
  EditButton,
  DeleteButton,
  CreateButton,
  Button,
  ShowButton,
  Tooltip,
  Checkbox,
  Form,
  Select,
  useSelect,
} from "@pankod/refine-antd";
import { Spin } from "antd";
import "styles/antd.less";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { DatePicker } from "antd";

import { TableAction } from "components/elements/tables/TableAction";
import { TotalDetail } from "components/elements/TotalDetail";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareClone } from "./clone";
import { HardwareShow } from "./show";
import { HardwareSearch } from "./search";

import {
  IHardwareFilterVariables,
  IHardwareResponse,
  IHardwareResponseCheckin,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { HardwareCheckout } from "./checkout";
import { HardwareCheckin } from "./checkin";
import {
  HARDWARE_CUSTOMER_RENTING_API,
  CATEGORIES_API,
  STATUS_LABELS_API,
  HARDWARE_RENTAL_DETAILS,
  LOCATION_API,
} from "api/baseApi";
import { EPermissions } from "constants/permissions";
import { convertHardwareToEditData } from "utils/ConvertHardwareData";
import { dateFormat } from "constants/assets";
import { ICategory } from "interfaces/categories";
import { IStatusLabel } from "interfaces/statusLabel";
import { ICompany } from "interfaces/company";
import {
  MenuOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useRentalCustomerColumns } from "./table-column-rental-customers";

const defaultCheckedList = [
  "id",
  "name",
  "image",
  "asset_tag",
  "serial",
  "model",
  "category",
  "status_label",
  "assigned_to",
  "location",
  "rtd_location",
  "isCustomerRenting",
  "created_at",
  "startRentalDate",
];

export const HardwareListRentalCustomers: React.FC<
  IResourceComponentsProps
> = () => {
  const t = useTranslate();
  const { RangePicker } = DatePicker;

  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_selected_rental_customers") !== null
      ? JSON.parse(
          localStorage.getItem("item_selected_rental_customers") as any
        )
      : defaultCheckedList
  );

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const [detailCheckout, setDetailCheckout] =
    useState<IHardwareResponseCheckout>();
  const [detailCheckin, setDetailCheckin] =
    useState<IHardwareResponseCheckin>();
  const [detailClone, setDetailClone] = useState<IHardwareResponse>();

  // UI states
  const [isActive, setIsActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingArr] = useState<boolean[]>([]);

  const menuRef = useRef(null);
  const onClickDropDown = () => setIsActive(!isActive);

  // Search params
  const searchParam = searchParams.get("search");
  const rtd_location_id = searchParams.get("rtd_location_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

  const { data: permissionsData } = usePermissions();
  const isAdmin = useMemo(
    () => permissionsData?.admin === EPermissions.ADMIN,
    [permissionsData]
  );

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<IHardwareResponse, HttpError, IHardwareFilterVariables>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      initialFilter: [
        {
          field: "isCustomerRenting",
          operator: "eq",
          value: true,
        },
      ],
      resource: HARDWARE_CUSTOMER_RENTING_API,
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
            value: search || searchParam,
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
            value: location || rtd_location_id,
          },
          {
            field: "startRentalDate",
            operator: "gte",
            value: purchase_date?.[0]?.format("YYYY-MM-DD") || dateFromParam,
          },
          {
            field: "startRentalDate",
            operator: "lte",
            value: purchase_date?.[1]?.format("YYYY-MM-DD") || dateToParam,
          },
          {
            field: "startRentalDate",
            operator: "eq",
            value: searchParams.get("startRentalDate"),
          }
        );
        return filters;
      },
    });

  // Select data for filters
  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: CATEGORIES_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

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

  const filterCategory = categorySelectProps?.options?.map((item) => ({
    text: String(item.label),
    value: String(item.value),
  }));

  const filterStatus_Label = statusLabelSelectProps?.options?.map((item) => ({
    text: String(item.label),
    value: String(item.value),
  }));

  // Use columns hook
  const collumns = useRentalCustomerColumns({
    sorter,
    filterCategory,
    filterStatus_Label,
  });

  // Action handlers
  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  const edit = (data: IHardwareResponse) => {
    const dataConvert = convertHardwareToEditData(data);
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IHardwareResponse) => {
    const dataConvert = convertHardwareToEditData(data);
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
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      last_checkout: {
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      assigned_user: data?.assigned_user,
      model_number: data?.model_number,
      assigned_asset: data?.assigned_asset,
      checkout_to_type: data?.checkout_to_type,
      user_can_checkout: data?.user_can_checkout,
      isCustomerRenting: data?.isCustomerRenting,
      startRentalDate: data?.startRentalDate,
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
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      },
      assigned_to: {
        id: data?.assigned_to.id,
        username: data?.assigned_to.username,
        last_name: data?.assigned_to.last_name,
        first_name: data?.assigned_to.first_name,
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

  // UI handlers
  const handleCreate = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSearch = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
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

  const onCheckItem = (value: any) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };

  // Date and location handlers
  const searchValuesByDateFrom = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(0, 10);
  }, [localStorage.getItem("purchase_date")]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(11, 21);
  }, [localStorage.getItem("purchase_date")]);

  const searchValuesLocation = useMemo(() => {
    return Number(localStorage.getItem("rtd_location_id"));
  }, [localStorage.getItem("rtd_location_id")]);

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []) as moment.Moment[];
      localStorage.setItem("purchase_date", formatString ?? "");
      searchParams.set(
        "dateFrom",
        from?.format("YYYY-MM-DD") ? from?.format("YYYY-MM-DD").toString() : ""
      );
      searchParams.set(
        "dateTo",
        to?.format("YYYY-MM-DD") ? to?.format("YYYY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete("dateFrom");
      searchParams.delete("dateTo");
      localStorage.setItem("purchase_date", formatString ?? "");
    }

    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  const handleChangeLocation = (value: number) => {
    if (value === 0) {
      searchParams.delete("rtd_location_id");
      localStorage.setItem(
        "rtd_location_id",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
    } else {
      localStorage.setItem(
        "rtd_location_id",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
      searchParams.set(
        "rtd_location_id",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location)
      );
    }

    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  // Outside click listener
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

  // Effects
  useEffect(() => {
    localStorage.setItem(
      "item_selected_rental_customers",
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  useEffect(() => {
    setIsTotalDetailReload(!isTotalDetailReload);
  }, [isModalVisible]);

  useEffect(() => {
    refreshData();
  }, [
    isEditModalVisible,
    isCloneModalVisible,
    isCheckoutModalVisible,
    isCheckinModalVisible,
  ]);

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;
  const { Option } = Select;

  return (
    <List
      title={
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {t("hardware.label.title.rentalCustomers")}
        </div>
      }
      pageHeaderProps={{
        extra: isAdmin && (
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
            label={t("hardware.label.title.time-rental")}
            name="purchase_date"
          >
            <RangePicker
              onChange={handleChangePickerByMonth}
              format={dateFormat}
              placeholder={[
                `${t("hardware.label.field.start-date")}`,
                `${t("hardware.label.field.end-date")}`,
              ]}
              defaultValue={
                localStorage.getItem("purchase_date") !== null
                  ? searchValuesByDateFrom !== "" && searchValuesByDateTo !== ""
                    ? [
                        moment(searchValuesByDateFrom),
                        moment(searchValuesByDateTo),
                      ]
                    : dateFromParam && dateToParam
                      ? [moment(dateFromParam), moment(dateToParam)]
                      : undefined
                  : undefined
              }
            />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.title.location")}
            name="location"
            className="search-month-location-null"
          >
            <Select onChange={handleChangeLocation} placeholder={t("all")}>
              <Option value={0}>{t("all")}</Option>
              {locationSelectProps.options?.map((item: any) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
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

      {/* Modals */}
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
          fromRentalPage={true}
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
        key={`checkout-${isCheckoutModalVisible}`}
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
      </MModal>

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

      <TotalDetail
        filters={filters}
        links={HARDWARE_RENTAL_DETAILS}
        isReload={isTotalDetailReload}
      />

      {loading ? (
        <div style={{ paddingTop: "15rem", textAlign: "center" }}>
          <Spin
            tip={`${t("loading")}...`}
            style={{ fontSize: "18px", color: "black" }}
          />
        </div>
      ) : (
        <Table
          className={(pageTotal as number) <= 10 ? "list-table" : ""}
          {...tableProps}
          rowKey="id"
          scroll={{ x: 1850 }}
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
              <Table.Column
                dataIndex={col.key}
                {...(col as any)}
                key={col.key}
                sorter
              />
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
                    resourceName={HARDWARE_CUSTOMER_RENTING_API}
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onSuccess={() => {
                      setIsTotalDetailReload(!isTotalDetailReload);
                    }}
                  />
                </Tooltip>

                {record.user_can_checkout === true && (
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

                {record.user_can_checkin === true && (
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
                )}
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
