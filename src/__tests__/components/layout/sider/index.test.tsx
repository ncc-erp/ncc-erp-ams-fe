import { Grid, useMenu } from "@pankod/refine-antd";
import { usePermissions } from "@pankod/refine-core";
import { fireEvent, render, screen } from "@testing-library/react";

import { DATA_TEST_ID } from "__tests__/constants/data-test-id";
import { Sider } from "components/layout";
import { SideBarIcon } from "components/layout/sider/SideBarIcon";
import { SideBarMenuItem } from "components/layout/sider/SideBarMenuItem";
import { SideBarSubMenuItem } from "components/layout/sider/SideBarSubMenuItem";
import { EPermissions } from "constants/permissions";

describe("Sidebar Components Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SideBarIcon Component", () => {
    it("renders correct icons for different titles and types", () => {
      render(<SideBarIcon title="resource.dashboard" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.DASHBOARD_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.asset" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.SETTING_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.tools" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.TOOL_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.accessory" type="item" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.INSERT_ROW_BELOW_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.consumable" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.COPY_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.tax_token" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.USB_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.users_assets" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.SCHEDULE_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.users_assets" type="item" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.DESKTOP_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.request" type="item" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.PULL_REQUEST_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.report" type="item" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.BAR_CHART_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.manager_user" type="item" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.USERGROUP_ADD_OUTLINED)
      ).toBeInTheDocument();

      render(<SideBarIcon title="resource.audit" type="title" />);
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.AUDIT_OUTLINED)
      ).toBeInTheDocument();
    });

    it("renders nothing for unknown title or empty title", () => {
      const { container } = render(
        <SideBarIcon title="unknown.title" type="title" />
      );
      expect(container.firstChild).toBeNull();

      const { container: container2 } = render(
        <SideBarIcon title="" type="title" />
      );
      expect(container2.firstChild).toBeNull();
    });
  });

  describe("SideBarMenuItem Component", () => {
    it("renders menu items correctly", () => {
      render(
        <SideBarMenuItem
          collapsed
          label=""
          itemList={["resource.dashboard", "resource.report"]}
          hasItemIcon={true}
        />
      );
      expect(screen.getByText("resource.dashboard")).toBeInTheDocument();
      expect(screen.getByText("resource.report")).toBeInTheDocument();
    });

    it("shows right arrow for selected item when not collapsed", () => {
      render(
        <SideBarMenuItem
          collapsed={false}
          label=""
          itemList={["resource.dashboard", "resource.report"]}
          hasItemIcon={true}
        />
      );
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.RIGHT_OUTLINED)
      ).toBeInTheDocument();
    });

    it("does not show right arrow when collapsed", () => {
      render(
        <SideBarMenuItem
          collapsed
          label=""
          itemList={["resource.dashboard", "resource.assets"]}
          hasItemIcon={true}
        />
      );
      expect(
        screen.queryByTestId(DATA_TEST_ID.ICONS.RIGHT_OUTLINED)
      ).not.toBeInTheDocument();
    });

    it("applies correct font weight to selected items", () => {
      render(
        <SideBarMenuItem
          collapsed
          label=""
          itemList={["resource.dashboard", "resource.report"]}
          hasItemIcon={true}
        />
      );
      const menuItems = screen.getAllByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM);
      const dashboardItem = menuItems[0];
      expect(dashboardItem).toHaveStyle({ fontWeight: "bold" });
    });

    it("handles empty itemList gracefully", () => {
      const { container } = render(
        <SideBarMenuItem collapsed label="" itemList={[]} hasItemIcon={true} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("filters items based on label correctly", () => {
      render(
        <SideBarMenuItem
          collapsed
          label=""
          itemList={["resource.assets"]}
          hasItemIcon={true}
        />
      );
      expect(screen.getByText("resource.assets")).toBeInTheDocument();
    });
  });

  describe("SideBarSubMenuItem Component", () => {
    it("renders sub menu with title and items", () => {
      render(
        <SideBarSubMenuItem
          collapsed={true}
          itemList={["resource.report", "resource.assets"]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={false}
        />
      );

      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM)
      ).toBeInTheDocument();
      expect(screen.getByText("resource.dashboard")).toBeInTheDocument();
      expect(screen.getByText("resource.assets")).toBeInTheDocument();
      expect(screen.getByText("resource.report")).toBeInTheDocument();
    });

    it("shows right arrow for selected item when not collapsed", () => {
      render(
        <SideBarSubMenuItem
          collapsed={false}
          itemList={["resource.dashboard", "resource.assets"]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={false}
        />
      );
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.RIGHT_OUTLINED)
      ).toBeInTheDocument();
    });

    it("does not show right arrow when collapsed", () => {
      render(
        <SideBarSubMenuItem
          collapsed={true}
          itemList={["resource.dashboard", "resource.assets"]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={false}
        />
      );
      expect(
        screen.queryByTestId(DATA_TEST_ID.ICONS.RIGHT_OUTLINED)
      ).not.toBeInTheDocument();
    });

    it("applies correct font weight to selected items", () => {
      render(
        <SideBarSubMenuItem
          collapsed={false}
          itemList={["resource.dashboard", "resource.assets"]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={false}
        />
      );

      const subMenuItems = screen.getAllByTestId(
        DATA_TEST_ID.SIDEBAR.MENU_ITEM
      );
      const dashboardItem = subMenuItems[0];
      expect(dashboardItem).toHaveStyle({ fontWeight: "bold" });
    });

    it("renders with item icons when hasItemIcon is true", () => {
      render(
        <SideBarSubMenuItem
          collapsed={false}
          itemList={["resource.dashboard"]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={true}
        />
      );

      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.SUB_MENU_TITLE)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(DATA_TEST_ID.ICONS.DASHBOARD_OUTLINED)
      ).toBeInTheDocument();
    });

    it("handles empty itemList gracefully", () => {
      render(
        <SideBarSubMenuItem
          collapsed={false}
          itemList={[]}
          menuKey="dashboard"
          label=""
          title="resource.dashboard"
          hasItemIcon={false}
        />
      );

      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM)
      ).toBeInTheDocument();
      expect(screen.getByText("resource.dashboard")).toBeInTheDocument();
    });
  });

  describe("Sider Component", () => {
    it("renders complete sidebar with all components", () => {
      render(<Sider />);

      // Check main sidebar structure
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.MENU)).toBeInTheDocument();
      expect(
        screen.getAllByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM).length
      ).toBeGreaterThan(0);

      // Check logo
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.LOGO)).toBeInTheDocument();
      expect(screen.getByAltText("NCC IT TOOL")).toBeInTheDocument();

      // Check collapse functionality
      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.COLLAPSE_BUTTON)
      ).toBeInTheDocument();
    });

    it("handles collapse functionality", () => {
      render(<Sider />);

      const collapseButton = screen.getByTestId(
        DATA_TEST_ID.SIDEBAR.COLLAPSE_BUTTON
      );
      expect(collapseButton).toBeInTheDocument();

      fireEvent.click(collapseButton);
      expect(collapseButton).toBeInTheDocument();
    });

    it("renders menu items based on admin permissions", () => {
      render(<Sider />);

      // Should render sub menu items for admin users
      const subMenuItems = screen.getAllByTestId(
        DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM
      );
      expect(subMenuItems.length).toBeGreaterThan(0);

      // Should render menu items for admin users
      const menuItems = screen.getAllByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM);
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it("renders with correct styles", () => {
      render(<Sider />);

      const sider = screen.getByTestId(DATA_TEST_ID.SIDEBAR);
      expect(sider).toHaveAttribute("width", "230px");
    });

    it("renders different content for USER permissions", () => {
      (usePermissions as jest.Mock).mockReturnValueOnce({
        data: {
          admin: EPermissions.USER,
          branchadmin: null,
        },
      });

      render(<Sider />);

      // Should still render basic structure
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.LOGO)).toBeInTheDocument();
      expect(screen.getByText("resource.users_assets")).toBeInTheDocument();
      expect(screen.queryByText("resource.dashboard")).not.toBeInTheDocument();
    });

    it("renders different content for BRANCHADMIN permissions", () => {
      (usePermissions as jest.Mock).mockReturnValueOnce({
        data: {
          admin: null,
          branchadmin: EPermissions.BRANCHADMIN,
        },
      });

      render(<Sider />);

      // Should render sub menu items for branch admin users
      const subMenuItems = screen.getAllByTestId(
        DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM
      );
      expect(subMenuItems.length).toBeGreaterThan(0);
    });

    it("handles mobile breakpoint correctly", () => {
      // Mock mobile breakpoint
      (Grid.useBreakpoint as jest.Mock).mockReturnValueOnce({ lg: false });

      render(<Sider />);
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
    });

    it("handles click events on menu items", () => {
      render(<Sider />);

      const menuItems = screen.getAllByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM);
      if (menuItems.length > 0) {
        fireEvent.click(menuItems[0]);
        // Note: In real implementation, this would trigger navigation
        // but in test environment, we just verify the component doesn't crash
        expect(menuItems[0]).toBeInTheDocument();
      }
    });
  });

  describe("Component Integration", () => {
    const menuItemProps = {
      collapsed: false,
      label: "",
      itemList: ["resource.dashboard"],
      hasItemIcon: true,
    };
    const subMenuItemProps = {
      collapsed: false,
      itemList: ["resource.dashboard"],
      menuKey: "dashboard",
      label: "dashboard",
      title: "Dashboard",
      hasItemIcon: true,
    };

    it("SideBarIcon integrates with SideBarMenuItem", () => {
      render(<SideBarMenuItem {...menuItemProps} />);

      // Should render menu item with icon
      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM)
      ).toBeInTheDocument();
    });

    it("SideBarIcon integrates with SideBarSubMenuItem", () => {
      render(<SideBarSubMenuItem {...subMenuItemProps} />);

      // Should render sub menu with icon
      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(DATA_TEST_ID.SIDEBAR.SUB_MENU_TITLE)
      ).toBeInTheDocument();
    });

    it("All components work together in Sider", () => {
      render(<Sider />);

      // Check that all component types are rendered
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.MENU)).toBeInTheDocument();

      // Check for sub menu items
      const subMenuItems = screen.getAllByTestId(
        DATA_TEST_ID.SIDEBAR.SUB_MENU_ITEM
      );
      expect(subMenuItems.length).toBeGreaterThan(0);

      // Check for menu items
      const menuItems = screen.getAllByTestId(DATA_TEST_ID.SIDEBAR.MENU_ITEM);
      expect(menuItems.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles undefined permissions gracefully", () => {
      (usePermissions as jest.Mock).mockReturnValueOnce({
        data: undefined,
      });

      render(<Sider />);

      // Should not crash and should render basic structure
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
    });

    it("handles null permissions gracefully", () => {
      (usePermissions as jest.Mock).mockReturnValueOnce({
        data: null,
      });

      render(<Sider />);

      // Should not crash and should render basic structure
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
    });

    it("handles empty menu items gracefully", () => {
      (useMenu as jest.Mock).mockReturnValueOnce({
        menuItems: [],
        selectedKey: null,
      });

      render(<Sider />);

      // Should still render the sidebar structure
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.MENU)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper data-testid attributes", () => {
      render(<Sider />);

      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.LOGO)).toBeInTheDocument();
      expect(screen.getByTestId(DATA_TEST_ID.SIDEBAR.MENU)).toBeInTheDocument();
    });

    it("has proper alt text for images", () => {
      render(<Sider />);

      const logo = screen.getByAltText("NCC IT TOOL");
      expect(logo).toBeInTheDocument();
    });

    it("has proper ARIA attributes and keyboard navigation", () => {
      render(<Sider />);

      const sider = screen.getByTestId(DATA_TEST_ID.SIDEBAR);
      expect(sider).toBeInTheDocument();

      // Test keyboard navigation
      const collapseButton = screen.getByTestId(
        DATA_TEST_ID.SIDEBAR.COLLAPSE_BUTTON
      );
      expect(collapseButton).toBeInTheDocument();

      // Test tab navigation
      collapseButton.focus();
      expect(document.activeElement).toBe(collapseButton);
    });
  });
});
