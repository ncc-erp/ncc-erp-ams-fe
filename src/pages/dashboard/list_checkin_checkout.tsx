/* eslint-disable jsx-a11y/anchor-is-valid */
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

    let sumConsumable = {
      type: translate("dashboard.field.typeConsumable"),
      category_type: CategoryType.CONSUMABLE,
    } as any;

    let sumAccessory = {
      type: translate("dashboard.field.typeAccessory"),
      category_type: CategoryType.ACCESSORY,
    } as any;

    let sumTool = {
      type: translate("dashboard.field.typeTool"),
      category_type: CategoryType.TOOL,
    } as any;

    let sumTaxToken = {
      type: translate("dashboard.field.typeTaxToken"),
      category_type: CategoryType.TAXTOKEN,
    } as any;

    let sumClientAsset = {
      type: translate("dashboard.field.typeClientAsset"),
      category_type: CategoryType.ASSET,
    } as any;

    var dataResponseCheckIn: any = [];
    var iteLocationKey: any = [];
    let dataSource = (dataCheckIn?.data.payload.categories || []).map(
      (category: IReport) => {
        var iteDataSource = {
          type: category.name,
          id: category.id,
          category_type: category.category_type,
        };
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

    (dataCheckIn?.data.payload.assets_statistic || []).forEach((items: any) => {
      dataSource.forEach((item: any) => {
        if (
          item.type === items.category_name &&
          item.category_type === CategoryType.ASSET
        ) {
          for (const key of iteLocationKey) {
            if (key === `location_${items.rtd_location_id}`) {
              item[key] = item[key] + Number(items.checkin);
              item[`count`] += Number(items.checkin);
              break;
            }
          }
        }
      });
    });

    (dataCheckIn?.data.payload.accessories_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.ACCESSORY
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumAccessory[`location_${items.location_id}`] =
                  sumAccessory[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkin) +
                    sumAccessory[`location_${items.location_id}`]
                    : Number(items.checkin);
                sumAccessory[`count`] =
                  sumAccessory[`count`] !== undefined
                    ? Number(items.checkin) + sumAccessory[`count`]
                    : Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckIn?.data.payload.consumables_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.CONSUMABLE
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumConsumable[`location_${items.location_id}`] =
                  sumConsumable[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkin) +
                    sumConsumable[`location_${items.location_id}`]
                    : Number(items.checkin);
                sumConsumable[`count`] =
                  sumConsumable[`count`] !== undefined
                    ? Number(items.checkin) + sumConsumable[`count`]
                    : Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckIn?.data.payload.tools_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.TOOL
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumTool[`location_${items.location_id}`] =
                  sumTool[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkin) +
                    sumTool[`location_${items.location_id}`]
                    : Number(items.checkin);
                sumTool[`count`] =
                  sumTool[`count`] !== undefined
                    ? Number(items.checkin) + sumTool[`count`]
                    : Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckIn?.data.payload.digital_signatures_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.TAXTOKEN
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumTaxToken[`location_${items.location_id}`] =
                  sumTaxToken[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkin) +
                    sumTaxToken[`location_${items.location_id}`]
                    : Number(items.checkin);
                sumTaxToken[`count`] =
                  sumTaxToken[`count`] !== undefined
                    ? Number(items.checkin) + sumTaxToken[`count`]
                    : Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckIn?.data.payload.client_assets_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.ASSET
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.rtd_location_id}`) {
                sumClientAsset[`location_${items.rtd_location_id}`] =
                  sumClientAsset[`location_${items.rtd_location_id}`] !== undefined
                    ? Number(items.checkin) +
                    sumClientAsset[`location_${items.rtd_location_id}`]
                    : Number(items.checkin);
                sumClientAsset[`count`] =
                  sumClientAsset[`count`] !== undefined
                    ? Number(items.checkin) + sumClientAsset[`count`]
                    : Number(items.checkin);
                break;
              }
            }
          }
        });
      }
    );


    dataCheckIn?.data.payload.locations.forEach((location: any) => {
      if (!sumConsumable[`location_${location.id}`]) {
        sumConsumable[`location_${location.id}`] = 0;
      }
      if (!sumAccessory[`location_${location.id}`]) {
        sumAccessory[`location_${location.id}`] = 0;
      }
      if (!sumTool[`location_${location.id}`]) {
        sumTool[`location_${location.id}`] = 0;
      }
      if (!sumTaxToken[`location_${location.id}`]) {
        sumTaxToken[`location_${location.id}`] = 0;
      }
      if (!sumClientAsset[`location_${location.id}`]) {
        sumClientAsset[`location_${location.id}`] = 0;
      }
    });

    dataResponseCheckIn = dataSource;
    dataResponseCheckIn = dataResponseCheckIn.filter(
      (item: any) => item.category_type === CategoryType.ASSET
    );

    setDataReportCheckIn([...dataResponseCheckIn, sumAccessory, sumConsumable, sumTool, sumTaxToken, sumClientAsset]);
  }, [
    dataCheckIn?.data.payload.assets_statistic || [],
    dataCheckIn?.data.payload.accessories_statistic || [],
    dataCheckIn?.data.payload.consumables_statistic || [],
    dataCheckIn?.data.payload.tools_statistic || [],
    dataCheckIn?.data.payload.digital_signatures_statistic || [],
    dataCheckIn?.data.payload.client_assets_statistic || [],
  ]);

  useEffect(() => {
    let assetNames = (dataCheckOut?.data.payload.assets_statistic || []).map(
      (item: any) => item.category_name
    );

    let consumableNames = (
      dataCheckOut?.data.payload.assets_statistic || []
    ).map((item: any) => item.category_name);

    let accessoryNames = (
      dataCheckOut?.data.payload.accessories_statistic || []
    ).map((item: any) => item.category_name);

    let toolNames = (
      dataCheckOut?.data.payload.tools_statistic || []
    ).map((item: any) => item.category_name);

    let taxTokenNames = (
      dataCheckOut?.data.payload.digital_signatures_statistic || []
    ).map((item: any) => item.category_name);

    let clientAssetNames = (
      dataCheckOut?.data.payload.client_assets_statistic || []
    ).map((item: any) => item.category_name);

    let sumConsumable = {
      type: translate("dashboard.field.typeConsumable"),
      category_type: CategoryType.CONSUMABLE,
    } as any;

    let sumAccessory = {
      type: translate("dashboard.field.typeAccessory"),
      category_type: CategoryType.ACCESSORY,
    } as any;

    let sumTool = {
      type: translate("dashboard.field.typeTool"),
      category_type: CategoryType.TOOL,
    } as any;

    let sumTaxToken = {
      type: translate("dashboard.field.typeTaxToken"),
      category_type: CategoryType.TAXTOKEN,
    } as any;

    let sumClientAsset = {
      type: translate("dashboard.field.typeClientAsset"),
      category_type: CategoryType.ASSET,
    } as any

    let assetArr: string[] = [];
    assetArr = assetNames.filter(function (item: string) {
      return assetArr.includes(item) ? "" : assetArr.push(item);
    });

    let accessoryArr: string[] = [];
    accessoryArr = accessoryNames.filter(function (item: string) {
      return accessoryArr.includes(item) ? "" : accessoryArr.push(item);
    });

    let consumableArr: string[] = [];
    consumableArr = consumableNames.filter(function (item: string) {
      return consumableArr.includes(item) ? "" : consumableArr.push(item);
    });

    let toolArr: string[] = [];
    toolArr = toolNames.filter(function (item: string) {
      return toolArr.includes(item) ? "" : toolArr.push(item);
    });

    let taxTokenArr: string[] = [];
    taxTokenArr = taxTokenNames.filter(function (item: string) {
      return taxTokenArr.includes(item) ? "" : taxTokenArr.push(item);
    });

    let clientAssetArr: string[] = [];
    clientAssetArr = clientAssetNames.filter(function (item: string) {
      return clientAssetArr.includes(item) ? "" : clientAssetArr.push(item);
    });

    let dataResponseCheckOut: any = [];
    let iteLocationKey: any = [];
    let dataSource = (dataCheckOut?.data.payload.categories || []).map(
      (category: IReport) => {
        var iteDataSource = {
          type: category.name,
          id: category.id,
          category_type: category.category_type,
        };
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
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.ASSET
          ) {
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

    (dataCheckOut?.data.payload.accessories_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.ACCESSORY
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumAccessory[`location_${items.location_id}`] =
                  sumAccessory[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkout) +
                    sumAccessory[`location_${items.location_id}`]
                    : Number(items.checkout);
                sumAccessory[`count`] =
                  sumAccessory[`count`] !== undefined
                    ? Number(items.checkout) + sumAccessory[`count`]
                    : Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckOut?.data.payload.consumables_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.CONSUMABLE
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumConsumable[`location_${items.location_id}`] =
                  sumConsumable[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkout) +
                    sumConsumable[`location_${items.location_id}`]
                    : Number(items.checkout);
                sumConsumable[`count`] =
                  sumConsumable[`count`] !== undefined
                    ? Number(items.checkout) + sumConsumable[`count`]
                    : Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckOut?.data.payload.tools_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.TOOL
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumTool[`location_${items.location_id}`] =
                  sumTool[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkout) +
                    sumTool[`location_${items.location_id}`]
                    : Number(items.checkout);
                sumTool[`count`] =
                  sumTool[`count`] !== undefined
                    ? Number(items.checkout) + sumTool[`count`]
                    : Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckOut?.data.payload.digital_signatures_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.TAXTOKEN
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.location_id}`) {
                sumTaxToken[`location_${items.location_id}`] =
                  sumTaxToken[`location_${items.location_id}`] !== undefined
                    ? Number(items.checkout) +
                    sumTaxToken[`location_${items.location_id}`]
                    : Number(items.checkout);
                sumTaxToken[`count`] =
                  sumTaxToken[`count`] !== undefined
                    ? Number(items.checkout) + sumTaxToken[`count`]
                    : Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );

    (dataCheckOut?.data.payload.client_assets_statistic || []).forEach(
      (items: any) => {
        dataSource.forEach((item: any) => {
          if (
            item.type === items.category_name &&
            item.category_type === CategoryType.ASSET
          ) {
            for (const key of iteLocationKey) {
              if (key === `location_${items.rtd_location_id}`) {
                sumClientAsset[`location_${items.rtd_location_id}`] =
                  sumClientAsset[`location_${items.rtd_location_id}`] !== undefined
                    ? Number(items.checkout) +
                    sumClientAsset[`location_${items.rtd_location_id}`]
                    : Number(items.checkout);
                sumClientAsset[`count`] =
                  sumClientAsset[`count`] !== undefined
                    ? Number(items.checkout) + sumClientAsset[`count`]
                    : Number(items.checkout);
                break;
              }
            }
          }
        });
      }
    );

    dataCheckOut?.data.payload.locations.forEach((location: any) => {
      if (!sumConsumable[`location_${location.id}`]) {
        sumConsumable[`location_${location.id}`] = 0;
      }
      if (!sumAccessory[`location_${location.id}`]) {
        sumAccessory[`location_${location.id}`] = 0;
      }
      if (!sumTool[`location_${location.id}`]) {
        sumTool[`location_${location.id}`] = 0;
      }
      if (!sumTaxToken[`location_${location.id}`]) {
        sumTaxToken[`location_${location.id}`] = 0;
      }
      if (!sumClientAsset[`location_${location.id}`]) {
        sumClientAsset[`location_${location.id}`] = 0;
      }
    });

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
      sumClientAsset
    ]);
  }, [
    dataCheckOut?.data.payload.assets_statistic || [],
    dataCheckOut?.data.payload.accessories_statistic || [],
    dataCheckOut?.data.payload.consumables_statistic || [],
    dataCheckIn?.data.payload.tools_statistic || [],
    dataCheckIn?.data.payload.digital_signatures_statistic || [],
    dataCheckIn?.data.payload.client_assets_statistic || [],
  ]);

  var columnsCheckOut = [
    {
      title: translate("report.label.title.nameReportCheckOut"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text: string, record: IReport) => (
        <strong
          onClick={() => {
            record.category_type === CategoryType.ASSET
              ? dateFromCheckOut && dateToCheckOut
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                )
                : list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                )
              : record.category_type === CategoryType.CONSUMABLE
                ? dateFromCheckOut && dateToCheckOut
                  ? list(
                    `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                  )
                  : list(
                    `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                  )
                : record.category_type === CategoryType.TOOL
                  ? dateFromCheckOut && dateToCheckOut
                    ? list(
                      `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                    )
                    : list(
                      `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                    )
                  : record.category_type === CategoryType.TAXTOKEN
                    ? dateFromCheckOut && dateToCheckOut
                      ? list(
                        `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                      )
                      : list(
                        `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                      )
                    : record.category_type === CategoryType.ACCESSORY
                      ? dateFromCheckOut && dateToCheckOut
                        ? list(
                          `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                        )
                        : list(
                          `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                        )
                      : list(
                        `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKOUT}`
                      );
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
        width: 100,
        render: (text: string, record: IReport) => (
          <Typography.Text
            strong
            type="secondary"
            className="field-category"
            onClick={() => {
              record.category_type === CategoryType.ASSET
                ? dateFromCheckOut && dateToCheckOut
                  ? list(
                    `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                  )
                  : list(
                    `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                  )
                : record.category_type === CategoryType.CONSUMABLE
                  ? dateFromCheckOut && dateToCheckOut
                    ? list(
                      `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                    )
                    : list(
                      `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                    )
                  : record.category_type === CategoryType.TOOL
                    ? dateFromCheckOut && dateToCheckOut
                      ? list(
                        `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                      )
                      : list(
                        `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                      )
                    : record.category_type === CategoryType.TAXTOKEN
                      ? dateFromCheckOut && dateToCheckOut
                        ? list(
                          `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                        )
                        : list(
                          `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                        )
                      : record.category_type === CategoryType.ACCESSORY
                        ? dateFromCheckOut && dateToCheckOut
                          ? list(
                            `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}&date_from=${dateFromCheckOut}&date_to=${dateToCheckOut}`
                          )
                          : list(
                            `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                          )
                        : list(
                          `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKOUT}`
                        );
            }}
          >
            {text}
          </Typography.Text>
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
      width: 150,
      render: (text: string, record: IReport) => (
        <strong
          onClick={() => {
            record.category_type === CategoryType.ASSET
              ? dateFromCheckIn && dateToCheckIn
                ? list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                )
                : list(
                  `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                )
              : record.category_type === CategoryType.CONSUMABLE
                ? dateFromCheckIn && dateToCheckIn
                  ? list(
                    `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                  )
                  : list(
                    `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                  )
                : record.category_type === CategoryType.TOOL
                  ? dateFromCheckIn && dateToCheckIn
                    ? list(
                      `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                    )
                    : list(
                      `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                    )
                  : record.category_type === CategoryType.TAXTOKEN
                    ? dateFromCheckIn && dateToCheckIn
                      ? list(
                        `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                      )
                      : list(
                        `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                      )
                    : record.category_type === CategoryType.ACCESSORY
                      ? dateFromCheckIn && dateToCheckIn
                        ? list(
                          `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                        )
                        : list(
                          `report?category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                        )
                      : list(
                        `report?category_id=${record.id}&category_type=${record.category_type}&action_type=${TypeAssetHistory.CHECKIN}`
                      );
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
        width: 100,
        render: (text: string, record: IReport) => (
          <Typography.Text
            strong
            type="secondary"
            className="field-category"
            onClick={() => {
              record.category_type === CategoryType.ASSET
                ? dateFromCheckIn && dateToCheckIn
                  ? list(
                    `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                  )
                  : list(
                    `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                  )
                : record.category_type === CategoryType.CONSUMABLE
                  ? dateFromCheckIn && dateToCheckIn
                    ? list(
                      `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                    )
                    : list(
                      `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                    )
                  : record.category_type === CategoryType.TOOL
                    ? dateFromCheckIn && dateToCheckIn
                      ? list(
                        `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                      )
                      : list(
                        `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                      )
                    : record.category_type === CategoryType.TAXTOKEN
                      ? dateFromCheckIn && dateToCheckIn
                        ? list(
                          `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                        )
                        : list(
                          `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                        )
                      : record.category_type === CategoryType.ACCESSORY
                        ? dateFromCheckIn && dateToCheckIn
                          ? list(
                            `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}&date_from=${dateFromCheckIn}&date_to=${dateToCheckIn}`
                          )
                          : list(
                            `report?category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                          )
                        : list(
                          `report?category_id=${record.id}&category_type=${record.category_type}&location_id=${item.id}&action_type=${TypeAssetHistory.CHECKIN}`
                        );
            }}
          >
            {text}
          </Typography.Text>
        ),
      };
    }
  );

  columnsCheckIn = [...columnsCheckIn, ...columntypesCheckIn];

  useEffect(() => {
    localStorage.removeItem("purchase_date");
    localStorage.removeItem("rtd_location_id");
    localStorage.removeItem("search");
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
                    <Spin
                      tip={`${translate("loading")}...`}
                      className="spin-center"
                    />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col sm={10} md={7}>
                      <AssetsSummaryPieChartCheckOut
                        assets_statistic={
                          dataReportCheckOut ? dataReportCheckOut : ""
                        }
                      />
                    </Col>
                    <Col sm={24} md={17}>
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
          <div style={{ marginTop: "6rem" }}>
            <Row gutter={[12, 12]}>
              <Col sm={24} md={24}>
                {isLoadingCheckin ? (
                  <Row gutter={16} className="dashboard-loading">
                    <Spin
                      tip={`${translate("loading")}...`}
                      className="spin-center"
                    />
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col sm={24} md={7}>
                      <AssetsSummaryPieChartCheckIn
                        assets_statistic={
                          dataReportCheckIn ? dataReportCheckIn : ""
                        }
                      />
                    </Col>
                    <Col sm={24} md={17}>
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
