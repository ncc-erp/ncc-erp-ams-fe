import { DateField, List, Table, TagField, TextField } from "@pankod/refine-antd";
import { IResourceComponentsProps, useCustom, useTranslate } from "@pankod/refine-core";
import { useMemo } from "react";
import { IReport } from "interfaces/report";


export const ReportList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();

    const { data, isLoading } = useCustom<any>({
        url: "api/v1/accessHistory",
        method: "get",
    });


    const collumns = useMemo(
        () => [
            {
                key: "asset",
                title: translate("report.label.field.name"),
                render: (value: IReport) => <TextField value={value.name} />,
            },
            {
                key: "asset",
                title: translate("report.label.field.propertyCard"),
                render: (value: IReport) => <TextField value={value.asset_tag} />,
            },
            // {
            //     key: "asset",
            //     title: translate("report.label.field.serial"),
            //     render: (value: IReport) => <TextField value={value.serial} />,
            // },
            // {
            //     key: "asset",
            //     title: translate("report.label.field.orderNumber"),
            //     render: (value: IReport) => <TextField value={value.order_number} />,
            // },
            // {
            //     key: "asset",
            //     title: translate("report.label.field.note"),
            //     render: (value: IReport) => <TextField value={value.notes} />,
            // },
            {
                key: "asset",
                title: translate("hardware.label.field.condition"),
                render: (value: IReport) => (
                    <TagField
                        value={
                            value.assigned_status === 0
                                ? translate("hardware.label.detail.noAssign")
                                : value.assigned_status === 1
                                    ? translate("hardware.label.detail.pendingAccept")
                                    : value.assigned_status === 2
                                        ? translate("hardware.label.detail.accept")
                                        : value.assigned_status === 3
                                            ? translate("hardware.label.detail.refuse")
                                            : ""
                        }
                        style={{
                            background:
                                value.assigned_status === 0
                                    ? "gray"
                                    : value.assigned_status === 1
                                        ? "#f39c12"
                                        : value.assigned_status === 2
                                            ? "#0073b7"
                                            : value.assigned_status === 3
                                                ? "red"
                                                : "gray",
                            color: "white",
                        }}
                    />
                ),
            },
            {
                key: "asset",
                title: translate("report.label.field.dateCreate"),
                render: (value: IReport) => (
                    <DateField format="LLL" value={value.created_at} />
                ),
            },
        ],
        []
    );

    return (
        <List
            title={translate("report.label.title.name")}
        >
            <Table
                dataSource={data?.data}
                rowKey="id"
            // scroll={{ x: 1400 }}
            >
                {collumns
                    .map((col) => (
                        <Table.Column dataIndex={col.key} {...col} sorter />
                    ))}
            </Table>
        </List>
    );
}