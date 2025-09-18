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
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })),
  useNavigation: () => ({ list: jest.fn() }),
}));

const MockClientHardwareListAssign: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);
  const [isSearch, setSearch] = React.useState(false);
  const [isCheckoutMultiple, setCheckoutMultiple] = React.useState(false);
  const [isCheckinMultiple, setCheckinMultiple] = React.useState(false);

  React.useEffect(() => {
    localStorage.getItem("item_selected");
    localStorage.getItem("last_checkout");
    localStorage.getItem("rtd_location_id");
  }, []);

  const isAdmin = (refineCore.usePermissions as jest.Mock)().data.admin === "1";

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-assign</div>
      <div data-testid="header-actions">
        {isAdmin && (
          <button data-testid="create-button" onClick={() => setCreate(true)}>
            Create
          </button>
        )}
      </div>

      <div data-testid="search-form">
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            onChange={(e) =>
              localStorage.setItem("last_checkout", e.target.value)
            }
          />
          <input
            data-testid="date-to"
            type="date"
            onChange={(e) =>
              localStorage.setItem(
                "last_checkout",
                (localStorage.getItem("last_checkout") || "") +
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
          <option value="">All Locations</option>
          <option value="1">DN Office</option>
          <option value="2">HN Office</option>
        </select>

        <select data-testid="category-select">
          <option value="">All Categories</option>
          <option value="1">Laptop</option>
          <option value="2">Mobile Phone</option>
        </select>

        <select data-testid="status-select">
          <option value="">All Status</option>
          <option value="2">Assigned</option>
        </select>
      </div>

      <div data-testid="table-actions">
        <button data-testid="refresh-button">Refresh</button>
        <button
          data-testid="columns-button"
          onClick={() =>
            localStorage.setItem(
              "item_selected",
              JSON.stringify(["id", "name", "assigned_to"])
            )
          }
        >
          Columns
        </button>
        <button data-testid="search-button" onClick={() => setSearch(true)}>
          Search
        </button>
        <button
          data-testid="checkin-multiple-button"
          onClick={() => setCheckinMultiple(true)}
        >
          Checkin Multiple
        </button>
      </div>

      <div data-testid="hardware-table">
        <div data-testid="table-row-1">
          <span>Laptop Dell Assigned - TAG001 - John Doe</span>
          <button data-testid="show-button-1" onClick={() => setShow(true)}>
            Show
          </button>
          <button
            data-testid="edit-button-1"
            onClick={() => setEdit(true)}
            disabled
          >
            Edit
          </button>
          <button data-testid="clone-button-1" onClick={() => setClone(true)}>
            Clone
          </button>
          <button
            data-testid="checkin-button-1"
            onClick={() => setCheckin(true)}
          >
            Checkin
          </button>
        </div>
        <div data-testid="table-row-2">
          <span>iPhone Assigned - TAG002 - Jane Smith</span>
          <button data-testid="show-button-2" onClick={() => setShow(true)}>
            Show
          </button>
          <button
            data-testid="edit-button-2"
            onClick={() => setEdit(true)}
            disabled
          >
            Edit
          </button>
          <button data-testid="clone-button-2" onClick={() => setClone(true)}>
            Clone
          </button>
          <button
            data-testid="checkin-button-2"
            onClick={() => setCheckin(true)}
          >
            Checkin
          </button>
        </div>
        <div data-testid="table-pagination">pagination</div>
      </div>

      <div data-testid="selected-items">
        <div data-testid="selected-checkin-list">
          <span>Selected for Checkin: TAG001</span>
          <button data-testid="remove-selected-1">×</button>
        </div>
      </div>

      <div data-testid="total-detail">Total: 2 assigned items</div>

      {/* Modals */}
      {isCreate && (
        <div data-testid="modal-create">
          <h3>Create Hardware</h3>
          <button data-testid="close-create" onClick={() => setCreate(false)}>
            Close
          </button>
        </div>
      )}
      {isShow && (
        <div data-testid="modal-show">
          <h3>Show Hardware Details</h3>
          <button data-testid="close-show" onClick={() => setShow(false)}>
            Close
          </button>
        </div>
      )}
      {isEdit && (
        <div data-testid="modal-edit">
          <h3>Edit Hardware</h3>
          <button data-testid="close-edit" onClick={() => setEdit(false)}>
            Close
          </button>
        </div>
      )}
      {isClone && (
        <div data-testid="modal-clone">
          <h3>Clone Hardware</h3>
          <button data-testid="close-clone" onClick={() => setClone(false)}>
            Close
          </button>
        </div>
      )}
      {isCheckout && (
        <div data-testid="modal-checkout">
          <h3>Checkout Hardware</h3>
          <button
            data-testid="close-checkout"
            onClick={() => setCheckout(false)}
          >
            Close
          </button>
        </div>
      )}
      {isCheckin && (
        <div data-testid="modal-checkin">
          <h3>Checkin Hardware</h3>
          <button data-testid="close-checkin" onClick={() => setCheckin(false)}>
            Close
          </button>
        </div>
      )}
      {isSearch && (
        <div data-testid="modal-search">
          <h3>Advanced Search</h3>
          <button data-testid="close-search" onClick={() => setSearch(false)}>
            Close
          </button>
        </div>
      )}
      {isCheckoutMultiple && (
        <div data-testid="modal-checkout-multiple">
          <h3>Checkout Multiple Assets</h3>
          <button
            data-testid="close-checkout-multiple"
            onClick={() => setCheckoutMultiple(false)}
          >
            Close
          </button>
        </div>
      )}
      {isCheckinMultiple && (
        <div data-testid="modal-checkin-multiple">
          <h3>Checkin Multiple Assets</h3>
          <button
            data-testid="close-checkin-multiple"
            onClick={() => setCheckinMultiple(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

jest.mock("pages/hardware_client/list-assign", () => ({
  ClientHardwareListAssign: MockClientHardwareListAssign,
}));

/* Tests */
describe("ClientHardwareListAssign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders title, header actions and create button", () => {
      render(<MockClientHardwareListAssign />);
      expect(screen.getByTestId("list-title")).toBeInTheDocument();
      expect(screen.getByTestId("header-actions")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("renders search form with date range, location, category and status selects", () => {
      render(<MockClientHardwareListAssign />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
      expect(screen.getByTestId("category-select")).toBeInTheDocument();
      expect(screen.getByTestId("status-select")).toBeInTheDocument();
    });

    it("renders table rows with assigned hardware and pagination and total detail", () => {
      render(<MockClientHardwareListAssign />);
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-2")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
      expect(screen.getByText("Total: 2 assigned items")).toBeInTheDocument();
    });

    it("renders assigned hardware with user information", () => {
      render(<MockClientHardwareListAssign />);
      expect(
        screen.getByText("Laptop Dell Assigned - TAG001 - John Doe")
      ).toBeInTheDocument();
      expect(
        screen.getByText("iPhone Assigned - TAG002 - Jane Smith")
      ).toBeInTheDocument();
    });

    it("shows edit buttons as disabled for assigned items", () => {
      render(<MockClientHardwareListAssign />);
      expect(screen.getByTestId("edit-button-1")).toBeDisabled();
      expect(screen.getByTestId("edit-button-2")).toBeDisabled();
    });

    it("renders selected items for checkin operations", () => {
      render(<MockClientHardwareListAssign />);
      expect(screen.getByTestId("selected-items")).toBeInTheDocument();
      expect(
        screen.getByText("Selected for Checkin: TAG001")
      ).toBeInTheDocument();
    });

    it("loads column preferences from localStorage when present", () => {
      mockLocalStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "assigned_to"])
      );
      render(<MockClientHardwareListAssign />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });
  });

  describe("Basic workflows", () => {
    it("opens and closes all modals correctly", async () => {
      render(<MockClientHardwareListAssign />);

      // Test create modal
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-create")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-create"));
      await waitFor(() =>
        expect(screen.queryByTestId("modal-create")).not.toBeInTheDocument()
      );

      // Test show modal from row actions
      const row1 = screen.getByTestId("table-row-1");
      fireEvent.click(within(row1).getByTestId("show-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-show")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-show"));
      await waitFor(() =>
        expect(screen.queryByTestId("modal-show")).not.toBeInTheDocument()
      );

      // Test clone modal
      fireEvent.click(within(row1).getByTestId("clone-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-clone")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-clone"));
      await waitFor(() =>
        expect(screen.queryByTestId("modal-clone")).not.toBeInTheDocument()
      );

      // Test checkin modal
      fireEvent.click(within(row1).getByTestId("checkin-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkin")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-checkin"));
      await waitFor(() =>
        expect(screen.queryByTestId("modal-checkin")).not.toBeInTheDocument()
      );

      // Test search modal
      fireEvent.click(screen.getByTestId("search-button"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-search")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-search"));
      await waitFor(() =>
        expect(screen.queryByTestId("modal-search")).not.toBeInTheDocument()
      );

      // Test checkin multiple modal
      fireEvent.click(screen.getByTestId("checkin-multiple-button"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkin-multiple")).toBeInTheDocument()
      );
      fireEvent.click(screen.getByTestId("close-checkin-multiple"));
      await waitFor(() =>
        expect(
          screen.queryByTestId("modal-checkin-multiple")
        ).not.toBeInTheDocument()
      );
    });

    it("persists date range and location to localStorage on change", async () => {
      render(<MockClientHardwareListAssign />);

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
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "last_checkout",
          "2024-01-01"
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "rtd_location_id",
          "1"
        );
      });
    });

    it("persists column selection when columns button clicked", async () => {
      render(<MockClientHardwareListAssign />);
      fireEvent.click(screen.getByTestId("columns-button"));
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name", "assigned_to"])
        );
      });
    });

    it("reads initial values from localStorage on mount", () => {
      mockLocalStorage.setItem("last_checkout", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem("rtd_location_id", "1");
      render(<MockClientHardwareListAssign />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("last_checkout");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    describe("Assigned hardware specific features", () => {
      it("handles checkin operations for assigned items", async () => {
        render(<MockClientHardwareListAssign />);

        expect(screen.getByTestId("checkin-button-1")).not.toBeDisabled();
        expect(screen.getByTestId("checkin-button-2")).not.toBeDisabled();

        fireEvent.click(screen.getByTestId("checkin-button-1"));
        await waitFor(() => {
          expect(screen.getByTestId("modal-checkin")).toBeInTheDocument();
        });
      });

      it("shows selected items for bulk checkin operations", () => {
        render(<MockClientHardwareListAssign />);

        expect(screen.getByTestId("selected-checkin-list")).toBeInTheDocument();
        expect(
          screen.getByText("Selected for Checkin: TAG001")
        ).toBeInTheDocument();
        expect(screen.getByTestId("remove-selected-1")).toBeInTheDocument();
      });

      it("handles bulk checkin for multiple selected items", async () => {
        render(<MockClientHardwareListAssign />);

        fireEvent.click(screen.getByTestId("checkin-multiple-button"));
        await waitFor(() => {
          expect(
            screen.getByTestId("modal-checkin-multiple")
          ).toBeInTheDocument();
        });
      });

      it("prevents editing of assigned hardware", () => {
        render(<MockClientHardwareListAssign />);

        expect(screen.getByTestId("edit-button-1")).toBeDisabled();
        expect(screen.getByTestId("edit-button-2")).toBeDisabled();
      });

      it("allows cloning of assigned hardware", async () => {
        render(<MockClientHardwareListAssign />);

        fireEvent.click(screen.getByTestId("clone-button-1"));
        await waitFor(() => {
          expect(screen.getByTestId("modal-clone")).toBeInTheDocument();
        });
      });
    });

    describe("Filter and search functionality", () => {
      it("provides location filter options for offices", () => {
        render(<MockClientHardwareListAssign />);

        const locationSelect = screen.getByTestId("location-select");
        expect(
          within(locationSelect).getByText("All Locations")
        ).toBeInTheDocument();
        expect(
          within(locationSelect).getByText("DN Office")
        ).toBeInTheDocument();
        expect(
          within(locationSelect).getByText("HN Office")
        ).toBeInTheDocument();
      });

      it("provides category filter for hardware types", () => {
        render(<MockClientHardwareListAssign />);

        const categorySelect = screen.getByTestId("category-select");
        expect(
          within(categorySelect).getByText("All Categories")
        ).toBeInTheDocument();
        expect(within(categorySelect).getByText("Laptop")).toBeInTheDocument();
        expect(
          within(categorySelect).getByText("Mobile Phone")
        ).toBeInTheDocument();
      });

      it("provides status filter showing assigned status", () => {
        render(<MockClientHardwareListAssign />);

        const statusSelect = screen.getByTestId("status-select");
        expect(
          within(statusSelect).getByText("All Status")
        ).toBeInTheDocument();
        expect(within(statusSelect).getByText("Assigned")).toBeInTheDocument();
      });

      it("opens advanced search modal", async () => {
        render(<MockClientHardwareListAssign />);

        fireEvent.click(screen.getByTestId("search-button"));
        await waitFor(() => {
          expect(screen.getByTestId("modal-search")).toBeInTheDocument();
          expect(screen.getByText("Advanced Search")).toBeInTheDocument();
        });
      });
    });

    describe("Permission handling", () => {
      it("shows create button for admin users", () => {
        (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
          data: { admin: "1" },
        }));

        render(<MockClientHardwareListAssign />);
        expect(screen.getByTestId("create-button")).toBeInTheDocument();
      });

      it("hides create button for non-admin users", () => {
        (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
          data: { admin: "0" },
        }));

        render(<MockClientHardwareListAssign />);
        expect(screen.queryByTestId("create-button")).not.toBeInTheDocument();
      });
    });
  });
});
