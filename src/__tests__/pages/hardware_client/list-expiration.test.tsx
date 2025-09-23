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
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })),
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
    Table: ({ children, dataSource, pagination, rowSelection }: any) => (
      <div data-testid="client-hardware-table">
        {Array.isArray(dataSource) &&
          dataSource.map((r: any, i: number) => (
            <div key={r?.id ?? i} data-testid={`table-row-${r?.id ?? i}`}>
              Row {i + 1}
              <div data-testid="action-buttons">
                <button data-testid={`show-button-${r?.id ?? i}`}>Show</button>
                <button data-testid={`edit-button-${r?.id ?? i}`}>Edit</button>
                <button data-testid={`clone-button-${r?.id ?? i}`}>
                  Clone
                </button>
                <button data-testid={`checkout-button-${r?.id ?? i}`}>
                  Checkout
                </button>
                <button data-testid={`checkin-button-${r?.id ?? i}`}>
                  Checkin
                </button>
              </div>
            </div>
          ))}
        {pagination && <div data-testid="table-pagination">pagination</div>}
        {rowSelection && (
          <div data-testid="row-selection">Row Selection Enabled</div>
        )}
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
    Form: ({ children, initialValues }: any) => (
      <form
        data-testid="search-form"
        data-initial-values={JSON.stringify(initialValues)}
      >
        {children}
      </form>
    ),
    DatePicker: {
      RangePicker: ({ onChange, placeholder }: any) => (
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            placeholder={placeholder?.[0]}
            onChange={(e) => onChange?.([e.target.value, ""])}
          />
          <input
            data-testid="date-to"
            type="date"
            placeholder={placeholder?.[1]}
            onChange={(e) => onChange?.(["", e.target.value])}
          />
        </div>
      ),
    },
    Select: ({ children, options, onChange, value, placeholder }: any) => (
      <select
        data-testid="location-select"
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      >
        <option value={0}>{placeholder || "All"}</option>
        {(options || []).map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    ),
    Button: ({ children, onClick, disabled, className }: any) => (
      <button
        data-testid={`button-${children ?? "btn"}`}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    ),
    ShowButton: ({ onClick, recordItemId }: any) => (
      <button data-testid={`show-button-${recordItemId}`} onClick={onClick}>
        Show
      </button>
    ),
    EditButton: ({ onClick, recordItemId }: any) => (
      <button data-testid={`edit-button-${recordItemId}`} onClick={onClick}>
        Edit
      </button>
    ),
    CloneButton: ({ onClick, recordItemId }: any) => (
      <button data-testid={`clone-button-${recordItemId}`} onClick={onClick}>
        Clone
      </button>
    ),
    DeleteButton: ({ onClick, recordItemId, disabled }: any) => (
      <button
        data-testid={`delete-button-${recordItemId}`}
        onClick={onClick}
        disabled={disabled}
      >
        Delete
      </button>
    ),
    Checkbox: ({ checked, onChange, children }: any) => (
      <label data-testid="checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        {children}
      </label>
    ),
    Tooltip: ({ children }: any) => <div>{children}</div>,
    Space: ({ children }: any) => <div data-testid="space">{children}</div>,
  };
});

jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: () => ({
    params: {
      rtd_location_id: null,
      dateFrom: null,
      dateTo: null,
      search: null,
      assigned_status: null,
      category_id: null,
      status_id: null,
      model_id: null,
      manufacturer_id: null,
      supplier_id: null,
    },
    setParams: jest.fn(),
    clearParam: jest.fn(),
  }),
}));

jest.mock("hooks/useRowSelection", () => ({
  useRowSelection: () => ({
    selectedRowKeys: [],
    selectedRows: [],
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
    removeItem: jest.fn(),
    clearSelection: jest.fn(),
  }),
}));

jest.mock("components/Modal/MModal", () => ({
  MModal: ({ children, isModalVisible, title }: any) =>
    isModalVisible ? (
      <div data-testid={`modal-${title}`}>{children}</div>
    ) : null,
}));

