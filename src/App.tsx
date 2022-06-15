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
// import { CategoryList } from "pages/categories";
// import { ManufacturesList } from "pages/manufacturers";
// import { LocationList } from "pages/location";

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
        },
        {
          name: "Tạo request",
          list: RequestList,
        },
        {
          name: "Tài sản của tôi",
          list: UserList,
        },
        // {
        //   name: "Danh mục",
        //   list: CategoryList,
        // },
        // {
        //   name: "Nhà sản xuất",
        //   list: ManufacturesList,
        // },
        // {
        //   name: "Địa phương",
        //   list: LocationList,
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
