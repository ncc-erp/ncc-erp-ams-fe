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
  rtd_location_id: number;
  location_id: number;
  checkin: number;
  checkout: number;
  user: {
    last_name: string;
    first_name: string;
  };
  datetime: string;
  checkin_counter: object;
}

export interface IReportResponse {
  total: number;
  id: number;
  notes: string;
  action_type: string;
  item: {
    id: number;
    name: string;
    type: string;
  }
  admin: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
  }
  target: {
    id: number;
    name: string;
    type: string;
  }
  created_at: {
    datetime: string;
    formatted: string;
  };
  log_meta: object;
}

export interface responseCheckIn {
  type: string;
  id: number;
  count: number;
}
