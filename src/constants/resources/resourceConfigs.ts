import {
  RESOURCE_TRANSLATION_KEYS,
  RESOURCE_ROUTES,
  RESOURCE_LABELS,
} from "./resourceEnums";
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

// Interface defining the structure of a resource configuration
export interface ResourceConfig {
  translationKey: string;
  component: React.ComponentType<any>;
  route: RESOURCE_ROUTES;
  label?: RESOURCE_LABELS;
}

// Resource configurations as an object
export const RESOURCE_CONFIGS: Record<
  keyof typeof RESOURCE_ROUTES,
  ResourceConfig
> = {
  USERS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS,
    component: UserList,
    route: RESOURCE_ROUTES.USERS,
    label: RESOURCE_LABELS.USERS,
  },
  DASHBOARD: {
    translationKey: RESOURCE_TRANSLATION_KEYS.DASHBOARD,
    component: DashboardPage,
    route: RESOURCE_ROUTES.DASHBOARD,
  },
  DETAIL_DEVICE: {
    translationKey: RESOURCE_TRANSLATION_KEYS.DETAIL_DEVICE,
    component: DetailProduct,
    route: RESOURCE_ROUTES.DETAIL_DEVICE,
  },
  CHECKIN_CHECKOUT: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CHECKIN_CHECKOUT,
    component: ListCheckin_Checkout,
    route: RESOURCE_ROUTES.CHECKIN_CHECKOUT,
  },
  ASSETS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS,
    component: HardwareList,
    route: RESOURCE_ROUTES.ASSETS,
    label: RESOURCE_LABELS.ASSETS,
  },
  ASSETS_ASSIGN: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_ASSIGN,
    component: HardwareListAssign,
    route: RESOURCE_ROUTES.ASSETS_ASSIGN,
    label: RESOURCE_LABELS.ASSETS,
  },
  ASSETS_READY_TO_DEPLOY: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_READY_TO_DEPLOY,
    component: HardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.ASSETS_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.ASSETS,
  },
  ASSETS_PENDING: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_PENDING,
    component: HardwareListPending,
    route: RESOURCE_ROUTES.ASSETS_PENDING,
    label: RESOURCE_LABELS.ASSETS,
  },
  ASSETS_BROKEN: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_BROKEN,
    component: HardwareListBroken,
    route: RESOURCE_ROUTES.ASSETS_BROKEN,
    label: RESOURCE_LABELS.ASSETS,
  },
  ASSETS_MAINTENANCE: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_MAINTENANCE,
    component: HardwareListMaintenance,
    route: RESOURCE_ROUTES.ASSETS_MAINTENANCE,
    label: RESOURCE_LABELS.ASSETS,
  },
  TOOLS_ALL: {
    translationKey: RESOURCE_TRANSLATION_KEYS.TOOLS_ALL,
    component: ToolList,
    route: RESOURCE_ROUTES.TOOLS_ALL,
    label: RESOURCE_LABELS.TOOLS,
  },
  TOOLS_WAITING: {
    translationKey: RESOURCE_TRANSLATION_KEYS.TOOLS_WAITING,
    component: ToolListWaitingConfirm,
    route: RESOURCE_ROUTES.TOOLS_WAITING,
    label: RESOURCE_LABELS.TOOLS,
  },
  LICENSES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.LICENSES,
    component: LicensesList,
    route: RESOURCE_ROUTES.LICENSES,
  },
  USERS_TOOLS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_TOOLS,
    component: UserListTool,
    route: RESOURCE_ROUTES.USERS_TOOLS,
    label: RESOURCE_LABELS.USERS,
  },
  USERS_TAX_TOKENS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_TAX_TOKENS,
    component: UserListTaxToken,
    route: RESOURCE_ROUTES.USERS_TAX_TOKENS,
    label: RESOURCE_LABELS.USERS,
  },
  USERS_LICENSES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.USERS_LICENSES,
    component: UserListLicenses,
    route: RESOURCE_ROUTES.USERS_LICENSES,
  },
  MODELS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.MODELS,
    component: ModelList,
    route: RESOURCE_ROUTES.MODELS,
  },
  CATEGORY: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CATEGORY,
    component: CategoryList,
    route: RESOURCE_ROUTES.CATEGORY,
  },
  MANUFACTURES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANUFACTURES,
    component: ManufacturesList,
    route: RESOURCE_ROUTES.MANUFACTURES,
  },
  SUPPLIERS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.SUPPLIERS,
    component: SupplierList,
    route: RESOURCE_ROUTES.SUPPLIERS,
  },
  DEPARTMENT: {
    translationKey: RESOURCE_TRANSLATION_KEYS.DEPARTMENT,
    component: DepartmentList,
    route: RESOURCE_ROUTES.DEPARTMENT,
  },
  LOCATION: {
    translationKey: RESOURCE_TRANSLATION_KEYS.LOCATION,
    component: LocationList,
    route: RESOURCE_ROUTES.LOCATION,
  },
  TAX_TOKEN_ASSIGN: {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN_ASSIGN,
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_ASSIGN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  REQUEST: {
    translationKey: RESOURCE_TRANSLATION_KEYS.REQUEST,
    component: RequestList,
    route: RESOURCE_ROUTES.REQUEST,
  },
  REPORT: {
    translationKey: RESOURCE_TRANSLATION_KEYS.REPORT,
    component: ReportList,
    route: RESOURCE_ROUTES.REPORT,
  },
  MANAGER_USER: {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANAGER_USER,
    component: Manager_UserList,
    route: RESOURCE_ROUTES.MANAGER_USER,
  },
  ASSETS_WAITING_CONFIRM: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_WAITING_CONFIRM,
    component: HardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.ASSETS_WAITING_CONFIRM,
    label: RESOURCE_LABELS.ASSETS,
  },
  CONSUMABLES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLES,
    component: ConsumablesList,
    route: RESOURCE_ROUTES.CONSUMABLES,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  CONSUMABLES_MAINTENANCE: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLES_MAINTENANCE,
    component: ConsumablesMainternanceList,
    route: RESOURCE_ROUTES.CONSUMABLES_MAINTENANCE,
    label: RESOURCE_LABELS.CONSUMABLES,
  },
  ACCESSORY: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ACCESSORY,
    component: AccessoryList,
    route: RESOURCE_ROUTES.ACCESSORY,
  },
  ACCESSORY_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ACCESSORY_DETAILS,
    component: AccessoryDetails,
    route: RESOURCE_ROUTES.ACCESSORY_DETAILS,
  },
  CONSUMABLE_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CONSUMABLE_DETAILS,
    component: ConsumableDetails,
    route: RESOURCE_ROUTES.CONSUMABLE_DETAILS,
  },
  SUPPLIER_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.SUPPLIER_DETAILS,
    component: SupplierDetails,
    route: RESOURCE_ROUTES.SUPPLIER_DETAILS,
  },
  LOCATION_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.LOCATION_DETAILS,
    component: LocationDetails,
    route: RESOURCE_ROUTES.LOCATION_DETAILS,
  },
  MANUFACTURES_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.MANUFACTURES_DETAILS,
    component: ManufacturesDetails,
    route: RESOURCE_ROUTES.MANUFACTURES_DETAILS,
  },
  WEBHOOK_DETAILS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK_DETAILS,
    component: WebhookDetail,
    route: RESOURCE_ROUTES.WEBHOOK_DETAILS,
  },
  ASSETS_EXPIRES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_EXPIRES,
    component: HardwareListExpiration,
    route: RESOURCE_ROUTES.ASSETS_EXPIRES,
    label: RESOURCE_LABELS.ASSETS,
  },
  TAX_TOKEN: {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN,
    component: TaxTokenList,
    route: RESOURCE_ROUTES.TAX_TOKEN,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  TAX_TOKEN_WAITING: {
    translationKey: RESOURCE_TRANSLATION_KEYS.TAX_TOKEN_WAITING,
    component: TaxTokenListWaitingConfirm,
    route: RESOURCE_ROUTES.TAX_TOKEN_WAITING,
    label: RESOURCE_LABELS.TAX_TOKEN,
  },
  CLIENT_ASSETS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSETS,
    component: ClientHardwareList,
    route: RESOURCE_ROUTES.CLIENT_ASSETS,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSET_ASSIGNED: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_ASSIGNED,
    component: ClientHardwareListAssign,
    route: RESOURCE_ROUTES.CLIENT_ASSET_ASSIGNED,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSET_READY_TO_DEPLOY: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_READY_TO_DEPLOY,
    component: ClientHardwareListReadyToDeploy,
    route: RESOURCE_ROUTES.CLIENT_ASSET_READY_TO_DEPLOY,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSET_PENDING: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_PENDING,
    component: ClientHardwareListPending,
    route: RESOURCE_ROUTES.CLIENT_ASSET_PENDING,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSET_BROKEN: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_BROKEN,
    component: ClientHardwareListBroken,
    route: RESOURCE_ROUTES.CLIENT_ASSET_BROKEN,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSET_WAITING_CONFIRM: {
    translationKey: RESOURCE_TRANSLATION_KEYS.CLIENT_ASSET_WAITING_CONFIRM,
    component: ClientHardwareListWaitingConfirm,
    route: RESOURCE_ROUTES.CLIENT_ASSET_WAITING_CONFIRM,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  CLIENT_ASSETS_EXPIRES: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSETS_EXPIRES,
    component: ClientHardwareListExpiration,
    route: RESOURCE_ROUTES.CLIENT_ASSETS_EXPIRES,
    label: RESOURCE_LABELS.CLIENT_ASSETS,
  },
  WEBHOOK: {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK,
    component: WebhookList,
    route: RESOURCE_ROUTES.WEBHOOK,
  },
  KOMU_LOGS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.KOMU_LOGS,
    component: KomuLogs,
    route: RESOURCE_ROUTES.KOMU_LOGS,
  },
  WEBHOOK_LOGS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.WEBHOOK_LOGS,
    component: WebhookLogs,
    route: RESOURCE_ROUTES.WEBHOOK_LOGS,
  },
  ASSET_RENTAL_CUSTOMERS: {
    translationKey: RESOURCE_TRANSLATION_KEYS.ASSET_RENTAL_CUSTOMERS,
    component: HardwareListRentalCustomers,
    route: RESOURCE_ROUTES.ASSET_RENTAL_CUSTOMERS,
    label: RESOURCE_LABELS.ASSETS,
  },
};
