export interface IUser {
  id: number;
  name: string;
}

export interface IUserCreateRequest {
  id: number;
  name: string;
  mezon_id: string;
  first_name: string;
  username: string;
  email: string;
  avatar: string;
  employee_num: number;
  jobtitle: string;
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
  activated: number;
  locale: string;
  remote: number;
  ldap_import: number;
  two_factor_activated: boolean;
  two_factor_enrolled: boolean;
  assets_count: number;
  password: string;
  manager_location: array;
  permissions: {
    admin: string;
    superuser: string;
    import: string;
    "reports.view": string;

    "assets.view": string;
    "assets.create": string;
    "assets.edit": string;
    "assets.delete": string;
    "assets.checkout": string;
    "assets.checkin": string;
    "assets.audit": string;
    "assets.view.requestable": string;

    "accessories.view": string;
    "accessories.create": string;
    "accessories.edit": string;
    "accessories.delete": string;
    "accessories.checkout": string;
    "accessories.checkin": string;

    "consumables.view": string;
    "consumables.create": string;
    "consumables.edit": string;
    "consumables.delete": string;
    "consumables.checkout": string;

    "licenses.view": string;
    "licenses.create": string;
    "licenses.edit": string;
    "licenses.delete": string;
    "licenses.checkout": string;
    "licenses.keys": string;
    "licenses.files": string;

    "users.view": string;
    "users.create": string;
    "users.edit": string;
    "users.delete": string;

    "models.view": string;
    "models.create": string;
    "models.edit": string;
    "models.delete": string;

    "categories.view": string;
    "categories.create": string;
    "categories.edit": string;
    "categories.delete": string;

    "departments.view": string;
    "departments.create": string;
    "departments.edit": string;
    "departments.delete": string;

    "statuslabels.view": string;
    "statuslabels.create": string;
    "statuslabels.edit": string;
    "statuslabels.delete": string;

    "customfields.view": string;
    "customfields.create": string;
    "customfields.edit": string;
    "customfields.delete": string;

    "suppliers.view": string;
    "suppliers.create": string;
    "suppliers.edit": string;
    "suppliers.delete": string;

    "manufacturers.view": string;
    "manufacturers.create": string;
    "manufacturers.edit": string;
    "manufacturers.delete": string;

    "locations.view": string;
    "locations.create": string;
    "locations.edit": string;
    "locations.delete": string;
  };
  password_confirmation: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  first_name: string;
  username: string;
  email: string;
  employee_num: number;
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
  address: string;
  city: string;
  state: string;
  notes: string;
  last_name: string;
  activated: boolean;
  remote: boolean;
  ldap_import: boolean;
  two_factor_activated: boolean;
  two_factor_enrolled: boolean;
  assets_count: number;
  avatar: string;
  password: string;
  password_confirmation: string;
  manager_location: array;
  permissions: {
    admin: string;
    superuser: string;
    import: string;
    "reports.view": string;

    "assets.view": string;
    "assets.create": string;
    "assets.edit": string;
    "assets.delete": string;
    "assets.checkout": string;
    "assets.checkin": string;
    "assets.audit": string;
    "assets.view.requestable": string;

    "accessories.view": string;
    "accessories.create": string;
    "accessories.edit": string;
    "accessories.delete": string;
    "accessories.checkout": string;
    "accessories.checkin": string;

    "consumables.view": string;
    "consumables.create": string;
    "consumables.edit": string;
    "consumables.delete": string;
    "consumables.checkout": string;

    "licenses.view": string;
    "licenses.create": string;
    "licenses.edit": string;
    "licenses.delete": string;
    "licenses.checkout": string;
    "licenses.keys": string;
    "licenses.files": string;

    "users.view": string;
    "users.create": string;
    "users.edit": string;
    "users.delete": string;

    "models.view": string;
    "models.create": string;
    "models.edit": string;
    "models.delete": string;

    "categories.view": string;
    "categories.create": string;
    "categories.edit": string;
    "categories.delete": string;

    "departments.view": string;
    "departments.create": string;
    "departments.edit": string;
    "departments.delete": string;

    "statuslabels.view": string;
    "statuslabels.create": string;
    "statuslabels.edit": string;
    "statuslabels.delete": string;

    "customfields.view": string;
    "customfields.create": string;
    "customfields.edit": string;
    "customfields.delete": string;

    "suppliers.view": string;
    "suppliers.create": string;
    "suppliers.edit": string;
    "suppliers.delete": string;

    "manufacturers.view": string;
    "manufacturers.create": string;
    "manufacturers.edit": string;
    "manufacturers.delete": string;

    "locations.view": string;
    "locations.create": string;
    "locations.edit": string;
    "locations.delete": string;
  };
}

interface IUserAssets {
  id: number;
  name: string;
  image: string;
  model: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  rtd_location: {
    id: number;
    name: string;
  };
  assigned_status: number;
  last_checkout: {
    datetime: string;
    formatted: string;
  };
}
