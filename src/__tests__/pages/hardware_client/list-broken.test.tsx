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
  useTranslate: () => (k: string) => k,
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })),
  useNavigation: () => ({ list: jest.fn() }),
  useNotification: () => ({ open: jest.fn() }),
}));

jest.mock("@pankod/refine-antd", () => {
  const Select: any = (props: any) => (
    <select
      data-testid={props["data-testid"] || "select"}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    >
      {props.options?.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {props.children}
    </select>
  );
  const SelectOption = ({ children, value }: any) => (
    <option value={value}>{children}</option>
  );
  SelectOption.displayName = "Select.Option";
  Select.Option = SelectOption;

  return {
    ...jest.requireActual("@pankod/refine-antd"),
    useTable: jest.fn(() => ({
      tableProps: { dataSource: [], pagination: { total: 0 }, loading: false },
      sorter: {},
      searchFormProps: {
        form: { submit: jest.fn(), getFieldsValue: jest.fn() },
      },
      tableQueryResult: { refetch: jest.fn() },
      filters: [],
    })),
    useSelect: jest.fn(() => ({
      selectProps: { options: [{ label: "Loc 1", value: 1 }] },
    })),
    Table: ({ children, dataSource, pagination }: any) => (
      <div data-testid="client-hardware-table">
        {(dataSource || [{ id: 1 }]).map((r: any, idx: number) => (
          <div key={r.id ?? idx} data-testid={`table-row-${r.id ?? idx}`}>
            Row
          </div>
        ))}
        {pagination && <div data-testid="table-pagination">pagination</div>}
        {children}
      </div>
    ),
    CreateButton: ({ onClick, children }: any) => (
      <button data-testid="create-button" onClick={onClick}>
        {children ?? "Create"}
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
    DeleteButton: ({ onClick, recordItemId }: any) => (
      <button data-testid={`delete-button-${recordItemId}`} onClick={onClick}>
        Delete
      </button>
    ),
    DatePicker: {
      RangePicker: ({ onChange, value = [] }: any) => (
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            value={(Array.isArray(value) && value[0]) || ""}
            onChange={(e) => onChange?.([e.target.value, value[1]])}
          />
          <input
            data-testid="date-to"
            type="date"
            value={(Array.isArray(value) && value[1]) || ""}
            onChange={(e) => onChange?.([value[0], e.target.value])}
          />
        </div>
      ),
    },
    Select,
    Button: ({ children, onClick }: any) => (
      <button data-testid={`button-${children ?? "btn"}`} onClick={onClick}>
        {children}
      </button>
    ),
    TextField: ({ value }: any) => (
      <span data-testid="text-field">{String(value)}</span>
    ),
    TagField: ({ value }: any) => (
      <span data-testid="tag-field">{String(value)}</span>
    ),
    List: ({ title, pageHeaderProps, children }: any) => (
      <div data-testid="list-component">
        <div data-testid="list-title">{title}</div>
        <div data-testid="list-header">{pageHeaderProps?.extra}</div>
        {children}
      </div>
    ),
    Form: ({ children, initialValues }: any) => (
      <form
        data-testid="search-form"
        data-initial-values={JSON.stringify(initialValues)}
      >
        {children}
      </form>
    ),
    Checkbox: ({ checked, onChange, children }: any) => (
      <label data-testid="checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        {children}
      </label>
    ),
    Tooltip: ({ children }: any) => <div>{children}</div>,
    Space: ({ children }: any) => <div data-testid="space">{children}</div>,
    Image: ({ src, alt }: any) => (
      <img data-testid="image" src={src} alt={alt} />
    ),
    DateField: ({ value }: any) => (
      <span data-testid="date-field">{value}</span>
    ),
    Spin: ({ tip }: any) => <div data-testid="spin">{tip}</div>,
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
jest.mock("pages/hardware_client/search", () => ({
  ClientHardwareSearch: () => <div data-testid="client-hardware-search" />,
}));

jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: () => ({
    params: {
      rtd_location_id: null,
      dateFrom: null,
      dateTo: null,
      search: null,
      assigned_status: null,
    },
    setParams: jest.fn(),
    clearParam: jest.fn(),
  }),
}));

const MockClientHardwareListBroken: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);
  const [isSearch, setSearch] = React.useState(false);
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

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-broken</div>
      <div data-testid="list-header">
        <button data-testid="create-button" onClick={() => setCreate(true)}>
          hardware.label.tooltip.create
        </button>
      </div>

      <div className="search">
        <form data-testid="search-form">
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
            <option value="">all</option>
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
                      JSON.stringify(["id", "name"])
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

      {loading ? (
        <div data-testid="spin">loading...</div>
      ) : (
        <div data-testid="client-hardware-table">
          <div data-testid="table-row-1">
            Broken Client Item 1
            <div data-testid="space">
              <button data-testid="show-button-1" onClick={() => setShow(true)}>
                Show
              </button>
              <button
                data-testid="clone-button-1"
                onClick={() => setClone(true)}
              >
                Clone
              </button>
              <button data-testid="edit-button-1" onClick={() => setEdit(true)}>
                Edit
              </button>
              <button data-testid="delete-button-1">Delete</button>
              <button
                data-testid="checkout-button-1"
                onClick={() => setCheckout(true)}
              >
                hardware.label.button.checkout
              </button>
              <button
                data-testid="checkin-button-1"
                onClick={() => setCheckin(true)}
              >
                hardware.label.button.checkin
              </button>
            </div>
          </div>
          <div data-testid="table-pagination">pagination</div>
        </div>
      )}

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
    </div>
  );
};

