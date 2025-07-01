import { IAppSearchParams, ParamConfig } from "types/searchParams";

export const SEARCH_PARAMS_CONFIG: Record<
  keyof IAppSearchParams,
  Record<string, ParamConfig>
> = {
  dashboard: {
    purchase_date_from: {
      key: "purchase_date_from",
      type: "string",
      defaultValue: "",
    },
    purchase_date_to: {
      key: "purchase_date_to",
      type: "string",
      defaultValue: "",
    },
    purchase_date_from1: {
      key: "purchase_date_from1",
      type: "string",
      defaultValue: "",
    },
    purchase_date_to1: {
      key: "purchase_date_to1",
      type: "string",
      defaultValue: "",
    },
    rtd_location_id: {
      key: "rtd_location_id",
      type: "json",
      defaultValue: null,
    },
  },
  hardwareList: {
    category_id: {
      key: "category_id",
      type: "string",
      defaultValue: "",
    },
    rtd_location_id: {
      key: "rtd_location_id",
      type: "json",
      defaultValue: null,
    },
    status_id: {
      key: "status_id",
      type: "string",
      defaultValue: "",
    },
    dateFrom: {
      key: "dateFrom",
      type: "string",
      defaultValue: "",
    },
    dateTo: {
      key: "dateTo",
      type: "string",
      defaultValue: "",
    },
    search: {
      key: "search",
      type: "string",
      defaultValue: "",
    },
    model_id: {
      key: "model_id",
      type: "string",
      defaultValue: "",
    },
    manufacturer_id: {
      key: "manufacturer_id",
      type: "string",
      defaultValue: "",
    },
    supplier_id: {
      key: "supplier_id",
      type: "string",
      defaultValue: "",
    },
    assigned_status: {
      key: "assigned_status",
      type: "string",
      defaultValue: "",
    },
  },
};
