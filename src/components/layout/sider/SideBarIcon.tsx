import { Icons } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import React from "react";

import { DATA_TEST_ID } from "__tests__/constants/data-test-id";

const {
  DashboardOutlined,
  DesktopOutlined,
  PullRequestOutlined,
  ScheduleOutlined,
  SettingOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
  InsertRowBelowOutlined,
  ToolOutlined,
  UsbOutlined,
  AuditOutlined,
} = Icons;

const {
  DASHBOARD_OUTLINED,
  SETTING_OUTLINED,
  TOOL_OUTLINED,
  INSERT_ROW_BELOW_OUTLINED,
  COPY_OUTLINED,
  USB_OUTLINED,
  SCHEDULE_OUTLINED,
  DESKTOP_OUTLINED,
  PULL_REQUEST_OUTLINED,
  USERGROUP_ADD_OUTLINED,
  BAR_CHART_OUTLINED,
  AUDIT_OUTLINED,
} = DATA_TEST_ID.ICONS;

type SideBarIconProps = {
  title: string;
  type: "title" | "item";
};

type IIconMap = {
  title: string;
  type: "title" | "item";
  icon: React.ReactNode;
};

export const SideBarIcon = (props: SideBarIconProps) => {
  const { title, type } = props;
  const translate = useTranslate();

  const IconMap: IIconMap[] = [
    {
      title: translate("resource.dashboard"),
      type: "title",
      icon: <DashboardOutlined data-testid={DASHBOARD_OUTLINED} />,
    },
    {
      title: translate("resource.asset"),
      type: "title",
      icon: <SettingOutlined data-testid={SETTING_OUTLINED} />,
    },
    {
      title: translate("resource.tools"),
      type: "title",
      icon: <ToolOutlined data-testid={TOOL_OUTLINED} />,
    },
    {
      title: translate("resource.accessory"),
      type: "item",
      icon: <InsertRowBelowOutlined data-testid={INSERT_ROW_BELOW_OUTLINED} />,
    },
    {
      title: translate("resource.consumable"),
      type: "title",
      icon: <CopyOutlined data-testid={COPY_OUTLINED} />,
    },
    {
      title: translate("resource.tax_token"),
      type: "title",
      icon: <UsbOutlined data-testid={USB_OUTLINED} />,
    },
    {
      title: translate("resource.users_assets"),
      type: "title",
      icon: <ScheduleOutlined data-testid={SCHEDULE_OUTLINED} />,
    },
    {
      title: translate("resource.users_assets"),
      type: "item",
      icon: <DesktopOutlined data-testid={DESKTOP_OUTLINED} />,
    },
    {
      title: translate("resource.request"),
      type: "item",
      icon: <PullRequestOutlined data-testid={PULL_REQUEST_OUTLINED} />,
    },
    {
      title: translate("resource.users"),
      type: "item",
      icon: <DesktopOutlined data-testid={DESKTOP_OUTLINED} />,
    },
    {
      title: translate("resource.users-tools"),
      type: "item",
      icon: <ToolOutlined data-testid={TOOL_OUTLINED} />,
    },
    {
      title: translate("resource.users-tax-tokens"),
      type: "item",
      icon: <UsbOutlined data-testid={USB_OUTLINED} />,
    },
    {
      title: translate("resource.setting"),
      type: "title",
      icon: <SettingOutlined data-testid={SETTING_OUTLINED} />,
    },
    {
      title: translate("resource.report"),
      type: "item",
      icon: <BarChartOutlined data-testid={BAR_CHART_OUTLINED} />,
    },
    {
      title: translate("resource.manager_user"),
      type: "item",
      icon: <UsergroupAddOutlined data-testid={USERGROUP_ADD_OUTLINED} />,
    },
    {
      title: translate("resource.client-asset"),
      type: "title",
      icon: <SettingOutlined data-testid={SETTING_OUTLINED} />,
    },
    {
      title: translate("resource.audit"),
      type: "title",
      icon: <AuditOutlined data-testid={AUDIT_OUTLINED} />,
    },
  ];

  return (
    <>
      {IconMap.find((item) => item.title === title && item.type === type)?.icon}
    </>
  );
};
