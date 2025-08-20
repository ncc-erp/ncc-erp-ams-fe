import {
  HardwareList,
  HardwareListAssign,
  HardwareListBroken,
  HardwareListPending,
  HardwareListReadyToDeploy,
  HardwareListMaintenance,
  HardwareListRentalCustomers,
} from "pages/hardware";
import {
  ClientHardwareList,
  ClientHardwareListAssign,
  ClientHardwareListBroken,
  ClientHardwareListPending,
  ClientHardwareListReadyToDeploy,
} from "pages/hardware_client";
import { DashboardPage } from "pages/dashboard";
import { RequestList } from "pages/request";
import { UserList } from "pages/users/list";
import { CategoryList } from "pages/categories";
import { ManufacturesList } from "pages/manufacturers";
import { LocationList } from "pages/location";
import { ModelList } from "pages/model";
import { SupplierList } from "pages/supplier";
import { DepartmentList } from "pages/department";
import { ListCheckin_Checkout } from "pages/dashboard/list_checkin_checkout";
import { ReportList } from "pages/report/list";
import { Manager_UserList } from "pages/manager_users/list";
import { HardwareListWaitingConfirm } from "pages/hardware/list-watiting-confirm";
import { ConsumablesList } from "pages/consumables";
import { AccessoryList } from "pages/accessory/list";
import { AccessoryDetails } from "pages/accessory/details";
import { ConsumableDetails } from "pages/consumables/details";
import { SupplierDetails } from "pages/supplier/details";
import { LocationDetails } from "pages/location/details";
import { ManufacturesDetails } from "pages/manufacturers/details";
import { HardwareListExpiration } from "pages/hardware/list-expiration";
import { LicensesList } from "pages/licenses/list";
import { UserListLicenses } from "pages/users/list-licenses";
import { TaxTokenList } from "pages/tax_token/list";
import { TaxTokenListWaitingConfirm } from "pages/tax_token/list-waiting";
import { ToolList } from "pages/tools/list";
import { ToolListWaitingConfirm } from "pages/tools/list-waiting";
import { UserListTool } from "pages/users/list-tools";
import { UserListTaxToken } from "pages/users/list-tax-tokens";
import { ClientHardwareListWaitingConfirm } from "pages/hardware_client/list-watiting-confirm";
import { ClientHardwareListExpiration } from "pages/hardware_client/list-expiration";
import { DetailProduct } from "pages/hardware/detail";
import { ConsumablesMainternanceList } from "pages/consumables/list-maintenance";
import { WebhookList } from "pages/webhook/list";
import { WebhookDetail } from "pages/webhook/detail";
import { KomuLogs } from "pages/audit/komu/list";
import { WebhookLogs } from "pages/audit/webhook_logs/list";

