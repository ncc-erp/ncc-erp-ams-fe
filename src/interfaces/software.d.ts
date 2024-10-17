import { Interface } from "readline";

export interface ISoftware {
  id: string;
  name: string;
  total: number;
  datetime: string;
  date: string;
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

export interface ISoftwareRequestMultipleCheckout {
  softwares: any[];
  assigned_users: string;
  checkout_at: string;
  notes: string;
  software: string;
  licenses: string;
}
export interface ISoftwareUsesResponse {
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
  checkout_at: string;
}
