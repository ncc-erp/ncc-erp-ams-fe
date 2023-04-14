import { Interface } from "readline";

export interface ISoftware {
  total: number;
  id: string;
  datetime: string;
  date: string;
  name: string;
}

export interface ISoftwareResponse {
  id: number;
  name: string;
  software_tag: string;
  total_licenses: number;
  checkout_count: number;
  user: {
    id: number;
    name: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  notes: string;
  category: {
    id: number;
    name: string;
  };
  version: string;
  user_can_checkout: boolean;
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
  deleted_at: {
    datetime: string;
    formatted: string;
  };
}

export interface ISoftwareCreateRequest {
  name: string;
  manufacturer_id: string;
  notes: string;
  category_id: string;
  software_tag: string;
  version: string;
}

export interface ISoftwareFilterVariables {
  search: string;
  name: string;
  software_tag: string;
  category: string;
  manufacturer: string;
}

export interface IModelSoftware {
  id: number;
  name: string;
  datetime: string;

}

export interface ISoftwareLicensesResponse {
  id: number;
  licenses: string;
  seats: string;
  freeSeats: number;
  software: {
    id: number;
    name: string;
  };
  purchase_date: {
    date: string;
    formatted: string;
  };
  expiration_date: {
    date: string;
    formatted: string;
  };
  purchase_cost: string;
  purchase_cost_numeric: string;
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
  deleted_at: {
    datetime: string;
    formatted: string;
  };
  user_can_checkout: boolean;
}

export interface ISoftwareLicensesFilterVariables {
  search: string;
  licenses: string;
  seats: string;
  freeSeats: number;
  software: string;
  purchase_cost: string;
  purchase_cost_numeric: string;
}

export interface ISoftwareRequestMultipleCheckout {
  softwares: {}[];
  assigned_user: string;
  checkout_at: string,
  notes: string
}

export interface ILicensesRequestCheckout {
  id: number,
  licenses: string
  assigned_user: string;
  software: string;
  checkout_at: {
    datetime: string;
    formatted: string;
  };
  notes: string
}

export interface ILicensesRequestEdit {
  id: number,
  licenses: string
  seats: string;
  software: {
    id: number;
    name: string;
  };
  purchase_date: {
    date: string;
    formatted: string;
  };
  expiration_date: {
    date: string;
    formatted: string;
  };
  purchase_cost: string;
}

export interface ILicensesReponse {
  id: number,
  licenses: string
  seats: string;
  software: string
  purchase_date: string
  expiration_date: string
  purchase_cost: string;
}
