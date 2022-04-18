import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useLogout,
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
const { LogoutOutlined } = Icons;

const { Text } = Typography;

export const Header: React.FC = () => {
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const currentLocale = locale();

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
        Vietnamese
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
      <Button type="link" onClick={() => logout() }><LogoutOutlined /></Button>
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
