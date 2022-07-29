import { useEffect, useState } from "react";
import { Col, Form, List, Row, Show, Table } from "@pankod/refine-antd";
import { IResourceComponentsProps, useCustom, useNavigation, useTranslate } from "@pankod/refine-core";
import { DatePicker } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { AssetsSummaryPieChartCheckIn, AssetsSummaryPieChartCheckOut } from "./asset-summary-piechar";
import { IReport } from "interfaces/report";
import "styles/antd.less";

export interface IReportAsset {
    id: number;
    name: string;
}

export const ListCheckin_Checkout: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const [dataReport, setDataReport] = useState<[string, string]>(["", ""]);
    const dateFormat = 'YYYY/MM/DD';

    const [searchParams, setSearchParams] = useSearchParams();
    const dateFrom = searchParams.get('from');
    const dateTo = searchParams.get('to');

    const [dataReportCheckIn, setDataReportCheckIn] = useState<any>([]);
    const [dataReportCheckOut, setDataReportCheckOut] = useState<any>([]);

    const { data, isLoading, refetch } = useCustom<any>({
        url: `api/v1/dashboard/reportAsset`,
        method: "get",
        config: {
            query: {
                from: dateFrom ? dateFrom : dataReport[0],
                to: dateTo ? dateTo : dataReport[1]
            }
        },
    });

    const { list } = useNavigation();
    const { RangePicker } = DatePicker;

    useEffect(() => {
        setDataReport([dateFrom !== null ? dateFrom : "", dateTo !== null ? dateTo : ""]);
        refetch();
    }, [dateFrom, dateTo])

    const handleChangePickerByMonth = (val: any, formatString: any) => {
        const [from, to] = Array.from(val || []);
        searchParams.set(
            "from",
            from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
        );
        searchParams.set(
            "to",
            to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
        );
        setSearchParams(searchParams);
    };

    useEffect(() => {
        var assetNames = (data?.data.payload.assets_statistic || []).map((item: IReport) => item.name);
        var assetArr: string[] = []
        assetArr = assetNames.filter(function (item: string) {
            return assetArr.includes(item) ? '' : assetArr.push(item);
        })

        var dataResponseCheckInt: any = [];
        var iteLocationKey: any = [];
        let dataSource = (data?.data.payload.categories || []).map((category: IReport) => {
            var iteDataSource = { type: category.name, id: category.id }
            var iteLocation = {};
            for (let i of data?.data.payload.locations) {
                iteLocation = { ...iteLocation, [`location_${i.id}`]: 0, [`count`]: 0 }
                iteLocationKey.push(`location_${i.id}` as string);
            }
            return { ...iteDataSource, ...iteLocation };
        });

        (data?.data.payload.assets_statistic || []).forEach((items: IReport) => {
            dataSource.forEach((item: any) => {
                if (item.type === items.name) {
                    for (const key of iteLocationKey) {
                        if (key == `location_${items.location_id}`) {
                            item[key] = item[key] + Number(items.checkin);
                            item[`count`] += Number(items.checkin);
                            break;
                        }
                    }
                }
            })
        });
        dataResponseCheckInt = dataSource;

        setDataReportCheckIn(dataResponseCheckInt);
    }, [data?.data.payload.assets_statistic || []])

    useEffect(() => {
        var assetNames = (data?.data.payload.assets_statistic || []).map((item: IReport) => item.name);
        var assetArr: string[] = []
        assetArr = assetNames.filter(function (item: string) {
            return assetArr.includes(item) ? '' : assetArr.push(item);
        })

        var dataResponseCheckOut: any = [];
        var iteLocationKey: any = [];
        let dataSource = (data?.data.payload.categories || []).map((category: IReport) => {
            var iteDataSource = { type: category.name, id: category.id }
            var iteLocation = {};
            for (let i of data?.data.payload.locations) {
                iteLocation = { ...iteLocation, [`location_${i.id}`]: 0, [`count`]: 0 }
                iteLocationKey.push(`location_${i.id}` as string);
            }
            return { ...iteDataSource, ...iteLocation };
        });

        (data?.data.payload.assets_statistic || []).forEach((items: IReport) => {
            dataSource.forEach((item: any) => {
                if (item.type === items.name) {
                    for (const key of iteLocationKey) {
                        if (key == `location_${items.location_id}`) {
                            item[key] = item[key] + Number(items.checkout);
                            item[`count`] += Number(items.checkout);
                            break;
                        }
                    }
                }
            })
        });
        dataResponseCheckOut = dataSource;

        setDataReportCheckOut(dataResponseCheckOut);
    }, [data?.data.payload.assets_statistic || []])

    var columnsCheckOut = [
        {
            title: "Thiết bị cấp phát",
            dataIndex: "type",
            key: "type",
            render: (text: string, record: IReport) => <strong onClick={() => {
                (dataReport[0] && dataReport[1])
                    ? list(`report?category_id=${record.id}&assetHistoryType=0&purchaseDateFrom=${dataReport[0]}&purchaseDateTo=${dataReport[1]}`)
                    : list(`report?category_id=${record.id}&assetHistoryType=0`)
            }} style={{ color: "#52c41a", cursor: "pointer" }}>{text}</strong>
        },
    ];

    var columntypesCheckOut = (data?.data.payload.locations || []).map((item: any) => {
        return {
            title: item.name,
            dataIndex: "location_" + item.id,
            key: "location_" + item.id,
            render: (text: string, record: IReport) => <a onClick={() => {
                (dataReport[0] && dataReport[1])
                    ? (list(`report?category_id=${record.id}&location=${item.id}&assetHistoryType=0&purchaseDateFrom=${dataReport[0]}&purchaseDateTo=${dataReport[1]}`))
                    : (list(`report?category_id=${record.id}&location=${item.id}&assetHistoryType=0`))
            }}>{text}</a>
        };
    });

    // var Titletong = {
    //     title: "tong",
    //     dataIndex: "count",
    //     key: "count",
    //     render: (text: string, record: IReport) => text
    // }
    // columnsCheckOut = [...columnsCheckOut, ...columntypesCheckOut, Titletong];

    columnsCheckOut = [...columnsCheckOut, ...columntypesCheckOut];

    var columnsCheckIn = [
        {
            title: "Thiết bị thu hồi",
            dataIndex: "type",
            key: "type",
            render: (text: string, record: IReport) => <strong onClick={() => {
                (dataReport[0] && dataReport[1])
                    ? list(`report?category_id=${record.id}&assetHistoryType=1&purchaseDateFrom=${dataReport[0]}&purchaseDateTo=${dataReport[1]}`)
                    : list(`report?category_id=${record.id}&assetHistoryType=1`)
            }} style={{ color: "#52c41a", cursor: "pointer" }}>{text}</strong>
        },
    ];

    var columntypesCheckIn = (data?.data.payload.locations || []).map((item: any) => {
        return {
            title: item.name,
            dataIndex: "location_" + item.id,
            key: "location_" + item.id,
            render: (text: string, record: IReport) => <a onClick={() => {
                (dataReport[0] && dataReport[1])
                    ? (list(`report?category_id=${record.id}&location=${item.id}&assetHistoryType=1&purchaseDateFrom=${dataReport[0]}&purchaseDateTo=${dataReport[1]}`))
                    : (list(`report?category_id=${record.id}&location=${item.id}&assetHistoryType=1`))
            }}>{text}</a>
        };
    });

    // columnsCheckIn = [...columnsCheckOut, ...columntypesCheckOut, Titletong];
    columnsCheckIn = [...columnsCheckIn, ...columntypesCheckIn];

    useEffect(() => {
        localStorage.removeItem("purchase_date")
    }, [window.location.reload])

    return (
        <>
            <List title={translate("dashboard.titleStatistic")}>
                <section className="reportAssetContainer">
                    <span className="title-section-dashboard">
                        {translate("report.label.title.nameReportCheckOut")}
                    </span>
                    <div className="search-all-location">
                        <Form
                            layout="vertical"
                            className="search-month-location"
                        >
                            <Form.Item label={translate("dashboard.time")} name="dataReport">
                                <RangePicker
                                    format={dateFormat}
                                    onChange={handleChangePickerByMonth}
                                    placeholder={[`${translate("report.label.field.dateStart")}`, `${translate("report.label.field.dateEnd")}`]}

                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ marginTop: "6rem" }}>
                        <Row gutter={[12, 12]}>
                            <Col sm={24} md={24}>
                                <Row gutter={16}>
                                    <Col sm={10} md={10}>
                                        <AssetsSummaryPieChartCheckOut assets_statistic={dataReportCheckOut ? dataReportCheckOut : ""} />
                                    </Col>
                                    <Col sm={24} md={14}>
                                        <Table
                                            key="id"
                                            dataSource={dataReportCheckOut}
                                            columns={columnsCheckOut}
                                            pagination={dataReportCheckOut ?? dataReportCheckOut.length <= 10 ? false : { pageSize: 10 }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </section>

                <section className="reportAssetContainer">
                    <span className="title-section-dashboard">
                        {translate("report.label.title.nameReportCheckIn")}
                    </span>
                    <div className="search-all-location">
                        <Form
                            layout="vertical"
                            className="search-month-location"
                        >
                            <Form.Item label={translate("dashboard.time")} name="dataReport">
                                <RangePicker
                                    format={dateFormat}
                                    onChange={handleChangePickerByMonth}
                                    placeholder={[`${translate("report.label.field.dateStart")}`, `${translate("report.label.field.dateEnd")}`]}

                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ marginTop: "6rem" }}>
                        <Row gutter={[12, 12]}>
                            <Col sm={24} md={24}>
                                <Row gutter={16}>
                                    <Col sm={24} md={10}>
                                        <AssetsSummaryPieChartCheckIn assets_statistic={dataReportCheckIn ? dataReportCheckIn : ""} />
                                    </Col>
                                    <Col sm={24} md={14}>
                                        <Table
                                            key="id"
                                            dataSource={dataReportCheckIn}
                                            columns={columnsCheckIn}
                                            pagination={dataReportCheckIn ?? dataReportCheckIn.length <= 10 ? false : { pageSize: 10 }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </section>
            </List>
        </>
    );
}





