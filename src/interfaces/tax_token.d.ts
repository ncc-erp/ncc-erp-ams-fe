export interface ITaxTokenResponse {
    id: number;
    name: string;
    seri: string;
    supplier: {
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
    status_id: number;
    user_can_checkout: boolean;
    user_can_checkin: boolean;
    checkout_counter: number;
    checkin_counter: number;
    assigned_status: number;
    note: string;
    withdraw_from: number;
    created_at: {
        datetime: string;
        formatted: string;
    };
    updated_at: {
        datetime: string;
        formatted: string;
    }
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
}

export interface ITaxTokenCreateRequest {
    name: string;
    seri: string;
    supplier: string;
    purchase_date: string;
    purchase_cost: string;
    expiration_date: string;
    note: string;
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
    signatures: {}[];
    assigned_to: string;
    checkout_date: string;
    note: string;
}