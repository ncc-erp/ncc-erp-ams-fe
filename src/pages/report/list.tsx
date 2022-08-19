import {
  DateField,
  Form,
  List,
  Select,
  Table,
  TagField,
  TextField,
  useSelect,
  useTable,
} from "@pankod/refine-antd";
import {
  CrudFilters,
  IResourceComponentsProps,
  useNavigation,
  useTranslate,
} from "@pankod/refine-core";
import { useEffect, useMemo, useState } from "react";
import { IReport, IReportResponse } from "interfaces/report";
import { ASSET_HISTORY_API, LOCATION_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { DatePicker } from "antd";
import { ActionType, dateFormat, TypeAssetHistory } from "constants/assets";
import { TableAction } from "components/elements/tables/TableAction";

const { RangePicker } = DatePicker;

export const ReportList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { list } = useNavigation();

  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get("location_id");
  const dateFromParam = searchParams.get("date_from");
  const dateToParam = searchParams.get("date_to");
  const assetHistoryType = searchParams.get("action_type");
  const searchParam = searchParams.get("search");

  const [search, setSearch] = useState<string>("");

  const { Option } = Select;

  const { tableProps, searchFormProps } = useTable<IReportResponse>({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: ASSET_HISTORY_API,
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      let { search, location_id, date_from, date_to, action_type } = params;
      filters.push(
        {
          field: "search",
          operator: "eq",
          value: searchParam,
        },
        {
          field: "location_id",
          operator: "eq",
          value: location,
        },
        {
          field: "date_from",
          operator: "eq",
          value: dateFromParam,
        },
        {
          field: "date_to",
          operator: "eq",
          value: dateToParam,
        },
        {
          field: "action_type",
          operator: "eq",
          value: assetHistoryType?.split('"').join(""),
        }
      );
      return filters;
    },
  });

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  function getActionTypeValue(type: string) {
    return (ActionType as any)[type];
  }

  function getColorActionType(type: string) {
    if (type === TypeAssetHistory.CHECKOUT) {
      return "#0073b7";
    } else if (type === TypeAssetHistory.CHECKIN) {
      return "red";
    } else {
      return "gray";
    }
  }

  function onClickNameReport(name: string) {
    return list(
      `assets?search=${name.substring(
        name.indexOf("(") + 1,
        name.indexOf(")")
      )}`
    );
  }

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: translate("report.label.field.id"),
        render: (value: IReport) => <TextField value={value ? value : ""} />,
      },
      {
        key: "item",
        title: translate("report.label.field.asset"),
        render: (value: IReport) => (
          <TextField
            style={{"cursor": "pointer"}}
            onClick={() => onClickNameReport(value.name)}
            value={value ? value.name : ""}
          />
        ),
      },
      {
        key: "item",
        title: translate("report.label.field.assetType"),
        render: (value: IReport) => (
          <TextField value={value ? value.type : ""} />
        ),
      },
      {
        key: "admin",
        title: translate("report.label.field.manager"),
        render: (value: IReport) => (
          <TextField value={value ? value.name : ""} />
        ),
      },
      {
        key: "target",
        title: translate("report.label.field.user"),
        render: (value: IReport) => (
          <TextField value={value ? value.name : ""} />
        ),
      },
      {
        key: "action_type",
        title: translate("report.label.field.type"),
        render: (type: string) => (
          <TagField
            value={getActionTypeValue(type)}
            style={{
              background: getColorActionType(type),
              color: "white",
            }}
          />
        ),
      },
      {
        key: "created_at",
        title: translate("report.label.field.dateCheckout_And_dateCheckin"),
        render: (value: IReport) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
      },
      {
        key: "note",
        title: translate("report.label.field.note"),
        render: (value: string) => (
          <TextField value={value && value !== "undefined" ? value : ""} />
        ),
      },
      // {
      //   key: "log_meta",
      //   title: translate("report.label.field.logMeta"),
      //   render: (value: IReport) => (
      //     <TextField value={value && value.checkin_counter ? JSON.stringify(value.checkin_counter ) : ""} />
      //   ),
      // },
    ],
    []
  );

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

  const handleLocationChange = (value: {
    value: string;
    label: React.ReactNode;
  }) => {
    if (JSON.stringify(value) === JSON.stringify("all")) {
      searchParams.delete("location_id");
    } else searchParams.set("location_id", JSON.stringify(value));
    searchFormProps.form?.submit();
    setSearchParams(searchParams);
  };

  const handleTypeChange = (value: {
    value: string;
    label: React.ReactNode;
  }) => {
    if (JSON.stringify(value) === JSON.stringify("all")) {
      searchParams.delete("action_type");
    } else searchParams.set("action_type", JSON.stringify(value));
    searchFormProps.form?.submit();
    setSearchParams(searchParams);
  };

  const handleDateChange = (value: any) => {
    const [from, to] = Array.from(value || []);
    searchParams.set(
      "date_from",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams.set(
      "date_to",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    searchFormProps.form?.submit();
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (searchParams.get("search") && search === " ") {
      searchParams.delete("search");
    }
  }, [search]);

  return (
    <List title={translate("report.label.title.name")}>
      <div className="search" style={{ marginBottom: "20px" }}>
        <Form
          layout="vertical"
          className="search-month-location"
          initialValues={{
            location: location ? Number(location) : translate("all"),
            created_at:
              dateFromParam && dateToParam
                ? [
                    moment(dateFromParam, dateFormat),
                    moment(dateToParam, dateFormat),
                  ]
                : "",
            type: searchParams.get("action_type")
              ? Number(assetHistoryType)
              : translate("all"),
          }}
        >
          <Form.Item
            label={translate("dashboard.placeholder.searchToDate")}
            name="created_at"
          >
            <RangePicker
              onCalendarChange={handleDateChange}
              format={dateFormat}
              placeholder={[
                `${translate("dashboard.field.start-date")}`,
                `${translate("dashboard.field.end-date")}`,
              ]}
            />
          </Form.Item>

          <Form.Item
            label={translate("hardware.label.title.location")}
            name="location"
            initialValue={"all"}
            className="search-month-location-null"
          >
            <Select onChange={handleLocationChange} placeholder="Vị trí">
              <Option value={"all"}>{translate("all")}</Option>
              {locationSelectProps.options?.map((item: any) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại"
            name="type"
            className="search-month-location-null"
          >
            <Select onChange={handleTypeChange} placeholder="Loại">
              <Option value={"all"}>{translate("all")}</Option>
              {Object.entries(ActionType).map(([key, value]) => {
                if (key !== "create new") {
                  return <Option value={key}>{value}</Option>;
                }
              })}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="report">
        <div className="sum-report">
          <span className="name-sum-report">
            {translate("dashboard.field.sum-report")}
          </span>{" "}
          : {tableProps.pagination ? tableProps.pagination?.total : 0}
        </div>
        <div className="search-report">
          <TableAction searchFormProps={searchFormProps} />
        </div>
      </div>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1850 }}
        pagination={{
          position: ["topRight", "bottomRight"],
          total: pageTotal ? pageTotal : 0,
        }}
      >
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
      </Table>
    </List>
  );
};
