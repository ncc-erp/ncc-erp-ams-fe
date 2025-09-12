import { Menu, Icons, useMenu, IMenuItem } from "@pankod/refine-antd";
import "../../../styles/antd.less";
import { SideBarIcon } from "./SideBarIcon";
import {
  menuItemInnerStyles,
  menuItemStyles,
} from "components/layout/sider/styles";

const { RightOutlined } = Icons;

type MenuItemProps = {
  collapsed: boolean;
  label: string;
  itemList: string[];
  hasItemIcon: boolean;
};

export const SideBarMenuItem = (props: MenuItemProps) => {
  const { label, itemList, collapsed, hasItemIcon, ...others } = props;
  const { menuItems, selectedKey } = useMenu();
  const filterSideBarItems = (
    item: IMenuItem,
    label: string,
    filters: string[]
  ) => {
    const checkLabel = item.options?.label === label;
    const checkName = filters.indexOf(item.name) > -1;
    if (label === "") return checkName;
    else return checkLabel && checkName;
  };
  return (
    <>
      {menuItems
        .filter((item) => filterSideBarItems(item, label, itemList))
        .map(({ name, route }) => {
          const isSelected = route === selectedKey;
          return (
            <Menu.Item
              {...others}
              style={menuItemStyles(isSelected)}
              key={route}
              eventKey={route}
              icon={<SideBarIcon title={name} type={"item"} />}
            >
              <div style={menuItemInnerStyles} data-test-id="menu-item">
                {name}
                {!collapsed && isSelected && <RightOutlined />}
              </div>
            </Menu.Item>
          );
        })}
    </>
  );
};
