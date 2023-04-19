export enum EPermissions {
  ADMIN = "1",
  USER = "0",
  BRANCHADMIN = "2",
}

export const AccessType = {
  allow: "1",
  refuse: "-1",
  can: "0",
};

export const Permission = {
  user: {
    code: "superuser",
    name: "superuser",
    default: 0,
    children: [],
  },
  admin: {
    code: "admin",
    name: "admin",
    default: 0,
    children: [],
  },
  branchadmin:{
    code: "branchadmin",
    name: "branchadmin",
    default: 0,
    children: [],
  },
};

export const optionsPermissions = [
  {
    label: "",
    value: AccessType.allow,
  },
  {
    label: "",
    value: AccessType.refuse,
  },
  {
    label: "",
    value: AccessType.can,
  },
];

export const defaultValue = {
  active: "1",
  inactive: "0",
};