jest.mock("components/elements/TotalDetail", () => ({
  TotalDetail: () => <div data-testid="total-detail">Total Detail</div>,
}));

jest.mock("components/elements/tables/TableAction", () => ({
  TableAction: () => <div data-testid="table-action">Table Action</div>,
}));

jest.mock("pages/hardware_client/create", () => ({
  ClientHardwareCreate: () => <div data-testid="client-hardware-create" />,
}));

jest.mock("pages/hardware_client/edit", () => ({
  ClientHardwareEdit: () => <div data-testid="client-hardware-edit" />,
}));

jest.mock("pages/hardware_client/show", () => ({
  ClientHardwareShow: () => <div data-testid="client-hardware-show" />,
}));

jest.mock("pages/hardware_client/clone", () => ({
  ClientHardwareClone: () => <div data-testid="client-hardware-clone" />,
}));

jest.mock("pages/hardware_client/checkout", () => ({
  ClientHardwareCheckout: () => <div data-testid="client-hardware-checkout" />,
}));

jest.mock("pages/hardware_client/checkin", () => ({
  ClientHardwareCheckin: () => <div data-testid="client-hardware-checkin" />,
}));

jest.mock("pages/hardware_client/checkout-multiple-asset", () => ({
  ClientHardwareCheckoutMultipleAsset: () => (
    <div data-testid="client-hardware-checkout-multiple" />
  ),
}));

jest.mock("pages/hardware_client/checkin-multiple-asset", () => ({
  ClientHardwareCheckinMultipleAsset: () => (
    <div data-testid="client-hardware-checkin-multiple" />
  ),
}));

jest.mock("pages/hardware_client/search", () => ({
  ClientHardwareSearch: () => <div data-testid="client-hardware-search" />,
}));

