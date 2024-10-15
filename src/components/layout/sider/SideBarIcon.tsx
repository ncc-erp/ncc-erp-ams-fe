import { useTranslate } from "@pankod/refine-core";
import { Icons } from "@pankod/refine-antd";
import React from "react";
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
} = Icons;

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
      icon: <DashboardOutlined />,
    },
    {
      title: translate("resource.asset"),
      type: "title",
      icon: <SettingOutlined />,
    },
    {
      title: translate("resource.tools"),
      type: "title",
      icon: <ToolOutlined />,
    },
    {
      title: translate("resource.accessory"),
      type: "item",
      icon: <InsertRowBelowOutlined />,
    },
    {
      title: translate("resource.consumables"),
      type: "item",
      icon: <CopyOutlined />,
    },
    {
      title: translate("resource.tax_token"),
      type: "title",
      icon: <UsbOutlined />,
    },
    {
      title: translate("resource.users_assets"),
      type: "title",
      icon: <ScheduleOutlined />,
    },
    {
      title: translate("resource.users_assets"),
      type: "item",
      icon: <DesktopOutlined />,
    },
    {
      title: translate("resource.request"),
      type: "item",
      icon: <PullRequestOutlined />,
    },
    {
      title: translate("resource.users"),
      type: "item",
      icon: <DesktopOutlined />,
    },
    {
      title: translate("resource.users-tools"),
      type: "item",
      icon: <ToolOutlined />,
    },
    {
      title: translate("resource.users-tax-tokens"),
      type: "item",
      icon: <UsbOutlined />,
    },
    {
      title: translate("resource.setting"),
      type: "title",
      icon: <SettingOutlined />,
    },
    {
      title: translate("resource.report"),
      type: "item",
      icon: <BarChartOutlined />,
    },
    {
      title: translate("resource.manager_user"),
      type: "item",
      icon: <UsergroupAddOutlined />,
    },
    {
      title: translate("resource.client-asset"),
      type: "title",
      icon: <SettingOutlined />,
    },
  ];
  return (
    <>
      {IconMap.find((item) => item.title === title && item.type === type)?.icon}
    </>
  );
};
