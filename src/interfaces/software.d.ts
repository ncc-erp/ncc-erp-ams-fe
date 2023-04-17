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
  created_at: [Dayjs, Dayjs];
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
  allocated_seats_count: number;
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
  software: string;
  purchase_cost: string;
  purchase_cost_numeric: string;
  purchase_date: [Dayjs, Dayjs];
  expiration_date: string;
}

export interface ISoftwareRequestMultipleCheckout {
  softwares: {}[];
  assigned_users: [];
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
  allocated_seats_count: number;
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
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  }
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

export interface ILicensesUsersReponse {
  id: number,
  license_active: {
    id: number,
    name: string
  };
  assigned_user: {
    id: number,
    name: string,
  };
}

