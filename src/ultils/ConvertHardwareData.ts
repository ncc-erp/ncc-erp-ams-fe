import { IHardwareResponse } from "interfaces/hardware";

export const convertHardwareToEditData = (
  data: IHardwareResponse
): IHardwareResponse => {
  return {
    ...data,
    id: data.id,
    name: data.name,
    asset_tag: data.asset_tag,
    serial: data.serial ?? "",
    model: {
      id: data?.model?.id,
      name: data?.model?.name,
    },
    model_number: data?.order_number,
    status_label: {
      id: data?.status_label.id,
      name: data?.status_label.name,
      status_type: data?.status_label.status_type,
      status_meta: data?.status_label.status_meta,
    },
    category: {
      id: data?.category?.id,
      name: data?.category?.name,
    },
    supplier: {
      id: data?.supplier?.id,
      name: data?.supplier?.name,
    },
    notes: data.notes,
    order_number: data.order_number ?? "",
    location: {
      id: data?.location?.id,
      name: data?.location?.name,
    },
    rtd_location: {
      id: data?.rtd_location?.id,
      name: data?.rtd_location?.name,
    },
    image: data?.image,
    warranty_months: data?.warranty_months,
    purchase_cost: data?.purchase_cost,
    purchase_date: {
      date: data?.purchase_date !== null ? data?.purchase_date.date : "",
      formatted:
        data?.purchase_date !== null ? data?.purchase_date.formatted : "",
    },
    assigned_to: data?.assigned_to,
    last_audit_date: data?.last_audit_date,

    requestable: data?.requestable,
    physical: data?.physical,

    note: "",
    expected_checkin: {
      date: "",
      formatted: "",
    },
    last_checkout: {
      date: "",
      formatted: "",
    },
    assigned_location: {
      id: 0,
      name: "",
    },
    assigned_user: 0,
    assigned_asset: "",
    checkout_to_type: {
      assigned_user: 0,
      assigned_asset: "",
      assigned_location: {
        id: 0,
        name: "",
      },
    },
    user_can_checkout: false,
    assigned_status: 0,
    checkin_at: {
      date: "",
      formatted: "",
    },
    created_at: {
      datetime: "",
      formatted: "",
    },
    updated_at: {
      datetime: "",
      formatted: "",
    },
    manufacturer: {
      id: 0,
      name: "",
    },
    checkin_counter: 0,
    checkout_counter: 0,
    requests_counter: 0,
    warranty_expires: {
      date: "",
      formatted: "",
    },
    user_can_checkin: false,
    withdraw_from: data?.withdraw_from,
    maintenance_date: {
      date: data?.maintenance_date != null ? data?.maintenance_date.date : "",
      formatted:
        data?.maintenance_date != null ? data?.maintenance_date.formatted : "",
    },
    maintenance_cycle: data?.maintenance_cycle,
  };
};
