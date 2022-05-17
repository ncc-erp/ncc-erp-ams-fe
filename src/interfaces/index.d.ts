export interface ICategory {
  id: string;
  title: string;
}
export interface ITable<T> {
  rows: T[],
  total: number
}

export interface IHardware {
  total: number,
  id: string,
}
// from demo
export interface IPost {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: ICategory;
}

export interface ICheck {
  id: number;
  name: string;
  asset_tag: string;
  alt_barcode: string;
  serial: string;
  available_actions: {
    checkout: string;
    checkin: string;
    clone: string;
    delete: string;
    restore: string;
    update: string;
  }
  category: {
    id: number;
    name: string;
  }
  company: {
    id: number;
    name: string;
  }
  created_at : {
    datetime: string;
    formatted: string;
  }
  image: string;
  last_audit_date: string;
  last_checkout: string;
  location: {
    id: number;
    name: string;
  }
  manufacturer: {
    id: number;
    name: string;
  }
  model: {
      id: number;
      name: string;
  }
  model_number: string;
  next_audit_date: string;
  notes: string;
  order_number: string;
  purchase_cost: number;
  purchase_date: {
      date: string;
      formatted: string;
  }
  qr: string;
  requests_counter: number;
  rtd_location: {
    id: number;
    name: string;
  }
  status_label: {
      id: number;
      name: string;
      status_type: string;
      status_meta: string;
  }
  supplier: {
      id: number;
      name: string;
  }
  updated_at : {
    datetime: string;
    formatted: string;
  }
  warranty_months: string;
  warranty_expires: string;
  user_can_checkout: string;
  assigned_to: number;
  
}
