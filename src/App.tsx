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
import { HardwareListCategoryPC } from "pages/hardware/list-category-PC";
import { HardwareListCategoryMonitor } from "pages/hardware/list-category-monitor";
import { HardwareListCategoryMouse } from "pages/hardware/list-category-mouse";
import { HardwareListCategoryKeyboard } from "pages/hardware/list-category-keyboard";
import { HardwareListCategoryHeadphone } from "pages/hardware/list-category-headphone";
import { HardwareListCategoryDevice } from "pages/hardware/list-category-device";
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
          name: t("resource.request"),
          list: RequestList,
          options: {
            route: "create-request",
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
          name: t("resource.asset-category-PC"),
          list: HardwareListCategoryPC,
          options: {
            route: "assets?category_id=5",
          },
        },
        {
          name: t("resource.asset-category-Monitor"),
          list: HardwareListCategoryMonitor,
          options: {
            route: `assets?category_id=6`,
          },
        },
        {
          name: t("resource.asset-category-Mouse"),
          list: HardwareListCategoryMouse,
          options: {
            route: `assets?category_id=7`,
          },
        },
        {
          name: t("resource.asset-category-Keyboard"),
          list: HardwareListCategoryKeyboard,
          options: {
            route: `assets?category_id=8`,
          },
        },
        {
          name: t("resource.asset-category-Headphone"),
          list: HardwareListCategoryHeadphone,
          options: {
            route: `assets?category_id=10`,
          },
        },
        {
          name: t("resource.asset-category-Device"),
          list: HardwareListCategoryDevice,
          options: {
            route: `assets?category_id=13`,
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
