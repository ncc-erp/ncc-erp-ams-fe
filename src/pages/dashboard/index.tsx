/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Select, Form, List } from "@pankod/refine-antd";
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
import { AllLocations } from "components/dashboard/locations/index-all-location";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";

  const [locationSelected, setLocationSelected] = useState<number | null>(6);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams1, setSearchParams1] = useSearchParams();

  const [dataDashboard, setDataDasshboard] = useState<[string, string]>([
    "",
    "",
  ]);
  const purchase_date_from = searchParams.get("purchase_date_from");
  const purchase_date_to = searchParams.get("purchase_date_to");

  const purchase_date_from1 = searchParams.get("purchase_date_from1");
  const purchase_date_to1 = searchParams.get("purchase_date_to1");

  const { data, isLoading } = useCustom({
    url: DASHBOARD_API,
    method: "get",
    config: {
      query: {
        purchase_date_from: purchase_date_from
          ? purchase_date_from
          : dataDashboard[0],
        purchase_date_to: purchase_date_to
          ? purchase_date_to
          : dataDashboard[1],
        location: searchParams.get("location"),
      },
    },
  });

  const { data: data1 } = useCustom({
    url: DASHBOARD_API,
    method: "get",
    config: {
      query: {
        purchase_date_from: purchase_date_from1
          ? purchase_date_from1
          : dataDashboard[0],
        purchase_date_to: purchase_date_to1
          ? purchase_date_to1
          : dataDashboard[1],
        location: searchParams.get("location"),
      },
    },
  });
  const [nameSearch, setNameSearch] = useState(
    "Tổng số lượng thiết bị của các văn phòng"
  );

  const handleChangeLocation = (value: any) => {
    localStorage.setItem("location", value !== undefined ? value : "");
    setLocationSelected(value);
    searchParams.set("location", JSON.stringify(value));
    setSearchParams(searchParams);
  };

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    const [from, to] = Array.from(val || []);
    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    searchParams.set(
      "purchase_date_from",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams.set(
      "purchase_date_to",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    setSearchParams(searchParams);
    setNameSearch(
      `Số lượng thiết bị của các văn phòng trong khoảng thời gian: ${searchParams.get(
        "purchase_date_from"
      )} đến ${searchParams.get("purchase_date_to")}`
    );
  };

  const handleChangePickerByMonthByCategory = (val: any, formatString: any) => {
    const [from, to] = Array.from(val || []);
    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    searchParams1.set(
      "purchase_date_from1",
      from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
    );
    searchParams1.set(
      "purchase_date_to1",
      to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
    );
    setSearchParams1(searchParams1);
    setNameSearch(
      `Số lượng thiết bị của các văn phòng trong khoảng thời gian: ${searchParams1.get(
        "purchase_date_from"
      )} đến ${searchParams1.get("purchase_date_to")}`
    );
  };

  useEffect(() => {
    localStorage.removeItem("purchase_date");
    localStorage.removeItem("location");
  }, [window.location.reload]);

  return (
    <div className="dashboardContainer">
      <List title={translate("dashboard.title")}>
        <section className="all-location">
          <span className="title-section-dashboard">
            {translate("dashboard.field.tilte-section-2")}
          </span>
          <div className="search-all-location">
            <Form layout="vertical" className="search-month-location">
              <Form.Item
                label={translate("dashboard.field.search-date")}
                name="purchase_date"
              >
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonth}
                  placeholder={[
                    `${translate("dashboard.field.start-date")}`,
                    `${translate("dashboard.field.end-date")}`,
                  ]}
                />
              </Form.Item>
            </Form>
            <div className="title-sum-location">{nameSearch}</div>
          </div>

          <Row gutter={[12, 12]}>
            {(data?.data.payload || []).map(
              (item: ILocation, index: number) => (
                <Col key={index} sm={24} md={24}>
                  <Locations location={item} data={data}></Locations>
                </Col>
              )
            )}
          </Row>
        </section>
        <section className="all-location">
          <span className="title-section-dashboard">
            {translate("dashboard.field.tilte-section-1")}
          </span>
          <div className="search">
            <Form layout="vertical" className="search-month-location">
              <Form.Item
                label={translate("dashboard.field.search-location")}
                name="location"
              >
                <Select
                  allowClear
                  placeholder={
                    locationSelected === null
                      ? translate("dashboard.placeholder.select-category")
                      : translate("dashboard.placeholder.select-category")
                  }
                  onChange={handleChangeLocation}
                  defaultValue={6}
                  className="selected-location"
                >
                  {(data?.data.payload || []).map((item: ILocation) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={translate("dashboard.field.search-date")}
                name="purchase_date"
              >
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonthByCategory}
                  placeholder={[
                    `${translate("dashboard.field.start-date")}`,
                    `${translate("dashboard.field.end-date")}`,
                  ]}
                />
              </Form.Item>
            </Form>
            <div className="title-sum-category">
              {translate("dashboard.field.sum-assets-by-category")}
            </div>
          </div>

          <Row gutter={[12, 12]}>
            {(data1?.data.payload || [])
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
      </List>
    </div>
  );
};
