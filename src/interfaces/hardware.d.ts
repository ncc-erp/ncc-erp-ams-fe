import { EBooleanString } from "../constants/common";

export interface IHardwareCreateRequest {
  rows: any;
  id: number;
  asset_tag: string;
  status_id: number;
  model_id: number;
  name: string;
  image: string;
  serial: string;
  purchase_date: string;
  purchase_cost: number;
  order_number: string;
  notes: string;
  archived: boolean;
  warranty_months: string;
  depreciate: boolean;
  supplier_id: number;
  requestable: number;
  rtd_location_id: number;
  last_audit_date: string;
  location_id: number;
  maintenance: string;
  isCustomerRenting: boolean;
}

export interface IHardwareUpdateRequest {
  assigned_user: number;
  name: string;
  serial: string;
  company: number;
  model: number;
  order_number: string;
  notes: string;
  asset_tag: string;
  status_label: number;
  warranty_months: string;
  purchase_cost: string;
  purchase_date: string;
  rtd_location: number;
  supplier: number;
  webhook: number;
  image: string;
  user_id: number;
  assigned_to: number;
  location: number;
  physical: number;
  requestable: number;
  reason: string;
  assigned_status: number;
  maintenance: string;
  maintenance_cycle: string;
  customer: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
  };
  isCustomerRenting: EBooleanString;
  startRentalDate?: string;
}
export interface IHardwareResponse {
  id: number;
  name: string;
  asset_tag: string;
  serial: string;
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
  notes: string;
  order_number: string;
  location: {
    id: number;
    name: string;
  };
  webhook?: {
    id: number;
    name: string;
  };
  rtd_location: {
    id: number;
    name: string;
  };
  image: string;
  warranty_months: string;
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
    id: number;
    name: string;
    username: string;
    last_name: string;
    first_name: string;
  };
  last_audit_date: string;
  requestable: string;
  physical: number;

  note: string;
  expected_checkin: {
    date: string;
    formatted: string;
  };
  last_checkout: {
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
  user_can_checkin: boolean;
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
  last_checkout: {
    date: string;
    formatted: string;
  };
  checkin_counter: number;
  checkout_counter: number;
  requests_counter: number;
  withdraw_from: number;
  maintenance_date?: {
    date: string;
    formatted: string;
  };
  maintenance_cycle?: string;
  isCustomerRenting?: boolean;
  startRentalDate?: {
    date: string;
    formatted: string;
  };
}

export interface IDefaultValue {
  value: string;
  label: string;
}

export interface IHardwareRequestCheckout {
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
  assigned_status: number;
  user_can_checkout: boolean;
  isCustomerRenting: EBooleanString;
  startRentalDate: string;
}
export interface IHardwareRequestMultipleCheckout {
  assets: any[];
  assigned_asset: string;
  assigned_location: string;
  assigned_user: string;
  checkout_at: string;
  checkout_to_type: string;
  assigned_status: number;
  user_can_checkout: boolean;
  note: string;
  status_id: number;
  isCustomerRenting: EBooleanString;
  startRentalDate: string;
}

export interface IHardwareRequestMultipleCheckin {
  assets: any[];
  status_label: string;
  status_id: string;
  checkin_at: string;
  rtd_location: string;
  note: string;
}

export interface IHardwareResponseCheckout {
  id: number;
  name: string;
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
  note: string;

  last_checkout: {
    date: string;
    formatted: string;
  };
  rtd_location: {
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
  isCustomerRenting?: boolean;
  startRentalDate?: {
    date: string;
    formatted: string;
  };
}

export interface IHardwareList {
  data:
    | {
        data: IHardwareCreateRequest;
      }
    | undefined;
  refetch: () => void;
}

export interface IHardwareRequestCheckin {
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
  checkin_at: string;
  rtd_location: number;
  assigned_status: number;
  assigned_user: string;
  assigned_to: string;
}

export interface IHardwareResponseCheckin {
  id: number;
  name: string;
  model: {
    id: number;
    name: string;
  };
  status_label: {
    id: number;
    name: string;
    status_type: string;
    status_meta: string;
  };
  note: string;
  rtd_location: {
    id: number;
    name: string;
  };
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

export interface IHardwareFilterVariables {
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
  category: string;
  isCustomerRenting: boolean;
}

export interface IHardwareRequestMultipleCancel {
  assets: any[];
  reason: string;
  assigned_status: number;
}
export interface IAssetsWaiting {
  id: number;
  asset_tag: string;
  status_id: number;
  model_id: number;
  name: string;
  image: string;
  serial: string;
  purchase_date: string;
  purchase_cost: number;
  order_number: string;
  notes: string;
  archived: boolean;
  warranty_months: string;
  depreciate: boolean;
  supplier_id: number;
  requestable: number;
  rtd_location_id: number;
  last_audit_date: string;
  location_id: number;
  assigned_status: number;
}

export interface ISearchFormProps {
  searchFormProps: any;
}

export interface ITableProps {
  columns: any[];
  selectedColumns: string[];
  tableProps: any;
  onShow: (record: IHardwareResponse) => void;
  onEdit: (record: IHardwareResponse) => void;
  onDeleteSuccess: () => void;
  resourceName?: string;
}

export interface IToolBarProps {
  columns: ColumnItem[];
  selectedColumns: string[];
  onToggleColumn: (col: ColumnItem) => void;
  onRefresh: () => void;
  onOpenSearch: () => void;
}

export interface IModalPropsProps {
  t: any;
  modalState: {
    type: HardwareModalType | null;
    isVisible: boolean;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      type: HardwareModalType | null;
      isVisible: boolean;
    }>
  >;
  detail: any;
  searchFormProps: any;
}
export interface FormValues {
  purchase_date?: string;
  maintenance_cycle?: number;
  maintenance?: string;
}
