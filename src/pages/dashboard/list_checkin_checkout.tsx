/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Col, Form, List, Row, Spin, Table } from "@pankod/refine-antd";
import {
  IResourceComponentsProps,
  useCustom,
  useNavigation,
  useTranslate,
} from "@pankod/refine-core";
import { DatePicker } from "antd";
import { useSearchParams } from "react-router-dom";
import {
  AssetsSummaryPieChartCheckIn,
  AssetsSummaryPieChartCheckOut,
} from "./asset-summary-piechar";
import { IReport } from "interfaces/report";
import "styles/antd.less";
import { dateFormat, TypeAssetHistory } from "constants/assets";
import { DASHBOARD_REPORT_ASSET_API } from "api/baseApi";

export interface IReportAsset {
  id: number;
  name: string;
}

export const ListCheckin_Checkout: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const [dataReport, setDataReport] = useState<[string, string]>(["", ""]);
  const [data_CheckOut, setData_CheckOut] = useState<[string, string]>([
    "",
    "",
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  const [searchParamsCheckOut, setSearchParamsCheckOut] = useSearchParams();
  const dateFromCheckOut = searchParams.get("from");
  const dateToCheckOut = searchParams.get("to");

  const [dataReportCheckIn, setDataReportCheckIn] = useState<any>([]);
  const [dataReportCheckOut, setDataReportCheckOut] = useState<any>([]);

  const {
    data: dataCheckIn,
    refetch: refetchCheckIn,
    isLoading: isLoadingCheckin,
  } = useCustom<any>({
    url: DASHBOARD_REPORT_ASSET_API,
    method: "get",
    config: {
      query: {
        from: dateFrom ? dateFrom : dataReport[0],
        to: dateTo ? dateTo : dataReport[1],
      },
    },
  });

  const {
    data: dataCheckOut,
    refetch: refetchCheckOut,
    isLoading: isLoadingCheckout,
  } = useCustom<any>({
    url: DASHBOARD_REPORT_ASSET_API,
    method: "get",
    config: {
      query: {
        from: dateFromCheckOut ? dateFromCheckOut : data_CheckOut[0],
        to: dateToCheckOut ? dateToCheckOut : data_CheckOut[1],
      },
    },
  });

  const { list } = useNavigation();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    setDataReport([
      dateFrom !== null ? dateFrom : "",
      dateTo !== null ? dateTo : "",
    ]);
    refetchCheckIn();
  }, [dateFrom, dateTo]);

  useEffect(() => {
    setData_CheckOut([
      dateFromCheckOut !== null ? dateFromCheckOut : "",
      dateToCheckOut !== null ? dateToCheckOut : "",
    ]);
    refetchCheckOut();
  }, [dateFromCheckOut, dateFromCheckOut]);

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      searchParams.set(
        "from",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParams.set(
        "to",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete("from");
      searchParams.delete("to");
    }
    setSearchParams(searchParams);
  };

  const handleChangePickerByMonthCheckOut = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      searchParamsCheckOut.set(
        "from",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParamsCheckOut.set(
        "to",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParamsCheckOut.delete("from");
      searchParamsCheckOut.delete("to");
    }
    setSearchParamsCheckOut(searchParamsCheckOut);
  };

  useEffect(() => {
    var assetNames = (dataCheckIn?.data.payload.assets_statistic || []).map(
      (item: any) => item.category_name
    );
    var assetArr: string[] = [];
    assetArr = assetNames.filter(function (item: string) {
      return assetArr.includes(item) ? "" : assetArr.push(item);
    });

    var dataResponseCheckInt: any = [];
    var iteLocationKey: any = [];
    let dataSource = (dataCheckIn?.data.payload.categories || []).map(
      (category: IReport) => {
        var iteDataSource = { type: category.name, id: category.id, category_type: category.category_type };
        var iteLocation = {};
        for (let i of dataCheckIn?.data.payload.locations) {
          iteLocation = {
            ...iteLocation,
            [`location_${i.id}`]: 0,
            [`count`]: 0,
          };
          iteLocationKey.push(`location_${i.id}` as string);
        }
        return { ...iteDataSource, ...iteLocation };
      }
    );

    (dataCheckIn?.data.payload.assets_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (item.type === items.category_name) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.rtd_location_id}`) {
                item[key] = item[key] + Number(items.checkin);
                item[`count`] += Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );
    dataResponseCheckInt = dataSource;

    setDataReportCheckIn(dataResponseCheckInt);
  }, [dataCheckIn?.data.payload.assets_statistic || []]);

  useEffect(() => {
    var assetNames = (dataCheckOut?.data.payload.assets_statistic || []).map(
      (item: any) => item.category_name
    );
    var assetArr: string[] = [];
    assetArr = assetNames.filter(function (item: string) {
      return assetArr.includes(item) ? "" : assetArr.push(item);
    });

    var dataResponseCheckOut: any = [];
    var iteLocationKey: any = [];
    let dataSource = (dataCheckOut?.data.payload.categories || []).map(
      (category: IReport) => {
        var iteDataSource = { type: category.name, id: category.id, category_type: category.category_type };
        var iteLocation = {};
        for (let i of dataCheckOut?.data.payload.locations) {
          iteLocation = {
            ...iteLocation,
            [`location_${i.id}`]: 0,
            [`count`]: 0,
          };
          iteLocationKey.push(`location_${i.id}` as string);
        }
        return { ...iteDataSource, ...iteLocation };
      }
    );

    (dataCheckOut?.data.payload.assets_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (item.type === items.category_name) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.rtd_location_id}`) {
                item[key] = item[key] + Number(items.checkout);
                item[`count`] += Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );
    dataResponseCheckOut = dataSource;

    setDataReportCheckOut(dataResponseCheckOut);
  }, [dataCheckOut?.data.payload.assets_statistic || []]);

  var columnsCheckOut = [
    {
      title: translate("report.label.title.nameReportCheckOut"),
      dataIndex: "type",
      key: "type",
      render: (text: string, record: IReport) => (
        <strong
          onClick={() => {
            data_CheckOut[0] && data_CheckOut[1]
              ? list(
                `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${data_CheckOut[0]}&date_to=${data_CheckOut[1]}`
              )
              : list(`report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`);
          }}
          style={{ color: "#52c41a", cursor: "pointer" }}
        >
          {text}
        </strong>
      ),
    },
  ];

  var columntypesCheckOut = (dataCheckOut?.data.payload.locations || []).map(
    (item: any) => {
      return {
        title: item.name,
        dataIndex: "location_" + item.id,
        key: "location_" + item.id,
        render: (text: string, record: IReport) => (
          <a
            onClick={() => {
              data_CheckOut[0] && data_CheckOut[1]
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${data_CheckOut[0]}&date_to=${data_CheckOut[1]}`
                )
                : list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                );
            }}
          >
            {text}
          </a>
        ),
      };
    }
  );

  columnsCheckOut = [...columnsCheckOut, ...columntypesCheckOut];

  var columnsCheckIn = [
    {
      title: translate("report.label.title.nameReportCheckIn"),
      dataIndex: "type",
      key: "type",
      render: (text: string, record: IReport) => (
        <strong
          onClick={() => {
            dataReport[0] && dataReport[1]
              ? list(
                `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dataReport[0]}&date_to=${dataReport[1]}`
              )
              : list(`report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`);
          }}
          style={{ color: "#52c41a", cursor: "pointer" }}
        >
          {text}
        </strong>
      ),
    },
  ];

  var columntypesCheckIn = (dataCheckIn?.data.payload.locations || []).map(
    (item: any) => {
      return {
        title: item.name,
        dataIndex: "location_" + item.id,
        key: "location_" + item.id,
        render: (text: string, record: IReport) => (
          <a
            onClick={() => {
              dataReport[0] && dataReport[1]
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dataReport[0]}&date_to=${dataReport[1]}`
                )
                : list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                );
            }}
          >
            {text}
          </a>
        ),
      };
    }
  );

  columnsCheckIn = [...columnsCheckIn, ...columntypesCheckIn];

  useEffect(() => {
    localStorage.removeItem("purchase_date");
  }, [window.location.reload]);

  return (
    <>
      <List title={translate("dashboard.titleStatistic")}>
        <section className="reportAssetContainer">
          <span className="title-section-dashboard">
            {translate("report.label.title.nameReportCheckOut")}
          </span>
          <div className="search-all-location">
            <Form layout="vertical" className="search-month-location">
              <Form.Item
                label={translate("dashboard.time_checkout")}
                name="data_CheckOut"
              >
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonthCheckOut}
                  placeholder={[
                    `${translate("report.label.field.dateStart")}`,
                    `${translate("report.label.field.dateEnd")}`,
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
          <div style={{ marginTop: "6rem" }}>
            <Row gutter={[12, 12]}>
              <Col sm={24} md={24}>
                {isLoadingCheckout ? (
                  <Row gutter={16} className="dashboard-loading">
                    <Spin tip={`${translate("loading")}...`} className="spin-center" />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col sm={10} md={10}>
                      <AssetsSummaryPieChartCheckOut
                        assets_statistic={
                          dataReportCheckOut ? dataReportCheckOut : ""
                        }
                      />
                    </Col>
                    <Col sm={24} md={14}>
                      <Table
                        key="id"
                        dataSource={dataReportCheckOut}
                        columns={columnsCheckOut}
                        // pagination={
                        //   (dataCheckOut?.data.payload.categories || []).length <= 
                        //   6
                        //     ? false
                        //     : { pageSize: 6 }
                        // }
                        scroll={{ x: 320 }}
                        pagination={false}
                        className="list-table-dashboad"
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </div>
        </section>

        <section className="reportAssetContainer">
          <span className="title-section-dashboard">
            {translate("report.label.title.nameReportCheckIn")}
          </span>
          <div className="search-all-location">
            <Form layout="vertical" className="search-month-location">
              <Form.Item
                label={translate("dashboard.time_checkin")}
                name="dataReport"
              >
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonth}
                  placeholder={[
                    `${translate("report.label.field.dateStart")}`,
                    `${translate("report.label.field.dateEnd")}`,
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
          <div style={{ marginTop: "6rem" }}>
            <Row gutter={[12, 12]}>
              <Col sm={24} md={24}>
                {isLoadingCheckin ? (
                  <Row gutter={16} className="dashboard-loading">
                    <Spin tip={`${translate("loading")}...`} className="spin-center" />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col sm={24} md={10}>
                      <AssetsSummaryPieChartCheckIn
                        assets_statistic={
                          dataReportCheckIn ? dataReportCheckIn : ""
                        }
                      />
                    </Col>
                    <Col sm={24} md={14}>
                      <Table
                        key="id"
                        dataSource={dataReportCheckIn}
                        columns={columnsCheckIn}
                        // pagination={
                        //   (dataCheckIn?.data.payload.categories || []).length <= 6
                        //     ? false
                        //     : { pageSize: 6 }
                        // }
                        scroll={{ x: 320 }}
                        pagination={false}
                        className="list-table-dashboad"
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </div>
        </section>
      </List>
    </>
  );
};
