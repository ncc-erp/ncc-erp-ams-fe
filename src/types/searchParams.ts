export type ParamType = "string" | "number" | "boolean" | "json";

export interface ParamConfig {
  key: string;
  type: ParamType;
  defaultValue: any;
}
export interface IDashboardSearchParams {
  purchase_date_from: string;
  purchase_date_to: string;
  purchase_date_from1: string;
  purchase_date_to1: string;
  rtd_location_id: number | null;
}

export interface IHardwareListSearchParams {
  category_id: number;
  rtd_location_id: string;
  status_id: number;
  dateFrom: string;
  dateTo: string;
  search: string;
  model_id: number;
  manufacturer_id: number;
  supplier_id: number;
  assigned_status: string;
  type: string;
}
export interface IAppSearchParams {
  dashboard: IDashboardSearchParams;
  hardwareList: IHardwareListSearchParams;
}
