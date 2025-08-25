import { I18nProvider, Refine } from "@pankod/refine-core";
import { notification, notificationProvider } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
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
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import { useTranslation } from "react-i18next";

import { DashboardPage } from "pages/dashboard";
import { RequestList } from "pages/request";
import { LoginPage } from "pages/login/login";
import { UserList } from "pages/users/list";
import { newEnforcer } from "casbin.js";
import { model, adapter } from "AccessControl";
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
import { EPermissions } from "constants/permissions";
import { TaxTokenList } from "pages/tax_token/list";
import { TaxTokenListWaitingConfirm } from "pages/tax_token/list-waiting";
import { ToolList } from "pages/tools/list";
import { ToolListWaitingConfirm } from "pages/tools/list-waiting";
import { UserListTool } from "pages/users/list-tools";
import { UserListTaxToken } from "pages/users/list-tax-tokens";
// import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import {
  ClientHardwareList,
  ClientHardwareListAssign,
  ClientHardwareListBroken,
  ClientHardwareListPending,
  ClientHardwareListReadyToDeploy,
} from "pages/hardware_client";
import { ClientHardwareListWaitingConfirm } from "pages/hardware_client/list-watiting-confirm";
import { ClientHardwareListExpiration } from "pages/hardware_client/list-expiration";
import { useRef } from "react";
import { DetailProduct } from "pages/hardware/detail";
import { DETAIL_DEVICE_ROUTE } from "constants/route";
import { ConsumablesMainternanceList } from "pages/consumables/list-maintenance";
import { WebhookList } from "pages/webhook/list";
import { WebhookDetail } from "pages/webhook/detail";
import { KomuLogs } from "pages/audit/komu/list";
import { WebhookLogs } from "pages/audit/webhook_logs/list";
import ScrollToTopButton from "components/elements/button/ScrollToTopButton";

