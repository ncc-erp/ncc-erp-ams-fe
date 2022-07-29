import {
  DateField,
  DatePicker,
  Form,
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
import { useMemo } from "react";
import { IReport } from "interfaces/report";
import { LOCATION_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import { useSearchParams } from "react-router-dom";

const { RangePicker } = DatePicker;

export const ReportList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useCustom<any>({
    url: "api/v1/asset-history",
    method: "get",
    config: {
      query: {
        location: searchParams.get("location"),
        purchaseDateFrom: searchParams.get("dateFrom"),
        purchaseDateTo: searchParams.get("dateTo"),
        assetHistoryType: "",
      },
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
        key: "asset",
        title: translate("hardware.label.field.condition"),
        render: (value: IReport) => (
          <TagField
            value={
              value &&
              (value.assigned_status === 0
                ? translate("hardware.label.detail.noAssign")
                : value.assigned_status === 1
                ? translate("hardware.label.detail.pendingAccept")
                : value.assigned_status === 2
                ? translate("hardware.label.detail.accept")
                : value.assigned_status === 3
                ? translate("hardware.label.detail.refuse")
                : "")
            }
            style={{
              background:
                value &&
                (value.assigned_status === 0
                  ? "gray"
                  : value.assigned_status === 1
                  ? "#f39c12"
                  : value.assigned_status === 2
                  ? "#0073b7"
                  : value.assigned_status === 3
                  ? "red"
                  : "gray"),
              color: "white",
            }}
          />
        ),
      },
      {
        key: "asset_history",
        title: translate("report.label.field.type"),
        render: (value: IReport) => (
          <TagField
            value={value.type === 0 ? "Cấp phát" : "Thu hồi"}
            style={{
              background: value.type === 0 ? "#0073b7" : "red",
              color: "white",
            }}
          />
        ),
      },

      {
        key: "asset",
        title: translate("report.label.field.note"),
        render: (value: IReport) => (
          <TextField value={value ? value.notes : ""} />
        ),
      },
      {
        key: "created_at",
        title: translate("report.label.field.dateCreate"),
        render: (value: IReport) => (
          <DateField format="LLL" value={value ? value.created_at : ""} />
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
    searchParams.set("location", JSON.stringify(value));
    setSearchParams(searchParams);
  };

  const handleDateChange = (val: any) => {
    const [from, to] = Array.from(val || []);
    searchParams.set(
      "dateFrom",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams.set(
      "dateTo",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    setSearchParams(searchParams);
  };

  return (
    <List title={translate("report.label.title.name")}>
      <div className="search" style={{ marginBottom: "20px" }}>
        <Form layout="vertical" className="search-month-location">
          <Form.Item label="Thời gian" name="purchase_date">
            <RangePicker
              onCalendarChange={handleDateChange}
              format={dateFormat}
              placeholder={[
                `${translate("dashboard.field.start-date")}`,
                `${translate("dashboard.field.end-date")}`,
              ]}
            />
          </Form.Item>

          <Form.Item label="Vị trí" name="location">
            <Select
              onChange={handleLocationChange}
              {...locationSelectProps}
              placeholder="Lựa chọn vị trí"
            />
          </Form.Item>
        </Form>
      </div>
      <Table dataSource={data?.data} rowKey="id">
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
      </Table>
    </List>
  );
};
