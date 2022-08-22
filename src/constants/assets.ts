export const defaultCheckedListWaitingConfirm = [
  "id",
  "name",
  "image",
  "model",
  "category",
  "status_label",
  "assigned_to",
  "assigned_status",
  "purchase_date",
];

export const ASSIGNED_STATUS = {
  NO_ASSIGN: 0,
  PENDING_ACCEPT: 1,
  ACCEPT: 2,
  REFUSE: 3,
};

export const STATUS_LABELS = {
  PENDING: 1,
  BROKEN: 3,
  ASSIGN: 4,
  READY_TO_DEPLOY: 5,
};

export enum EStatus {
  PENDING = "Pending",
  BROKEN = "Broken",
  READY_TO_DEPLOY = "Ready to Deploy",
  ASSIGN = "Assign",
}

export const TypeAssetHistory = {
  CHECKOUT: "checkout",
  CHECKIN: "checkin from",
};

export const ActionType = {
  checkout: "Cấp phát",
  "checkin from": "Thu hồi",
  update: "Chỉnh sửa",
  delete: "Xóa",
  "create new": "Tạo mới",
  create: "Tạo mới",
};

export const dateFormat = "YYYY/MM/DD";

export enum EPermissions {
  ADMIN = "1",
  USER = "0",
}

export const AccessType = {
  allow: "1",
  refuse: "-1",
  can: "0",
};

export const Permission = {
  user: "user",
  admin: "admin",
  import: "import",
  reports_view: "reports.view",
  assets: [
    "view",
    "create",
    "edit",
    "delete",
    "checkout",
    "checkin",
    "audit",
    "view_requestable",
  ],
  accessories: ["view", "create", "edit", "delete", "checkout", "checkin"],
  consumables: ["view", "create", "edit", "delete", "checkout"],
  licenses: ["view", "create", "edit", "delete", "checkout", "keys", "files"],
  users: ["view", "create", "edit", "delete"],
  models: ["view", "create", "edit", "delete"],
  categories: ["view", "create", "edit", "delete"],
  departments: ["view", "create", "edit", "delete"],
  statuslabels: ["view", "create", "edit", "delete"],
  customfields: ["view", "create", "edit", "delete"],
  suppliers: ["view", "create", "edit", "delete"],
  manufacturers: ["view", "create", "edit", "delete"],
  locations: ["view", "create", "edit", "delete"],
};

export const actions = {
  import: EPermissions.USER,
  reports_view: EPermissions.USER,
  assets: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
    checkout: EPermissions.USER,
    checkin: EPermissions.USER,
    audit: EPermissions.USER,
    view_requestable: EPermissions.USER,
  },
  accessories: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
    checkout: EPermissions.USER,
    checkin: EPermissions.USER,
  },
  consumables: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
    checkout: EPermissions.USER,
  },
  licenses: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
    checkout: EPermissions.USER,
    keys: EPermissions.USER,
    files: EPermissions.USER,
  },
  users: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  models: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  categories: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  departments: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  statuslabels: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  customfields: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  suppliers: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  manufacturers: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
  },
  locations: {
    view: EPermissions.USER,
    create: EPermissions.USER,
    edit: EPermissions.USER,
    delete: EPermissions.USER,
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