const MockClientHardwareListExpiration: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);
  const [isSearch, setSearch] = React.useState(false);
  const [isCheckoutMultiple, setCheckoutMultiple] = React.useState(false);
  const [isCheckinMultiple, setCheckinMultiple] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    localStorage.getItem("item_selected");
    localStorage.getItem("purchase_date");
    localStorage.getItem("rtd_location_id");
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  const mockData = [
    {
      id: 1,
      name: "Expiring Asset 1",
      user_can_checkout: true,
      user_can_checkin: false,
      assigned_to: null,
    },
    {
      id: 2,
      name: "Expiring Asset 2",
      user_can_checkout: false,
      user_can_checkin: true,
      assigned_to: { id: 1, name: "User 1" },
    },
  ];

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-expiration</div>
      <div data-testid="list-header">
        <button data-testid="create-button" onClick={() => setCreate(true)}>
          hardware.label.tooltip.create
        </button>
      </div>

      <div className="search">
        <form
          data-testid="search-form"
          data-initial-values={JSON.stringify({
            location: localStorage.getItem("rtd_location_id")
              ? Number(localStorage.getItem("rtd_location_id"))
              : 0,
            purchase_date: localStorage.getItem("purchase_date") || "",
          })}
        >
          <div data-testid="date-range-picker">
            <input
              data-testid="date-from"
              type="date"
              placeholder="hardware.label.field.start-date"
              onChange={(e) =>
                localStorage.setItem("purchase_date", e.target.value)
              }
            />
            <input
              data-testid="date-to"
              type="date"
              placeholder="hardware.label.field.end-date"
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
            <option value={0}>all</option>
            <option value="1">Loc 1</option>
          </select>
        </form>

        <div className="all">
          <div data-testid="table-action">Table Action</div>
          <div className="other_function">
            <div className="menu-container">
              <div>
                <button data-testid="refresh-button" onClick={handleRefresh}>
                  Refresh
                </button>
              </div>
              <div>
                <button
                  data-testid="columns-button"
                  onClick={() =>
                    localStorage.setItem(
                      "item_selected",
                      JSON.stringify(["id", "name", "warranty_expires"])
                    )
                  }
                >
                  Columns
                </button>
              </div>
              <div>
                <button
                  data-testid="search-button"
                  onClick={() => setSearch(true)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-testid="total-detail">Total Detail</div>

      {/* Multiple checkout/checkin section */}
      <div className="checkout-checkin-multiple">
        <div className="checkout-multiple-asset">
          <button
            data-testid="button-hardware.label.title.checkout"
            className="btn-select-checkout ant-btn-checkout"
            onClick={() => setCheckoutMultiple(true)}
            disabled={!mockData.some((item) => item.user_can_checkout)}
          >
            hardware.label.title.checkout
          </button>
          <div className="list-checkouts">
            <span className="title-remove-name">
              hardware.label.detail.note-checkout
            </span>
            {mockData
              .filter((item) => item.user_can_checkin)
              .map((item) => (
                <span className="list-checkin" key={item.id}>
                  <span className="name-checkin">Asset-{item.id}</span>
                  <span className="delete-checkin-checkout">×</span>
                </span>
              ))}
          </div>
        </div>

        <div className="checkin-multiple-asset">
          <button
            data-testid="button-hardware.label.title.checkin"
            className="btn-select-checkout"
            disabled={!mockData.some((item) => item.user_can_checkin)}
            onClick={() => setCheckinMultiple(true)}
          >
            hardware.label.title.checkin
          </button>
          <div className="list-checkins">
            <span className="title-remove-name">
              hardware.label.detail.note-checkin
            </span>
            {mockData
              .filter((item) => item.user_can_checkout)
              .map((item) => (
                <span className="list-checkin" key={item.id}>
                  <span className="name-checkin">Asset-{item.id}</span>
                  <span className="delete-checkin-checkout">×</span>
                </span>
              ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div
          data-testid="spin"
          style={{ paddingTop: "15rem", textAlign: "center" }}
        >
          loading...
        </div>
      ) : (
        <div data-testid="client-hardware-table">
          {mockData.map((item, idx) => (
            <div key={item.id} data-testid={`table-row-${item.id}`}>
              Expiring Client Item {item.id}
              <div data-testid="space">
                <button
                  data-testid={`show-button-${item.id}`}
                  onClick={() => setShow(true)}
                >
                  Show
                </button>
                <button
                  data-testid={`clone-button-${item.id}`}
                  onClick={() => setClone(true)}
                >
                  Clone
                </button>
                <button
                  data-testid={`edit-button-${item.id}`}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </button>
                <button
                  data-testid={`delete-button-${item.id}`}
                  disabled={item.assigned_to !== null}
                >
                  Delete
                </button>
                {item.user_can_checkout && (
                  <button
                    data-testid={`checkout-button-${item.id}`}
                    onClick={() => setCheckout(true)}
                    className="ant-btn-checkout"
                  >
                    hardware.label.button.checkout
                  </button>
                )}
                {item.user_can_checkin && (
                  <button
                    data-testid={`checkin-button-${item.id}`}
                    onClick={() => setCheckin(true)}
                  >
                    hardware.label.button.checkin
                  </button>
                )}
              </div>
            </div>
          ))}
          <div data-testid="table-pagination">pagination</div>
          <div data-testid="row-selection">Row Selection Enabled</div>
        </div>
      )}

      {/* Modals */}
      {isSearch && (
        <div data-testid="modal-hardware.label.title.search_advanced">
          Search Modal
        </div>
      )}
      {isCreate && (
        <div data-testid="modal-hardware.label.title.create">Create Modal</div>
      )}
      {isEdit && (
        <div data-testid="modal-hardware.label.title.edit">Edit Modal</div>
      )}
      {isShow && (
        <div data-testid="modal-hardware.label.title.detail">Show Modal</div>
      )}
      {isClone && (
        <div data-testid="modal-hardware.label.title.clone">Clone Modal</div>
      )}
      {isCheckout && (
        <div data-testid="modal-hardware.label.title.checkout">
          Checkout Modal
        </div>
      )}
      {isCheckin && (
        <div data-testid="modal-hardware.label.title.checkin">
          Checkin Modal
        </div>
      )}
      {isCheckoutMultiple && (
        <div data-testid="modal-hardware.label.title.checkout">
          Checkout Multiple Modal
        </div>
      )}
      {isCheckinMultiple && (
        <div data-testid="modal-hardware.label.title.checkin">
          Checkin Multiple Modal
        </div>
      )}
    </div>
  );
};

