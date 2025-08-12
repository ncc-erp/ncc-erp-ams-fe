import { IAppSearchParams, ParamConfig } from "hooks/useAppSearchParams/types";

// Common parameter configurations
const createStringParam = (
  key: string,
  defaultValue: string | undefined = undefined
): ParamConfig => ({
  key,
  type: "string",
  defaultValue,
});

const createJsonParam = (
  key: string,
  defaultValue: any = null
): ParamConfig => ({
  key,
  type: "json",
  defaultValue,
});

// Date range parameters
const dateRangeParams = {
  date_from: createStringParam("date_from"),
  date_to: createStringParam("date_to"),
};

const purchaseDateRangeParams = {
  purchase_date_from: createStringParam("purchase_date_from"),
  purchase_date_to: createStringParam("purchase_date_to"),
};

const expirationDateRangeParams = {
  expirationDateFrom: createStringParam("expirationDateFrom"),
  expirationDateTo: createStringParam("expirationDateTo"),
};

// Common filter parameters
const commonFilterParams = {
  search: createStringParam("search"),
  category_id: createStringParam("category_id"),
  manufacturer_id: createStringParam("manufacturer_id"),
  supplier_id: createStringParam("supplier_id"),
  location_id: createStringParam("location_id"),
  rtd_location_id: createJsonParam("rtd_location_id", null),
};

export const SEARCH_PARAMS_CONFIG: Record<
  keyof IAppSearchParams,
  Record<string, ParamConfig>
> = {
  dashboard: {
    ...purchaseDateRangeParams,
    purchase_date_from1: createStringParam("purchase_date_from1"),
    purchase_date_to1: createStringParam("purchase_date_to1"),
    rtd_location_id: createJsonParam("rtd_location_id", null),
  },

  hardwareList: {
    ...commonFilterParams,
    status_id: createStringParam("status_id"),
    dateFrom: createStringParam("dateFrom"),
    dateTo: createStringParam("dateTo"),
    model_id: createStringParam("model_id"),
    assigned_status: createStringParam("assigned_status"),
    type: createStringParam("type"),
  },

  toolList: {
    ...commonFilterParams,
    purchaseDateFrom: createStringParam("purchaseDateFrom"),
    purchaseDateTo: createStringParam("purchaseDateTo"),
    ...expirationDateRangeParams,
  },

  accessoryList: {
    ...commonFilterParams,
    ...dateRangeParams,
  },

  consumablesList: {
    ...commonFilterParams,
    ...dateRangeParams,
  },

  taxTokenList: {
    ...commonFilterParams,
    purchaseDateFrom: createStringParam("purchaseDateFrom"),
    purchaseDateTo: createStringParam("purchaseDateTo"),
    ...expirationDateRangeParams,
  },

  reportList: {
    ...commonFilterParams,
    ...dateRangeParams,
    action_type: createStringParam("action_type"),
    category_type: createStringParam("category_type"),
  },

  listCheckinCheckout: {
    from_CheckIn: createStringParam("from_CheckIn"),
    to_CheckIn: createStringParam("to_CheckIn"),
    from_CheckOut: createStringParam("from_CheckOut"),
    to_CheckOut: createStringParam("to_CheckOut"),
  },
};

// Utility functions for type-safe access
export const getParamConfig = <K extends keyof IAppSearchParams>(
  section: K,
  paramKey: keyof IAppSearchParams[K]
): ParamConfig | undefined => {
  return SEARCH_PARAMS_CONFIG[section][paramKey as string];
};

export const getDefaultValue = <K extends keyof IAppSearchParams>(
  section: K,
  paramKey: keyof IAppSearchParams[K]
): any => {
  const config = getParamConfig(section, paramKey);
  return config?.defaultValue;
};

export const getParamKey = <K extends keyof IAppSearchParams>(
  section: K,
  paramKey: keyof IAppSearchParams[K]
): string => {
  const config = getParamConfig(section, paramKey);
  return config?.key || (paramKey as string);
};
