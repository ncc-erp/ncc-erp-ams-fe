import {
  DateField,
  Form,
  Input,
  List,
  Select,
  Table,
  TagField,
  TextField,
  useSelect,
} from "@pankod/refine-antd";
import {
  IResourceComponentsProps,
  useCustom,
  useTranslate,
} from "@pankod/refine-core";
import { useEffect, useMemo, useState } from "react";
import { IReport } from "interfaces/report";
import { ASSET_HISTORY_API, LOCATION_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { DatePicker } from "antd";
import { TypeAssetHistory } from "constants/assets";

const { RangePicker } = DatePicker;

export const ReportList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  const location_id = searchParams.get("location");
  const dateFromParam = searchParams.get("purchaseDateFrom");
  const dateToParam = searchParams.get("purchaseDateTo");
  const assetHistoryType = searchParams.get("assetHistoryType");

  const [search, setSearch] = useState<string>("");

  const { Option } = Select;
  const { Search } = Input;

  const { data } = useCustom<any>({
    url: ASSET_HISTORY_API,
    method: "get",
    config: {
      query: {
        location: searchParams.get("location"),
        purchaseDateFrom: searchParams.get("purchaseDateFrom"),
        purchaseDateTo: searchParams.get("purchaseDateTo"),
        assetHistoryType: searchParams.get("assetHistoryType"),
        category_id: searchParams.get("category_id"),
      },
      filters: [
        {
          field: "name",
          operator: "eq",
          value: search,
        },
      ],
    },
  });

  const collumns = useMemo(
    () => [
      {
        key: "asset",
        title: translate("report.label.field.name"),
        render: (value: IReport) => (
          <TextField value={value ? value.name : ""} />
        ),
      },
      {
        key: "asset",
        title: translate("report.label.field.propertyCard"),
        render: (value: IReport) => (
          <TextField value={value ? value.asset_tag : ""} />
        ),
      },
      {
        key: "asset_history",
        title: translate("report.label.field.type"),
        render: (value: IReport) => (
          <TagField
            value={
              value && value.type === TypeAssetHistory.CHECKOUT
                ? translate("hardware.label.title.checkout")
                : translate("hardware.label.title.checkin")
            }
            style={{
              background:
                value && value.type === TypeAssetHistory.CHECKOUT
                  ? "#0073b7"
                  : "red",
              color: "white",
            }}
          />
        ),
      },
      {
        key: "asset_history",
        title: translate("report.label.field.user"),
        render: (value: IReport) => (
          <TextField
            value={
              value && value.user
                ? value.user.last_name + " " + value.user.first_name
                : ""
            }
          />
        ),
      },
      {
        key: "asset",
        title: translate("report.label.field.note"),
        render: (value: IReport) => (
          <TextField
            value={value && (value.notes !== "undefined" ? value.notes : "")}
          />
        ),
      },
      {
        key: "asset_history",
        title: translate("report.label.field.dateCheckout_And_dateCheckin"),
        render: (value: IReport) =>
          value ? (
            <DateField format="LLL" value={value ? value.created_at : ""} />
          ) : (
            ""
          ),
      },
    ],
    []
  );

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

  const handleLocationChange = (value: {
    value: string;
    label: React.ReactNode;
  }) => {
    if (JSON.stringify(value) === JSON.stringify("all")) {
      searchParams.delete("location");
    } else searchParams.set("location", JSON.stringify(value));
    setSearchParams(searchParams);
  };

  const handleTypeChange = (value: {
    value: string;
    label: React.ReactNode;
  }) => {
    if (JSON.stringify(value) === JSON.stringify("all")) {
      searchParams.delete("assetHistoryType");
    } else searchParams.set("assetHistoryType", JSON.stringify(value));
    setSearchParams(searchParams);
  };

  const handleDateChange = (value: any) => {
    const [from, to] = Array.from(value || []);
    searchParams.set(
      "purchaseDateFrom",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams.set(
      "purchaseDateTo",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    setSearchParams(searchParams);
  };

  const handleSearchByName = (value: any) => {
    searchParams.set("search_name", value ? value : "");
    setSearchParams(searchParams);
    setSearch(value);
  };

  useEffect(() => {
    if (searchParams.get("search_name") && search === " ") {
      searchParams.delete("search_name");
    }
  }, [search]);

  return (
    <List title={translate("report.label.title.name")}>
      <div className="search" style={{ marginBottom: "20px" }}>
        <Form
          layout="vertical"
          className="search-month-location"
          initialValues={{
            location: location_id ? Number(location_id) : translate("all"),
            purchase_date:
              dateFromParam && dateToParam
                ? [
                    moment(dateFromParam, dateFormat),
                    moment(dateToParam, dateFormat),
                  ]
                : "",
            type: searchParams.get("assetHistoryType")
              ? Number(assetHistoryType)
              : translate("all"),
          }}
        >
          <Form.Item
            label={translate("dashboard.placeholder.searchToDate")}
            name="purchase_date"
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
            label="Vị trí"
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
              <Option value={TypeAssetHistory.CHECKOUT}>
                {translate("hardware.label.title.checkout")}
              </Option>
              <Option value={TypeAssetHistory.CHECKIN}>
                {translate("hardware.label.title.checkin")}
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="report">
        <div className="sum-report">
          <span className="name-sum-report">
            {translate("dashboard.field.sum-report")}
          </span>{" "}
          : {data ? data.data.length : 0}
        </div>
        <div className="search-report">
          <Form
            initialValues={{
              name:
                searchParams.get("search_name") !== ""
                  ? searchParams.get("search_name")
                  : "",
            }}
          >
            <Form.Item name={"name"}>
              <Search
                placeholder={translate("table.search")}
                onChange={(event) => handleSearchByName(event.target.value)}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </div>
      </div>

      <Table
        dataSource={data?.data}
        rowKey="id"
        scroll={{ x: 1400 }}
        pagination={data?.data.length <= 10 ? false : { pageSize: 10 }}
      >
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
      </Table>
    </List>
  );
};
