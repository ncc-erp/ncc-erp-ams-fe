import { Pie } from "@ant-design/plots";
import { useTranslate } from "@pankod/refine-core";

export interface IAssetHistory {
    id: number;
    location_id: number;
    locationName: string;
    name: string;
    checkin: string;
    checkout: string;
}

type AssetsSummaryPieChartProps = {
    assets_statistic: IAssetHistory[];
};

export const AssetsSummaryPieChartCheckOut = (props: AssetsSummaryPieChartProps) => {
    const { assets_statistic } = props;

    const translate = useTranslate();
    const data = assets_statistic;

    const config = {
        appendPadding: 10,
        data,
        angleField: 'count',
        colorField: 'type',
        color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 12,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: "22px"
                },
                content: translate("report.label.title.nameReportCheckOut"),
            },
        },
    };
    return <Pie {...config} />;
};

export const AssetsSummaryPieChartCheckIn = (props: AssetsSummaryPieChartProps) => {
    const { assets_statistic } = props;

    const translate = useTranslate();
    const data = assets_statistic;

    const config = {
        appendPadding: 10,
        data,
        angleField: 'count',
        colorField: 'type',
        color: ["#3c8dbc", "#00a65a", "#dd4b39", "#f39c12", "#00c0ef", "#605ca8"],
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 12,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: "22px"
                },
                content: translate("report.label.title.nameReportCheckIn"),
            },
        },
    };
    return <Pie {...config} />;
};
