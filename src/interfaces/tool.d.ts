export interface IToolResponse {
  id: number;
  name: string;
  purchase_cost: number;
  assigned_to: {
    id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
  };
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  supplier: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  notes: string;
  qty: number;
  checkout_counter: number;
  checkin_counter: number;
  assigned_status: number;
  user_can_checkout: boolean;
  user_can_checkin: boolean;
  withdraw_from: number;
  assigned_to: {
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
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
  checkin_date: {
    datetime: string;
    formatted: string;
  };
  last_checkout: {
    datetime: string;
    formatted: string;
  };
}

export interface IToolFilterVariable {
  name: string;
  key: string;
  category: string;
  manufacturer: string;
  version: string;
  created_at: [Dayjs, Dayjs];
  purchase_date: [Dayjs, Dayjs];
  expiration_date: [Dayjs, Dayjs];
}

export interface IToolRequest {
  name: string;
  supplier: string;
  purchase_date: string;
  purchase_cost: string;
  expiration_date: string;
  notes: string;
  location: string;
  category: string;
  qty: number;
  status_label: string;
}

export interface IToolMessageResponse {
  name: string;
  supplier: string;
  purchase_date: string;
  purchase_cost: string;
  expiration_date: string;
  notes: string;
  location: string;
  category: string;
  qty: number;
  status_label: string;
}

export interface IToolCheckoutRequest {
  id: number;
  name: string;
  assigned_to: string;
  checkout_at: {
    datetime: string;
    formatted: string;
  };
  notes: string;
}

export interface IToolMultiCheckoutRequest {
  id: number;
  name: string;
  tools: [];
  assigned_to: string;
  checkout_at: {
    datetime: string;
    formatted: string;
  };
  notes: string;
}

export interface IToolCheckoutMessageResponse {
  name: string;
  assigned_to: string;
  checkout_at: string;
  notes: string;
}

export interface IToolCheckinRequest {
  status_label: string;
  id: number;
  name: string;
  notes: string;
  checkin_at: string;
  assigned_to: string;
}

export interface IToolMultiCheckinRequest {
  id: number;
  name: string;
  tools: [];
  assigned_users: [];
  checkin_at: {
    datetime: string;
    formatted: string;
  };
  notes: string;
}

export interface IToolCheckinMessageResponse {
  name: string;
  assigned_users: string;
  checkin_at: string;
  notes: string;
}

export interface IToolCreateRequest {
  name: string;
  supplier: string;
  purchase_date: string;
  purchase_cost: string;
  expiration_date: string;
  notes: string;
  location: string;
  category: string;
  qty: number;
  status_label: string;
  messages: string;
}

export interface ITool {
  id: string;
  name: string;
  total: number;
  datetime: string;
  date: string;
}

export interface IToolResponseCheckin {
  id: number;
  name: string;
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  notes: string;
  assigned_to: {
    id: number;
    username: string;
    last_name: string;
    first_name: string;
  };
  checkin_at: {
    date: string;
    formatted: string;
  };
  user_can_checkout: boolean;
}

export interface IToolUpdateRequest {
  name: string;
  supplier: string;
  purchase_date: string;
  purchase_cost: string;
  expiration_date: string;
  note: string;
  location: string;
  category: string;
  qty: number;
  warranty_months: string;
  status_label: string;
  reason: string;
  assigned_status: number;
}

export interface IToolRequestMultipleCancel {
  tools: any[];
  reason: string;
  assigned_status: number;
}

export interface IToolCreateRequest {
  rows: any;
  id: number;
  status_id: number;
  name: string;
  purchase_date: string;
  purchase_cost: number;
  expiration_date: string;
  supplier_id: number;
  notes: string;
  location_id: number;
  created_at: string;
}
