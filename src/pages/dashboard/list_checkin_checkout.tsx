import { useEffect, useState } from "react";
import {
  Col,
  Form,
  List,
  Row,
  Spin,
  Table,
  Typography,
} from "@pankod/refine-antd";
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
import { CategoryType, dateFormat, TypeAssetHistory } from "constants/assets";
import { DASHBOARD_REPORT_ASSET_API } from "api/baseApi";
import moment from "moment";
import { LocalStorageKey } from "enums/LocalStorageKey";

export interface IReportAsset {
  id: number;
  name: string;
}

export const ListCheckin_Checkout: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { list } = useNavigation();
  const { RangePicker } = DatePicker;

  const [data_CheckIn, setData_CheckIn] = useState<[string, string]>(["", ""]);
  const [data_CheckOut, setData_CheckOut] = useState<[string, string]>([
    "",
    "",
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromCheckIn = searchParams.get("from_CheckIn");
  const dateToCheckIn = searchParams.get("to_CheckIn");

  const [searchParamsCheckOut, setSearchParamsCheckOut] = useSearchParams();
  const dateFromCheckOut = searchParams.get("from_CheckOut");
  const dateToCheckOut = searchParams.get("to_CheckOut");

  const [dataReportCheckIn, setDataReportCheckIn] = useState<any>([]);
  const [dataReportCheckOut, setDataReportCheckOut] = useState<any>([]);

  const {
    data: dataCheckIn,
    refetch: refetchCheckIn,
    isLoading: isLoadingCheckin,
  } = useCustom({
    url: DASHBOARD_REPORT_ASSET_API,
    method: "get",
    config: {
      query: {
        from: dateFromCheckIn ? dateFromCheckIn : data_CheckIn[0],
        to: dateToCheckIn ? dateToCheckIn : data_CheckIn[1],
      },
    },
  });

  const {
    data: dataCheckOut,
    refetch: refetchCheckOut,
    isLoading: isLoadingCheckout,
  } = useCustom({
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
      const [from, to] = Array.from(val || []) as moment.Moment[];
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
      const [from, to] = Array.from(val || []) as moment.Moment[];
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

  const calculateSumEachCategory = (
    checkType: string,
    category: string,
    iteLocationKey: any,
    dataSource: any,
    is_client = false
  ) => {
    let categoryKeyTranslate = category;
    let payloadKey = category.toLowerCase() + "s_statistic";
    const category_const = (CategoryType as { [key: string]: string })[
      category.toUpperCase()
    ];

    if (category === "Asset" && is_client) {
      payloadKey = "client_" + payloadKey;
      categoryKeyTranslate = "ClientAsset";
    }
    if (category === "TaxToken") {
      payloadKey = "digital_signatures_statistic";
    }
    if (category === "Accessory") {
      payloadKey = "accessories_statistic";
    }

    const typeSum = {
      type: translate("dashboard.field.type" + categoryKeyTranslate),
      category_type: category_const,
    } as any;

    let dataForCalculate = dataCheckIn;

    if (checkType === "checkout") {
      dataForCalculate = dataCheckOut;
    }

    (dataForCalculate?.data.payload[payloadKey] || []).forEach((items: any) => {
      const locationAttribute =
        category === "Asset"
          ? `location_${items.rtd_location_id}`
          : `location_${items.location_id}`;
      dataSource.forEach((item: any) => {
        if (
          item.type === items.category_name &&
          item.category_type === category_const
        ) {
          for (const key of iteLocationKey) {
            if (key === locationAttribute) {
              if (category === "Asset" && !is_client) {
                item[locationAttribute] =
                  (item[locationAttribute] ?? 0) + Number(items[checkType]);
                item[`count`] = (item[`count`] ?? 0) + Number(items[checkType]);
                break;
              } else {
                typeSum[locationAttribute] =
                  (typeSum[locationAttribute] ?? 0) + Number(items[checkType]);
                typeSum[`count`] =
                  (typeSum[`count`] ?? 0) + Number(items[checkType]);
                break;
              }
            }
          }
        }
      });
    });

    return typeSum;
  };

  const setDefaultValueForLocationNotExist = (type: string, sumTypes: any) => {
    let dataCheckForSet = dataCheckIn;

    if (type === "checkout") {
      dataCheckForSet = dataCheckOut;
    }

    dataCheckForSet?.data.payload.locations.forEach((location: any) => {
      sumTypes.forEach((sumType: any) => {
        sumType[`location_${location.id}`] =
          sumType[`location_${location.id}`] ?? 0;
      });
    });
  };

  const getDataSource = (type: string, iteLocationKey: any) => {
    let dataForGet = dataCheckIn;

    if (type === "checkout") {
      dataForGet = dataCheckOut;
    }

    return (dataForGet?.data.payload.categories || []).map(
      (category: IReport) => {
        const iteDataSource = {
          type: category.name,
          id: category.id,
          category_type: category.category_type,
        };
        let iteLocation = {};
        for (const i of dataForGet?.data?.payload?.locations) {
          iteLocation = {
            ...iteLocation,
            [`location_${i.id}`]: 0,
            [`count`]: 0,
          };
          iteLocationKey.push(`location_${i.id}`);
        }
        return { ...iteDataSource, ...iteLocation };
      }
    );
  };

  const getUrlForOnClick = (
    action_type: string,
    record: IReport,
    dateFrom: string | null,
    dateTo: string | null,
    location_id = ""
  ) => {
    let url = `report?category_type=${record.category_type}&action_type=${action_type}`;

    if (dateFrom && dateTo) {
      url += `&date_from=${dateFrom}&date_to=${dateTo}`;
    }

    if (record.category_type === CategoryType.ASSET) {
      url += `&category_id=${record.id}`;
    }

    if (location_id) {
      url += `&location_id=${location_id}`;
    }

    return list(url);
  };

  useEffect(() => {
    const assetNames = (dataCheckIn?.data.payload.assets_statistic || []).map(
      (item: any) => item.category_name
    );

    let assetArr: string[] = [];
    assetArr = assetNames.filter(function (item: string) {
      return assetArr.includes(item) ? "" : assetArr.push(item);
    });

    const type = "checkin";
    let dataResponseCheckIn: any = [];
    const iteLocationKey: any = [];
    const dataSource = getDataSource(type, iteLocationKey);

    const sumConsumable = calculateSumEachCategory(
      type,
      "Consumable",
      iteLocationKey,
      dataSource
    );
    const sumClientAsset = calculateSumEachCategory(
      type,
      "Asset",
      iteLocationKey,
      dataSource,
      true
    );
    const sumAccessory = calculateSumEachCategory(
      type,
      "Accessory",
      iteLocationKey,
      dataSource
    );
    const sumTool = calculateSumEachCategory(
      type,
      "Tool",
      iteLocationKey,
      dataSource
    );
    const sumTaxToken = calculateSumEachCategory(
      type,
      "TaxToken",
      iteLocationKey,
      dataSource
    );
    calculateSumEachCategory(type, "Asset", iteLocationKey, dataSource);

    setDefaultValueForLocationNotExist(type, [
      sumConsumable,
      sumClientAsset,
      sumAccessory,
      sumTool,
      sumTaxToken,
    ]);

    dataResponseCheckIn = dataSource;
    dataResponseCheckIn = dataResponseCheckIn.filter(
      (item: any) => item.category_type === CategoryType.ASSET
    );

    setDataReportCheckIn([
      ...dataResponseCheckIn,
      sumAccessory,
      sumConsumable,
      sumTool,
      sumTaxToken,
      sumClientAsset,
    ]);
  }, [
    dataCheckIn?.data.payload.assets_statistic || [],
    dataCheckIn?.data.payload.accessories_statistic || [],
    dataCheckIn?.data.payload.consumables_statistic || [],
    dataCheckIn?.data.payload.tools_statistic || [],
    dataCheckIn?.data.payload.digital_signatures_statistic || [],
    dataCheckIn?.data.payload.client_assets_statistic || [],
  ]);

  useEffect(() => {
    const assetNames = (dataCheckOut?.data.payload.assets_statistic || []).map(
      (item: any) => item.category_name
    );

    let assetArr: string[] = [];
    assetArr = assetNames.filter(function (item: string) {
      return assetArr.includes(item) ? "" : assetArr.push(item);
    });

    const type = "checkout";
    let dataResponseCheckOut: any = [];
    const iteLocationKey: any = [];
    const dataSource = getDataSource(type, iteLocationKey);

    const sumConsumable = calculateSumEachCategory(
      type,
      "Consumable",
      iteLocationKey,
      dataSource
    );
    const sumClientAsset = calculateSumEachCategory(
      type,
      "Asset",
      iteLocationKey,
      dataSource,
      true
    );
    const sumAccessory = calculateSumEachCategory(
      type,
      "Accessory",
      iteLocationKey,
      dataSource
    );
    const sumTool = calculateSumEachCategory(
      type,
      "Tool",
      iteLocationKey,
      dataSource
    );
    const sumTaxToken = calculateSumEachCategory(
      type,
      "TaxToken",
      iteLocationKey,
      dataSource
    );
    calculateSumEachCategory(type, "Asset", iteLocationKey, dataSource);

    setDefaultValueForLocationNotExist(type, [
      sumConsumable,
      sumClientAsset,
      sumAccessory,
      sumTool,
      sumTaxToken,
    ]);

    dataResponseCheckOut = dataSource;
    dataResponseCheckOut = dataResponseCheckOut.filter(
      (item: any) => item.category_type === CategoryType.ASSET
    );

    setDataReportCheckOut([
      ...dataResponseCheckOut,
      sumAccessory,
      sumConsumable,
      sumTool,
      sumTaxToken,
      sumClientAsset,
    ]);
  }, [
    dataCheckOut?.data.payload.assets_statistic || [],
    dataCheckOut?.data.payload.accessories_statistic || [],
    dataCheckOut?.data.payload.consumables_statistic || [],
    dataCheckOut?.data.payload.tools_statistic || [],
    dataCheckOut?.data.payload.digital_signatures_statistic || [],
    dataCheckOut?.data.payload.client_assets_statistic || [],
  ]);

  let columnsCheckOut = [
    {
      title: translate("report.label.title.nameReportCheckOut"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text: string, record: IReport) => (
        <strong
          onClick={() =>
            getUrlForOnClick(
              TypeAssetHistory.CHECKOUT,
              record,
              dateFromCheckOut,
              dateToCheckOut
            )
          }
          style={{ color: "#52c41a", cursor: "pointer" }}
        >
          {text}
        </strong>
      ),
    },
  ];

  const columntypesCheckOut = (dataCheckOut?.data.payload.locations || []).map(
    (item: any) => {
      return {
        title: item.name,
        dataIndex: "location_" + item.id,
        key: "location_" + item.id,
        width: 100,
        render: (text: string, record: IReport) => (
          <Typography.Text
            strong
            type="secondary"
            className="field-category"
            onClick={() =>
              getUrlForOnClick(
                TypeAssetHistory.CHECKOUT,
                record,
                dateFromCheckOut,
                dateToCheckOut,
                item.id
              )
            }
          >
            {text}
          </Typography.Text>
        ),
      };
    }
  );

  columnsCheckOut = [...columnsCheckOut, ...columntypesCheckOut];

  let columnsCheckIn = [
    {
      title: translate("report.label.title.nameReportCheckIn"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text: string, record: IReport) => (
        <strong
          onClick={() =>
            getUrlForOnClick(
              TypeAssetHistory.CHECKIN,
              record,
              dateFromCheckIn,
              dateToCheckIn
            )
          }
          style={{ color: "#52c41a", cursor: "pointer" }}
        >
          {text}
        </strong>
      ),
    },
  ];

  const columntypesCheckIn = (dataCheckIn?.data.payload.locations || []).map(
    (item: any) => {
      return {
        title: item.name,
        dataIndex: "location_" + item.id,
        key: "location_" + item.id,
        width: 100,
        render: (text: string, record: IReport) => (
          <Typography.Text
            strong
            type="secondary"
            className="field-category"
            onClick={() =>
              getUrlForOnClick(
                TypeAssetHistory.CHECKIN,
                record,
                dateFromCheckIn,
                dateToCheckIn,
                item.id
              )
            }
          >
            {text}
          </Typography.Text>
        ),
      };
    }
  );

  columnsCheckIn = [...columnsCheckIn, ...columntypesCheckIn];

  useEffect(() => {
    localStorage.removeItem(LocalStorageKey.PURCHASE_DATE);
    localStorage.removeItem(LocalStorageKey.RTD_LOCATION_ID);
    localStorage.removeItem(LocalStorageKey.SEARCH);
  }, [window.location.reload]);

  return (
    <>
      <List
        title={
          <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
            {translate("dashboard.titleStatistic")}
          </div>
        }
      >
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
          <div className="report-asset-container" style={{ marginTop: "6rem" }}>
            <Row gutter={[12, 12]}>
              <Col style={{ width: "100%" }} sm={24} md={24}>
                {isLoadingCheckout ? (
                  <Row gutter={16} className="dashboard-loading">
                    <Spin
                      tip={`${translate("loading")}...`}
                      className="spin-center"
                    />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col xs={24} sm={24} md={7}>
                      <AssetsSummaryPieChartCheckOut
                        assets_statistic={dataReportCheckOut ?? ""}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={17}>
                      <Table
                        key="id"
                        dataSource={dataReportCheckOut}
                        columns={columnsCheckOut}
                        scroll={{ x: "calc(500px + 50%)", y: 400 }}
                        pagination={false}
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
          <div className="report-asset-container" style={{ marginTop: "6rem" }}>
            <Row gutter={[12, 12]}>
              <Col style={{ width: "100%" }} sm={24} md={24}>
                {isLoadingCheckin ? (
                  <Row gutter={16} className="dashboard-loading">
                    <Spin
                      tip={`${translate("loading")}...`}
                      className="spin-center"
                    />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col xs={24} sm={24} md={7}>
                      <AssetsSummaryPieChartCheckIn
                        assets_statistic={dataReportCheckIn ?? ""}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={17}>
                      <Table
                        key="id"
                        dataSource={dataReportCheckIn}
                        columns={columnsCheckIn}
                        scroll={{ x: "calc(500px + 50%)", y: 400 }}
                        pagination={false}
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
