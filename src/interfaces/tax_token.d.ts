export interface ITaxTokenResponse {
  id: number;
  name: string;
  seri: string;
  supplier: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  assigned_to: {
    id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
  };
  purchase_date: {
    date: string;
    formatted: string;
  };
  purchase_cost: string;
  expiration_date: {
    date: string;
    formatted: string;
  };
  last_checkout: {
    datetime: string;
    formatted: string;
  };
  checkin_date: {
    datetime: string;
    formatted: string;
  };
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  user_can_checkout: boolean;
  user_can_checkin: boolean;
  checkout_counter: number;
  checkin_counter: number;
  assigned_status: number;
  note: string;
  qty: number;
  warranty_months: number;
  withdraw_from: number;
  created_at: {
    datetime: string;
    formatted: string;
  };
  updated_at: {
    datetime: string;
    formatted: string;
  };
}

export interface ITaxToken {
  id: string;
  name: string;
  total: number;
  datetime: string;
  date: string;
}

export interface ITaxTokenFilterVariables {
  search: string;
  name: string;
  seri: string;
  supplier: string;
  purchase_date: [Dayjs, Dayjs];
  expiration_date: [Dayjs, Dayjs];
}

export interface ITaxTokenCreateRequest {
  name: string;
  seri: string;
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
  messages: string;
}

export interface ITaxTokenUpdateRequest {
  name: string;
  seri: string;
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

export interface ITaxTokenRequestCheckout {
  id: number;
  name: string;
  note: string;
  assigned_user: string;
  checkout_date: string;
  supplier: string;
}

export interface ITaxTokenMultipleRequestCheckout {
  signatures: any[];
  assigned_to: string;
  checkout_date: string;
  note: string;
}

export interface ITaxTokenMultipleRequestCheckin {
  signatures: any[];
  checkin_at: string;
  note: string;
}

export interface ITaxTokenRequestCheckin {
  status_label: string;
  id: number;
  seri: string;
  status_id: number;
  name: string;
  note: string;
  archived: boolean;
  depreciate: boolean;
  checkin_at: string;
  assigned_status: number;
  assigned_user: string;
  assigned_to: string;
}

export interface ITaxTokenResponseCheckin {
  id: number;
  name: string;
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  note: string;
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

export interface ITaxTokenRequestMultipleCancel {
  tax_tokens: any[];
  reason: string;
  assigned_status: number;
}

export interface ITaxTokenRequestMultipleCheckout {
  tax_tokens: any[];
  assigned_asset: string;
  assigned_location: string;
  assigned_user: string;
  checkout_at: string;
  checkout_to_type: string;
  assigned_status: number;
  user_can_checkout: boolean;
  note: string;
  status_id: number;
}
