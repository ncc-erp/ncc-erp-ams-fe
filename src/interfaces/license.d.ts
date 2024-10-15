import { Interface } from "readline";

export interface ILicenses {
  id: string;
  name: string;
  total: number;
  datetime: string;
  date: string;
}

export interface ILicensesResponse {
  id: number;
  licenses: string;
  seats: string;
  freeSeats: number;
  checkout_count: number;
  software: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  manufacturer: {
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
  checkout_at: {
    datetime: string;
    formatted: string;
  };
  user_can_checkout: boolean;
}

export interface ILicensesRequestCheckout {
  id: number;
  licenses: string;
  assigned_user: string;
  software: string;
  checkout_at: {
    datetime: string;
    formatted: string;
  };
  notes: string;
}

export interface ILicensesRequestEdit {
  id: number;
  licenses: string;
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
  checkout_count: number;
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
}

export interface ILicensesUsersReponse {
  id: number;
  license_active: {
    id: number;
    name: string;
  };
  assigned_user: {
    id: number;
    name: string;
  };
}

export interface ILicensesCreateRequest {
  software_id: string;
  licenses: string;
  seats: string;
  purchase_date: string;
  expiration_date: string;
  purchase_cost: string;
}

export interface ILicensesFilterVariables {
  search: string;
  licenses: string;
  seats: string;
  software: string;
  purchase_cost: string;
  purchase_cost_numeric: string;
  purchase_date: [Dayjs, Dayjs];
  expiration_date: string;
}

export interface ILicenseUsers {
  id: number;
  license_active: {
    id: number;
    name: string;
  };
  assigned_user: {
    user_id: number;
    name: string;
    department: string;
    location: string;
  };
  checkout_at: {
    datetime: string;
    formatted: string;
  };
}
