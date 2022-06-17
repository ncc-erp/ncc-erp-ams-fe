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

interface IHeaderProps {
  setIsReloadPermission: () => void
}

export const Header: React.FC<IHeaderProps> = ({ setIsReloadPermission }) => {
  const translate = useTranslate()
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const currentLocale = locale();
  const { push } = useNavigation();

  const clientId = process.env.GOOGLE_CLIENT_ID
    ? process.env.GOOGLE_CLIENT_ID
    : "149954872426-ga5qkfj6v6fjr98p4lbakvf8u6mgtnp6.apps.googleusercontent.com";

  const { signOut: signOutGoogle } = useGoogleLogout({
    clientId,
    cookiePolicy: "single_host_origin",
  });

  const logoutAccount = () => {
    signOutGoogle();
    logout();
    push("/login")
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
      <Button type="link" onClick={() => {
        logoutAccount()
        setIsReloadPermission()
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
