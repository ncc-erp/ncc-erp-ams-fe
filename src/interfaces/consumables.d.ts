export interface IConsumables {
  id: number;
  name: string;
  datetime: string;
}

export interface IConsumablesCategory {
  id: number;
  text: string;
}

export interface IConsumablesRequest {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  purchase_date: string;
  location: string;
  total_consumables: number;
  notes: string;
  order_number: string;
  image: string;
  qty: number;
  date: string;
  purchase_cost: string;
  supplier: string;
  warranty_months: string;
  maintenance_date: string;
  maintenance_cycle: string;
}
export interface IConsumablesResponse {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  purchase_date: {
    date: string;
    formatted: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  total_consumables: number;
  notes: string;
  purchase_cost: number;
  image: string;
  order_number: number;
  qty: number;
  user_can_checkout: boolean;
  assigned_to: number;
  warranty_months: string;
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
  remaining: number;
  maintenance_date?: {
    date: string;
    formatted: string;
  };
  maintenance_cycle?: string;
}

export interface IConsumablesRequestCheckout {
  assigned_asset: string;
  assigned_location: string;
  assigned_user: string;
  status_label: string;
  model: string;
  id: number;
  asset_tag: string;
  status_id: number;
  model_id: number;
  name: string;
  note: string;
  archived: boolean;
  depreciate: boolean;
  checkout_at: string;
  expected_checkin: string;
  location_id: number;
  checkout_to_type: string;
  assigned_to: string;
  user_can_checkout: boolean;
  category: number;
}
export interface IConsumablesResponseCheckout {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  note: string;

  checkout_at: {
    date: string;
    formatted: string;
  };
  assigned_to: number;
  user_can_checkout: boolean;
}

export interface IConsumablesFilterVariables {
  search: string;
  name: string;
  filter: string;
  location: string;
  purchase_date: [Dayjs, Dayjs];
  category: string;
}
export interface FormValues {
  purchase_date?: string;
  maintenance_cycle?: number;
}
