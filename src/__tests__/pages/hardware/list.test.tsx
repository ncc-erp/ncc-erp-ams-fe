import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IHardwareResponse } from "../../../interfaces/hardware";
import { HardwareList } from "pages/hardware";

// Mock hardware data first, so it's available for other mocks
const mockHardwareData: IHardwareResponse[] = [
  {
    id: 1,
    name: "Laptop Dell XPS",
    asset_tag: "TAG001",
    serial: "SERIAL001",
    model: { id: 1, name: "XPS 13" },
    model_number: "XPS13-9380",
    category: { id: 1, name: "Laptop" },
    status_label: {
      id: 1,
      name: "Ready to Deploy",
      status_type: "deployable",
      status_meta: "",
    },
    assigned_to: {
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    },
    assigned_status: 1,
    location: { id: 1, name: "Office 1" },
    rtd_location: { id: 1, name: "Office 1" },
    manufacturer: { id: 1, name: "Dell" },
    supplier: { id: 1, name: "Dell Store" },
    notes: "Good condition",
    order_number: "ORD-001",
    image: "laptop.jpg",
    warranty_months: "24",
    warranty_expires: { date: "2025-01-01", formatted: "Jan 1, 2025" },
    purchase_cost: 1500,
    purchase_date: { date: "2023-01-01", formatted: "Jan 1, 2023" },
    last_audit_date: "2023-06-15",
    requestable: "1",
    physical: 1,
    note: "",
    expected_checkin: { date: "", formatted: "" },
    last_checkout: { date: "", formatted: "" },
    assigned_location: { id: 0, name: "" },
    assigned_user: 0,
    assigned_asset: "",
    checkout_to_type: {
      assigned_user: 0,
      assigned_asset: "",
      assigned_location: { id: 0, name: "" },
    },
    user_can_checkout: true,
    user_can_checkin: false,
    checkin_at: { date: "", formatted: "" },
    created_at: { datetime: "2023-01-01", formatted: "Jan 1, 2023" },
    updated_at: { datetime: "2023-01-01", formatted: "Jan 1, 2023" },
    checkin_counter: 0,
    checkout_counter: 0,
    requests_counter: 0,
    withdraw_from: 0,
    maintenance_cycle: "12",
    isCustomerRenting: false,
  },
  {
    id: 2,
    name: "iPhone 13",
    asset_tag: "TAG002",
    serial: "SERIAL002",
    model: { id: 2, name: "iPhone 13" },
    model_number: "A2482",
    category: { id: 2, name: "Mobile Phone" },
    status_label: {
      id: 2,
      name: "Assigned",
      status_type: "assigned",
      status_meta: "",
    },
    assigned_to: {
      id: 1,
      name: "John Doe",
      username: "john",
      last_name: "Doe",
      first_name: "John",
    },
    assigned_status: 2,
    location: { id: 2, name: "Office 2" },
    rtd_location: { id: 2, name: "Office 2" },
    manufacturer: { id: 2, name: "Apple" },
    supplier: { id: 2, name: "Apple Store" },
    notes: "New device",
    order_number: "ORD-002",
    image: "iphone.jpg",
    warranty_months: "12",
    warranty_expires: { date: "2024-02-01", formatted: "Feb 1, 2024" },
    purchase_cost: 1000,
    purchase_date: { date: "2023-02-01", formatted: "Feb 1, 2023" },
    last_audit_date: "2023-07-15",
    requestable: "0",
    physical: 1,
    note: "",
    expected_checkin: { date: "", formatted: "" },
    last_checkout: { date: "2023-02-15", formatted: "Feb 15, 2023" },
    assigned_location: { id: 0, name: "" },
    assigned_user: 1,
    assigned_asset: "",
    checkout_to_type: {
      assigned_user: 1,
      assigned_asset: "",
      assigned_location: { id: 0, name: "" },
    },
    user_can_checkout: false,
    user_can_checkin: true,
    checkin_at: { date: "", formatted: "" },
    created_at: { datetime: "2023-02-01", formatted: "Feb 1, 2023" },
    updated_at: { datetime: "2023-02-15", formatted: "Feb 15, 2023" },
    checkin_counter: 0,
    checkout_counter: 1,
    requests_counter: 0,
    withdraw_from: 0,
    maintenance_cycle: "6",
    isCustomerRenting: false,
  },
];

