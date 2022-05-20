import { Interface } from "readline";

export interface IHardwareRequest {
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
    id: number;
    name: string;
    asset_tag: string;
    serial: string;
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
    supplier: {
        id: number;
        name: string;
    }
    notes: string;
    order_number: string;
    company: {
        id: number;
        name: string;
    }
    location: {
        id: number;
        name: string;
    }
    rtd_location: {
        id: number;
        name: string;
    }
    image: string;
    warranty_months: string;
    purchase_cost: number;
    purchase_date: {
        date: string;
        formatted: string;
    }
    assigned_to: number;
    last_audit_date: string;
}
export interface IHardwareResponseConvert {
    id: number;
    name: string;
    asset_tag: string;
    serial: string;
    model: IDefaultValue;
    model_number: string;
    status_label: IDefaultValue;
    category: IDefaultValue;
    supplier: IDefaultValue;
    notes: string;
    order_number: string;
    company: IDefaultValue;
    location: IDefaultValue;
    rtd_location: IDefaultValue;
    image: string;
    warranty_months: string;
    purchase_cost: number;
    purchase_date: string;
    assigned_to: number;
    last_audit_date: string;
}

export interface IDefaultValue {
    value: string;
    label: string;
}

export interface IHardwareRequestCheckout {
    id: number;
    asset_tag: string;
    status_id: number;
    model_id: number;
    name: string;
    notes: string;
    archived: boolean;
    depreciate: boolean;
    last_checkout: string;
    last_audit_date: string;
    location_id: number;
}

export interface IHardwareResponseCheckout {
    id: number;
    name: string;
    // asset_tag: string;
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
    location: {
        id: number;
        name: string;
    }
    assigned_to: number;
    last_audit_date: {
        date: string;
        formatted: string;
    };
    last_checkout: {
        date: string;
        formatted: string;
    }
    physical:string;
}
export interface IHardwareResponseCheckin {
    id: number;
    name: string;
    asset_tag: string;
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
    location: {
        id: number;
        name: string;
    }
 
    assigned_to: number;
    last_audit_date: {
        date: string;
        formatted: string;
    };
    last_checkout: {
        date: string;
        formatted: string;
    }
    // next_audit_date: {
    //     date: string;
    //     formatted: string;
    // }
}
