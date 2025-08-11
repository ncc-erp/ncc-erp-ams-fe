import { Icons, IMenuItem, Menu, useMenu } from "@pankod/refine-antd";

import { DATA_TEST_ID } from "__tests__/constants/data-test-id";
import "../../../styles/antd.less";
import { SideBarIcon } from "./SideBarIcon";

const { RightOutlined } = Icons;

type MenuItemProps = {
  collapsed: boolean;
  itemList: string[];
  menuKey: string;
  label: string;
  title: string;
  hasItemIcon: boolean;
};

export const SideBarSubMenuItem = (props: MenuItemProps) => {
  const { itemList, menuKey, label, title, hasItemIcon, collapsed, ...others } =
    props;
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
    <Menu.SubMenu
      {...others}
      title={
        <span data-testid={DATA_TEST_ID.SIDEBAR.SUB_MENU_TITLE}>
          <SideBarIcon title={title} type={"title"} />
          <span>{title}</span>
        </span>
      }
      key={menuKey}
      data-testid={DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM}
    >
      {menuItems &&
        menuItems
          .filter((item) => filterSideBarItems(item, label, itemList))
          .map(({ name, route }) => {
            const isSelected = route === selectedKey;
            return (
              <Menu.Item
                style={{
                  fontWeight: isSelected ? "bold" : "normal",
                }}
                key={route}
                icon={
                  hasItemIcon ? (
                    <SideBarIcon title={name} type={"item"} />
                  ) : undefined
                }
                data-testid={DATA_TEST_ID.SIDEBAR.MENU_ITEM}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {name}
                  {!collapsed && isSelected && (
                    <RightOutlined
                      data-testid={DATA_TEST_ID.ICONS.RIGHT_OUTLINED}
                    />
                  )}
                </div>
              </Menu.Item>
            );
          })}
    </Menu.SubMenu>
  );
};
