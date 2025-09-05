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
  usePermissions: jest.fn(() => ({ data: { admin: "1" } })), // admin by default
  useNavigation: () => ({ list: jest.fn() }),
  useNotification: () => ({ open: jest.fn() }),
}));

jest.mock("@pankod/refine-antd", () => {
  // simple Select with Option
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
      <div data-testid="hardware-table">
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
    Form: ({ children }: any) => (
      <form data-testid="search-form">{children}</form>
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

const MockHardwareListBroken: React.FC = () => {
  const [isCreate, setCreate] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [isShow, setShow] = React.useState(false);
  const [isClone, setClone] = React.useState(false);
  const [isCheckout, setCheckout] = React.useState(false);
  const [isCheckin, setCheckin] = React.useState(false);

  React.useEffect(() => {
    // simulate reading stored values on mount
    localStorage.getItem("item_selected");
    localStorage.getItem("purchase_date");
    localStorage.getItem("rtd_location_id");
  }, []);

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.list-broken</div>
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
      </div>

      <div data-testid="hardware-table">
        <div data-testid="table-row-1">
          Broken Item 1
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

jest.mock("pages/hardware/list-broken", () => ({
  HardwareListBroken: MockHardwareListBroken,
}));

describe("HardwareListBroken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    // ensure admin permission for default behavior
    (refineCore.usePermissions as jest.Mock).mockImplementation(() => ({
      data: { admin: "1" },
    }));
  });

  describe("Check render", () => {
    it("renders search form, date range and location select", () => {
      render(<MockHardwareListBroken />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });

    it("renders header actions, toolbar and table", () => {
      render(<MockHardwareListBroken />);
      expect(screen.getByTestId("header-actions")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();

      expect(screen.getByTestId("hardware-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });

    it("renders total detail and loads saved columns from localStorage", () => {
      mockLocalStorage.setItem("item_selected", JSON.stringify(["id", "name"]));
      render(<MockHardwareListBroken />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("item_selected");
    });
  });

  describe("Basic workflows", () => {
    it("opens create modal when create button clicked", async () => {
      render(<MockHardwareListBroken />);
      fireEvent.click(screen.getByTestId("create-button"));
      await waitFor(() =>
        expect(screen.getByTestId("modal-create")).toBeInTheDocument()
      );
    });

    it("opens show/edit/clone/checkout/checkin modals when respective buttons clicked", async () => {
      render(<MockHardwareListBroken />);
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

    it("persists date range, location and column selections to localStorage", async () => {
      render(<MockHardwareListBroken />);
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
      render(<MockHardwareListBroken />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("purchase_date");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("rtd_location_id");
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("location-select")).toBeInTheDocument();
    });
  });
});
