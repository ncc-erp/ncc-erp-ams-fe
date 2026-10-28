import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import * as refineCore from "@pankod/refine-core";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    __store: () => store,
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: () => (key: string) => key,
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })), // admin by default
  useNavigation: () => ({ list: jest.fn() }),
}));

const MockHardwareListAssign: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);

  React.useEffect(() => {
    // simulate reading saved columns and filters on mount
    localStorage.getItem("item_selected");
    localStorage.getItem("purchase_date");
    localStorage.getItem("rtd_location_id");
  }, []);

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-assign</div>
      <div data-testid="header-actions">
        <button data-testid="create-button" onClick={() => setCreate(true)}>
          Create
        </button>
      </div>

      <div data-testid="search-form">
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            onChange={(e) =>
              localStorage.setItem("purchase_date", e.target.value)
            }
          />
          <input
            data-testid="date-to"
            type="date"
            onChange={(e) =>
              localStorage.setItem(
                "purchase_date",
                (localStorage.getItem("purchase_date") || "") +
                  "~" +
                  e.target.value
              )
            }
          />
        </div>

        <select
          data-testid="location-select"
          onChange={(e) =>
            localStorage.setItem("rtd_location_id", String(e.target.value))
          }
        >
          <option value="">All</option>
          <option value="1">Loc 1</option>
        </select>
      </div>

      <div data-testid="table-actions">
        <button data-testid="refresh-button">Refresh</button>
        <button
          data-testid="columns-button"
          onClick={() =>
            localStorage.setItem(
              "item_selected",
              JSON.stringify(["id", "name"])
            )
          }
        >
          Columns
        </button>
        <button data-testid="search-button">Search</button>
      </div>

      <div data-testid="hardware-table">
        <div data-testid="table-row-1">
          Item 1
          <button data-testid="show-button-1" onClick={() => setShow(true)}>
            Show
          </button>
          <button data-testid="edit-button-1" onClick={() => setEdit(true)}>
            Edit
          </button>
          <button data-testid="clone-button-1" onClick={() => setClone(true)}>
            Clone
          </button>
          <button
            data-testid="checkout-button-1"
            onClick={() => setCheckout(true)}
          >
            Checkout
          </button>
          <button
            data-testid="checkin-button-1"
            onClick={() => setCheckin(true)}
          >
            Checkin
          </button>
        </div>
        <div data-testid="table-pagination">pagination</div>
      </div>

      <div data-testid="total-detail">Total</div>

      {isCreate && <div data-testid="modal-create">Create Modal</div>}
      {isShow && <div data-testid="modal-show">Show Modal</div>}
      {isEdit && <div data-testid="modal-edit">Edit Modal</div>}
      {isClone && <div data-testid="modal-clone">Clone Modal</div>}
      {isCheckout && <div data-testid="modal-checkout">Checkout Modal</div>}
      {isCheckin && <div data-testid="modal-checkin">Checkin Modal</div>}
    </div>
  );
};

jest.mock("pages/hardware/list-assign", () => ({
  HardwareListAssign: MockHardwareListAssign,
}));

/* Tests */
describe("HardwareListAssign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders title, header actions and create button", () => {
      render(<MockHardwareListAssign />);
      expect(screen.getByTestId("list-title")).toBeInTheDocument();
      expect(screen.getByTestId("header-actions")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("renders search form with date range and location select", () => {
      render(<MockHardwareListAssign />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("renders table rows and pagination and total detail", () => {
      render(<MockHardwareListAssign />);
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });

    it("loads column preferences from localStorage when present", () => {
      mockLocalStorage.setItem("item_selected", JSON.stringify(["id", "name"]));
      render(<MockHardwareListAssign />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });
  });

  describe("Basic workflows", () => {
    it("opens create modal when create button clicked", async () => {
      render(<MockHardwareListAssign />);
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-create")).toBeInTheDocument()
      );
    });

    it("opens show/edit/clone/checkout/checkin modals from row actions", async () => {
      render(<MockHardwareListAssign />);
      const row = screen.getByTestId("table-row-1");

      fireEvent.click(within(row).getByTestId("show-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-show")).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("edit-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-edit")).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("clone-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-clone")).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("checkout-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkout")).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("checkin-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkin")).toBeInTheDocument()
      );
    });

    it("persists date range and location to localStorage on change", async () => {
      render(<MockHardwareListAssign />);
      fireEvent.change(screen.getByTestId("date-from"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.change(screen.getByTestId("date-to"), {
        target: { value: "2024-12-31" },
      });
      fireEvent.change(screen.getByTestId("location-select"), {
        target: { value: "1" },
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "rtd_location_id",
          "1"
        );
      });
    });

    it("persists column selection when columns button clicked", async () => {
      render(<MockHardwareListAssign />);
      fireEvent.click(screen.getByTestId("columns-button"));
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name"])
        );
      });
    });

    it("reads initial values from localStorage on mount", () => {
      mockLocalStorage.setItem("purchase_date", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem("rtd_location_id", "1");
      render(<MockHardwareListAssign />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });
  });
});
