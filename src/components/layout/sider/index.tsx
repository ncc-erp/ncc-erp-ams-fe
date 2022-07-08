/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import {
  useTranslate,
  useTitle,
  useNavigation,
  usePermissions,
} from "@pankod/refine-core";
import { AntdLayout, Menu, Grid, Icons, useMenu } from "@pankod/refine-antd";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import "../../../styles/antd.less";

const {
  RightOutlined,
  DashboardOutlined,
  DesktopOutlined,
  PullRequestOutlined,
  ScheduleOutlined,
  SettingOutlined,
} = Icons;

export const Sider: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const Title = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey } = useMenu();
  const { push } = useNavigation();
  const breakpoint = Grid.useBreakpoint();

  const isMobile = !breakpoint.lg;

  const { data: permissionsData } = usePermissions();

  const SubMenu = Menu.SubMenu;

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
          if (!breakpoint.lg) {
            setCollapsed(true);
          }

          push(key as string);
        }}
      >
        {permissionsData &&
          permissionsData.admin === "1" &&
          menuItems
            .filter(
              (item) => item.name === `${translate("resource.dashboard")}`
            )
            .map(({ icon, name, route }) => {
              const isSelected = route === selectedKey;
              return (
                <Menu.Item
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  key={route}
                  icon={
                    name === `${translate("resource.dashboard")}` ? (
                      <DashboardOutlined />
                    ) : (
                      ""
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {name}
                    {!collapsed && isSelected && <RightOutlined />}
                  </div>
                </Menu.Item>
              );
            })}

        {permissionsData && permissionsData.admin === "1" && (
          <SubMenu
            title={
              <span>
                <SettingOutlined />
                <span>{translate("resource.assets")}</span>
              </span>
            }
          >
            {menuItems &&
              menuItems
                .filter(
                  (item) =>
                    item.name === `${translate("resource.assets")}` ||
                    item.name === `${translate("resource.assets-assign")}` ||
                    item.name ===
                      `${translate("resource.assets-readyToDeploy")}` ||
                    item.name === `${translate("resource.assets-pending")}` ||
                    item.name === `${translate("resource.assets-broken")}`
                )
                .map(({ icon, name, route }) => {
                  const isSelected = route === selectedKey;
                  return (
                    <Menu.Item
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                      key={route}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {name}
                        {!collapsed && isSelected && <RightOutlined />}
                      </div>
                    </Menu.Item>
                  );
                })}
          </SubMenu>
        )}

        {permissionsData &&
          permissionsData.admin === "1" &&
          menuItems
            .filter(
              (item) =>
                item.name === `${translate("resource.request")}` ||
                item.name === `${translate("resource.users")}`
            )
            .map(({ icon, name, route }) => {
              const isSelected = route === selectedKey;
              return (
                <Menu.Item
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  key={route}
                  icon={
                    name === `${translate("resource.assets")}` ? (
                      <DesktopOutlined />
                    ) : name === `${translate("resource.request")}` ? (
                      <PullRequestOutlined />
                    ) : name === `${translate("resource.users")}` ? (
                      <ScheduleOutlined />
                    ) : (
                      ""
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {name}
                    {!collapsed && isSelected && <RightOutlined />}
                  </div>
                </Menu.Item>
              );
            })}

        {permissionsData && permissionsData.admin === "1" && (
          <SubMenu
            title={
              <span>
                <SettingOutlined />
                <span>{translate("resource.setting")}</span>
              </span>
            }
          >
            {menuItems &&
              menuItems
                .filter(
                  (item) =>
                    item.name === `${translate("resource.model")}` ||
                    item.name === `${translate("resource.category")}` ||
                    item.name === `${translate("resource.manufactures")}` ||
                    item.name === `${translate("resource.suppliers")}` ||
                    item.name === `${translate("resource.department")}` ||
                    item.name === `${translate("resource.location")}`
                )
                .map(({ icon, name, route }) => {
                  const isSelected = route === selectedKey;
                  return (
                    <Menu.Item
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                      key={route}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {name}
                        {!collapsed && isSelected && <RightOutlined />}
                      </div>
                    </Menu.Item>
                  );
                })}
          </SubMenu>
        )}

        {permissionsData &&
          permissionsData.admin === "0" &&
          menuItems
            .filter(
              (item) =>
                item.name === `${translate("resource.dashboard")}` ||
                item.name === `${translate("resource.users")}`
            )
            .map(({ icon, name, route }) => {
              const isSelected = route === selectedKey;
              return (
                <Menu.Item
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  key={route}
                  icon={
                    name === `${translate("resource.dashboard")}` ? (
                      <DashboardOutlined />
                    ) : name === `${translate("resource.users")}` ? (
                      <ScheduleOutlined />
                    ) : (
                      ""
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {name}
                    {!collapsed && isSelected && <RightOutlined />}
                  </div>
                </Menu.Item>
              );
            })}
      </Menu>
    </AntdLayout.Sider>
  );
};
