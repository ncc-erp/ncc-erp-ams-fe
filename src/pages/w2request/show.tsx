/* eslint-disable react-hooks/exhaustive-deps */
import { useCustom, useTranslate } from "@pankod/refine-core";

import "react-mde/lib/styles/css/react-mde-all.css";

import { W2REQUEST_API } from "api/baseApi";
import { ITaskResult } from "interfaces/w2request";
import { Divider, TagField, TextField } from "@pankod/refine-antd";
import { Spin } from "antd";

import "./style.less"
import { useMemo } from "react";
import { isObjectEmpty } from "untils/isObjectEmpty";
import { RequestInput } from "./components/RequestInput";
import { TextGroup } from "./components/TextGroup";
import { formatDate } from "untils/dateHandler";
import { getBGRequestAssignedStatusDecription, getRequestStatusDecription } from "untils/request";
import { RequestStatus } from "constants/w2request";

type DetailRequestProps = {
    id: string;
};

export const DetailRequest = (props: DetailRequestProps) => {
    const translate = useTranslate();
    const { id } = props;
    const { data, isLoading } = useCustom<ITaskResult>({
        url: W2REQUEST_API + `/${id}/request-detail-by-id`,
        method: "get",
        successNotification: false,
        errorNotification: false,
    });

    const { tasks, inputRequestUser, inputRequestDetail, emailTo } =
        useMemo(() => {
            const { input, tasks, emailTo } = data?.data || {};
            const { RequestUser, Request } = input || {};

            return {
                tasks,
                emailTo,
                inputRequestUser: RequestUser,
                inputRequestDetail: Request,
            };
        }, [data]);

    const hasInputRequestData: boolean = useMemo(() => {
        return !isObjectEmpty(inputRequestDetail);
    }, [inputRequestDetail]);

    if (isLoading) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spin />
            </div>
        )
    }

    return (
        <div className="modalBody">
            <div className="container">
                <TextField
                    value={translate("w2request.label.title.RequestInput")}
                    style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "red"
                    }}
                />

                <div className="wrapper">
                    {hasInputRequestData && inputRequestDetail && (
                        <RequestInput inputRequestDetail={inputRequestDetail} />
                    )}
                </div>

                <Divider style={{ marginBottom: "12px", marginTop: "8px" }} />

                <TextField
                    value={translate("w2request.label.title.RequestUser")}
                    style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "red"
                    }}
                />

                <div className="wrapper">
                    <TextGroup label={translate("w2request.label.title.Name")} content={inputRequestUser?.name} />
                    <TextGroup label="Email" content={inputRequestUser?.email} />
                    <TextGroup
                        label={translate("w2request.label.title.Branchname")}
                        content={inputRequestUser?.branchName}
                    />
                </div>

                <Divider style={{ marginBottom: "12px", marginTop: "8px" }} />

                <TextField
                    value={translate("w2request.label.title.Detail")}
                    style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "red"
                    }}
                />

                <div className="wrapper">
                    <TextGroup label={translate("w2request.label.title.Requesttemplate")} content={tasks?.name} />
                    <TextGroup
                        label={translate("w2request.label.title.Emailassignment")}
                        content={emailTo?.join(', ')}
                    />
                    <TextGroup
                        label={translate("w2request.label.title.Creationtime")}
                        content={
                            tasks?.creationTime
                                ? formatDate(new Date(tasks?.creationTime))
                                : ''
                        }
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <label style={{ fontWeight: "700", fontSize: "15px" }}>{translate("w2request.label.title.status")}</label>
                        <TagField
                            value={getRequestStatusDecription(tasks?.status as string)}
                            style={{
                                fontSize: "15px",
                                background: getBGRequestAssignedStatusDecription(tasks?.status as string),
                                color: "white",
                                width: "fit-content",
                            }}
                        />
                    </div>

                    {tasks?.reason && (
                        <TextGroup label={translate("w2request.label.title.Reason")} content={tasks.reason} />
                    )}

                    {tasks?.status == RequestStatus.REJECTED && tasks?.updatedBy && (
                        <TextGroup label={translate("w2request.label.title.RejectedBy")} content={tasks.updatedBy} />
                    )}
                </div>

            </div>
        </div>
    );
};