function App() {
  const { t, i18n } = useTranslation();
  const notificationRef = useRef(null);
  const route = window.location.pathname;

  notification.config({
    getContainer() {
      return notificationRef.current as unknown as HTMLElement;
    },
  });

  const i18nProvider: I18nProvider = {
    translate: (key: string, params: Record<string, any>) =>
      t(key, params) as string,
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  // const currThemes = {
  //   dark: `${process.env.PUBLIC_URL}/antd.dark-theme.css`,
  //   light: `${process.env.PUBLIC_URL}/antd.light-theme.css`,
  // };
  return (
    // <ThemeSwitcherProvider themeMap={currThemes} defaultTheme="light">
    <>
      <Refine
        routerProvider={routerProvider}
        notificationProvider={notificationProvider}
        dataProvider={dataProvider}
        authProvider={authProvider}
        LoginPage={LoginPage}
        accessControlProvider={{
          can: async ({ resource, action, params }) => {
            const role = await authProvider.getPermissions();
            const enforcer = await newEnforcer(model, adapter);
            if (role.branchadmin == EPermissions.BRANCHADMIN) {
              if (action === "show") {
                const can = await enforcer.enforce(
                  role.branchadmin,
                  `${resource}/${params.id}`,
                  action
                );
                return Promise.resolve({ can });
              } else {
                const can = await enforcer.enforce(
                  role.branchadmin,
                  `${resource}`,
                  action
                );
                return Promise.resolve({ can });
              }
            }
            if (action === "delete" || action === "edit" || action === "show") {
              const can = await enforcer.enforce(
                role.admin,
                `${resource}/${params.id}`,
                action
              );
              return Promise.resolve({ can });
            }

            if (action === "field") {
              const can = await enforcer.enforce(
                role.admin,
                `${resource}/${params.field}`,
                action
              );
              return Promise.resolve({ can });
            }
            const can = await enforcer.enforce(role.admin, resource, action);
            return Promise.resolve({ can });
          },
        }}
        resources={[
          {
            name: t("resource.users"),
            list: UserList,
            options: {
              route: "users",
              label: "users",
            },
          },
          {
            name: t("resource.dashboard"),
            list: DashboardPage,
            options: {
              route: "dashboard",
            },
          },
          {
            name: t("resource.detail-device"),
            list: DetailProduct,
            options: {
              route: "detail-device",
            },
          },
          {
            name: t("resource.checkin-checkout"),
            list: ListCheckin_Checkout,
            options: {
              route: "checkin_checkout",
            },
          },
          {
            name: t("resource.assets"),
            list: HardwareList,
            options: {
              route: "assets",
              label: "assets",
            },
          },
          {
            name: t("resource.assets-assign"),
            list: HardwareListAssign,
            options: {
              route: "assets-assign",
              label: "assets",
            },
          },
          {
            name: t("resource.assets-readyToDeploy"),
            list: HardwareListReadyToDeploy,
            options: {
              route: "assets-readyToDeploy",
              label: "assets",
            },
          },
          {
            name: t("resource.assets-pending"),
            list: HardwareListPending,
            options: {
              route: "assets-pending",
              label: "assets",
            },
          },
          {
            name: t("resource.assets-broken"),
            list: HardwareListBroken,
            options: {
              route: "assets-broken",
              label: "assets",
            },
          },
          {
            name: t("resource.assets-maintenance"),
            list: HardwareListMaintenance,
            options: {
              route: "assets-maintenance",
              label: "assets",
            },
          },
          {
            name: t("resource.tools-all"),
            list: ToolList,
            options: {
              route: "tools-all",
              label: "tools",
            },
          },
          {
            name: t("resource.tools-waiting"),
            list: ToolListWaitingConfirm,
            options: {
              route: "tools-waiting",
              label: "tools",
            },
          },
          // {
          //   name: t("resource.softwares"),
          //   list: SoftwareList,
          //   options: {
          //     route: "softwares",
          //   },
          // },
          {
            name: t("resource.licenses"),
            list: LicensesList,
            options: {
              route: "licenses",
            },
          },
          {
            name: t("resource.users-tools"),
            list: UserListTool,
            options: {
              route: "users-tools",
              label: "users",
            },
          },
          {
            name: t("resource.users-tax-tokens"),
            list: UserListTaxToken,
            options: {
              route: "users-tax-tokens",
              label: "users",
            },
          },
          {
            name: t("resource.users_licenses"),
            list: UserListLicenses,
            options: {
              route: "users-licenses",
            },
          },
          {
            name: t("resource.model"),
            list: ModelList,
            options: {
              route: "models",
            },
          },
          {
            name: t("resource.category"),
            list: CategoryList,
            options: {
              route: "category",
            },
          },
          {
            name: t("resource.manufactures"),
            list: ManufacturesList,
            options: {
              route: "manufactures",
            },
          },
          {
            name: t("resource.suppliers"),
            list: SupplierList,
            options: {
              route: "suppliers",
            },
          },
          {
            name: t("resource.department"),
            list: DepartmentList,
            options: {
              route: "department",
            },
          },
          {
            name: t("resource.location"),
            list: LocationList,
            options: {
              route: "location",
            },
          },

          {
            name: t("resource.tax_token_assign"),
            list: TaxTokenListWaitingConfirm,
            options: {
              route: "tax_token_assign",
              label: "tax_token",
            },
          },
          {
            name: t("resource.request"),
            list: RequestList,
            options: {
              route: "request",
            },
          },
          {
            name: t("resource.report"),
            list: ReportList,
            options: {
              route: "report",
            },
          },
          {
            name: t("resource.manager_user"),
            list: Manager_UserList,
            options: {
              route: "manager_user",
            },
          },
          {
            name: t("resource.assets-waiting-confirm"),
            list: HardwareListWaitingConfirm,
            options: {
              route: "assets-waiting-confirm",
              label: "assets",
            },
          },

          {
            name: t("resource.consumables"),
            list: ConsumablesList,
            options: {
              route: "consumables",
              label: "consumables",
            },
          },
          {
            name: t("resource.consumables-maintenance"),
            list: ConsumablesMainternanceList,
            options: {
              route: "consumables-maintenance",
              label: "consumables",
            },
          },
          {
            name: t("resource.accessory"),
            list: AccessoryList,
            options: {
              route: "accessory",
            },
          },
          {
            name: t("resource.accessory_details"),
            list: AccessoryDetails,
            options: {
              route: "accessory_details",
            },
          },
          {
            name: t("resource.consumable_details"),
            list: ConsumableDetails,
            options: {
              route: "consumable_details",
            },
          },
          {
            name: t("resource.supplier_details"),
            list: SupplierDetails,
            options: {
              route: "supplier_details",
            },
          },
          {
            name: t("resource.location_details"),
            list: LocationDetails,
            options: {
              route: "location_details",
            },
          },
          {
            name: t("resource.manufactures_details"),
            list: ManufacturesDetails,
            options: {
              route: "manufactures_details",
            },
          },
          {
            name: t("resource.webhook_details"),
            list: WebhookDetail,
            options: {
              route: "webhook_details",
            },
          },
          {
            name: t("resource.assets-expires"),
            list: HardwareListExpiration,
            options: {
              route: "assets-expires",
              label: "assets",
            },
          },
          {
            name: t("resource.tax_token"),
            list: TaxTokenList,
            options: {
              route: "tax_token",
              label: "tax_token",
            },
          },
          {
            name: t("resource.tax_token_waiting"),
            list: TaxTokenListWaitingConfirm,
            options: {
              route: "tax_token_waiting",
              label: "tax_token",
            },
          },
          {
            name: t("resource.client-assets"),
            list: ClientHardwareList,
            options: {
              route: "client-assets",
              label: "client-assets",
            },
          },
          {
            name: t("resource.client-asset-assigned"),
            list: ClientHardwareListAssign,
            options: {
              route: "client-asset-assigned",
              label: "client-assets",
            },
          },
          {
            name: t("resource.client-asset-readyToDeploy"),
            list: ClientHardwareListReadyToDeploy,
            options: {
              route: "client-asset-readyToDeploy",
              label: "client-assets",
            },
          },
          {
            name: t("resource.client-asset-pending"),
            list: ClientHardwareListPending,
            options: {
              route: "client-asset-pending",
              label: "client-assets",
            },
          },
          {
            name: t("resource.assets-broken"),
            list: ClientHardwareListBroken,
            options: {
              route: "client-asset-broken",
              label: "client-assets",
            },
          },
          {
            name: t("resource.client-asset-waitingConfirm"),
            list: ClientHardwareListWaitingConfirm,
            options: {
              route: "client-asset-waitingConfirm",
              label: "client-assets",
            },
          },
          {
            name: t("resource.assets-expires"),
            list: ClientHardwareListExpiration,
            options: {
              route: "client-assets-expires",
              label: "client-assets",
            },
          },
          {
            name: t("resource.webhook"),
            list: WebhookList,
            options: {
              route: "webhook",
            },
          },
          {
            name: t("resource.komu_logs"),
            list: KomuLogs,
            options: {
              route: "komu_logs",
            },
          },
          {
            name: t("resource.webhook_logs"),
            list: WebhookLogs,
            options: {
              route: "webhook_logs",
            },
          },
          {
            name: t("resource.asset-rental-customers"),
            list: HardwareListRentalCustomers,
            options: {
              route: "asset-rental-customers",
              label: "assets",
            },
          },
        ]}
        Title={Title}
        Header={route === DETAIL_DEVICE_ROUTE ? undefined : Header}
        Sider={route === DETAIL_DEVICE_ROUTE ? undefined : Sider}
        Footer={Footer}
        Layout={Layout}
        OffLayoutArea={OffLayoutArea}
        i18nProvider={i18nProvider}
      />
      <ScrollToTopButton />
      <div ref={notificationRef} data-test-id="notification-container"></div>
    </>
  );
}

export default App;
