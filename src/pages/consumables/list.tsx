/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  CreateButton,
  DateField,
  DatePicker,
  DeleteButton,
  EditButton,
  Form,
  getDefaultSortOrder,
  List,
  Select,
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
  useTranslate,
} from "@pankod/refine-core";
import { CONSUMABLE_API, LOCATION_API } from "api/baseApi";
import { TableAction } from "components/elements/tables/TableAction";
import { MModal } from "components/Modal/MModal";
import {
  IConsumablesFilterVariables,
  IConsumablesRequest,
  IConsumablesResponse,
} from "interfaces/consumables";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConsumablesCreate } from "./create";
import { SyncOutlined, MenuOutlined } from "@ant-design/icons";
import { ICompany } from "interfaces/company";
import moment from "moment";
import { dateFormat } from "constants/assets";

const defaultCheckedList = [
  "id",
  "name",
  "category",
  "purchase_date",
  "manufacturer",
  "location",
  "qty",
  "notes",
];

export const ConsumablesList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isLoadingArr] = useState<boolean[]>([]);

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_consumables_selected") !== null
      ? JSON.parse(localStorage.getItem("item_consumables_selected") as string)
      : defaultCheckedList
  );
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location_id = searchParams.get("location_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");
  const searchParam = searchParams.get("search");

  const { tableProps, searchFormProps, sorter, tableQueryResult } = useTable<
    IConsumablesResponse,
    HttpError,
    IConsumablesFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: CONSUMABLE_API,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      let { search, location, purchase_date } = params;
      filters.push(
        {
          field: "search",
          operator: "eq",
          value: search ? search : searchParam,
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

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: translate("consumables.label.field.name"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "category",
        title: translate("consumables.label.field.category"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },

      {
        key: "manufacturer",
        title: translate("consumables.label.field.manufacturer"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
      },
      {
        key: "location",
        title: translate("consumables.label.field.location"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "purchase_date",
        title: translate("consumables.label.field.purchase_date"),
        render: (value: IConsumablesRequest) =>
          value ? (
            <DateField format="LLL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
      },
      {
        key: "notes",
        title: translate("consumables.label.field.notes"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
    ],
    []
  );

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const handleCreate = () => {
    handleOpenModel();
  };

  const handleOpenModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const onCheckItem = (value: { key: string }) => {
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
      "item_consumables_selected",
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

  const pageTotal = tableProps.pagination && tableProps.pagination.total;
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  let searchValuesLocation = useMemo(() => {
    return Number(localStorage.getItem("location_id"));
  }, [localStorage.getItem("location_id")]);
  const searchValuesByDateFrom = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(0, 10);
  }, [localStorage.getItem("purchase_date")]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage.getItem("purchase_date")?.substring(11, 21);
  }, [localStorage.getItem("purchase_date")]);

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

  return (
    <List
      title={translate("consumables.label.title.consumables")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {translate("consumables.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search">
        <Form
          {...searchFormProps}
          initialValues={{
            location:
              localStorage.getItem("location_id") !== null ??
              searchValuesLocation !== 0
                ? searchValuesLocation
                : Number(location_id) ?? Number(location_id),
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
            label={translate("consumables.label.title.date")}
            name="purchase_date"
          >
            <RangePicker
              onChange={handleChangePickerByMonth}
              format={dateFormat}
              placeholder={[
                `${translate("consumables.label.field.start-date")}`,
                `${translate("consumables.label.field.end-date")}`,
              ]}
            />
          </Form.Item>
          <Form.Item
            label={translate("consumables.label.field.location")}
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
              placeholder={translate("all")}
            >
              <Option value={0}>{translate("all")}</Option>
              {locationSelectProps.options?.map((item: any) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="all-search">
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
                  title={translate("consumables.label.tooltip.refresh")}
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
                  title={translate("consumables.label.tooltip.columns")}
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
        </div>
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
          scroll={{ x: 1220 }}
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
          <Table.Column<IConsumablesResponse>
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={translate("consumables.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton hideText size="small" recordItemId={record.id} />
                </Tooltip>
                <DeleteButton
                  resourceName={CONSUMABLE_API}
                  hideText
                  size="small"
                  recordItemId={record.id}
                />

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
                  >
                    {translate("consumables.label.button.checkout")}
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      )}
      <MModal
        title={translate("consumables.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <ConsumablesCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
    </List>
  );
};
