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

// Resource configuration interface
interface ResourceConfig {
  translationKey: string;
  component: any;
  route: RESOURCE_ROUTES;
  label?: RESOURCE_LABELS;
}

// Resource configurations array
const RESOURCE_CONFIGS: ResourceConfig[] = [
  {
    translationKey: "resource.users",
    component: UserList,
    route: RESOURCE_ROUTES.USERS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: "resource.dashboard",
    component: DashboardPage,
    route: RESOURCE_ROUTES.DASHBOARD,
  },
  {
    translationKey: "resource.detail-device",
    component: DetailProduct,
    route: RESOURCE_ROUTES.DETAIL_DEVICE,
  },
  {
    translationKey: "resource.checkin-checkout",
    component: ListCheckin_Checkout,
    route: RESOURCE_ROUTES.CHECKIN_CHECKOUT,
  },
  {
    translationKey: "resource.assets",
    component: HardwareList,
    route: RESOURCE_ROUTES.ASSETS,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.assets-assign",
    component: HardwareListAssign,
    route: RESOURCE_ROUTES.ASSETS_ASSIGN,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.assets-readyToDeploy",
    component: HardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.ASSETS_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.assets-pending",
    component: HardwareListPending,
    route: RESOURCE_ROUTES.ASSETS_PENDING,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.assets-broken",
    component: HardwareListBroken,
    route: RESOURCE_ROUTES.ASSETS_BROKEN,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.assets-maintenance",
    component: HardwareListMaintenance,
    route: RESOURCE_ROUTES.ASSETS_MAINTENANCE,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.tools-all",
    component: ToolList,
    route: RESOURCE_ROUTES.TOOLS_ALL,
    label: RESOURCE_LABELS.TOOLS,
  },
  {
    translationKey: "resource.tools-waiting",
    component: ToolListWaitingConfirm,
    route: RESOURCE_ROUTES.TOOLS_WAITING,
    label: RESOURCE_LABELS.TOOLS,
  },
  {
    translationKey: "resource.licenses",
    component: LicensesList,
    route: RESOURCE_ROUTES.LICENSES,
  },
  {
    translationKey: "resource.users-tools",
    component: UserListTool,
    route: RESOURCE_ROUTES.USERS_TOOLS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: "resource.users-tax-tokens",
    component: UserListTaxToken,
    route: RESOURCE_ROUTES.USERS_TAX_TOKENS,
    label: RESOURCE_LABELS.USERS,
  },
  {
    translationKey: "resource.users_licenses",
    component: UserListLicenses,
    route: RESOURCE_ROUTES.USERS_LICENSES,
  },
  {
    translationKey: "resource.model",
    component: ModelList,
    route: RESOURCE_ROUTES.MODELS,
  },
  {
    translationKey: "resource.category",
    component: CategoryList,
    route: RESOURCE_ROUTES.CATEGORY,
  },
  {
    translationKey: "resource.manufactures",
    component: ManufacturesList,
    route: RESOURCE_ROUTES.MANUFACTURES,
  },
  {
    translationKey: "resource.suppliers",
    component: SupplierList,
    route: RESOURCE_ROUTES.SUPPLIERS,
  },
  {
    translationKey: "resource.department",
    component: DepartmentList,
    route: RESOURCE_ROUTES.DEPARTMENT,
  },
  {
    translationKey: "resource.location",
    component: LocationList,
    route: RESOURCE_ROUTES.LOCATION,
  },
  {
    translationKey: "resource.tax_token_assign",
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_ASSIGN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: "resource.request",
    component: RequestList,
    route: RESOURCE_ROUTES.REQUEST,
  },
  {
    translationKey: "resource.report",
    component: ReportList,
    route: RESOURCE_ROUTES.REPORT,
  },
  {
    translationKey: "resource.manager_user",
    component: Manager_UserList,
    route: RESOURCE_ROUTES.MANAGER_USER,
  },
  {
    translationKey: "resource.assets-waiting-confirm",
    component: HardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.ASSETS_WAITING_CONFIRM,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.consumables",
    component: ConsumablesList,
    route: RESOURCE_ROUTES.CONSUMABLES,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  {
    translationKey: "resource.consumables-maintenance",
    component: ConsumablesMainternanceList,
    route: RESOURCE_ROUTES.CONSUMABLES_MAINTENANCE,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  {
    translationKey: "resource.accessory",
    component: AccessoryList,
    route: RESOURCE_ROUTES.ACCESSORY,
  },
  {
    translationKey: "resource.accessory_details",
    component: AccessoryDetails,
    route: RESOURCE_ROUTES.ACCESSORY_DETAILS,
  },
  {
    translationKey: "resource.consumable_details",
    component: ConsumableDetails,
    route: RESOURCE_ROUTES.CONSUMABLE_DETAILS,
  },
  {
    translationKey: "resource.supplier_details",
    component: SupplierDetails,
    route: RESOURCE_ROUTES.SUPPLIER_DETAILS,
  },
  {
    translationKey: "resource.location_details",
    component: LocationDetails,
    route: RESOURCE_ROUTES.LOCATION_DETAILS,
  },
  {
    translationKey: "resource.manufactures_details",
    component: ManufacturesDetails,
    route: RESOURCE_ROUTES.MANUFACTURES_DETAILS,
  },
  {
    translationKey: "resource.webhook_details",
    component: WebhookDetail,
    route: RESOURCE_ROUTES.WEBHOOK_DETAILS,
  },
  {
    translationKey: "resource.assets-expires",
    component: HardwareListExpiration,
    route: RESOURCE_ROUTES.ASSETS_EXPIRES,
    label: RESOURCE_LABELS.ASSETS,
  },
  {
    translationKey: "resource.tax_token",
    component: TaxTokenList,
    route: RESOURCE_ROUTES.TAX_TOKEN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: "resource.tax_token_waiting",
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_WAITING,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  {
    translationKey: "resource.client-assets",
    component: ClientHardwareList,
    route: RESOURCE_ROUTES.CLIENT_ASSETS,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.client-asset-assigned",
    component: ClientHardwareListAssign,
    route: RESOURCE_ROUTES.CLIENT_ASSET_ASSIGNED,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.client-asset-readyToDeploy",
    component: ClientHardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.CLIENT_ASSET_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.client-asset-pending",
    component: ClientHardwareListPending,
    route: RESOURCE_ROUTES.CLIENT_ASSET_PENDING,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.assets-broken",
    component: ClientHardwareListBroken,
    route: RESOURCE_ROUTES.CLIENT_ASSET_BROKEN,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.client-asset-waitingConfirm",
    component: ClientHardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.CLIENT_ASSET_WAITING_CONFIRM,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.assets-expires",
    component: ClientHardwareListExpiration,
    route: RESOURCE_ROUTES.CLIENT_ASSETS_EXPIRES,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  {
    translationKey: "resource.webhook",
    component: WebhookList,
    route: RESOURCE_ROUTES.WEBHOOK,
  },
  {
    translationKey: "resource.komu_logs",
    component: KomuLogs,
    route: RESOURCE_ROUTES.KOMU_LOGS,
  },
  {
    translationKey: "resource.webhook_logs",
    component: WebhookLogs,
    route: RESOURCE_ROUTES.WEBHOOK_LOGS,
  },
  {
    translationKey: "resource.asset-rental-customers",
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
