// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Interface } from "readline";

export interface IHardwareRequest {
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
    warranty_months: number;
    depreciate: boolean;
    supplier_id: number;
    requestable: boolean;
    rtd_location_id: number;
    last_audit_date: string;
    location_id: number;
}
export interface IHardwareResponse {
    rtd_location_id: any;
    archived: any;    
    id: number;
    name: string;
    asset_tag: string;
    serial: string;
    model: {
        id: number;
        name: string;
    }
    // model_number: string;
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
    supplier: {
        id: number;
        name: string;
    };
    notes: string;
    order_number: string;
    company: {
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
    warranty_months: string;
    purchase_cost: number;
    purchase_date: {
        date: string;
        formatted: string;
    };
    assigned_to: number;
    last_audit_date: string;
    requestable: number;
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
    notes: string;
    archived: boolean;
    depreciate: boolean;
    checkout_at: string;
    expected_checkin: string;
    location_id: number;
    checkout_to_type : string;
}

export interface IHardwareResponseCheckout {
    id: number;
    name: string;
    model: {
        id: number;
        name: string;
    }
    model_number: string;
    status_label: {
        id: number;
        name: string;
        status_type: string;
        status_meta: string;
    }
    category: {
        id: number;
        name: string;
    }
    notes: string;
    company: {
        id: number;
        name: string;
    }
    
    expected_checkin: {
        date: string;
        formatted: string;
    };
    checkout_at: {
        date: string;
        formatted: string;
    }
    assigned_location: {
        id: number;
        name: string;
    }
    assigned_user: number;
    assigned_asset: string;
    checkout_to_type : {
        assigned_user: number;
        assigned_asset:string; 
        assigned_location: {
            id: number;
            name: string;
        }
    }
}

export interface IHardwareList {
    data: {
        data: IHardwareRequest;
    } | undefined ;
    refetch: Function;
}