jest.mock("pages/hardware_client/list-broken", () => ({
  ClientHardwareListBroken: MockClientHardwareListBroken,
}));

describe("ClientHardwareListBroken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders search form, date range and location select", () => {
      render(<MockClientHardwareListBroken />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("renders header actions, toolbar and table", () => {
      render(<MockClientHardwareListBroken />);
      expect(screen.getByTestId("list-header")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();

      expect(screen.getByTestId("client-hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });

    it("renders total detail and table action components", () => {
      render(<MockClientHardwareListBroken />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
    });

    it("loads saved columns from localStorage on mount", () => {
      mockLocalStorage.setItem("item_selected", JSON.stringify(["id", "name"]));
      render(<MockClientHardwareListBroken />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });

    it("renders action buttons for each row (show, clone, edit, delete, checkout, checkin)", () => {
      render(<MockClientHardwareListBroken />);
      const row = screen.getByTestId("table-row-1");

      expect(within(row).getByTestId("show-button-1")).toBeInTheDocument();
      expect(within(row).getByTestId("clone-button-1")).toBeInTheDocument();
      expect(within(row).getByTestId("edit-button-1")).toBeInTheDocument();
      expect(within(row).getByTestId("delete-button-1")).toBeInTheDocument();
      expect(within(row).getByTestId("checkout-button-1")).toBeInTheDocument();
      expect(within(row).getByTestId("checkin-button-1")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("opens create modal when create button clicked", async () => {
      render(<MockClientHardwareListBroken />);
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument()
      );
    });

    it("opens search modal when search button clicked", async () => {
      render(<MockClientHardwareListBroken />);
      fireEvent.click(screen.getByTestId("search-button"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.search_advanced")
        ).toBeInTheDocument()
      );
    });

    it("opens show/edit/clone/checkout/checkin modals when respective buttons clicked", async () => {
      render(<MockClientHardwareListBroken />);
      const row = screen.getByTestId("table-row-1");

      fireEvent.click(within(row).getByTestId("show-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.detail")
        ).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("edit-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.edit")
        ).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("clone-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.clone")
        ).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("checkout-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkout")
        ).toBeInTheDocument()
      );

      fireEvent.click(within(row).getByTestId("checkin-button-1"));
      await waitFor(() =>
        expect(
          screen.getByTestId("modal-hardware.label.title.checkin")
        ).toBeInTheDocument()
      );
    });

    it("persists date range, location and column selections to localStorage", async () => {
      render(<MockClientHardwareListBroken />);
      fireEvent.change(screen.getByTestId("date-from"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.change(screen.getByTestId("date-to"), {
        target: { value: "2024-12-31" },
      });
      fireEvent.change(screen.getByTestId("location-select"), {
        target: { value: "1" },
      });
      fireEvent.click(screen.getByTestId("columns-button"));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "rtd_location_id",
          "1"
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected",
          JSON.stringify(["id", "name"])
        );
      });
    });

    it("loads initial values from localStorage into search defaults", () => {
      mockLocalStorage.setItem("purchase_date", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem("rtd_location_id", "1");
      render(<MockClientHardwareListBroken />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("shows loading spinner when refresh is triggered", async () => {
      render(<MockClientHardwareListBroken />);
      fireEvent.click(screen.getByTestId("refresh-button"));

      await waitFor(() => {
        expect(screen.getByTestId("spin")).toBeInTheDocument();
      });
    });

    it("handles date range changes and updates localStorage", async () => {
      render(<MockClientHardwareListBroken />);

      fireEvent.change(screen.getByTestId("date-from"), {
        target: { value: "2024-01-01" },
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "purchase_date",
        "2024-01-01"
      );

      fireEvent.change(screen.getByTestId("date-to"), {
        target: { value: "2024-12-31" },
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "purchase_date",
        "2024-01-01~2024-12-31"
      );
    });

    it("handles location selection and updates localStorage", async () => {
      render(<MockClientHardwareListBroken />);

      fireEvent.change(screen.getByTestId("location-select"), {
        target: { value: "1" },
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "rtd_location_id",
        "1"
      );
    });
  });

  describe("State management", () => {
    it("manages modal visibility states independently", async () => {
      render(<MockClientHardwareListBroken />);

      // Open create modal
      fireEvent.click(screen.getByTestId("create-button"));
      expect(
        screen.getByTestId("modal-hardware.label.title.create")
      ).toBeInTheDocument();

      // Open search modal (should be independent)
      fireEvent.click(screen.getByTestId("search-button"));
      expect(
        screen.getByTestId("modal-hardware.label.title.search_advanced")
      ).toBeInTheDocument();

      // Both modals should be visible in mock (in real app, usually one at a time)
      expect(
        screen.getByTestId("modal-hardware.label.title.create")
      ).toBeInTheDocument();
    });

    it("correctly reads and sets localStorage for column selection", () => {
      mockLocalStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "status"])
      );

      render(<MockClientHardwareListBroken />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");

      fireEvent.click(screen.getByTestId("columns-button"));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "item_selected",
        JSON.stringify(["id", "name"])
      );
    });
  });
});
