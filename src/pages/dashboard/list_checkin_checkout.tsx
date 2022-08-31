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
  const { list } = useNavigation();
  const { RangePicker } = DatePicker;

  const [data_CheckIn, setData_CheckIn] = useState<[string, string]>(["", ""]);
  const [data_CheckOut, setData_CheckOut] = useState<[string, string]>(["", ""]);

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromCheckIn = searchParams.get("from_CheckIn");
  const dateToCheckIn = searchParams.get("to_CheckIn");

  const [searchParamsCheckOut, setSearchParamsCheckOut] = useSearchParams();
  const dateFromCheckOut = searchParams.get("from_CheckOut");
  const dateToCheckOut = searchParams.get("to_CheckOut");

  const [dataReportCheckIn, setDataReportCheckIn] = useState<any>([]);
  const [dataReportCheckOut, setDataReportCheckOut] = useState<any>([]);

  const { data: dataCheckIn, refetch: refetchCheckIn, isLoading: isLoadingCheckin } = useCustom({
    url: DASHBOARD_REPORT_ASSET_API,
    method: "get",
    config: {
      query: {
        from: dateFromCheckIn ? dateFromCheckIn : data_CheckIn[0],
        to: dateToCheckIn ? dateToCheckIn : data_CheckIn[1],
      },
    },
  });

  const { data: dataCheckOut, refetch: refetchCheckOut, isLoading: isLoadingCheckout } = useCustom({
    url: DASHBOARD_REPORT_ASSET_API,
    method: "get",
    config: {
      query: {
        from: dateFromCheckOut ? dateFromCheckOut : data_CheckOut[0],
        to: dateToCheckOut ? dateToCheckOut : data_CheckOut[1],
      },
    },
  });

  useEffect(() => {
    setData_CheckIn([
      dateFromCheckIn !== null ? dateFromCheckIn : "",
      dateToCheckIn !== null ? dateToCheckIn : "",
    ]);
    refetchCheckIn();
  }, [dateFromCheckIn, dateToCheckIn]);

  useEffect(() => {
    setData_CheckOut([
      dateFromCheckOut !== null ? dateFromCheckOut : "",
      dateToCheckOut !== null ? dateToCheckOut : "",
    ]);
    refetchCheckOut();
  }, [dateFromCheckOut, dateFromCheckOut]);

  const handleChangePickerByMonthCheckIn = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      searchParams.set(
        "from_CheckIn",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParams.set(
        "to_CheckIn",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete("from_CheckIn");
      searchParams.delete("to_CheckIn");
    }
    setSearchParams(searchParams);
  };

  const handleChangePickerByMonthCheckOut = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []);
      searchParamsCheckOut.set(
        "from_CheckOut",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParamsCheckOut.set(
        "to_CheckOut",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParamsCheckOut.delete("from_CheckOut");
      searchParamsCheckOut.delete("to_CheckOut");
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

    var dataResponseCheckIn: any = [];
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
    dataResponseCheckIn = dataSource;

    setDataReportCheckIn(dataResponseCheckIn);
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
            dateFromCheckOut && dateToCheckOut
              ? list(
                `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
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
              dateFromCheckOut && dateToCheckOut
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
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
            dateFromCheckIn && dateToCheckIn
              ? list(
                `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
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
              dateFromCheckIn && dateToCheckIn
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
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
                name="data_CheckIn"
              >
                <RangePicker
                  format={dateFormat}
                  onChange={handleChangePickerByMonthCheckIn}
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
