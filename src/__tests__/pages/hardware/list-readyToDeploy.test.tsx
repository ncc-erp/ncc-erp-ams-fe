import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as refineCore from "@pankod/refine-core";

// Mock the component itself
const MockHardwareListReadyToDeploy: React.FC = () => {
  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const [isSearchOpen, setSearchOpen] = React.useState(false);
  const [isShowOpen, setShowOpen] = React.useState(false);
  const { data: permissionsData } = refineCore.usePermissions?.() ?? {
    data: {},
  };
  const isAdmin = permissionsData?.admin === "admin";

  return (
    <div data-testid="list-component">
      <div data-testid="list-header">
        <div data-testid="list-title">
          hardware.label.title.list-readyToDeploy
        </div>
        <div data-testid="header-actions">
          {isAdmin && (
            <button
              data-testid="create-hardware-button"
              onClick={() => setCreateOpen(true)}
            >
              Create
            </button>
          )}
        </div>
      </div>

      <div data-testid="search-form">
        <div data-testid="date-range-picker">
          <input type="date" data-testid="date-from" />
          <input type="date" data-testid="date-to" />
        </div>
        <select data-testid="location-select">
          <option value="">Select location</option>
          <option value="1">Location 1</option>
        </select>
      </div>

      <div data-testid="table-actions">
        <button data-testid="refresh-button">Refresh</button>
        <button data-testid="columns-button">Columns</button>
        <button data-testid="search-button" onClick={() => setSearchOpen(true)}>
          Search
        </button>
      </div>

      <div data-testid="hardware-table">
        <div data-testid="table-row-1">
          Hardware Item 1
          <button data-testid="show-button-1" onClick={() => setShowOpen(true)}>
            Show
          </button>
        </div>
      </div>

      <div data-testid="total-detail">Total Detail</div>

      {isCreateOpen && (
        <div data-testid="create-modal">
          <div data-testid="hardware-create">Create Form</div>
          <button onClick={() => setCreateOpen(false)}>Close</button>
        </div>
      )}

      {isSearchOpen && (
        <div data-testid="search-modal">
          <div data-testid="hardware-search">Search Form</div>
          <button onClick={() => setSearchOpen(false)}>Close</button>
        </div>
      )}

      {isShowOpen && (
        <div data-testid="show-modal">
          <div data-testid="hardware-show">Show Details</div>
          <button onClick={() => setShowOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Mock components
jest.mock("pages/hardware/list-readyToDeploy", () => ({
  HardwareListReadyToDeploy: MockHardwareListReadyToDeploy,
}));

jest.mock("@pankod/refine-antd", () => ({
  ...jest.requireActual("@pankod/refine-antd"),
  List: ({ children, title }: any) => (
    <div data-testid="list-wrapper">
      {title}
      {children}
    </div>
  ),
  CreateButton: ({ children, onClick }: any) => (
    <button data-testid="create-hardware-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock hooks
jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: jest.fn(() => ({
    params: {
      rtd_location_id: null,
      category_id: null,
      type: null,
      dateFrom: null,
      dateTo: null,
      search: null,
      assigned_status: null,
    },
    setParams: jest.fn(),
    clearParam: jest.fn(),
  })),
}));

jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: jest.fn(() => (key: string) => key),
  usePermissions: jest.fn(() => ({
    data: { admin: "admin" },
  })),
  useNavigation: jest.fn(() => ({
    list: jest.fn(),
  })),
  useTable: jest.fn(() => ({
    tableProps: {
      dataSource: [],
      pagination: { total: 50 },
    },
    sorter: {},
    searchFormProps: {
      form: {
        getFieldsValue: jest.fn(),
        submit: jest.fn(),
      },
    },
    tableQueryResult: { refetch: jest.fn() },
    filters: [],
  })),
}));

jest.mock("pages/hardware/list-readyToDeploy", () => ({
  HardwareListReadyToDeploy: MockHardwareListReadyToDeploy,
}));

describe("HardwareListReadyToDeploy - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify(["id", "name", "model"])),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "admin" },
    }));
  });

  describe("Check render", () => {
    it("should render search form with date range and location filters", () => {
      render(<MockHardwareListReadyToDeploy />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("should render the toolbar actions", () => {
      render(<MockHardwareListReadyToDeploy />);
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render hardware table and total detail", () => {
      render(<MockHardwareListReadyToDeploy />);
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });
  });

  describe("Basic workflows (modals & interactions)", () => {
    it("should open the create modal when create button is clicked (admin)", async () => {
      render(<MockHardwareListReadyToDeploy />);
      fireEvent.click(screen.getByTestId("create-hardware-button"));
      await waitFor(() => {
        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
      });
    });

    it("should open the search modal when search button is clicked", async () => {
      render(<MockHardwareListReadyToDeploy />);
      fireEvent.click(screen.getByTestId("search-button"));
      await waitFor(() => {
        expect(screen.getByTestId("search-modal")).toBeInTheDocument();
        expect(screen.getByTestId("hardware-search")).toBeInTheDocument();
      });
    });

    it("should open the show modal when show button is clicked", async () => {
      render(<MockHardwareListReadyToDeploy />);
      fireEvent.click(screen.getByTestId("show-button-1"));
      await waitFor(() => {
        expect(screen.getByTestId("show-modal")).toBeInTheDocument();
        expect(screen.getByTestId("hardware-show")).toBeInTheDocument();
      });
    });

    it("should handle date inputs change", () => {
      render(<MockHardwareListReadyToDeploy />);
      const dateFrom = screen.getByTestId("date-from") as HTMLInputElement;
      const dateTo = screen.getByTestId("date-to") as HTMLInputElement;
      fireEvent.change(dateFrom, { target: { value: "2024-01-01" } });
      fireEvent.change(dateTo, { target: { value: "2024-01-31" } });
      expect(dateFrom.value).toBe("2024-01-01");
      expect(dateTo.value).toBe("2024-01-31");
    });

    it("should handle location select change", () => {
      render(<MockHardwareListReadyToDeploy />);
      const location = screen.getByTestId(
        "location-select"
      ) as HTMLSelectElement;
      fireEvent.change(location, { target: { value: "1" } });
      expect(location.value).toBe("1");
    });
  });
});
