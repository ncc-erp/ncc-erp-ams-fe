export interface IToolResponse {
  id: number;
  name: string;
  tool_id: number;
  checkout_count: number;
  purchase_cost: number;
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
  user_can_checkin: boolean;
  assigned_to: {
    id: number;
    name: string;
  };
  purchase_date: {
    date: string;
    formatted: string;
  }
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
  },
  checkout_at: {
    datetime: string;
    formatted: string;
  }
}

export interface IToolFilterVariable {
  name: string;
  key: string;
  category: string;
  manufacturer: string;
  version: string;
  created_at: [Dayjs, Dayjs];
}

export interface IToolRequest {
  name: string;
  purchase_cost: number;
  purchase_date: string;
  version: string;
  category_id: number;
  manufacturer_id: number;
  notes: string;
}

export interface IToolMessageResponse {
  name: string;
  version: string;
  category_id: string;
  manufacturer_id: string;
  notes: string;
  purchase_date: string;
  purchase_cost: string;
}

export interface IToolCheckoutRequest {
  id: number;
  name: string;
  assigned_users: [];
  checkout_at: {
      datetime: string;
      formatted: string;
  };
  notes: string
}

export interface IToolMultiCheckoutRequest {
  id: number;
  name: string;
  tools: [];
  assigned_users: [];
  checkout_at: {
      datetime: string;
      formatted: string;
  };
  notes: string
}

export interface IToolCheckoutMessageResponse {
  name: string;
  assigned_users: string;
  checkout_at: string;
  notes: string;
}

export interface IToolCheckinRequest {
  id: number;
  name: string;
  assigned_user: number;
  username: string;
  checkin_at: {
      datetime: string;
      formatted: string;
  };
  notes: string
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
  notes: string
}

export interface IToolCheckinMessageResponse {
  name: string;
  assigned_users: string;
  checkin_at: string;
  notes: string;
}
