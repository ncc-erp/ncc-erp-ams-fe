import React, { useState } from "react";

import {
  useTranslate,
  useLogout,
  useTitle,
  useNavigation,
  usePermissions,
} from "@pankod/refine-core";
import { AntdLayout, Menu, Grid, Icons, useMenu } from "@pankod/refine-antd";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import { useGoogleLogout } from "react-google-login";

const { RightOutlined, LogoutOutlined } = Icons;

export const Sider: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { mutate: logout } = useLogout();
  const Title = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey } = useMenu();
  const { push } = useNavigation();
  const breakpoint = Grid.useBreakpoint();

  const isMobile = !breakpoint.lg;

  const clientId = process.env.GOOGLE_CLIENT_ID
    ? process.env.GOOGLE_CLIENT_ID
    : "";

  const { signOut: signOutGoogle } = useGoogleLogout({
    clientId,
    cookiePolicy: "single_host_origin",
  });

  const logoutAccount = () => {
    signOutGoogle();
    logout();
    push("/login");
  };

  const { data: permissionsData } = usePermissions();

  return (
    <AntdLayout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      collapsedWidth={isMobile ? 0 : 80}
      breakpoint="lg"
      style={isMobile ? antLayoutSiderMobile : antLayoutSider}
    >
      {Title && <Title collapsed={collapsed} />}
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        onClick={({ key }) => {
          if (key === "logout") {
            logoutAccount();
            return;
          }

          if (!breakpoint.lg) {
            setCollapsed(true);
          }

          push(key as string);
        }}
      >
        {(permissionsData && permissionsData.admin === "1") ? (menuItems.map(({ icon, label, route }) => {
          const isSelected = route === selectedKey;
          return (
            <Menu.Item
              style={{
                fontWeight: isSelected ? "bold" : "normal",
              }}
              key={route}
              icon={icon}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {label}
                {!collapsed && isSelected && <RightOutlined />}
              </div>
            </Menu.Item>
          );
        })) : (
          menuItems.filter((item) =>
            item.name === `${translate('resource.dashboard')}` || item.name === `${translate('resource.users')}`
          ).map(({ icon, label, route }) => {
            const isSelected = route === selectedKey;
            return (
              <Menu.Item
                style={{
                  fontWeight: isSelected ? "bold" : "normal",
                }}
                key={route}
                icon={icon}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {label}
                  {!collapsed && isSelected && <RightOutlined />}
                </div>
              </Menu.Item>
            );
          })
        )}

      </Menu >
    </AntdLayout.Sider >
  );
};
