export interface IAccesstoryRequest {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  purchase_date: string;
  supplier: string;
  location: string;
  total_accessory: number;
  notes: string;
  order_number: string;
  purchase_cost: number;
  image: string;
  qty: number;
  date: string;
}

export interface IAccesstoryResponse {
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
  supplier: {
    id: number;
    name: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  total_accessory: number;
  notes: string;
  purchase_cost: number;
  image: string;
  order_number: number;
  qty: number;
  user_can_checkout: boolean;
  assigned_to: number;
  remaining_qty: number;
}

export interface IAccessoryRequestCheckout {
  id: number;
  name: string;
  note: string;
  assigned_to: number;
  user_can_checkout: boolean;
  category: string;
}

export interface IAccessoryResponseCheckout {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  note: string;

  assigned_to: number;
  user_can_checkout: boolean;
}

export interface IAccessoryFilterVariables {
  search: string;
  name: string;
  serial: string;
  model: string;
  asset_tag: string;
  filter: string;
  rtd_location_id: string;
  location: string;
  status_label: string;
  purchase_date: [Dayjs, Dayjs];
  assigned_to: string;
  assigned_status: string;
}
