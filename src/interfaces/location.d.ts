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
  tools_count: number;
  accessories_count: number;
  consumables_count: number;
  digital_signatures_count: number;
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

<<<<<<< HEAD
  assets_count: number;
  assigned_assets_count: number;
  users_count: number;
  ldap_ou: string;
}
=======
    assets_count:number;
    assigned_assets_count: number;
    users_count : number;
    ldap_ou: string;
    branch_code: string;
}
>>>>>>> 6d82004a39a2bcfd337c36ab21c3206de9fd2a25
