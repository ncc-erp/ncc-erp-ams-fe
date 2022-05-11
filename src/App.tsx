import { Refine } from "@pankod/refine-core";
import { notificationProvider } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import {
  HardwareList,
  HardwareCreate,
  HardwareEdit,
  HardwareShow,
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
import { RequestList, RequestShow, RequestCreate } from "pages/request";
// import { CheckoutList } from "pages/checkout/list";
import { LoginPage } from "pages/login/login";

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
      DashboardPage={DashboardPage}
      LoginPage={LoginPage}
      resources={[
        {
          name: "Hardware",
          list: HardwareList,
          show: HardwareShow,
        },
        {
          name: "Tạo request",
          list: RequestList,
        },
        // {
        //   name: "Checkout",
        //   list: CheckoutList,
        // },
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
