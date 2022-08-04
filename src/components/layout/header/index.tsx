import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useLogout,
  useNavigation,
  useTranslate,
} from "@pankod/refine-core";
import {
  AntdLayout,
  Space,
  Menu,
  Button,
  Icons,
  Avatar,
  Typography,
} from "@pankod/refine-antd";
import { useGoogleLogout } from "react-google-login";

const { LogoutOutlined } = Icons;

const { Text } = Typography;

export const Header: React.FC = () => {
  const translate = useTranslate()
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const currentLocale = locale();
  const { push } = useNavigation();

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    ? process.env.REACT_APP_GOOGLE_CLIENT_ID
    : "149954872426-ga5qkfj6v6fjr98p4lbakvf8u6mgtnp6.apps.googleusercontent.com";

  const { signOut: signOutGoogle } = useGoogleLogout({
    clientId,
    cookiePolicy: "single_host_origin",
  });

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
      <Button type="link" onClick={() => {
        logoutAccount()
      }}>
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
