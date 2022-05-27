
export interface IRequest {
    name: string;
    branch_id: number;
    supplier_id: number;
    entry_id: number;
    note: string;
    asset_ids: {}[]
}
export interface IRequestResponse {
    status: string;
    entry_type: {
     code: string;
     expenseType: number;
     id: number;
     level: number;
     name: string;
     parentId: number;
     pathName: string;
     workflowId: number;
   };
     branch: {
     id: number;
     name: string;
     code: string;
     default: boolean;
   };
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
    finfast_request_assets: any;
}

