export interface IDeviceDetailQr {
  id: string | null;
  name: string | null;
  status_label: {
    name: string | null;
  } | null;
  serial: string | null;
  manufacturer: {
    name: string | null;
  } | null;
  category: {
    name: string | null;
  } | null;
  model: {
    name: string | null;
  } | null;
  purchase_date: {
    formatted: string | null;
  } | null;
  supplier: string | null;
  location: {
    name: string | null;
  } | null;
  created_at: {
    formatted: string | null;
  } | null;
  updated_at: {
    formatted: string | null;
  } | null;
  purchase_cost: {
    formatted: string | null;
  } | null;
  checkin_counter: string | null;
  checkout_counter: string | null;
  notes: string | null;
  warranty_expires: {
    formatted: string;
  } | null;
  assigned_to: {
    name: string | null;
  } | null;

  warranty_months: string | null;

  requests_counter: number | null;
}
