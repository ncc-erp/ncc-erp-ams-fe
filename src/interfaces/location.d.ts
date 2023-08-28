export interface ILocations {
    id: number;
    name: string;
}
export interface ILocationResponse {
    id: number;
    name: string;
    parent: {
        id: number;
        name: string;
    };
    manager: {
        id: number;
        name: string;
    };
    address2: string;
    address: string;
    city: string;
    state: string;
    country: string;
    currency: number;
    image: string;
    assets_count: number;
    branch_code: string;

}
export interface ILocationRequest {
    id: number;
    name: string;
    parent: number;
    manager: number;
    address_detail: string;
    address: string;
    city: string;
    state: string;
    country: string;
    currency: number;
    image: string;

    assets_count:number;
    assigned_assets_count: number;
    users_count : number;
    ldap_ou: string;
    branch_code: string;
}