import { Refine } from "@pankod/refine-core";
import { notificationProvider, Layout } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { HardwareList, HardwareShow } from "pages/hardware";
import {
  Title,
  Header,
  Sider,
  Footer,
  OffLayoutArea,
} from "components/layout";
import { useTranslation } from "react-i18next";
import { DashboardPage } from "pages/dashboard";
import { RequestList } from "pages/request";
import { LoginPage } from "pages/login/login";
import { UserList } from "pages/users/list";
import { newEnforcer } from "casbin.js";
import { adapter, model } from "AccessControl";
import { useRef, useState } from "react";

function App() {
  const { t, i18n } = useTranslation();
  const refCheck = useRef(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const resetRef = () => {
    refCheck.current = false;
  }

  return (
    <Refine
      routerProvider={routerProvider}
      notificationProvider={notificationProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      DashboardPage={DashboardPage}
      LoginPage={LoginPage}
      accessControlProvider={{
        can: async ({ resource, action, params }) => {
          let role = currentUser;
          if (refCheck.current === false || role === null) {
            role = await authProvider.getPermissions();
            refCheck.current = true;
            setCurrentUser(role);
          }
          const enforcer = await newEnforcer(model, adapter);
          if (
            action === "delete" ||
            action === "edit" ||
            action === "show"
          ) {
            const can = await enforcer.enforce(
              role,
              `${resource}/${params.id}`,
              action,
            );
            return Promise.resolve({ can });
          }

          if (action === "field") {
            const can = await enforcer.enforce(
              role,
              `${resource}/${params.field}`,
              action,
            );
            return Promise.resolve({ can });
          }

          const can = await enforcer.enforce(role, resource, action);
          return Promise.resolve({ can });
        },
      }}
      resources={[
        {
          name: "assets",
          list: HardwareList,
          show: HardwareShow,
          options: {
            route: "assets",
          },
        },
        {
          name: "Tạo request",
          list: RequestList,
          options: {
            route: "create-request",
          },
        },
        {
          name: "Users",
          list: UserList,
          options: {
            route: "users",
          },
        },
      ]}
      Title={Title}
      Header={() => <Header resetRef={resetRef} />}
      Sider={() => <Sider resetRef={resetRef} />}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      i18nProvider={i18nProvider}
    />
  );
}

export default App;