// Resource routes enum
export enum RESOURCE_ROUTES {
  USERS = "users",
  DASHBOARD = "dashboard",
  DETAIL_DEVICE = "detail-device",
  CHECKIN_CHECKOUT = "checkin_checkout",
  ASSETS = "assets",
  ASSETS_ASSIGN = "assets-assign",
  ASSETS_READY_TO_DEPLOY = "assets-readyToDeploy",
  ASSETS_PENDING = "assets-pending",
  ASSETS_BROKEN = "assets-broken",
  ASSETS_MAINTENANCE = "assets-maintenance",
  TOOLS_ALL = "tools-all",
  TOOLS_WAITING = "tools-waiting",
  LICENSES = "licenses",
  USERS_TOOLS = "users-tools",
  USERS_TAX_TOKENS = "users-tax-tokens",
  USERS_LICENSES = "users-licenses",
  MODELS = "models",
  CATEGORY = "category",
  MANUFACTURES = "manufactures",
  SUPPLIERS = "suppliers",
  DEPARTMENT = "department",
  LOCATION = "location",
  TAX_TOKEN_ASSIGN = "tax_token_assign",
  REQUEST = "request",
  REPORT = "report",
  MANAGER_USER = "manager_user",
  ASSETS_WAITING_CONFIRM = "assets-waiting-confirm",
  CONSUMABLES = "consumables",
  CONSUMABLES_MAINTENANCE = "consumables-maintenance",
  ACCESSORY = "accessory",
  ACCESSORY_DETAILS = "accessory_details",
  CONSUMABLE_DETAILS = "consumable_details",
  SUPPLIER_DETAILS = "supplier_details",
  LOCATION_DETAILS = "location_details",
  MANUFACTURES_DETAILS = "manufactures_details",
  WEBHOOK_DETAILS = "webhook_details",
  ASSETS_EXPIRES = "assets-expires",
  TAX_TOKEN = "tax_token",
  TAX_TOKEN_WAITING = "tax_token_waiting",
  CLIENT_ASSETS = "client-assets",
  CLIENT_ASSET_ASSIGNED = "client-asset-assigned",
  CLIENT_ASSET_READY_TO_DEPLOY = "client-asset-readyToDeploy",
  CLIENT_ASSET_PENDING = "client-asset-pending",
  CLIENT_ASSET_BROKEN = "client-asset-broken",
  CLIENT_ASSET_WAITING_CONFIRM = "client-asset-waitingConfirm",
  CLIENT_ASSETS_EXPIRES = "client-assets-expires",
  WEBHOOK = "webhook",
  KOMU_LOGS = "komu_logs",
  WEBHOOK_LOGS = "webhook_logs",
  ASSET_RENTAL_CUSTOMERS = "asset-rental-customers",
}

// Resource labels enum
export enum RESOURCE_LABELS {
  USERS = "users",
  ASSETS = "assets",
  TOOLS = "tools",
  CLIENT_ASSETS = "client-assets",
  CONSUMABLES = "consumables",
  TAX_TOKEN = "tax_token",
}

// Resource translation keys enum
export enum RESOURCE_TRANSLATION_KEYS {
  USERS = "resource.users",
  DASHBOARD = "resource.dashboard",
  DETAIL_DEVICE = "resource.detail-device",
  CHECKIN_CHECKOUT = "resource.checkin-checkout",
  ASSETS = "resource.assets",
  ASSETS_ASSIGN = "resource.assets-assign",
  ASSETS_READY_TO_DEPLOY = "resource.assets-readyToDeploy",
  ASSETS_PENDING = "resource.assets-pending",
  ASSETS_BROKEN = "resource.assets-broken",
  ASSETS_MAINTENANCE = "resource.assets-maintenance",
  TOOLS_ALL = "resource.tools-all",
  TOOLS_WAITING = "resource.tools-waiting",
  LICENSES = "resource.licenses",
  USERS_TOOLS = "resource.users-tools",
  USERS_TAX_TOKENS = "resource.users-tax-tokens",
  USERS_LICENSES = "resource.users_licenses",
  MODELS = "resource.model",
  CATEGORY = "resource.category",
  MANUFACTURES = "resource.manufactures",
  SUPPLIERS = "resource.suppliers",
  DEPARTMENT = "resource.department",
  LOCATION = "resource.location",
  TAX_TOKEN_ASSIGN = "resource.tax_token_assign",
  REQUEST = "resource.request",
  REPORT = "resource.report",
  MANAGER_USER = "resource.manager_user",
  ASSETS_WAITING_CONFIRM = "resource.assets-waiting-confirm",
  CONSUMABLES = "resource.consumables",
  CONSUMABLES_MAINTENANCE = "resource.consumables-maintenance",
  ACCESSORY = "resource.accessory",
  ACCESSORY_DETAILS = "resource.accessory_details",
  CONSUMABLE_DETAILS = "resource.consumable_details",
  SUPPLIER_DETAILS = "resource.supplier_details",
  LOCATION_DETAILS = "resource.location_details",
  MANUFACTURES_DETAILS = "resource.manufactures_details",
  WEBHOOK_DETAILS = "resource.webhook_details",
  ASSETS_EXPIRES = "resource.assets-expires",
  TAX_TOKEN = "resource.tax_token",
  TAX_TOKEN_WAITING = "resource.tax_token_waiting",
  CLIENT_ASSETS = "resource.client-assets",
  CLIENT_ASSET_ASSIGNED = "resource.client-asset-assigned",
  CLIENT_ASSET_READY_TO_DEPLOY = "resource.client-asset-readyToDeploy",
  CLIENT_ASSET_PENDING = "resource.client-asset-pending",
  CLIENT_ASSET_BROKEN = "resource.client-asset-broken",
  CLIENT_ASSET_WAITING_CONFIRM = "resource.client-asset-waitingConfirm",
  WEBHOOK = "resource.webhook",
  KOMU_LOGS = "resource.komu_logs",
  WEBHOOK_LOGS = "resource.webhook_logs",
  ASSET_RENTAL_CUSTOMERS = "resource.asset-rental-customers",
}

