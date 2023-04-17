/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, CSSProperties } from "react";

import {
  useTranslate,
  useNavigation,
  usePermissions,
  useRouterContext,
} from "@pankod/refine-core";
import { AntdLayout, Menu, Grid, Icons, useMenu } from "@pankod/refine-antd";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import "../../../styles/antd.less";
import { EPermissions } from "constants/permissions";

const {
  RightOutlined,
  DashboardOutlined,
  DesktopOutlined,
  PullRequestOutlined,
  ScheduleOutlined,
  SettingOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
  InsertRowBelowOutlined,
  BlockOutlined
} = Icons;

const logo: CSSProperties = {
  height: "50px",
  left: "50%",
  position: "relative",
  transform: "translateX(-50%)",
  marginTop: "10px",
  marginBottom: "10px",
};

export const Sider: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const translate = useTranslate();
  const { menuItems, selectedKey } = useMenu();
  const { push } = useNavigation();
  const breakpoint = Grid.useBreakpoint();

  const isMobile = !breakpoint.lg;

  const { data: permissionsData } = usePermissions();

  const SubMenu = Menu.SubMenu;

  const { Link } = useRouterContext();

  return (
    <AntdLayout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      collapsedWidth={isMobile ? 0 : 80}
      breakpoint="lg"
      style={isMobile ? antLayoutSiderMobile : antLayoutSider}
    >
      {permissionsData && permissionsData.admin === EPermissions.USER && (
        <>
          <Link to="users">
            {collapsed ? (
              <img
                src={"/images/global/nccsoft-logo-small.png"}
                alt="NCC IT TOOL"
                style={logo}
              />
            ) : (
              <img
                src={"/images/global/nccsoft-logo-small.png"}
                alt="NCC IT TOOL"
                style={logo}
              />
            )}
          </Link>
        </>
      )}

      {permissionsData && permissionsData.admin === EPermissions.ADMIN && (
        <>
          <Link to="dashboard">
            {collapsed ? (
              <img
                src={"/images/global/nccsoft-logo-small.png"}
                alt="NCC IT TOOL"
                style={logo}
              />
            ) : (
              <img
                src={"/images/global/nccsoft-logo-small.png"}
                alt="NCC IT TOOL"
                style={logo}
              />
            )}
          </Link>
        </>
      )}
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
        {permissionsData && permissionsData.admin === EPermissions.ADMIN && (
          <SubMenu
            title={
              <span>
                <DashboardOutlined />
                <span>{translate("resource.dashboard")}</span>
              </span>
            }
            key={"dashboard"}
          >
            {menuItems &&
              menuItems
                .filter(
                  (item) =>
                    item.name === `${translate("resource.dashboard")}` ||
                    item.name === `${translate("resource.checkin-checkout")}`
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

        {permissionsData && permissionsData.admin === EPermissions.ADMIN && (
          <SubMenu
            title={
              <span>
                <SettingOutlined />
                <span>{translate("resource.asset")}</span>
              </span>
            }
            key={"asset"}
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
                    item.name === `${translate("resource.assets-broken")}` ||
                    item.name ===
                    `${translate("resource.assets-waiting-confirm")}` ||
                    item.name ===
                    `${translate("resource.assets-expires")}`
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

        {permissionsData && permissionsData.admin === EPermissions.ADMIN &&
          menuItems
            .filter(
              (item) => item.name === `${translate("resource.softwares")}`
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
                    name === `${translate("resource.softwares")}` ? (
                      <BlockOutlined />
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

        {permissionsData &&
          permissionsData.admin === EPermissions.ADMIN &&
          menuItems
            .filter(
              (item) => item.name === `${translate("resource.accessory")}`
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
                    name === `${translate("resource.accessory")}` ? (
                      <InsertRowBelowOutlined />
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

        {permissionsData &&
          permissionsData.admin === EPermissions.ADMIN &&
          menuItems
            .filter(
              (item) => item.name === `${translate("resource.consumables")}`
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
                    name === `${translate("resource.consumables")}` ? (
                      <CopyOutlined />
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

        {permissionsData &&
          permissionsData.admin === EPermissions.ADMIN &&
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

        {permissionsData && permissionsData.admin === EPermissions.ADMIN && (
          <SubMenu
            title={
              <span>
                <SettingOutlined />
                <span>{translate("resource.setting")}</span>
              </span>
            }
            key={"setting"}
          >
            {menuItems &&
              menuItems
                .filter(
                  (item) =>
                    item.name === `${translate("resource.model")}` ||
                    item.name === `${translate("resource.category")}` ||
                    item.name === `${translate("resource.manufactures")}` ||
                    item.name === `${translate("resource.suppliers")}` ||
                    // item.name === `${translate("resource.department")}` ||
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
          permissionsData.admin === EPermissions.ADMIN &&
          menuItems
            .filter((item) => item.name === `${translate("resource.report")}`)
            .map(({ icon, name, route }) => {
              const isSelected = route === selectedKey;
              return (
                <Menu.Item
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  key={route}
                  icon={
                    name === `${translate("resource.report")}` ? (
                      <BarChartOutlined />
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

        {permissionsData &&
          permissionsData.admin === EPermissions.USER &&
          menuItems
            .filter((item) => item.name === `${translate("resource.users")}`)
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

        {permissionsData &&
          permissionsData.admin === EPermissions.ADMIN &&
          menuItems
            .filter(
              (item) => item.name === `${translate("resource.manager_user")}`
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
                    name === `${translate("resource.manager_user")}` ? (
                      <UsergroupAddOutlined />
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
