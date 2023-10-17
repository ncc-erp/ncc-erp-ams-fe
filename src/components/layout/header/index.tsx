import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useLogout,
  useNavigation,
  useTranslate,
  usePermissions,
} from "@pankod/refine-core";
import {
  AntdLayout,
  Space,
  Menu,
  Button,
  Icons,
  Avatar,
  Typography,
  // Switch,
} from "@pankod/refine-antd";
import { useGoogleLogout } from "react-google-login";
import { useState } from "react";
import dataProvider from "providers/dataProvider";
import { SYNC_USER_API } from "api/baseApi";
import { EPermissions } from "constants/permissions";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { FaMoon, FaSun } from 'react-icons/fa';
const { LogoutOutlined, SyncOutlined } = Icons;

const { Text } = Typography;

export const Header: React.FC = () => {
  const translate = useTranslate();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const currentLocale = locale();
  const { push } = useNavigation();
  const [hrmLoading, setHrmLoading] = useState(false);

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    ? process.env.REACT_APP_GOOGLE_CLIENT_ID
    : "149954872426-ga5qkfj6v6fjr98p4lbakvf8u6mgtnp6.apps.googleusercontent.com";

  const { signOut: signOutGoogle } = useGoogleLogout({
    clientId,
    cookiePolicy: "single_host_origin",
  });

  const syncHrm = () => {
    const { custom } = dataProvider;
    setHrmLoading(true);
    custom &&
      custom({
        url: SYNC_USER_API,
        method: "get",
      }).then((x) => {
        setHrmLoading(false);
      });
  };

  const logoutAccount = () => {
    signOutGoogle();
    logout();
    push("/login");
  };

  const menu = (
    <Menu selectedKeys={[currentLocale]}>
      <Menu.Item
        key="vi"
        onClick={() => changeLanguage("vi")}
        icon={
          <span style={{ marginRight: 8 }}>
            <Avatar size={16} src={`/images/flags/${"vi"}.svg`} />
          </span>
        }
      >
        {translate("lang.vi")}
      </Menu.Item>
    </Menu>
  );

  const { data: userIdentity } = useGetIdentity<string>();
  const { data: permissionsData } = usePermissions();
  // const [isDarkMode, setIsDarkMode] = useState<boolean>();
  // const { switcher, themes } = useThemeSwitcher();

  // const toggleTheme = (isChecked: boolean) => {
  //   setIsDarkMode(isChecked);
  //   switcher({ theme: isChecked ? themes.dark : themes.light });
  // };

  return (
    <AntdLayout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
        backgroundColor: "#FFF",
      }}
    >
      <Text style={{ fontWeight: "500", fontSize: "16px" }}>{userIdentity?.slice(1, userIdentity.length - 1)}</Text>
      {/* <Switch
        checkedChildren={<FaMoon style={{fontSize: "17px", paddingTop: "3px"}}/>}
        unCheckedChildren={<FaSun style={{color: "white", fontSize: "17px", paddingTop: "3px"}}/>}
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <Text style={{ fontWeight: "500", fontSize: "16px", marginLeft: "20px" }}>{userIdentity?.slice(1, userIdentity.length - 1)}</Text> */}
      {permissionsData && permissionsData.admin === EPermissions.ADMIN && (
        <Button
          type="link"
          loading={hrmLoading}
          onClick={syncHrm}
        >
          <SyncOutlined />
        </Button>
      )}

      {/* <Button type="link" onClick={() => {
        logoutAccount()
      }}>
      </Button> */}
      <Button
        type="link"
        onClick={() => {
          logoutAccount();
        }}
      >
        <LogoutOutlined />
      </Button>
      {/* <Dropdown overlay={menu}>
        <Button type="link">
          <Space>
            <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
            {currentLocale === "en"
              ? "English"
              : currentLocale === "de"
              ? "German"
              : "Vietnamese"}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown> */}
      <Space style={{ marginLeft: "8px" }}>
        {user?.name && (
          <Text ellipsis strong>
            {user.name}
          </Text>
        )}
        {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
      </Space>
    </AntdLayout.Header>
  );
};