// Resource configuration interface
interface ResourceConfig {
  translationKey: string;
  component: any;
  route: RESOURCE_ROUTES;
  label?: RESOURCE_LABELS;
}

const RESOURCE_CONFIGS: ResourceConfig[] = [
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS,
    component: UserList,
    route: RESOURCE_ROUTES.USERS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.DASHBOARD,
    component: DashboardPage,
    route: RESOURCE_ROUTES.DASHBOARD,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.DETAIL_DEVICE,
    component: DetailProduct,
    route: RESOURCE_ROUTES.DETAIL_DEVICE,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CHECKIN_CHECKOUT,
    component: ListCheckin_Checkout,
    route: RESOURCE_ROUTES.CHECKIN_CHECKOUT,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS,
    component: HardwareList,
    route: RESOURCE_ROUTES.ASSETS,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_ASSIGN,
    component: HardwareListAssign,
    route: RESOURCE_ROUTES.ASSETS_ASSIGN,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_READY_TO_DEPLOY,
    component: HardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.ASSETS_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_PENDING,
    component: HardwareListPending,
    route: RESOURCE_ROUTES.ASSETS_PENDING,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_BROKEN,
    component: HardwareListBroken,
    route: RESOURCE_ROUTES.ASSETS_BROKEN,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_MAINTENANCE,
    component: HardwareListMaintenance,
    route: RESOURCE_ROUTES.ASSETS_MAINTENANCE,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.TOOLS_ALL,
    component: ToolList,
    route: RESOURCE_ROUTES.TOOLS_ALL,
    label: RESOURCE_LABELS.TOOLS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.TOOLS_WAITING,
    component: ToolListWaitingConfirm,
    route: RESOURCE_ROUTES.TOOLS_WAITING,
    label: RESOURCE_LABELS.TOOLS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.LICENSES,
    component: LicensesList,
    route: RESOURCE_ROUTES.LICENSES,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_TOOLS,
    component: UserListTool,
    route: RESOURCE_ROUTES.USERS_TOOLS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_TAX_TOKENS,
    component: UserListTaxToken,
    route: RESOURCE_ROUTES.USERS_TAX_TOKENS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_LICENSES,
    component: UserListLicenses,
    route: RESOURCE_ROUTES.USERS_LICENSES,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.MODELS,
    component: ModelList,
    route: RESOURCE_ROUTES.MODELS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CATEGORY,
    component: CategoryList,
    route: RESOURCE_ROUTES.CATEGORY,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANUFACTURES,
    component: ManufacturesList,
    route: RESOURCE_ROUTES.MANUFACTURES,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.SUPPLIERS,
    component: SupplierList,
    route: RESOURCE_ROUTES.SUPPLIERS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.DEPARTMENT,
    component: DepartmentList,
    route: RESOURCE_ROUTES.DEPARTMENT,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.LOCATION,
    component: LocationList,
    route: RESOURCE_ROUTES.LOCATION,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN_ASSIGN,
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_ASSIGN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.REQUEST,
    component: RequestList,
    route: RESOURCE_ROUTES.REQUEST,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.REPORT,
    component: ReportList,
    route: RESOURCE_ROUTES.REPORT,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANAGER_USER,
    component: Manager_UserList,
    route: RESOURCE_ROUTES.MANAGER_USER,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_WAITING_CONFIRM,
    component: HardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.ASSETS_WAITING_CONFIRM,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLES,
    component: ConsumablesList,
    route: RESOURCE_ROUTES.CONSUMABLES,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLES_MAINTENANCE,
    component: ConsumablesMainternanceList,
    route: RESOURCE_ROUTES.CONSUMABLES_MAINTENANCE,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ACCESSORY,
    component: AccessoryList,
    route: RESOURCE_ROUTES.ACCESSORY,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ACCESSORY_DETAILS,
    component: AccessoryDetails,
    route: RESOURCE_ROUTES.ACCESSORY_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLE_DETAILS,
    component: ConsumableDetails,
    route: RESOURCE_ROUTES.CONSUMABLE_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.SUPPLIER_DETAILS,
    component: SupplierDetails,
    route: RESOURCE_ROUTES.SUPPLIER_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.LOCATION_DETAILS,
    component: LocationDetails,
    route: RESOURCE_ROUTES.LOCATION_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANUFACTURES_DETAILS,
    component: ManufacturesDetails,
    route: RESOURCE_ROUTES.MANUFACTURES_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK_DETAILS,
    component: WebhookDetail,
    route: RESOURCE_ROUTES.WEBHOOK_DETAILS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_EXPIRES,
    component: HardwareListExpiration,
    route: RESOURCE_ROUTES.ASSETS_EXPIRES,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN,
    component: TaxTokenList,
    route: RESOURCE_ROUTES.TAX_TOKEN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN_WAITING,
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_WAITING,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSETS,
    component: ClientHardwareList,
    route: RESOURCE_ROUTES.CLIENT_ASSETS,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_ASSIGNED,
    component: ClientHardwareListAssign,
    route: RESOURCE_ROUTES.CLIENT_ASSET_ASSIGNED,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_READY_TO_DEPLOY,
    component: ClientHardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.CLIENT_ASSET_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_PENDING,
    component: ClientHardwareListPending,
    route: RESOURCE_ROUTES.CLIENT_ASSET_PENDING,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_BROKEN,
    component: ClientHardwareListBroken,
    route: RESOURCE_ROUTES.CLIENT_ASSET_BROKEN,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_WAITING_CONFIRM,
    component: ClientHardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.CLIENT_ASSET_WAITING_CONFIRM,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_EXPIRES,
    component: ClientHardwareListExpiration,
    route: RESOURCE_ROUTES.CLIENT_ASSETS_EXPIRES,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK,
    component: WebhookList,
    route: RESOURCE_ROUTES.WEBHOOK,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.KOMU_LOGS,
    component: KomuLogs,
    route: RESOURCE_ROUTES.KOMU_LOGS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK_LOGS,
    component: WebhookLogs,
    route: RESOURCE_ROUTES.WEBHOOK_LOGS,
  },
  {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSET_RENTAL_CUSTOMERS,
    component: HardwareListRentalCustomers,
    route: RESOURCE_ROUTES.ASSET_RENTAL_CUSTOMERS,
    label: RESOURCE_LABELS.ASSETS,
  },
];

// Function to generate resources from configuration
export const generateResources = (t: any): any[] => {
  return RESOURCE_CONFIGS.map((config) => ({
    name: t(config.translationKey),
    list: config.component,
    options: {
      route: config.route,
      ...(config.label && { label: config.label }),
    },
  }));
};
