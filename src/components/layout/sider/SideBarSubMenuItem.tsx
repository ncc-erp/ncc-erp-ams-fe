/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Icons, IMenuItem, useMenu } from "@pankod/refine-antd";
import "../../../styles/antd.less";
import { SideBarIcon } from "./SideBarIcon";

const {
  RightOutlined,
} = Icons;

type MenuItemProps = {
  collapsed: boolean,
  itemList: string[],
  key: string,
  label: string,
  title: string,
  hasItemIcon: boolean
}

export const SideBarSubMenuItem = (props: MenuItemProps) => {
  const { itemList, key, label, title, hasItemIcon, collapsed, ...others } = props;
  const { menuItems, selectedKey } = useMenu();
  const SubMenu = Menu.SubMenu;

  const filterSideBarItems = (item: IMenuItem, label: string, filters: string[]) => {
    const checkLabel = item.options?.label === label;
    const checkName = filters.indexOf(item.name) > -1;
    if (label === "") return checkName;
    else return checkLabel && checkName;
  }

  return (
    <SubMenu
      {...others}
      title={
        <span>
          <SideBarIcon title={title} type={"title"} />
          <span>{title}</span>
        </span>
      }
      key={key}

    >
      {menuItems &&
        menuItems
          .filter(
            (item) =>
              filterSideBarItems(item, label, itemList)
          )
          .map(({ icon, name, route }) => {
            const isSelected = route === selectedKey;
            return (
              <Menu.Item
                style={{
                  fontWeight: isSelected ? "bold" : "normal"
                }}
                key={route}
                icon={hasItemIcon && <SideBarIcon title={name} type={"item"} />}
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
  )
}