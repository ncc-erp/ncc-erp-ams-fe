export interface IHardwareRequest {
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
    warranty_months: number;
    depreciate: boolean;
    supplier_id: number;
    requestable: boolean;
    rtd_location_id: number;
    last_audit_date: string;
    location_id: number;
}