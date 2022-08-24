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
  import: {
    code: "import",
    name: "import",
    default: 0,
    children: [],
  },
  reports_view: {
    code: "reports.view",
    name: "reports.view",
    default: 0,
    children: [],
  },
  assets: {
    name: "assets",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
      {
        code: "checkout",
        name: "Checkout",
        default: 0,
      },
      {
        code: "checkin",
        name: "Checkin",
        default: 0,
      },
      {
        code: "audit",
        name: "Audit",
        default: 0,
      },
      {
        code: "view.requestable",
        name: "view.requestable",
        default: 0,
      },
    ],
  },
  accessories: {
    name: "accessories",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
      {
        code: "checkout",
        name: "Checkout",
        default: 0,
      },
      {
        code: "checkin",
        name: "Checkin",
        default: 0,
      },
    ],
  },
  consumables: {
    name: "consumables",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
      {
        code: "checkout",
        name: "Checkout",
        default: 0,
      },
    ],
  },
  licenses: {
    name: "licenses",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
      {
        code: "checkout",
        name: "Checkout",
        default: 0,
      },
      {
        code: "keys",
        name: "Keys",
        default: 0,
      },
      {
        code: "files",
        name: "Files",
        default: 0,
      },
    ],
  },
  users: {
    name: "users",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  models: {
    name: "models",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  categories: {
    name: "categories",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  departments: {
    name: "departments",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  statuslabels: {
    name: "statuslabels",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  customfields: {
    name: "customfields",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  suppliers: {
    name: "suppliers",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  manufacturers: {
    name: "manufacturers",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
  },
  locations: {
    name: "locations",
    children: [
      {
        code: "view",
        name: "View",
        default: 0,
      },
      {
        code: "create",
        name: "Create",
        default: 0,
      },
      {
        code: "edit",
        name: "Edit",
        default: 0,
      },
      {
        code: "delete",
        name: "Delete",
        default: 0,
      },
    ],
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
