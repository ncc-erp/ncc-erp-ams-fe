import {
    CrudFilters,
} from "@pankod/refine-core";
import { ITotalDetail } from "interfaces";
import { useEffect, useState } from "react";
import { axiosInstance } from "providers/axios";
import { stringify } from "query-string";
import { SetURLSearchParams } from "react-router-dom";
import { FormProps } from "@pankod/refine-antd";
import { BadgeButtonTotalItem } from "./BadgeButtonTotalItem";

type TotalDetailProps = {
    filters: CrudFilters | undefined;
    links: string;
    additional_filter?: string;
    isReload?: boolean | undefined;
    searchParams?: URLSearchParams;
    setSearchParams?: SetURLSearchParams;
    searchFormProps?: FormProps<any>
    optionCategory?: {
        text: React.ReactNode;
        value: string | number | null | undefined;
    }[] | undefined,
};

export const TotalDetail = (props: TotalDetailProps) => {
    const { filters, links, additional_filter, searchParams, setSearchParams, searchFormProps, optionCategory } = props;
    const [totalDetail, setTotalDetail] = useState<ITotalDetail[]>();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
            `${links}?${stringify(queryFilters, { arrayFormat: 'index' })}&${additional_filter}`,
        );
        data.then(response => {
            setTotalDetail(response.data.payload);
        })
    }

    useEffect(() => {
        getTotalDetail();
    }, []);

    const getIdCategory = (name: any) => {
        let id;
        optionCategory?.map((item) => {
            if (item.text === name) {
                id = item.value;
            }
        });
        return id;
    }

    const handleSelectFilter = (name: any) => {
        if (activeCategory === name) {
            setActiveCategory(null);
            localStorage.removeItem("category_id");
            searchFormProps?.form?.setFieldsValue({ category: undefined });
            searchFormProps?.form?.submit();
            return;
        }
        if (!searchParams || !setSearchParams || !searchFormProps) return;
        localStorage.setItem(
            "category_id",
            getIdCategory(name) ?? ""
        );
        setActiveCategory(name);
        searchFormProps.form?.setFieldsValue({ category: getIdCategory(name) });
        searchFormProps.form?.submit();
    }

    if (!searchFormProps) {
        <div className="sum-assets">
            {totalDetail ? totalDetail.map((item: any, index: any) => (
                <span className="total-sum-assets" key={index}>{item.name} {"(" + item.total + ")"}</span>
            )) : 0}
        </div>
    }

    return (
        <div className="sum-assets">
            {totalDetail ? totalDetail.map((item: any, index: any) => (
                <BadgeButtonTotalItem
                    active={activeCategory === item.name}
                    handleSelectFilter={handleSelectFilter}
                    key={index}
                    name={item.name}
                    total={item.total}
                />
            )) : 0}
        </div>
    )
}