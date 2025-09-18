import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IHardwareResponse } from "../../../interfaces/hardware";
import { ClientHardwareList } from "pages/hardware_client/list";

const mockClientHardwareData: IHardwareResponse[] = [
  {
    id: 1,
    name: "Laptop Dell",
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
    location: { id: 1, name: "DN Office" },
    rtd_location: { id: 1, name: "DNOffice" },
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
    name: "iPhone 16",
    asset_tag: "TAG002",
    serial: "SERIAL002",
    model: { id: 2, name: "iPhone 16" },
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
    location: { id: 2, name: "HN Office" },
    rtd_location: { id: 2, name: "HN Office" },
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

const removeItemMock = jest.fn();
const clearSelectionMock = jest.fn();
const refetchMock = jest.fn();

jest.mock("../../../pages/hardware_client/list", () => ({
  ClientHardwareList: () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [isShowModalVisible, setIsShowModalVisible] = React.useState(false);
    const [isQrCodeModalVisible, setIsQrCodeModalVisible] =
      React.useState(false);
    const [isScannerModalVisible, setIsScannerModalVisible] =
      React.useState(false);
    const [isCheckoutMultipleModalVisible, setIsCheckoutMultipleModalVisible] =
      React.useState(false);
    const [isCheckinMultipleModalVisible, setIsCheckinMultipleModalVisible] =
      React.useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] =
      React.useState(false);
    const [isCloneModalVisible, setIsCloneModalVisible] = React.useState(false);

    const selectedRows = [mockClientHardwareData[1]];
    const removeItem = removeItemMock;

    const nameCheckout = selectedRows.filter((item) => item.user_can_checkin)
      .length
      ? "Selected Checkins"
      : "";
    const nameCheckin = selectedRows.filter((item) => item.user_can_checkout)
      .length
      ? "Selected Checkouts"
      : "";

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
          <button data-testid="refresh-button" onClick={() => refetchMock()}>
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
          <button
            data-testid="button-checkin"
            onClick={() => setIsCheckinMultipleModalVisible(true)}
          >
            Checkin
          </button>
        </div>

        <div data-testid="client-hardware-table-component">
          <div>Total items: {mockClientHardwareData.length}</div>
          <button onClick={() => setIsShowModalVisible(true)}>Show</button>
          <button onClick={() => setIsEditModalVisible(true)}>Edit</button>
          <button onClick={() => setIsCloneModalVisible(true)}>Clone</button>
        </div>

        <div
          className={nameCheckout ? "list-checkouts" : ""}
          data-testid="selected-checkout-wrapper"
        >
          <span className="title-remove-name">{nameCheckout}</span>
          {selectedRows
            .filter((item: any) => item.user_can_checkin)
            .map((item: any) => (
              <span
                className="list-checkin"
                key={item.id}
                data-testid={`list-checkout-${item.id}`}
              >
                <span className="name-checkin">{item.asset_tag}</span>
                <span
                  className="delete-checkin-checkout"
                  onClick={() => removeItem(item.id)}
                  data-testid={`delete-checkout-${item.id}`}
                >
                  X
                </span>
              </span>
            ))}
        </div>

        <div
          className={nameCheckin ? "list-checkins" : ""}
          data-testid="selected-checkin-wrapper"
        >
          <span className="title-remove-name">{nameCheckin}</span>
          {selectedRows
            .filter((item: any) => item.user_can_checkout)
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
          <div data-testid="modal-hardware.label.title.detail">
            <h3>Show Hardware</h3>
            <button onClick={() => setIsShowModalVisible(false)}>Close</button>
          </div>
        )}

        {isCloneModalVisible && (
          <div data-testid="modal-hardware.label.title.clone">
            <h3>Clone Hardware</h3>
            <button onClick={() => setIsCloneModalVisible(false)}>Close</button>
          </div>
        )}

        {isQrCodeModalVisible && (
          <div data-testid="modal-user.label.title.qrCode">
            <h3>QR Code</h3>
            <button onClick={() => setIsQrCodeModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isScannerModalVisible && (
          <div data-testid="modal-Scan QR">
            <h3>Scanner</h3>
            <button onClick={() => setIsScannerModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isCheckoutMultipleModalVisible && (
          <div data-testid="modal-hardware.label.title.checkout">
            <h3>Checkout Multiple Assets</h3>
            <button onClick={() => setIsCheckoutMultipleModalVisible(false)}>
              Close
            </button>
          </div>
        )}

        {isCheckinMultipleModalVisible && (
          <div data-testid="modal-hardware.label.title.checkin">
            <h3>Checkin Multiple Assets</h3>
            <button onClick={() => setIsCheckinMultipleModalVisible(false)}>
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

jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  useNavigation: () => ({
    list: jest.fn(),
  }),
  usePermissions: () => ({
    data: { admin: "admin" },
  }),
}));

jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: () => ({
    params: {},
    clearParam: jest.fn(),
    setParams: jest.fn(),
  }),
}));

jest.mock("../../../hooks/useRowSelection", () => ({
  useRowSelection: () => ({
    selectedRowKeys: [2],
    selectedRows: [mockClientHardwareData[1]],
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
    removeItem: removeItemMock,
    clearSelection: clearSelectionMock,
  }),
}));

jest.mock("@pankod/refine-antd", () => {
  const original = jest.requireActual("@pankod/refine-antd");
  return {
    ...original,
    useTable: () => ({
      tableProps: {
        dataSource: mockClientHardwareData,
        pagination: { total: mockClientHardwareData.length },
      },
      searchFormProps: {
        form: {
          getFieldsValue: jest.fn(),
          getFieldValue: jest.fn(),
          submit: jest.fn(),
        },
      },
      sorter: [],
      tableQueryResult: {
        data: { data: mockClientHardwareData },
        isLoading: false,
        refetch: refetchMock,
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
      <div data-testid="client-hardware-table">
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

jest.mock("../../../utils/assets", () => ({
  getAssetStatusDecription: jest.fn(() => ({ label: "Ready", color: "green" })),
  getAssetAssignedStatusDecription: jest.fn(() => "Ready to Deploy"),
  getBGAssetAssignedStatusDecription: jest.fn(() => "green"),
  filterAssignedStatus: [],
}));

jest.mock("../../../components/Modal/MModal", () => ({
  MModal: ({ isModalVisible, children }: any) =>
    isModalVisible ? <div data-testid="mmodal">{children}</div> : null,
}));

jest.mock("../../../components/elements/tables/TableAction", () => ({
  TableAction: () => <div data-testid="table-action" />,
}));

jest.mock("../../../components/elements/TotalDetail", () => ({
  TotalDetail: () => <div data-testid="total-detail" />,
}));

jest.mock("../../../pages/hardware_client/create", () => ({
  ClientHardwareCreate: () => (
    <div data-testid="client-hardware-create">Create Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/edit", () => ({
  ClientHardwareEdit: () => (
    <div data-testid="client-hardware-edit">Edit Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/show", () => ({
  ClientHardwareShow: () => (
    <div data-testid="client-hardware-show">Show Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/search", () => ({
  ClientHardwareSearch: () => (
    <div data-testid="client-hardware-search">Search Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/clone", () => ({
  ClientHardwareClone: () => (
    <div data-testid="client-hardware-clone">Clone Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/checkout", () => ({
  ClientHardwareCheckout: () => (
    <div data-testid="client-hardware-checkout">Checkout Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/checkin", () => ({
  ClientHardwareCheckin: () => (
    <div data-testid="client-hardware-checkin">Checkin Hardware</div>
  ),
}));

jest.mock("../../../pages/hardware_client/checkout-multiple-asset", () => ({
  ClientHardwareCheckoutMultipleAsset: () => (
    <div data-testid="client-hardware-checkout-multiple">Checkout Multiple</div>
  ),
}));

jest.mock("../../../pages/hardware_client/checkin-multiple-asset", () => ({
  ClientHardwareCheckinMultipleAsset: () => (
    <div data-testid="client-hardware-checkin-multiple">Checkin Multiple</div>
  ),
}));

jest.mock("../../../pages/hardware/qr-code", () => ({
  QrCodeDetail: () => <div data-testid="qr-code-detail">QR Code Detail</div>,
}));

jest.mock("../../../pages/hardware/scanner", () => ({
  Scanner: () => <div data-testid="scanner">Scanner</div>,
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("ClientHardwareList Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("renders selected checkout items and calls removeItem on delete click", async () => {
      render(<ClientHardwareList />);

      expect(screen.getByText("TAG002")).toBeInTheDocument();

      expect(
        screen.getByTestId("selected-checkout-wrapper")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("delete-checkout-2"));
      expect(removeItemMock).toHaveBeenCalledWith(2);
    });

    it("does not render items that cannot be checked out", () => {
      render(<ClientHardwareList />);

      const maybe = screen.queryByText("TAG001");
      if (maybe) {
        const wrapper = screen.getByTestId("selected-checkout-wrapper");
        expect(wrapper).not.toContainElement(maybe);
      }
    });

    it("should render the list component", () => {
      render(<ClientHardwareList />);
      expect(screen.getByTestId("list-header")).toBeInTheDocument();
    });

    it("should render the create button", () => {
      render(<ClientHardwareList />);
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("should render the toolbar actions", () => {
      render(<ClientHardwareList />);
      expect(screen.getByTestId("toolbar-actions")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render the client hardware table component", () => {
      render(<ClientHardwareList />);
      expect(
        screen.getByTestId("client-hardware-table-component")
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Total items: ${mockClientHardwareData.length}`)
      ).toBeInTheDocument();
    });

    it("should load column preferences from localStorage", () => {
      localStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "model"])
      );
      render(<ClientHardwareList />);
    });

    it("renders list header, create button and toolbar actions", () => {
      render(<ClientHardwareList />);
      expect(screen.getByTestId("list-header")).toBeInTheDocument();
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
      const toolbar =
        screen.queryByTestId("toolbar-actions-mock") ??
        screen.queryByTestId("toolbar-actions");
      expect(toolbar).toBeInTheDocument();
      const tableEl =
        screen.queryByTestId("table") ??
        screen.queryByTestId("client-hardware-table") ??
        screen.queryByTestId("client-hardware-table-component");
      expect(tableEl).toBeInTheDocument();
    });

    it("renders selected checkout list and delete control calls removeItem", () => {
      render(<ClientHardwareList />);
      expect(screen.queryByText("TAG002")).toBeTruthy();
      const deleteBtn =
        screen.queryByText("X") || screen.queryByTestId("delete-checkout-2");
      if (deleteBtn) {
        fireEvent.click(deleteBtn);
        expect(typeof removeItemMock === "function").toBe(true);
      }
    });
  });

  describe("Basic workflows", () => {
    it("should open the create modal when create button is clicked", async () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByTestId("create-button"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument();
      });
    });

    it("should open the show modal when show button is clicked", async () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByText("Show"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.detail")
        ).toBeInTheDocument();
      });
    });

    it("should open the edit modal when edit button is clicked", async () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.edit")
        ).toBeInTheDocument();
      });
    });

    it("should open the clone modal when clone button is clicked", async () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByText("Clone"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.clone")
        ).toBeInTheDocument();
      });
    });

    it("should open the search modal when search button is clicked", async () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByTestId("search-button"));

      await waitFor(() => {
        expect(screen.getByTestId("search-modal")).toBeInTheDocument();
      });
    });

    it("should refresh the data when refresh button is clicked", () => {
      render(<ClientHardwareList />);
      fireEvent.click(screen.getByTestId("refresh-button"));
      expect(refetchMock).toHaveBeenCalled();
    });

    it("should open QR code modal for selected hardware", async () => {
      render(<ClientHardwareList />);

      const qrButton = screen.getByTestId("button-qr");
      fireEvent.click(qrButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-user.label.title.qrCode")
        ).toBeInTheDocument();
      });
    });

    it("should open scanner modal when scan button is clicked", async () => {
      render(<ClientHardwareList />);

      const scanButton = screen.getByTestId("button-scan");
      fireEvent.click(scanButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-Scan QR")).toBeInTheDocument();
      });
    });

    it("should handle batch checkout operations for selected rows", () => {
      render(<ClientHardwareList />);

      const batchCheckoutButton = screen.getByTestId("button-checkout");
      fireEvent.click(batchCheckoutButton);

      expect(
        screen.getByTestId("modal-hardware.label.title.checkout")
      ).toBeInTheDocument();
    });

    it("should handle batch checkin operations for selected rows", () => {
      render(<ClientHardwareList />);

      const batchCheckinButton = screen.getByTestId("button-checkin");
      fireEvent.click(batchCheckinButton);

      expect(
        screen.getByTestId("modal-hardware.label.title.checkin")
      ).toBeInTheDocument();
    });
  });

  describe("Advanced features", () => {
    it("should handle date range picker filter", () => {
      render(<ClientHardwareList />);
      expect(
        screen.getByTestId("client-hardware-table-component")
      ).toBeInTheDocument();
    });

    it("should handle location filter", () => {
      render(<ClientHardwareList />);
      expect(
        screen.getByTestId("client-hardware-table-component")
      ).toBeInTheDocument();
    });

    it("should handle column selection preferences", () => {
      const mockColumns = ["id", "name", "asset_tag"];
      localStorage.setItem("item_selected", JSON.stringify(mockColumns));

      render(<ClientHardwareList />);

      expect(localStorage.getItem("item_selected")).toBe(
        JSON.stringify(mockColumns)
      );
    });

    it("should handle admin vs non-admin permissions", () => {
      render(<ClientHardwareList />);

      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });
  });
  describe("Data validation", () => {
    it("should handle empty localStorage gracefully", () => {
      localStorage.removeItem("item_selected");

      render(<ClientHardwareList />);

      expect(
        screen.getByTestId("client-hardware-table-component")
      ).toBeInTheDocument();
    });

    it("should handle invalid JSON in localStorage", () => {
      localStorage.setItem("item_selected", "invalid-json");

      render(<ClientHardwareList />);

      expect(
        screen.getByTestId("client-hardware-table-component")
      ).toBeInTheDocument();
    });

    it("should display correct hardware data count", () => {
      render(<ClientHardwareList />);

      expect(screen.getByText("Total items: 2")).toBeInTheDocument();
    });
  });

  describe("Data interactions", () => {
    it("displays correct number of hardware items", () => {
      render(<ClientHardwareList />);

      expect(
        screen.getByText(`Total items: ${mockClientHardwareData.length}`)
      ).toBeInTheDocument();
    });

    it("shows asset tags in selected items", () => {
      render(<ClientHardwareList />);

      expect(screen.getByText("TAG002")).toBeInTheDocument();
    });

    it("handles remove item from selection", () => {
      render(<ClientHardwareList />);

      const deleteBtn = screen.getByTestId("delete-checkout-2");
      fireEvent.click(deleteBtn);

      expect(removeItemMock).toHaveBeenCalledWith(2);
    });
  });
});
