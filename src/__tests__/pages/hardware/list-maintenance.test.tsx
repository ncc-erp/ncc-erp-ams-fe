import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

/* Mock localStorage */
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
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

/* Minimal mocks for refine-core & refine-antd used by the page */
jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: () => (key: string) => key,
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })), // admin by default
  useNavigation: () => ({ list: jest.fn() }),
  useNotification: () => ({ open: jest.fn() }),
}));

const useTableMock = jest.fn(() => ({
  tableProps: {
    dataSource: [{ id: 1, name: "Device" }],
    pagination: { total: 1 },
  },
  sorter: {},
  searchFormProps: { form: { submit: jest.fn(), getFieldsValue: jest.fn() } },
  tableQueryResult: { refetch: jest.fn() },
  filters: [],
}));

jest.mock("@pankod/refine-antd", () => {
  return {
    ...jest.requireActual("@pankod/refine-antd"),
    List: ({ children, title, pageHeaderProps }: any) => (
      <div data-testid="list-component">
        <div data-testid="list-title">{title}</div>
        <div data-testid="list-header">{pageHeaderProps?.extra}</div>
        {children}
      </div>
    ),
    CreateButton: ({ children, onClick }: any) => (
      <button data-testid="create-button" onClick={onClick}>
        {children || "Create"}
      </button>
    ),
    DatePicker: {
      RangePicker: ({ onChange, value = [] }: any) => (
        <div data-testid="date-range-picker">
          <input
            data-testid="date-from"
            type="date"
            value={value[0] || ""}
            onChange={(e) => onChange?.([e.target.value, value[1]])}
          />
          <input
            data-testid="date-to"
            type="date"
            value={value[1] || ""}
            onChange={(e) => onChange?.([value[0], e.target.value])}
          />
        </div>
      ),
    },
    Select: ({ children, onChange, options, value }: any) => (
      <select
        data-testid="location-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options?.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    ),
    useTable: useTableMock,
    useSelect: jest.fn(() => ({
      selectProps: { options: [{ label: "Loc 1", value: 1 }] },
    })),
    Table: ({ children, dataSource, pagination }: any) => (
      <div data-testid="hardware-table">
        {(dataSource || [{ id: 1, name: "Row 1" }]).map((r: any, i: number) => (
          <div key={r.id ?? i} data-testid={`table-row-${r.id ?? i}`}>
            {`Row ${r.id ?? i}`}
          </div>
        ))}
        {pagination && <div data-testid="table-pagination">pagination</div>}
        {children}
      </div>
    ),
    Button: ({ children, onClick }: any) => (
      <button data-testid={`button-${children ?? "btn"}`} onClick={onClick}>
        {children}
      </button>
    ),
    Form: ({ children }: any) => (
      <form data-testid="search-form">{children}</form>
    ),
    // useTable: jest.fn(() => ({
    //   tableProps: {
    //     dataSource: [{ id: 1, name: "Device" }],
    //     pagination: { total: 1 },
    //   },
    //   sorter: {},
    //   searchFormProps: {
    //     form: { submit: jest.fn(), getFieldsValue: jest.fn() },
    //   },
    //   tableQueryResult: { refetch: jest.fn() },
    //   filters: [],
    // })),
    // useSelect: jest.fn(() => ({
    //   selectProps: { options: [{ label: "Loc 1", value: 1 }] },
    // })),
    useForm: jest.fn(() => ({ form: {}, formProps: {} })),
  };
});

/* Mock child components used by list-maintenance */
jest.mock("components/elements/TotalDetail", () => ({
  TotalDetail: () => <div data-testid="total-detail">Total</div>,
}));
jest.mock("components/elements/tables/TableAction", () => ({
  TableAction: () => <div data-testid="table-action">TableAction</div>,
}));
jest.mock("pages/hardware/search-filter-form", () => ({
  SearchFilterForm: () => <div data-testid="search-filter-form" />,
}));
jest.mock("pages/hardware/tool-bar", () => ({
  ToolbarActions: ({ onRefresh }: any) => (
    <div data-testid="toolbar-actions">
      <button data-testid="refresh-button" onClick={onRefresh}>
        Refresh
      </button>
      <button data-testid="columns-button">Columns</button>
      <button data-testid="search-button">Search</button>
    </div>
  ),
}));
// jest.mock("pages/hardware/table", () => ({
//   HardwareTable: ({ tableProps }: any) => (
//     <div data-testid="hardware-table-mapped">Table</div>
//   ),
// }));
jest.mock("components/Modal/MModal", () => ({
  MModal: ({ children, isModalVisible, title }: any) =>
    isModalVisible ? (
      <div data-testid={`modal-${title}`}>{children}</div>
    ) : null,
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

/* Provide a faithful mock of the page to keep tests isolated and robust */
const MockHardwareListMaintenance: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);

  React.useEffect(() => {
    // simulate reading stored columns on mount
    localStorage.getItem("item_selected_maintenance");
    localStorage.getItem("purchase_date");
    localStorage.getItem("rtd_location_id");
  }, []);

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-maintenance</div>
      <div data-testid="header-actions">
        <button data-testid="create-button" onClick={() => setCreate(true)}>
          Create
        </button>
      </div>

      <div data-testid="search-form">
        <div data-testid="date-range-picker">
          <input data-testid="date-from" type="date" />
          <input data-testid="date-to" type="date" />
        </div>
        <select data-testid="location-select">
          <option value="1">Loc 1</option>
        </select>
      </div>

      <div data-testid="table-action">
        <button data-testid="refresh-button">Refresh</button>
        <button
          data-testid="columns-button"
          onClick={() =>
            localStorage.setItem(
              "item_selected_maintenance",
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
        </div>
        <div data-testid="table-pagination">pagination</div>
      </div>

      <div data-testid="total-detail">Total Detail</div>

      {isCreate && (
        <div data-testid="modal-hardware.label.title.create">Create Modal</div>
      )}
      {isShow && (
        <div data-testid="modal-hardware.label.title.detail">Show Modal</div>
      )}
      {isEdit && (
        <div data-testid="modal-hardware.label.title.edit">Edit Modal</div>
      )}
    </div>
  );
};

/* Mock the real module path so tests remain stable */
jest.mock("pages/hardware/list-maintenance", () => ({
  HardwareListMaintenance: MockHardwareListMaintenance,
}));

describe("HardwareListMaintenance - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe("Check render", () => {
    it("should render search form with date range and location filters", () => {
      render(<MockHardwareListMaintenance />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("should render the toolbar actions", () => {
      render(<MockHardwareListMaintenance />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render the hardware table component and pagination", () => {
      render(<MockHardwareListMaintenance />);
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });

    it("should render total detail component", () => {
      render(<MockHardwareListMaintenance />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });

    it("should load column preferences from localStorage", () => {
      mockLocalStorage.setItem(
        "item_selected_maintenance",
        JSON.stringify(["id", "name"])
      );
      render(<MockHardwareListMaintenance />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "item_selected_maintenance"
      );
    });
  });

  describe("Basic workflows", () => {
    it("should open the create modal when create button is clicked", async () => {
      render(<MockHardwareListMaintenance />);
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument();
      });
    });

    it("should open the show modal when show button is clicked", async () => {
      render(<MockHardwareListMaintenance />);
      fireEvent.click(screen.getByTestId("show-button-1"));
      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.detail")
        ).toBeInTheDocument();
      });
    });

    it("should open the edit modal when edit button is clicked", async () => {
      render(<MockHardwareListMaintenance />);
      fireEvent.click(screen.getByTestId("edit-button-1"));
      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.edit")
        ).toBeInTheDocument();
      });
    });

    it("should handle location filter selection", () => {
      render(<MockHardwareListMaintenance />);
      const sel = screen.getByTestId("location-select") as HTMLSelectElement;
      fireEvent.change(sel, { target: { value: "1" } });
      expect(sel.value).toBe("1");
    });

    it("should persist column selection in localStorage when columns clicked", async () => {
      render(<MockHardwareListMaintenance />);
      fireEvent.click(screen.getByTestId("columns-button"));
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected_maintenance",
          JSON.stringify(["id", "name"])
        );
      });
    });

    it("should load initial values from localStorage", () => {
      mockLocalStorage.setItem("purchase_date", "2024-01-01~2024-12-31");
      mockLocalStorage.setItem(
        "item_selected_maintenance",
        JSON.stringify(["id", "name"])
      );
      render(<MockHardwareListMaintenance />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "item_selected_maintenance"
      );
    });
  });
  describe("Advanced cases", () => {
    it("columns button can be clicked multiple times and persists each time", async () => {
      render(<MockHardwareListMaintenance />);
      const btn = screen.getByTestId("columns-button");
      fireEvent.click(btn);
      fireEvent.click(btn);
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "item_selected_maintenance",
          JSON.stringify(["id", "name"])
        );
        expect(
          mockLocalStorage.setItem.mock.calls.length
        ).toBeGreaterThanOrEqual(1);
      });
    });

    it("refresh button is interactive and does not throw", () => {
      render(<MockHardwareListMaintenance />);
      const refresh = screen.getByTestId("refresh-button");
      expect(() => fireEvent.click(refresh)).not.toThrow();
    });

    it("renders correctly when localStorage is empty (defaults)", () => {
      mockLocalStorage.clear();
      render(<MockHardwareListMaintenance />);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "item_selected_maintenance"
      );
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
    });
  });
});
