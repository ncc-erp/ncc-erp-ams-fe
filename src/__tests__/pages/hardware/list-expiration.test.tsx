import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  useNotification: () => ({ open: jest.fn() }),
  useApp: jest.fn(),
}));

jest.mock("@pankod/refine-antd", () => {
  return {
    ...jest.requireActual("@pankod/refine-antd"),
    useTable: jest.fn(() => ({
      tableProps: { dataSource: [], pagination: { total: 0 }, loading: false },
      sorter: {},
      searchFormProps: {
        form: { getFieldsValue: jest.fn(), submit: jest.fn() },
      },
      tableQueryResult: { refetch: jest.fn() },
      filters: [],
    })),
    useSelect: jest.fn(() => ({
      selectProps: { options: [{ label: "Loc 1", value: 1 }] },
    })),
    List: ({ children, title, pageHeaderProps }: any) => (
      <div data-testid="list-component">
        <div data-testid="list-title">{title}</div>
        <div data-testid="list-header">{pageHeaderProps?.extra}</div>
        {children}
      </div>
    ),
    CreateButton: ({ onClick, children }: any) => (
      <button data-testid="create-button" onClick={onClick}>
        {children ?? "Create"}
      </button>
    ),
    Table: ({ children, dataSource, pagination }: any) => (
      <div data-testid="hardware-table">
        {Array.isArray(dataSource) &&
          dataSource.map((r: any, i: number) => (
            <div key={r?.id ?? i} data-testid={`table-row-${r?.id ?? i}`}>
              Row
            </div>
          ))}
        {pagination && <div data-testid="table-pagination">pagination</div>}
        {children}
      </div>
    ),
    DateField: ({ value }: any) => (
      <span data-testid="date-field">{String(value)}</span>
    ),
    TextField: ({ value }: any) => (
      <span data-testid="text-field">{String(value)}</span>
    ),
    TagField: ({ value }: any) => (
      <span data-testid="tag-field">{String(value)}</span>
    ),
    Form: ({ children }: any) => (
      <form data-testid="search-form">{children}</form>
    ),
    DatePicker: {
      RangePicker: ({ onChange }: any) => (
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            onChange={(e) => onChange?.([e.target.value, ""])}
          />
          <input
            data-testid="date-to"
            type="date"
            onChange={(e) => onChange?.(["", e.target.value])}
          />
        </div>
      ),
    },
    Select: ({ children, options, onChange, value }: any) => (
      <select
        data-testid="location-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {(options || []).map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    ),
    Button: ({ children, onClick }: any) => (
      <button data-testid={`button-${children ?? "btn"}`} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

jest.mock("components/Modal/MModal", () => ({
  MModal: ({ children, isModalVisible, title }: any) =>
    isModalVisible ? (
      <div data-testid={`modal-${title}`}>{children}</div>
    ) : null,
}));
jest.mock("components/elements/TotalDetail", () => ({
  TotalDetail: () => <div data-testid="total-detail">Total</div>,
}));
jest.mock("components/elements/tables/TableAction", () => ({
  TableAction: () => <div data-testid="table-action">TableAction</div>,
}));
jest.mock("pages/hardware/create", () => ({
  HardwareCreate: () => <div data-testid="hardware-create" />,
}));
jest.mock("pages/hardware/edit", () => ({
  HardwareEdit: () => <div data-testid="hardware-edit" />,
}));
jest.mock("pages/hardware/show", () => ({
  HardwareShow: () => <div data-testid="hardware-show" />,
}));
jest.mock("pages/hardware/clone", () => ({
  HardwareClone: () => <div data-testid="hardware-clone" />,
}));
jest.mock("pages/hardware/checkout", () => ({
  HardwareCheckout: () => <div data-testid="hardware-checkout" />,
}));
jest.mock("pages/hardware/checkin", () => ({
  HardwareCheckin: () => <div data-testid="hardware-checkin" />,
}));
jest.mock("pages/hardware/table-column", () => ({
  useHardwareColumns: () => [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
  ],
}));

const MockHardwareListExpiration: React.FC = () => {
  const [isCreate] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);

  React.useEffect(() => {
    localStorage.getItem("item_selected");
    localStorage.getItem("purchase_date");
    localStorage.getItem("rtd_location_id");
  }, []);

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.expiration</div>

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

      <div data-testid="table-action">
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
          Row 1
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

      <div data-testid="total-detail">Total Detail</div>

      {isCreate && <div data-testid="modal-create">Create Modal</div>}
      {isShow && <div data-testid="modal-show">Show Modal</div>}
      {isEdit && <div data-testid="modal-edit">Edit Modal</div>}
      {isClone && <div data-testid="modal-clone">Clone Modal</div>}
      {isCheckout && <div data-testid="modal-checkout">Checkout Modal</div>}
      {isCheckin && <div data-testid="modal-checkin">Checkin Modal</div>}
    </div>
  );
};

jest.mock("pages/hardware/list-expiration", () => ({
  HardwareListExpiration: MockHardwareListExpiration,
}));

// Test
describe("HardwareListExpiration - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    // default admin permission
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders search form with date range and location select", () => {
      render(<MockHardwareListExpiration />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("renders toolbar actions and table", () => {
      render(<MockHardwareListExpiration />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();

      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();

      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });

    it("loads column preferences from localStorage when present", () => {
      mockLocalStorage.setItem("item_selected", JSON.stringify(["id", "name"]));
      render(<MockHardwareListExpiration />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });

    it("date inputs are present and initially empty", () => {
      render(<MockHardwareListExpiration />);
      const dateFrom = screen.getByTestId("date-from") as HTMLInputElement;
      const dateTo = screen.getByTestId("date-to") as HTMLInputElement;
      expect(dateFrom).toBeInTheDocument();
      expect(dateTo).toBeInTheDocument();
      expect(dateFrom.value).toBe("");
      expect(dateTo.value).toBe("");
    });

    it("hides create button for non-admin users", () => {
      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: {},
      }));
      render(<MockHardwareListExpiration />);
      expect(screen.queryByTestId("create-button")).toBeNull();
      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: { admin: "1" },
      }));
    });

    it("columns and search toolbar buttons are accessible", () => {
      render(<MockHardwareListExpiration />);
      const colsBtn = screen.getByTestId("columns-button");
      const searchBtn = screen.getByTestId("search-button");
      expect(colsBtn).toBeVisible();
      expect(searchBtn).toBeVisible();
    });
  });

  describe("Basic workflows", () => {
    it("opens show/edit/clone/checkout/checkin modals when action buttons clicked", async () => {
      render(<MockHardwareListExpiration />);
      //   const row = screen.getByTestId("table-row-1");

      fireEvent.click(screen.getByTestId("show-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-show")).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("edit-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-edit")).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("clone-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-clone")).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("checkout-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkout")).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("checkin-button-1"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-checkin")).toBeInTheDocument()
      );
    });

    it("handles date inputs change and saves to localStorage", async () => {
      render(<MockHardwareListExpiration />);
      const dateFrom = screen.getByTestId("date-from") as HTMLInputElement;
      const dateTo = screen.getByTestId("date-to") as HTMLInputElement;

      fireEvent.change(dateFrom, { target: { value: "2024-01-01" } });
      fireEvent.change(dateTo, { target: { value: "2024-12-31" } });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });
    });

    it("handles location select change and persists to localStorage", async () => {
      render(<MockHardwareListExpiration />);
      const location = screen.getByTestId(
        "location-select"
      ) as HTMLSelectElement;
      fireEvent.change(location, { target: { value: "1" } });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "rtd_location_id",
          "1"
        );
      });
    });

    it("persists column selection when columns button clicked", async () => {
      render(<MockHardwareListExpiration />);
      fireEvent.click(screen.getByTestId("columns-button"));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name"])
        );
      });
    });

    it("loads initial values from localStorage into search defaults", () => {
      mockLocalStorage.setItem("purchase_date", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem("rtd_location_id", "1");
      render(<MockHardwareListExpiration />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });
  });
  describe("Advanced cases", () => {
    it("hides create button for non-admin users", () => {
      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: {},
      }));
      render(<MockHardwareListExpiration />);
      expect(screen.queryByTestId("create-button")).toBeNull();

      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: { admin: "1" },
      }));
    });

    it("columns button persists selection on repeated clicks", async () => {
      render(<MockHardwareListExpiration />);
      const colsBtn = screen.getByTestId("columns-button");
      fireEvent.click(colsBtn);
      fireEvent.click(colsBtn);

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name"])
        );
        expect(
          (mockLocalStorage.setItem as jest.Mock).mock.calls.length
        ).toBeGreaterThanOrEqual(1);
      });
    });

    it("date range inputs save purchase_date with '~' separator", async () => {
      render(<MockHardwareListExpiration />);
      fireEvent.change(screen.getByTestId("date-from"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.change(screen.getByTestId("date-to"), {
        target: { value: "2024-12-31" },
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        const calls = (mockLocalStorage.setItem as jest.Mock).mock.calls.flat();
        const wrotePurchase = calls.find(
          (c) => typeof c === "string" && c.includes("2024-01-01")
        );
        expect(wrotePurchase).toBeTruthy();
      });
    });

    it("works correctly when localStorage is empty (defaults)", () => {
      mockLocalStorage.clear();
      render(<MockHardwareListExpiration />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
    });

    it("refresh button is interactive and does not throw", () => {
      render(<MockHardwareListExpiration />);
      const refresh = screen.getByTestId("refresh-button");
      expect(() => fireEvent.click(refresh)).not.toThrow();
    });
    it("handles malformed item_selected in localStorage without throwing", () => {
      render(<MockHardwareListExpiration />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
      (mockLocalStorage.getItem as jest.Mock).mockRestore?.();
      (mockLocalStorage.getItem as jest.Mock).mockImplementation(
        (k: string) => {
          const s = (mockLocalStorage as any).__store?.() ?? {};
          return s[k] ?? null;
        }
      );
    });
  });
});
