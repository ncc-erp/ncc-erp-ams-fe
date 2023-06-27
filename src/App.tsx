import { Refine } from "@pankod/refine-core";
import { notificationProvider } from "@pankod/refine-antd";
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
} from "pages/hardware";
import {
  SoftwareList,
} from "pages/software/list";
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
import { ToolList } from "pages/tools/list";
import { ToolListWaitingConfirm } from "pages/tools/list-waiting";
import { UserListTool } from "pages/users/list-tools";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <Refine
      routerProvider={routerProvider}
      notificationProvider={notificationProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      LoginPage={LoginPage}
      accessControlProvider={{
        can: async ({ resource, action, params }) => {
          let role = await authProvider.getPermissions();
          const enforcer = await newEnforcer(model, adapter);

          if (role.branchadmin == EPermissions.BRANCHADMIN) {
            if(action === "show"){
              const can = await enforcer.enforce(
                role.branchadmin,
                `${resource}/${params.id}`,
                action
              );
              return Promise.resolve({ can });
            }else{
              const can = await enforcer.enforce(
                role.branchadmin,
                `${resource}`,
                action,
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
          name: t("resource.dashboard"),
          list: DashboardPage,
          options: {
            route: "dashboard",
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
          },
        },
        {
          name: t("resource.assets-assign"),
          list: HardwareListAssign,
          options: {
            route: "assets-assign",
          },
        },
        {
          name: t("resource.assets-readyToDeploy"),
          list: HardwareListReadyToDeploy,
          options: {
            route: "assets-readyToDeploy",
          },
        },
        {
          name: t("resource.assets-pending"),
          list: HardwareListPending,
          options: {
            route: "assets-pending",
          },
        },
        {
          name: t("resource.assets-broken"),
          list: HardwareListBroken,
          options: {
            route: "assets-broken",
          },
        },
        {
          name: t("resource.tools-all"),
          list: ToolList,
          options: {
            route: "tools-all",
          },
        },
        {
          name: t("resource.tools-waiting"),
          list: ToolListWaitingConfirm,
          options: {
            route: "tools-waiting",
          }
        },
        {
          name: t("resource.softwares"),
          list: SoftwareList,
          options: {
            route: "softwares",
          },
        },
        {
          name: t("resource.licenses"),
          list: LicensesList,
          options: {
            route: "licenses",
          },
        },
        {
          name: t("resource.users"),
          list: UserList,
          options: {
            route: "users",
          },
        },
        {
          name: t("resource.users-tools"),
          list: UserListTool,
          options: {
            route: "users-tools",
          }
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
          },
        },

        {
          name: t("resource.consumables"),
          list: ConsumablesList,
          options: {
            route: "consumables",
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
          name: t("resource.assets-expires"),
          list: HardwareListExpiration,
          options: {
            route: "assets-expires",
          },
        },
      ]}
      Title={Title}
      Header={Header}
      Sider={Sider}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      i18nProvider={i18nProvider}
    />
  );
}

export default App;
