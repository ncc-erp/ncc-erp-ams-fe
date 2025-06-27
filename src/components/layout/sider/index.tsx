import React, { useState, CSSProperties } from "react";

import {
  useTranslate,
  useNavigation,
  usePermissions,
  useRouterContext,
} from "@pankod/refine-core";
import { AntdLayout, Menu, Grid, useMenu } from "@pankod/refine-antd";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import "../../../styles/antd.less";
import { EPermissions } from "constants/permissions";
import { SideBarSubMenuItem } from "./SideBarSubMenuItem";
import { SideBarMenuItem } from "./SideBarMenuItem";

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
  const { selectedKey } = useMenu();
  const { push } = useNavigation();
  const breakpoint = Grid.useBreakpoint();

  const isMobile = !breakpoint.lg;

  const { data: permissionsData } = usePermissions();

  const { Link } = useRouterContext();

  const dashboardItemList = [
    translate("resource.dashboard"),
    translate("resource.checkin-checkout"),
  ];

  const assetItemList = [
    translate("resource.assets"),
    translate("resource.assets-assign"),
    translate("resource.assets-readyToDeploy"),
    translate("resource.assets-pending"),
    translate("resource.assets-broken"),
    translate("resource.assets-waiting-confirm"),
    translate("resource.assets-expires"),
    translate("resource.assets-maintenance"),
  ];

  const toolItemList = [
    translate("resource.tools-all"),
    translate("resource.tools-waiting"),
  ];

  const consumableItemList = [
    translate("resource.consumables"),
    translate("resource.consumables-maintenance"),
  ];

  const accessoryItemList = [translate("resource.accessory")];

  const taxTokenItemList = [
    translate("resource.tax_token"),
    translate("resource.tax_token_assign"),
    translate("resource.tax_token_waiting"),
  ];

  const settingItemList = [
    translate("resource.model"),
    translate("resource.category"),
    translate("resource.manufactures"),
    translate("resource.suppliers"),
    translate("resource.location"),
    translate("resource.webhook"),
  ];

  const userAssetItemList = [
    translate("resource.users"),
    translate("resource.users_licenses"),
    translate("resource.users-tools"),
    translate("resource.users-tax-tokens"),
    translate("resource.request"),
  ];

  const reportItemList = [translate("resource.report")];

  const userManagerList = [translate("resource.manager_user")];

  const clientAssetList = [
    translate("resource.client-assets"),
    translate("resource.client-asset-assigned"),
    translate("resource.client-asset-readyToDeploy"),
    translate("resource.client-asset-pending"),
    translate("resource.client-asset-broken"),
    translate("resource.client-asset-waitingConfirm"),
    translate("resource.client-asset-expires"),
  ];
  const auditItemList = [translate("resource.komu_logs")];

  const userIsUser = permissionsData?.admin === EPermissions.USER;
  const userIsAdmin = permissionsData?.admin === EPermissions.ADMIN;
  const userIsBranchAdmin =
    permissionsData?.branchadmin === EPermissions.BRANCHADMIN;

  const renderMenuContent = () => (
    <>
      {permissionsData && userIsUser && (
        <>
          <Link to="users" data-test-id="logo">
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

      {permissionsData && userIsAdmin && (
        <>
          <Link to="dashboard" data-test-id="logo">
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
        data-test-id="menu"
      >
        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.dashboard")}
            label=""
            key={"dashboard"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={dashboardItemList}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.asset")}
            label={"assets"}
            key={"asset"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={assetItemList}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.client-asset")}
            label={"client-assets"}
            key={"client-asset"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={clientAssetList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.tools")}
            label={"tools"}
            key={"tool"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={toolItemList}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarMenuItem
            collapsed={collapsed}
            label={""}
            hasItemIcon={true}
            itemList={accessoryItemList}
            key={"accessory-menu"}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.consumable")}
            label={"consumables"}
            key={"consumable"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={consumableItemList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.tax_token")}
            label={"tax_token"}
            key={"tax_token"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={taxTokenItemList}
          />
        )}

        {permissionsData && (
          <SideBarSubMenuItem
            title={translate("resource.users_assets")}
            label={"users"}
            key={"users_assets"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={userAssetItemList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.setting")}
            label={""}
            key={"setting"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={settingItemList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarMenuItem
            collapsed={collapsed}
            label={""}
            hasItemIcon={true}
            itemList={reportItemList}
            key={"report-menu"}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarMenuItem
            collapsed={collapsed}
            label={""}
            hasItemIcon={true}
            itemList={userManagerList}
            key={"user-manager-menu"}
          />
        )}
        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.audit")}
            label={""}
            key={"audit"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={auditItemList}
          />
        )}
      </Menu>
    </>
  );

  return (
    <>
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 998,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      <AntdLayout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="lg"
        style={isMobile ? antLayoutSiderMobile : antLayoutSider}
        width="230px"
        className="custom-overflow-y"
        data-test-id="sidebar"
      >
        {isMobile ? (
          <div style={{ height: "100%", display: "flex" }}>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
              }}
              className="sider-overflow-y"
            >
              {renderMenuContent()}
            </div>
          </div>
        ) : (
          renderMenuContent()
        )}
      </AntdLayout.Sider>
    </>
  );
};
