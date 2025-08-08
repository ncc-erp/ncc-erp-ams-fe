import { DATA_TEST_ID } from "__tests__/constants/data-test-id";

export const AntdLayout = {
  Sider: jest.fn(
    ({
      children,
      collapsed,
      onCollapse,
      collapsedWidth,
      breakpoint,
      collapsible,
      ...props
    }: any) => (
      <div {...props}>
        <button
          data-testid={DATA_TEST_ID.SIDEBAR.COLLAPSE_BUTTON}
          onClick={() => onCollapse && onCollapse(!collapsed)}
        >
          Toggle Collapse
        </button>
        {children}
      </div>
    )
  ),
};

const MenuComponent = ({
  children,
  selectedKeys,
  mode,
  onClick,
  ...props
}: any) => <div {...props}>{children}</div>;

const MenuItem = ({ children, eventKey, ...props }: any) => (
  <div data-testid={DATA_TEST_ID.SIDEBAR.MENU_ITEM} {...props}>
    {children}
  </div>
);

const SubMenu = ({ children, title, ...props }: any) => (
  <div {...props}>
    <div>{title}</div>
    {children}
  </div>
);

export const Menu = Object.assign(jest.fn(MenuComponent), {
  Item: jest.fn(MenuItem),
  SubMenu: jest.fn(SubMenu),
});

export const Grid = {
  useBreakpoint: jest.fn(() => ({ lg: true })),
};

export const useMenu = jest.fn(() => ({
  menuItems: [
    {
      name: "resource.dashboard",
      route: "/dashboard",
      label: "dashboard",
    },
    {
      name: "resource.assets",
      route: "/assets",
      label: "assets",
    },
    {
      name: "resource.report",
      route: "/report",
      label: "report",
    },
    {
      name: "resource.users",
      route: "/users",
      label: "users",
    },
  ],
  selectedKey: "/dashboard",
}));

export const Typography = {
  Title: jest.fn(({ children, level, ...props }: any) => (
    <h1 {...props}>{children}</h1>
  )),
  Text: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  Paragraph: jest.fn(({ children, ...props }: any) => (
    <p {...props}>{children}</p>
  )),
};

export const Icons = {
  DashboardOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  DesktopOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  PullRequestOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  ScheduleOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  SettingOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  BarChartOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  UsergroupAddOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  CopyOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  InsertRowBelowOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  ToolOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  UsbOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  AuditOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
  RightOutlined: jest.fn(({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  )),
};
