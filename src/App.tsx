import { I18nProvider, Refine } from "@pankod/refine-core";
import { notification, notificationProvider } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";

import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import { useTranslation } from "react-i18next";

import { LoginPage } from "pages/login/login";
import { newEnforcer } from "casbin.js";
import { model, adapter } from "AccessControl";
import { EPermissions } from "constants/permissions";
// import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { useMemo, useRef } from "react";
import { DETAIL_DEVICE_ROUTE } from "constants/route";
import ScrollToTopButton from "components/elements/button/ScrollToTopButton";
import { ThemeProvider } from "context/ThemeContext";
import ThemeToggle from "components/ThemeToggle";
import { ThemeWrapper } from "components/ThemeWrapper";
import { generateResources } from "./constants/resources";
import { RESOURCE_CONFIGS } from "./constants/resources/resourceConfigs";

function App() {
  const { t, i18n } = useTranslation();
  const notificationRef = useRef(null);
  const route = window.location.pathname;

  const resourceNames: (keyof typeof RESOURCE_CONFIGS)[] = [
    "USERS",
    "DASHBOARD",
    "DETAIL_DEVICE",
    "CHECKIN_CHECKOUT",
    "ASSETS",
    "ASSETS_ASSIGN",
    "ASSETS_READY_TO_DEPLOY",
    "ASSETS_PENDING",
    "ASSETS_BROKEN",
    "ASSETS_MAINTENANCE",
    "TOOLS_ALL",
    "TOOLS_WAITING",
    "LICENSES",
    "USERS_TOOLS",
    "USERS_TAX_TOKENS",
    "USERS_LICENSES",
    "MODELS",
    "CATEGORY",
    "MANUFACTURES",
    "SUPPLIERS",
    "DEPARTMENT",
    "LOCATION",
    "TAX_TOKEN_ASSIGN",
    "REQUEST",
    "REPORT",
    "MANAGER_USER",
    "ASSETS_WAITING_CONFIRM",
    "CONSUMABLES",
    "CONSUMABLES_MAINTENANCE",
    "ACCESSORY",
    "ACCESSORY_DETAILS",
    "CONSUMABLE_DETAILS",
    "SUPPLIER_DETAILS",
    "LOCATION_DETAILS",
    "MANUFACTURES_DETAILS",
    "WEBHOOK_DETAILS",
    "ASSETS_EXPIRES",
    "TAX_TOKEN",
    "TAX_TOKEN_WAITING",
    "CLIENT_ASSETS",
    "CLIENT_ASSET_ASSIGNED",
    "CLIENT_ASSET_READY_TO_DEPLOY",
    "CLIENT_ASSET_PENDING",
    "CLIENT_ASSET_BROKEN",
    "CLIENT_ASSET_WAITING_CONFIRM",
    "CLIENT_ASSETS_EXPIRES",
    "WEBHOOK",
    "KOMU_LOGS",
    "WEBHOOK_LOGS",
    "ASSET_RENTAL_CUSTOMERS",
  ];

  const resources = useMemo(() => generateResources(t, resourceNames), [t]);

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
      <ThemeProvider>
        <ThemeWrapper>
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
                if (
                  action === "delete" ||
                  action === "edit" ||
                  action === "show"
                ) {
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
                const can = await enforcer.enforce(
                  role.admin,
                  resource,
                  action
                );
                return Promise.resolve({ can });
              },
            }}
            resources={resources}
            Title={Title}
            Header={route === DETAIL_DEVICE_ROUTE ? undefined : Header}
            Sider={route === DETAIL_DEVICE_ROUTE ? undefined : Sider}
            Footer={Footer}
            Layout={Layout}
            OffLayoutArea={OffLayoutArea}
            i18nProvider={i18nProvider}
          />
          <ScrollToTopButton />
          <div
            ref={notificationRef}
            data-test-id="notification-container"
          ></div>
          <ThemeToggle
            style={{
              position: "fixed",
              bottom: "60px",
              right: "15px",
              zIndex: 9999,
              backgroundColor: "var(--color-bg-container)",
            }}
          />
        </ThemeWrapper>
      </ThemeProvider>
    </>
  );
}

export default App;
