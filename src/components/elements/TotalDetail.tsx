import {
    CrudFilters,
    useNotification,
    useTranslate
} from "@pankod/refine-core";
import { ITotalDetail } from "interfaces";
import { useEffect, useState } from "react";
import { axiosInstance } from "providers/axios";
import { stringify } from "query-string";

type TotalDetailProps = {
    filters: CrudFilters | undefined;
    links: string;
};

export const TotalDetail = (props: TotalDetailProps) => {
    const { filters, links } = props;
    const t = useTranslate();
    const { open } = useNotification();
    const [totalDetail, setTotalDetail] = useState<ITotalDetail[]>();

    const getTotalDetail = () => {
        const queryFilters: { [key: string]: string | string[] } = {};
        if (filters) {
            filters.map((filter) => {
                if (filter.operator !== "or") {
                    const { field, operator, value } = filter;
                    queryFilters[field] = value;
                }
            });
        }
        const data = axiosInstance.get(
            `${links}?${stringify(queryFilters, { arrayFormat: 'index' })}`
        );
        data.then(response => {
            setTotalDetail(response.data.payload);
        })
    }

    useEffect(() => {
        getTotalDetail();
    }, [filters]);

    return (
        <div className="sum-assets">
            <span className="name-sum-assets">
                {t("hardware.label.title.sum-assets")}
            </span>{" "}
            : {totalDetail ? totalDetail.map((item: any, index: any) => (
                <span className="total-sum-assets" key={index}>{item.name} {"(" + item.total + ")"}</span>
            )) : 0}
        </div>
    )
}