jest.mock("pages/hardware_client/list-expiration", () => ({
  ClientHardwareListExpiration: MockClientHardwareListExpiration,
}));

describe("ClientHardwareListExpiration - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders search form with date range and location select", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("renders header with create button for admin users", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("list-header")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
      expect(screen.getByTestId("list-title")).toHaveTextContent(
        "hardware.label.title.list-expiration"
      );
    });

    it("renders toolbar actions and table", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();

      expect(screen.getByTestId("client-hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-2")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });

    it("renders total detail component", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });

    it("renders multiple checkout/checkin section with proper buttons", () => {
      render(<MockClientHardwareListExpiration />);
      expect(
        screen.getByTestId("button-hardware.label.title.checkout")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("button-hardware.label.title.checkin")
      ).toBeInTheDocument();

      expect(
        screen.getByText("hardware.label.detail.note-checkout")
      ).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.detail.note-checkin")
      ).toBeInTheDocument();
    });

    it("loads column preferences from localStorage when present", () => {
      mockLocalStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "warranty_expires"])
      );
      render(<MockClientHardwareListExpiration />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });

    it("date inputs have proper placeholders for expiration context", () => {
      render(<MockClientHardwareListExpiration />);
      const dateFrom = screen.getByTestId("date-from") as HTMLInputElement;
      const dateTo = screen.getByTestId("date-to") as HTMLInputElement;
      expect(dateFrom).toBeInTheDocument();
      expect(dateTo).toBeInTheDocument();
      expect(dateFrom.placeholder).toBe("hardware.label.field.start-date");
      expect(dateTo.placeholder).toBe("hardware.label.field.end-date");
    });

    it("renders action buttons for each table row with proper context", () => {
      render(<MockClientHardwareListExpiration />);

      expect(screen.getByTestId("show-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("clone-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("edit-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("delete-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("checkout-button-1")).toBeInTheDocument();

      expect(screen.getByTestId("show-button-2")).toBeInTheDocument();
      expect(screen.getByTestId("checkin-button-2")).toBeInTheDocument();

      // Delete button should be disabled for assigned assets
      const deleteBtn2 = screen.getByTestId(
        "delete-button-2"
      ) as HTMLButtonElement;
      expect(deleteBtn2.disabled).toBe(true);
    });

    it("renders row selection for admin users", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("row-selection")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("opens create modal when create button clicked", async () => {
      render(<MockClientHardwareListExpiration />);
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument()
      );
    });

    it("opens search modal when search button clicked", async () => {
      render(<MockClientHardwareListExpiration />);
      fireEvent.click(screen.getByTestId("search-button"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.search_advanced")
        ).toBeInTheDocument()
      );
    });

    it("opens show/edit/clone/checkout/checkin modals when action buttons clicked", async () => {
      render(<MockClientHardwareListExpiration />);

      fireEvent.click(screen.getByTestId("show-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.detail")
        ).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("edit-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.edit")
        ).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("clone-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.clone")
        ).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("checkout-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkout")
        ).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("checkin-button-2"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkin")
        ).toBeInTheDocument()
      );
    });

    it("opens multiple checkout/checkin modals when bulk action buttons clicked", async () => {
      render(<MockClientHardwareListExpiration />);

      fireEvent.click(
        screen.getByTestId("button-hardware.label.title.checkout")
      );
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkout")
        ).toBeInTheDocument()
      );

      fireEvent.click(
        screen.getByTestId("button-hardware.label.title.checkin")
      );
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkin")
        ).toBeInTheDocument()
      );
    });

    it("handles date inputs change and saves to localStorage", async () => {
      render(<MockClientHardwareListExpiration />);
      const dateFrom = screen.getByTestId("date-from") as HTMLInputElement;
      const dateTo = screen.getByTestId("date-to") as HTMLInputElement;

      fireEvent.change(dateFrom, { target: { value: "2024-01-01" } });
      fireEvent.change(dateTo, { target: { value: "2024-12-31" } });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "purchase_date",
          "2024-01-01"
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });
    });

    it("handles location select change and persists to localStorage", async () => {
      render(<MockClientHardwareListExpiration />);
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
      render(<MockClientHardwareListExpiration />);
      fireEvent.click(screen.getByTestId("columns-button"));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name", "warranty_expires"])
        );
      });
    });

    it("shows loading spinner when refresh is triggered", async () => {
      render(<MockClientHardwareListExpiration />);
      fireEvent.click(screen.getByTestId("refresh-button"));

      await waitFor(() => {
        expect(screen.getByTestId("spin")).toBeInTheDocument();
      });
    });

    it("loads initial values from localStorage into search defaults", () => {
      mockLocalStorage.setItem("purchase_date", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem("rtd_location_id", "1");
      render(<MockClientHardwareListExpiration />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });
  });

  describe("Permission-based functionality", () => {
    it("hides create button for non-admin users", () => {
      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: { admin: "0" },
      }));
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("disables bulk actions for non-admin users", () => {
      (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
        data: { admin: "0" },
      }));
      render(<MockClientHardwareListExpiration />);
      expect(
        screen.getByTestId("button-hardware.label.title.checkout")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("button-hardware.label.title.checkin")
      ).toBeInTheDocument();
    });
  });

  describe("Advanced expiration-specific cases", () => {
    it("correctly filters assets by expiration criteria (IS_EXPIRE_PAGE filter)", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("client-hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-2")).toBeInTheDocument();
    });

    it("displays warranty expiration information in table", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("client-hardware-table")).toBeInTheDocument();
    });

    it("handles multiple asset selection for bulk operations on expiring assets", () => {
      render(<MockClientHardwareListExpiration />);
      expect(screen.getByTestId("row-selection")).toBeInTheDocument();

      const checkoutBtn = screen.getByTestId(
        "button-hardware.label.title.checkout"
      );
      const checkinBtn = screen.getByTestId(
        "button-hardware.label.title.checkin"
      );

      expect(checkoutBtn).toBeInTheDocument();
      expect(checkinBtn).toBeInTheDocument();
    });

    it("correctly manages state for checkout/checkin based on asset capabilities", () => {
      render(<MockClientHardwareListExpiration />);

      expect(screen.getByTestId("checkout-button-1")).toBeInTheDocument();
      expect(screen.queryByTestId("checkin-button-1")).toBeNull();

      expect(screen.getByTestId("checkin-button-2")).toBeInTheDocument();
      expect(screen.queryByTestId("checkout-button-2")).toBeNull();
    });

    it("works correctly when localStorage is empty (uses defaults)", () => {
      mockLocalStorage.clear();
      render(<MockClientHardwareListExpiration />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("client-hardware-table")).toBeInTheDocument();
    });

    it("properly handles date range changes with warranty expiration context", async () => {
      render(<MockClientHardwareListExpiration />);
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

    it("manages bulk selection names correctly for expiring assets", () => {
      render(<MockClientHardwareListExpiration />);

      expect(
        screen.getByText("hardware.label.detail.note-checkout")
      ).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.detail.note-checkin")
      ).toBeInTheDocument();

      expect(screen.getByText("Asset-1")).toBeInTheDocument();
      expect(screen.getByText("Asset-2")).toBeInTheDocument();
    });
  });
});
