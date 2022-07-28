import { useState } from "react";
import { Form, List, Row } from "@pankod/refine-antd";
import { useCustom, useNavigation, useTranslate } from "@pankod/refine-core";
import { DatePicker } from 'antd';

export const ListCheckin_Checkout: React.FC = () => {
    const translate = useTranslate();
    const [dataReport, setDataReport] = useState<[string, string]>(["", ""]);
    const dateFormat = 'YYYY/MM/DD';

    const { data, refetch } = useCustom({
        url: "api/v1/dashboard/reportAsset",
        method: "get",
        config: {
            query: {
                from: dataReport[0],
                to: dataReport[1]
            }
        },
    });

    const { list } = useNavigation();
    const { RangePicker } = DatePicker;

    const handleReportAssets = (values: any, formatString: [string, string]) => {
        setDataReport(formatString);
        refetch();
    }

    return (
        <>
            <div className="reportAssetContainer">
                <List title={translate("dashboard.titleStatistic")}>
                    <Form
                        layout="vertical"
                        className="search-month-location"
                    >
                        <Form.Item label={translate("dashboard.time")} name="dataReport">
                            <RangePicker
                                format={dateFormat}
                                onChange={handleReportAssets}
                            />
                        </Form.Item>
                    </Form>
                    <Row gutter={[12, 12]}>
                        {(data?.data.payload || []).map((item: any, index: any) => (
                            <table className="report_assets" key={index}>
                                <thead>
                                    <tr>
                                        <th colSpan={2}><a onClick={() => { list("assets") }}>{item.locationName}</a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th><a>{item.type === 1 ? "Cấp phát" : "Thu hồi"}</a></th>
                                        <td><a>{item.total}</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}
                    </Row>
                </List>
            </div>
        </>
    );
}