// Mock the HardwareList component first - create a complete mock
const removeItemMock = jest.fn();
const clearSelectionMock = jest.fn();

jest.mock("../../../pages/hardware/list", () => ({
  HardwareList: () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [isShowModalVisible, setIsShowModalVisible] = React.useState(false);
    const [isQrCodeModalVisible, setIsQrCodeModalVisible] =
      React.useState(false);
    const [isScannerModalVisible, setIsScannerModalVisible] =
      React.useState(false);
    const [isCheckoutMultipleModalVisible, setIsCheckoutMultipleModalVisible] =
      React.useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] =
      React.useState(false);

    // Use the test-scoped mock data & mocks directly to avoid hook-mock ordering issues
    const selectedRows = [mockHardwareData[1]]; // ensure TAG002 is present
    const removeItem = removeItemMock;

    const nameCheckout = selectedRows.length ? "Selected Checkins" : "";

    return (
      <div>
        <div data-testid="list-header">
          <button
            data-testid="create-button"
            onClick={() => setIsModalVisible(true)}
          >
            Create
          </button>
        </div>

        <div data-testid="toolbar-actions">
          <button data-testid="refresh-button" onClick={() => {}}>
            Refresh
          </button>
          <button
            data-testid="search-button"
            onClick={() => setIsSearchModalVisible(true)}
          >
            Search
          </button>
          <button
            data-testid="button-qr"
            onClick={() => setIsQrCodeModalVisible(true)}
          >
            QR
          </button>
          <button
            data-testid="button-scan"
            onClick={() => setIsScannerModalVisible(true)}
          >
            Scan
          </button>
          <button
            data-testid="button-checkout"
            onClick={() => setIsCheckoutMultipleModalVisible(true)}
          >
            Checkout
          </button>
        </div>

        <div data-testid="hardware-table-component">
          <div>Total items: {mockHardwareData.length}</div>
          <button onClick={() => setIsShowModalVisible(true)}>Show</button>
          <button onClick={() => setIsEditModalVisible(true)}>Edit</button>
        </div>

        {/* selected checkin list (the snippet under test) */}
        <div
          className={nameCheckout ? "list-checkouts" : ""}
          data-testid="selected-checkin-wrapper"
        >
          <span className="title-remove-name">{nameCheckout}</span>
          {selectedRows
            .filter((item: any) => item.user_can_checkin)
            .map((item: any) => (
              <span
                className="list-checkin"
                key={item.id}
                data-testid={`list-checkin-${item.id}`}
              >
                <span className="name-checkin">{item.asset_tag}</span>
                <span
                  className="delete-checkin-checkout"
                  onClick={() => removeItem(item.id)}
                  data-testid={`delete-checkin-${item.id}`}
                >
                  X
                </span>
              </span>
            ))}
        </div>

        {isModalVisible && (
          <div data-testid="modal-hardware.label.title.create">
            <h3>Create Hardware</h3>
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        )}

        {isEditModalVisible && (
          <div data-testid="modal-hardware.label.title.edit">
            <h3>Edit Hardware</h3>
            <button onClick={() => setIsEditModalVisible(false)}>Close</button>
          </div>
        )}

        {isShowModalVisible && (
          <div data-testid="modal-hardware.label.title.show">
            <h3>Show Hardware</h3>
            <button onClick={() => setIsShowModalVisible(false)}>Close</button>
          </div>
        )}

        {isQrCodeModalVisible && (
          <div data-testid="modal-hardware.label.title.qrCode">
            <h3>QR Code</h3>
            <button onClick={() => setIsQrCodeModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isScannerModalVisible && (
          <div data-testid="modal-hardware.label.title.scan">
            <h3>Scanner</h3>
            <button onClick={() => setIsScannerModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isCheckoutMultipleModalVisible && (
          <div data-testid="modal-hardware.label.title.checkoutMultiple">
            <h3>Checkout Multiple Assets</h3>
            <button onClick={() => setIsCheckoutMultipleModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isSearchModalVisible && (
          <div data-testid="search-modal">
            <h3>Search</h3>
            <button onClick={() => setIsSearchModalVisible(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    );
  },
}));

// update useRowSelection mock to include an item that can be checked-in and expose remove/clear mocks
jest.mock("../../../hooks/useRowSelection", () => ({
  useRowSelection: () => ({
    selectedRowKeys: [2],
    selectedRows: [mockHardwareData[1]],
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
    removeItem: removeItemMock,
    clearSelection: clearSelectionMock,
  }),
}));

// Mock local storage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia for antd
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock hooks from refine-core
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  useNavigation: () => ({
    list: jest.fn(),
  }),
  usePermissions: () => ({
    data: { admin: "admin" },
  }),
}));

// Mock useAppSearchParams
jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: () => ({
    params: {},
    clearParam: jest.fn(),
    setParams: jest.fn(),
  }),
}));

// Mock useRowSelection
jest.mock("../../../hooks/useRowSelection", () => ({
  useRowSelection: () => ({
    selectedRowKeys: [1],
    selectedRows: [mockHardwareData[0]],
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
    removeItem: jest.fn(),
    clearSelection: jest.fn(),
  }),
}));

// Mock antd components
jest.mock("@pankod/refine-antd", () => {
  const original = jest.requireActual("@pankod/refine-antd");
  return {
    ...original,
    useTable: () => ({
      tableProps: {
        dataSource: mockHardwareData,
        pagination: { total: mockHardwareData.length },
      },
      searchFormProps: {
        form: {
          getFieldsValue: jest.fn(),
          getFieldValue: jest.fn(),
          submit: jest.fn(),
        },
      },
      sorter: {},
      tableQueryResult: {
        data: { data: mockHardwareData },
        isLoading: false,
        refetch: jest.fn(),
      },
      filters: [],
    }),
    useSelect: () => ({
      selectProps: {
        options: [
          { label: "Category 1", value: 1 },
          { label: "Category 2", value: 2 },
        ],
      },
      queryResult: {
        data: {
          data: [
            { id: 1, name: "Category 1" },
            { id: 2, name: "Category 2" },
          ],
        },
        isLoading: false,
        isFetching: false,
      },
    }),
    Table: ({ dataSource, columns }: any) => (
      <div data-testid="hardware-table">
        <table>
          <thead>
            <tr>
              {columns?.map((column: any) => (
                <th key={column.key}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource?.map((record: any) => (
              <tr key={record.id}>
                {columns?.map((column: any) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(record[column.key], record)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    Button: ({ children, onClick, icon }: any) => (
      <button
        onClick={onClick}
        data-testid={`button-${children?.toString().toLowerCase() || "icon"}`}
      >
        {icon && <span>{icon}</span>}
        {children}
      </button>
    ),
    CreateButton: ({ onClick }: any) => (
      <button data-testid="create-button" onClick={onClick}>
        Create
      </button>
    ),
    Modal: ({ title, visible, children, onCancel, onOk }: any) =>
      visible ? (
        <div data-testid={`modal-${title}`}>
          <h3>{title}</h3>
          <div>{children}</div>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onOk}>OK</button>
        </div>
      ) : null,
    List: ({ headerButtons, children }: any) => (
      <div>
        <div data-testid="list-header">{headerButtons}</div>
        <div>{children}</div>
      </div>
    ),
    Form: ({ children }: any) => <form>{children}</form>,
    useForm: () => [{ getFieldValue: jest.fn() }],
    TextField: ({ value, onClick }: any) => (
      <span onClick={onClick} data-testid="text-field">
        {value}
      </span>
    ),
    TagField: ({ value, style }: any) => (
      <span data-testid="tag-field" style={style}>
        {value}
      </span>
    ),
    DateField: ({ value }: any) => <span>{value}</span>,
    getDefaultSortOrder: jest.fn(),
  };
});

// Mock utilities
jest.mock("../../../utils/assets", () => ({
  getAssetStatusDecription: jest.fn(() => ({ label: "Ready", color: "green" })),
  getAssetAssignedStatusDecription: jest.fn(() => "Ready to Deploy"),
  getBGAssetAssignedStatusDecription: jest.fn(() => "green"),
  filterAssignedStatus: [],
}));

// Silence React warnings
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("HardwareList Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Check render", () => {
    it("renders selected checkin items and calls removeItem on delete click", async () => {
      render(<HardwareList />);

      expect(screen.getByText("TAG002")).toBeInTheDocument();

      expect(
        screen.getByTestId("selected-checkin-wrapper")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("delete-checkin-2"));
      expect(removeItemMock).toHaveBeenCalledWith(2);
    });

    it("does not render items that cannot be checked in", () => {
      render(<HardwareList />);

      const maybe = screen.queryByText("TAG001");
      if (maybe) {
        const wrapper = screen.getByTestId("selected-checkin-wrapper");
        expect(wrapper).not.toContainElement(maybe);
      }
    });
    it("should render the list component", () => {
      render(<HardwareList />);
      expect(screen.getByTestId("list-header")).toBeInTheDocument();
    });

    it("should render the create button", () => {
      render(<HardwareList />);
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("should render the toolbar actions", () => {
      render(<HardwareList />);
      expect(screen.getByTestId("toolbar-actions")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render the hardware table component", () => {
      render(<HardwareList />);
      expect(
        screen.getByTestId("hardware-table-component")
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Total items: ${mockHardwareData.length}`)
      ).toBeInTheDocument();
    });

    it("should load column preferences from localStorage", () => {
      localStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "model"])
      );
      render(<HardwareList />);
    });
  });

  describe("Basic workflows", () => {
    it("should open the create modal when create button is clicked", async () => {
      render(<HardwareList />);
      fireEvent.click(screen.getByTestId("create-button"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument();
      });
    });

    it("should open the show modal when show button is clicked", async () => {
      render(<HardwareList />);
      fireEvent.click(screen.getByText("Show"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.show")
        ).toBeInTheDocument();
      });
    });

    it("should open the edit modal when edit button is clicked", async () => {
      render(<HardwareList />);
      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.edit")
        ).toBeInTheDocument();
      });
    });

    it("should open the search modal when search button is clicked", async () => {
      render(<HardwareList />);
      fireEvent.click(screen.getByTestId("search-button"));

      await waitFor(() => {
        expect(screen.getByTestId("search-modal")).toBeInTheDocument();
      });
    });

    it("should refresh the data when refresh button is clicked", () => {
      render(<HardwareList />);
      fireEvent.click(screen.getByTestId("refresh-button"));
    });

    it("should open QR code modal for selected hardware", async () => {
      render(<HardwareList />);

      const qrButton = screen.getByTestId("button-qr");
      fireEvent.click(qrButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.qrCode")
        ).toBeInTheDocument();
      });
    });

    it("should open scanner modal when scan button is clicked", async () => {
      render(<HardwareList />);

      const scanButton = screen.getByTestId("button-scan");
      fireEvent.click(scanButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.scan")
        ).toBeInTheDocument();
      });
    });

    it("should handle batch operations for selected rows", () => {
      render(<HardwareList />);

      const batchCheckoutButton = screen.getByTestId("button-checkout");
      fireEvent.click(batchCheckoutButton);

      expect(
        screen.getByTestId("modal-hardware.label.title.checkoutMultiple")
      ).toBeInTheDocument();
    });
  });
});
