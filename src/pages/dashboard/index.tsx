import { Row, Col, Select, Form, List, Spin } from "@pankod/refine-antd";
import { DatePicker } from "antd";
import "styles/antd.less";
import { Locations } from "components/dashboard/locations";
import {
  IResourceComponentsProps,
  useCustom,
  useTranslate,
} from "@pankod/refine-core";

import { DASHBOARD_API } from "api/baseApi";
import { useEffect, useState } from "react";
import { ILocation } from "interfaces/dashboard";
import { AllLocations } from "components/dashboard/locations/index-all-location";
import { dateFormat } from "constants/assets";
import { useAppSearchParams } from "hooks/useAppSearchParams";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { RangePicker } = DatePicker;

  const [locationSelected, setLocationSelected] = useState<number | null>(
    99999
  );
  const [dataDashboard] = useState<[string, string]>(["", ""]);

  const {
    params: {
      purchase_date_from,
      purchase_date_to,
      purchase_date_from1,
      purchase_date_to1,
      rtd_location_id,
    },
    setParams,
  } = useAppSearchParams("dashboard");

  const { data, isLoading: isLoadingData } = useCustom({
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
        location: rtd_location_id,
      },
    },
  });

  const { data: data1, isLoading: isLoadingData1 } = useCustom({
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
        location: rtd_location_id,
      },
    },
  });

  const [nameSearch, setNameSearch] = useState(
    translate("dashboard.detail.title-show")
  );

  const handleChangeLocation = (value: any) => {
    localStorage.setItem("rtd_location_id", value !== undefined ? value : "");
    setLocationSelected(value);
    setParams({ rtd_location_id: JSON.stringify(value) });
  };

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    const [from, to] = Array.from(val || []) as moment.Moment[];
    const newFromDate = from?.format("YY-MM-DD")
      ? from?.format("YY-MM-DD").toString()
      : "";
    const newToDate = to?.format("YY-MM-DD")
      ? to?.format("YY-MM-DD").toString()
      : "";

    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    setParams({
      purchase_date_from: newFromDate,
      purchase_date_to: newToDate,
    });
    setNameSearch(
      `${translate("dashboard.detail.title-count-asset")} : ${newFromDate} đến ${newToDate}`
    );
  };

  const handleChangePickerByMonthByCategory = (val: any, formatString: any) => {
    const [from, to] = Array.from(val || []) as moment.Moment[];
    const newFromDate = from?.format("YY-MM-DD")
      ? from?.format("YY-MM-DD").toString()
      : "";
    const newToDate = to?.format("YY-MM-DD")
      ? to?.format("YY-MM-DD").toString()
      : "";

    localStorage.setItem(
      "purchase_date",
      formatString !== undefined ? formatString : ""
    );
    setParams({
      purchase_date_from1: newFromDate,
      purchase_date_to1: newToDate,
    });
    setNameSearch(
      `${translate("dashboard.detail.title-count-asset")} : ${newFromDate} đến ${newToDate}`
    );
  };
  const locationName = data?.data.payload.find(
    (item: ILocation) => item.id === locationSelected
  )?.name;

  useEffect(() => {
    localStorage.removeItem("purchase_date");
    localStorage.removeItem("rtd_location_id");
    localStorage.removeItem("search");
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
          <div className="locations-container">
            <Row gutter={[12, 12]}>
              {isLoadingData ? (
                <Col sm={24} md={24} className="dashboard-loading">
                  <Spin
                    tip={`${translate("loading")}...`}
                    className="spin-center"
                  />
                </Col>
              ) : (
                (data?.data.payload || [])
                  .filter(
                    (item: ILocation) =>
                      locationSelected === null || item.id === locationSelected
                  )
                  .map((item: ILocation, index: number) => (
                    <Col key={index} sm={24} md={24}>
                      <Locations location={item} data={data}></Locations>
                    </Col>
                  ))
              )}
            </Row>
          </div>
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
                initialValue={locationName}
              >
                <Select
                  allowClear
                  placeholder={
                    locationSelected === null
                      ? translate("dashboard.placeholder.select-category")
                      : translate("dashboard.placeholder.select-category")
                  }
                  onChange={handleChangeLocation}
                  // defaultValue={99999}
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

          <div className="locations-container">
            <Row gutter={[12, 12]}>
              {isLoadingData1 ? (
                <Col sm={24} md={24} className="dashboard-loading">
                  <Spin
                    tip={`${translate("loading")}...`}
                    className="spin-center"
                  />
                </Col>
              ) : (
                (data1?.data.payload || [])
                  .filter(
                    (item: ILocation) =>
                      locationSelected === null || item.id === locationSelected
                  )
                  .map((item: ILocation, index: number) => (
                    <Col key={index} sm={24} md={24}>
                      <AllLocations location={item}></AllLocations>
                    </Col>
                  ))
              )}
            </Row>
          </div>
        </section>
      </List>
    </div>
  );
};
