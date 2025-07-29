export type ParamType = "string" | "number" | "boolean" | "json";

export interface ParamConfig {
  key: string;
  type: ParamType;
  defaultValue: any;
}

// Base interfaces cho từng loại parameter
export interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}

export interface SearchParams {
  search?: string;
}

export interface LocationParams {
  location_id?: string;
  rtd_location_id?: number | null | string;
}

export interface CategoryParams {
  category_id?: string | number;
}

export interface FilterParams {
  manufacturer_id?: string | number;
  supplier_id?: string | number;
  model_id?: string | number;
  status_id?: string | number;
}

// Dashboard specific
export interface IDashboardSearchParams {
  purchase_date_from: string;
  purchase_date_to: string;
  purchase_date_from1: string;
  purchase_date_to1: string;
  rtd_location_id: number | null | string;
}

// Hardware list specific
export interface IHardwareListSearchParams {
  category_id: string;
  rtd_location_id: number | null | string;
  status_id: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  model_id: string;
  manufacturer_id: string;
  supplier_id: string;
  assigned_status: string;
  type: string;
}

// Tool list specific
export interface IToolListSearchParams {
  purchaseDateFrom: string;
  purchaseDateTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
  search: string;
  rtd_location_id: number | null;
}

// Accessory list specific
export interface IAccessoryListSearchParams {
  category_id: string;
  location_id: string;
  date_from: string;
  date_to: string;
  search: string;
  supplier_id: string;
  manufacturer_id: string;
}

// Consumables list specific
export interface IConsumablesListSearchParams {
  location_id: string;
  date_from: string;
  date_to: string;
  search: string;
  category_id: string;
  manufacturer_id: string;
  supplier_id: string;
}

// Tax token list specific
export interface ITaxTokenListSearchParams {
  search: string;
  purchaseDateFrom: string;
  purchaseDateTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
  rtd_location_id: number | null;
}

// Report list specific
export interface IReportListSearchParams {
  location_id: string;
  date_from: string;
  date_to: string;
  action_type: string;
  search: string;
  category_id: string;
  category_type: string;
}

// Checkin/Checkout list specific
export interface IListCheckinCheckoutSearchParams {
  from_CheckIn: string;
  to_CheckIn: string;
  from_CheckOut: string;
  to_CheckOut: string;
}

// Main interface mapping
export interface IAppSearchParams {
  dashboard: IDashboardSearchParams;
  hardwareList: IHardwareListSearchParams;
  toolList: IToolListSearchParams;
  accessoryList: IAccessoryListSearchParams;
  consumablesList: IConsumablesListSearchParams;
  taxTokenList: ITaxTokenListSearchParams;
  reportList: IReportListSearchParams;
  listCheckinCheckout: IListCheckinCheckoutSearchParams;
}

// Utility types
export type SearchParamKey = keyof IAppSearchParams;
export type SearchParamValue<T extends SearchParamKey> = IAppSearchParams[T];
