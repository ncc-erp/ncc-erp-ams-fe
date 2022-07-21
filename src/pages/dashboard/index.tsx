import { Row, Col, Show, Select, Form, DatePicker } from "@pankod/refine-antd";
import "styles/antd.less";
import { Locations } from "components/dashboard/locations";
import {
  IResourceComponentsProps,
  useCustom,
  useTranslate,
} from "@pankod/refine-core";

import { DASHBOARD_API } from "api/baseApi";
import { useState } from "react";
import { ILocation } from "interfaces/dashboard";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { RangePicker } = DatePicker;

  const [locationSelected, setLocationSelected] = useState<number | null>(null);
  const [dateSelected, setDateSelected] = useState<[string, string]>(["", ""]);

  const { data, isLoading, refetch } = useCustom({
    url: DASHBOARD_API,
    method: "get",
    config: {
      query: {
        purchase_date_from: dateSelected[0],
        purchase_date_to: dateSelected[1],
      },
    },
  });

  const handleChangeLocation = (value: number) => {
    if (value) {
      setLocationSelected(value);
    }
  };

  const handleChangePickerByMonth = (
    values: any,
    formatString: [string, string]
  ) => {
    setDateSelected(formatString);
    refetch();
  };

  return (
    <div className="dashboardContainer">
      <Show isLoading={isLoading} title={translate("dashboard.title")}>
        <div className="dashboard-search-select">
          <Select
            allowClear
            placeholder={translate("dashboard.placeholder.select-category")}
            onChange={handleChangeLocation}
            defaultValue={data?.data.payload[data?.data.payload.length - 1]}
          >
            {(data?.data.payload || []).map((item: ILocation) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>

          <Form layout="vertical" className="search-month-to-location">
            <RangePicker
              format="YYYY-MM-DD"
              onChange={handleChangePickerByMonth}
            />
          </Form>
        </div>

        <Row gutter={[12, 12]}>
          {(data?.data.payload || [])
            .filter(
              (item: ILocation) =>
                locationSelected === null || item.id === locationSelected
            )
            .map((item: ILocation, index: number) => (
              <Col key={index} sm={24} md={24}>
                <Locations location={item}></Locations>
              </Col>
            ))}
        </Row>
      </Show>
    </div>
  );
};
