/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Show, Select, Form } from "@pankod/refine-antd";
import { DatePicker } from "antd";
import "styles/antd.less";
import { Locations } from "components/dashboard/locations";
import {
  IResourceComponentsProps,
  useCustom,
  useTranslate,
} from "@pankod/refine-core";
import "styles/antd.less";

import { DASHBOARD_API } from "api/baseApi";
import { useEffect, useState } from "react";
import { ILocation } from "interfaces/dashboard";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { AllLocations } from "components/dashboard/locations/index-all-location";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";

  const [locationSelected, setLocationSelected] = useState<number | null>(6);
  const [dateSelected, setDateSelected] = useState<[string, string]>(["", ""]);

  const [searchParams] = useSearchParams();
  const purchase_date_from = searchParams.get("purchase_date_from");
  const purchase_date_to = searchParams.get("purchase_date_to");
  const location_id = searchParams.get("location_id");

  const { data, isLoading, refetch } = useCustom({
    url: DASHBOARD_API,
    method: "get",
    config: {
      query: {
        purchase_date_from: dateSelected[0],
        purchase_date_to: dateSelected[1],
        location_id: locationSelected,
      },
    },
  });

  const handleChangeLocation = (value: any) => {
    if (value) {
      localStorage.setItem("location", value !== undefined ? value : "");
      setLocationSelected(value);
      refetch();
    }
  };

  const handleChangePickerByMonth = (values: any, formatString: any) => {
    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    setDateSelected(formatString);
  };

  useEffect(() => {
    if (location_id) {
      setLocationSelected(location_id as any);
    }
  }, [location_id]);

  useEffect(() => {
    if (purchase_date_from && purchase_date_to) {
      setDateSelected([purchase_date_from, purchase_date_to]);
    }
  }, [purchase_date_from, purchase_date_to]);
  return (
    <div className="dashboardContainer">
      <Show isLoading={isLoading} title={translate("dashboard.title")}>
      <section className="all-location">
          <span className="title-section-dashboard">
            {translate("dashboard.field.tilte-section-2")}
          </span>
          <div className="search-all-location">
            <Form
              initialValues={{
                purchase_date:
                  purchase_date_from && purchase_date_to
                    ? [
                        moment(purchase_date_from, dateFormat),
                        moment(purchase_date_to, dateFormat),
                      ]
                    : "",
              }}
              layout="vertical"
              className="search-month-location"
            >
              <Form.Item label={translate("dashboard.field.search-date")} name="purchase_date">
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonth}
                  placeholder={[`${translate("dashboard.field.start-date")}`, `${translate("dashboard.field.end-date")}`]} 
                />
              </Form.Item>
            </Form>
          </div>

          <Row gutter={[12, 12]}>
            {(data?.data.payload || [])
              .map((item: ILocation, index: number) => (
                <Col key={index} sm={24} md={24}>
                  <Locations location={item} data={data}></Locations>
                </Col>
              ))}
          </Row>
        </section>
        <section className="all-location">
          <span className="title-section-dashboard">
          {translate("dashboard.field.tilte-section-1")}
          </span>
          <div className="search">
            <Form
              initialValues={{
                location: location_id ? Number(location_id) : 6,
                purchase_date:
                  purchase_date_from && purchase_date_to
                    ? [
                        moment(purchase_date_from, dateFormat),
                        moment(purchase_date_to, dateFormat),
                      ]
                    : "",
              }}
              layout="vertical"
              className="search-month-location"
            >
              <Form.Item label={translate("dashboard.field.search-location")} name="location">
                <Select
                  allowClear
                  placeholder={
                    locationSelected === null
                      ? translate("dashboard.placeholder.select-category")
                      : translate("dashboard.placeholder.select-category")
                  }
                  onChange={(value: number) => handleChangeLocation(value)}
                  className="selected-location" 
                >
                  {(data?.data.payload || []).map((item: ILocation) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={translate("dashboard.field.search-date")} name="purchase_date">
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonth}
                  placeholder={[`${translate("dashboard.field.start-date")}`, `${translate("dashboard.field.end-date")}`]} 
                />
              </Form.Item>
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
                  <AllLocations location={item}></AllLocations>
                </Col>
              ))}
          </Row>
        </section>
      </Show>
    </div>
  );
};
