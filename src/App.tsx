import { Refine } from "@pankod/refine-core";
import { notificationProvider } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { HardwareList } from "pages/hardware";
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
          name: t("resource.location"),
          list: LocationList,
          options: {
            route: "location",
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
