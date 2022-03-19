import { Refine } from "@pankod/refine-core";
import { notificationProvider, LoginPage } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "styles/antd.less";
import dataProvider from "@pankod/refine-simple-rest";
import { authProvider } from "./authProvider";
import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";
import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import { useTranslation } from "react-i18next";

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
      dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
      authProvider={authProvider}
      LoginPage={LoginPage}
      resources={[
        {
          name: "posts",
          list: PostList,
          create: PostCreate,
          edit: PostEdit,
          show: PostShow,
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
