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
import { IoQrCodeSharp } from "react-icons/io5";
import { useGoogleLogout } from "react-google-login";
import { useEffect, useState } from "react";
import dataProvider from "providers/dataProvider";
import { SYNC_USER_API } from "api/baseApi";
import { EPermissions } from "constants/permissions";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { FaMoon, FaSun } from "react-icons/fa";
import { MModal } from "components/Modal/MModal";
import { Scanner } from "pages/hardware/scanner";
import "../../../styles/qr-code.less";
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
  const [isShowModalScan, setIsShowModalScan] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: permissionsData } = usePermissions();
  useEffect(() => {
    if (permissionsData?.admin === EPermissions.ADMIN) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [permissionsData]);

  const syncHrm = () => {
    const { custom } = dataProvider;
    setHrmLoading(true);
    if (custom) {
      custom({
        url: SYNC_USER_API,
        method: "get",
      }).then((x) => {
        setHrmLoading(false);
      });
    }
  };

  const logoutAccount = () => {
    // signOutGoogle();
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
  // const [isDarkMode, setIsDarkMode] = useState<boolean>();
  // const { switcher, themes } = useThemeSwitcher();

  // const toggleTheme = (isChecked: boolean) => {
  //   setIsDarkMode(isChecked);
  //   switcher({ theme: isChecked ? themes.dark : themes.light });
  // };

  const handleScanQR = () => {
    setIsShowModalScan(true);
  };
  return (
    <>
      {isShowModalScan && (
        <MModal
          title={"Scan QR"}
          setIsModalVisible={setIsShowModalScan}
          isModalVisible={isShowModalScan}
        >
          <Scanner />
        </MModal>
      )}
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
        {isAdmin && (
          <>
            <IoQrCodeSharp
              className="qr-icon"
              style={{
                marginRight: "25px",
                backgroundColor: "none",
                border: "none",
              }}
              size={45}
              onClick={handleScanQR}
            />
          </>
        )}
        <Text
          data-test-id="username"
          style={{ fontWeight: "500", fontSize: "16px" }}
        >
          {userIdentity?.slice(1, userIdentity.length - 1)}
        </Text>
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
            data-test-id="sync-hrm-btn"
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
          data-test-id="logout-btn"
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
    </>
  );
};
