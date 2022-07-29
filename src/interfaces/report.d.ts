export interface IReport {
  id: number;
  name: string;
  asset_tag: string;
  serial: number;
  purchase_date: string;
  purchase_cost: number;
  order_number: number;
  assigned_to: number;
  notes: string;
  created_at: string;
  image: string;
  type: number;
  assigned_status: number;
  user_id: number;
  location_id: number;
  checkin: number;
  checkout: number;
  user: {
    last_name: string;
    first_name: string;
  };
}

export interface IReportResponse {
  id: number;
  asset_id: number;
  asset_histories_id: number;
  asset: {
    id: number;
    name: string;
    asset_tag: string;
    assigned_type: string;
    serial: string;
    notes: string;
    order_number: string;
    warranty_months: string;
    image: string;
    purchase_cost: number;
    purchase_date: number;
  };
  created_at: string;
  updated_at: string;

  model: {
    id: number;
    name: string;
  };
  model_number: string;
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  category: {
    id: number;
    name: string;
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
  rtd_location: {
    id: number;
    name: string;
  };
  image: string;
  warranty_expires: {
    date: string;
    formatted: string;
  };
  purchase_cost: number;
  purchase_date: {
    date: string;
    formatted: string;
  };
  assigned_to: {
    name: string;
    username: string;
  };
  last_audit_date: string;
  requestable: string;
  physical: number;

  note: string;
  expected_checkin: {
    date: string;
    formatted: string;
  };
  checkout_at: {
    date: string;
    formatted: string;
  };
  assigned_location: {
    id: number;
    name: string;
  };
  assigned_user: number;
  assigned_asset: string;
  checkout_to_type: {
    assigned_user: number;
    assigned_asset: string;
    assigned_location: {
      id: number;
      name: string;
    };
  };
  user_can_checkout: boolean;
  assigned_status: number;
  checkin_at: {
    date: string;
    formatted: string;
  };
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
  checkout_at: {
    date: string;
    formatted: string;
  };
  checkin_counter: number;
  checkout_counter: number;
  requests_counter: number;
}

export interface responseCheckIn {
  type: string;
  id: number;
  count: number;
}
