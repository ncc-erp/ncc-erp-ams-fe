import { AntdLayout, Grid, Menu, useMenu } from "@pankod/refine-antd";
import {
  useNavigation,
  usePermissions,
  useRouterContext,
  useTranslate,
} from "@pankod/refine-core";
import React, { CSSProperties, useState } from "react";

import { DATA_TEST_ID } from "__tests__/constants/data-test-id";
import { EPermissions } from "constants/permissions";
import "../../../styles/antd.less";
import { SideBarMenuItem } from "./SideBarMenuItem";
import { SideBarSubMenuItem } from "./SideBarSubMenuItem";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";

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
    translate("resource.asset-rental-customers"),
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
  const auditItemList = [
    translate("resource.komu_logs"),
    translate("resource.webhook_logs"),
  ];

  const userIsUser = permissionsData?.admin === EPermissions.USER;
  const userIsAdmin = permissionsData?.admin === EPermissions.ADMIN;
  const userIsBranchAdmin =
    permissionsData?.branchadmin === EPermissions.BRANCHADMIN;

  const renderMenuContent = () => (
    <>
      {permissionsData && userIsUser && (
        <>
          <Link to="users" data-testid={DATA_TEST_ID.SIDEBAR.LOGO}>
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
          <Link to="dashboard" data-testid={DATA_TEST_ID.SIDEBAR.LOGO}>
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
        data-testid={DATA_TEST_ID.SIDEBAR.MENU}
      >
        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.dashboard")}
            label=""
            menuKey={"dashboard"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={dashboardItemList}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.asset")}
            label={"assets"}
            menuKey={"asset"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={assetItemList}
          />
        )}

        {permissionsData && (userIsAdmin || userIsBranchAdmin) && (
          <SideBarSubMenuItem
            title={translate("resource.client-asset")}
            label={"client-assets"}
            menuKey={"client-asset"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={clientAssetList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.tools")}
            label={"tools"}
            menuKey={"tool"}
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
            menuKey={"consumable"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={consumableItemList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.tax_token")}
            label={"tax_token"}
            menuKey={"tax_token"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={taxTokenItemList}
          />
        )}

        {permissionsData && (
          <SideBarSubMenuItem
            title={translate("resource.users_assets")}
            label={"users"}
            menuKey={"users_assets"}
            hasItemIcon={false}
            collapsed={collapsed}
            itemList={userAssetItemList}
          />
        )}

        {permissionsData && userIsAdmin && (
          <SideBarSubMenuItem
            title={translate("resource.setting")}
            label={""}
            menuKey={"setting"}
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
            menuKey={"audit"}
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
        data-testid={DATA_TEST_ID.SIDEBAR}
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
