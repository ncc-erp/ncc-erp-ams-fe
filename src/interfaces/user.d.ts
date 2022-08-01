export interface IUser {
  id: number;
  name: string;
}

export interface IUserCreateRequest {
  id: number;
  name: string;
  first_name: string;
  username: string;
  email: string;
  avatar: string;
  employee_num: number;
  job_title: string;
  manager: number;
  department: number;
  location: number;
  phone: number;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  notes: string;
  last_name: string;
  activated: boolean;
  locale: string;
  remote: boolean;
  ldap_import: boolean;
  two_factor_activated: boolean;
  two_factor_enrolled: boolean;
  assets_count: number;
}

export interface IUserResponse {
  id: number;
  name: string;
  first_name: string;
  username: string;
  email: string;
  employee_num: number;
  job_title: string;
  manager: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  phone: number;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  notes: string;
  last_name: string;
  activated: boolean;
  locale: string;
  remote: boolean;
  ldap_import: boolean;
  two_factor_activated: boolean;
  two_factor_enrolled: boolean;
  assets_count: number;
  avatar: string;
}
