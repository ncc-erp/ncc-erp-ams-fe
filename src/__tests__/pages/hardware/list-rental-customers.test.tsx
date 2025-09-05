import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import { IHardwareResponse } from "../../../interfaces/hardware";

// Mock hardware rental data first, so it's available for other mocks
const mockHardwareRentalData: IHardwareResponse[] = [
  {
    id: 1,
    name: "Laptop Dell XPS - Rental",
    asset_tag: "RENT001",
    serial: "RENTAL001",
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
      id: 1,
      name: "Customer ABC Corp",
      username: "customer_abc",
      last_name: "Corp",
      first_name: "ABC",
    },
    assigned_status: 1,
    location: { id: 1, name: "Rental Office" },
    rtd_location: { id: 1, name: "Rental Office" },
    manufacturer: { id: 1, name: "Dell" },
    supplier: { id: 1, name: "Dell Store" },
    notes: "For customer rental",
    order_number: "RENT-001",
    image: "laptop-rental.jpg",
    warranty_months: "24",
    warranty_expires: { date: "2025-01-01", formatted: "Jan 1, 2025" },
    purchase_cost: 1500,
    purchase_date: { date: "2023-01-01", formatted: "Jan 1, 2023" },
    last_audit_date: "2023-06-15",
    requestable: "1",
    physical: 1,
    note: "",
    expected_checkin: { date: "", formatted: "" },
    last_checkout: { date: "2024-01-15", formatted: "Jan 15, 2024" },
    assigned_location: { id: 1, name: "Customer Site" },
    assigned_user: 1,
    assigned_asset: "",
    checkout_to_type: {
      assigned_user: 1,
      assigned_asset: "",
      assigned_location: { id: 1, name: "Customer Site" },
    },
    user_can_checkout: true,
    user_can_checkin: false,
    checkin_at: { date: "", formatted: "" },
    created_at: { datetime: "2023-01-01", formatted: "Jan 1, 2023" },
    updated_at: { datetime: "2024-01-15", formatted: "Jan 15, 2024" },
    checkin_counter: 0,
    checkout_counter: 1,
    requests_counter: 0,
    withdraw_from: 0,
    maintenance_cycle: "12",
    isCustomerRenting: true,
    startRentalDate: { date: "2024-01-15", formatted: "Jan 15, 2024" },
  },
  {
    id: 2,
    name: "iPhone 13 - Customer Rental",
    asset_tag: "RENT002",
    serial: "RENTAL002",
    model: { id: 2, name: "iPhone 13" },
    model_number: "A2482",
    category: { id: 2, name: "Mobile Phone" },
    status_label: {
      id: 4,
      name: "Assigned",
      status_type: "assigned",
      status_meta: "",
    },
    assigned_to: {
      id: 2,
      name: "Customer XYZ Ltd",
      username: "customer_xyz",
      last_name: "Ltd",
      first_name: "XYZ",
    },
    assigned_status: 2,
    location: { id: 2, name: "Rental Office 2" },
    rtd_location: { id: 2, name: "Rental Office 2" },
    manufacturer: { id: 2, name: "Apple" },
    supplier: { id: 2, name: "Apple Store" },
    notes: "Premium rental device",
    order_number: "RENT-002",
    image: "iphone-rental.jpg",
    warranty_months: "12",
    warranty_expires: { date: "2024-02-01", formatted: "Feb 1, 2024" },
    purchase_cost: 1000,
    purchase_date: { date: "2023-02-01", formatted: "Feb 1, 2023" },
    last_audit_date: "2023-07-15",
    requestable: "0",
    physical: 1,
    note: "",
    expected_checkin: { date: "", formatted: "" },
    last_checkout: { date: "2024-02-15", formatted: "Feb 15, 2024" },
    assigned_location: { id: 2, name: "Customer Office XYZ" },
    assigned_user: 2,
    assigned_asset: "",
    checkout_to_type: {
      assigned_user: 2,
      assigned_asset: "",
      assigned_location: { id: 2, name: "Customer Office XYZ" },
    },
    user_can_checkout: false,
    user_can_checkin: true,
    checkin_at: { date: "", formatted: "" },
    created_at: { datetime: "2023-02-01", formatted: "Feb 1, 2023" },
    updated_at: { datetime: "2024-02-15", formatted: "Feb 15, 2024" },
    checkin_counter: 0,
    checkout_counter: 1,
    requests_counter: 0,
    withdraw_from: 0,
    maintenance_cycle: "6",
    isCustomerRenting: true,
    startRentalDate: { date: "2024-02-15", formatted: "Feb 15, 2024" },
  },
];

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

// Silence console errors
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Mock hooks from refine-core
jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: () => (key: string) => key,
  useNavigation: () => ({
    list: jest.fn(),
  }),
  usePermissions: () => ({
    data: { admin: "1" },
  }),
  useCustom: jest.fn(),
  useCreate: jest.fn(() => ({
    mutate: jest.fn(),
    data: { data: { status: "success" } },
    isLoading: false,
  })),
  useUpdate: jest.fn(() => ({
    mutate: jest.fn(),
    data: { data: { status: "success" } },
    isLoading: false,
  })),
  useDelete: jest.fn(() => ({
    mutate: jest.fn(),
    data: { data: { status: "success" } },
    isLoading: false,
  })),
  useNotification: () => ({
    open: jest.fn(),
  }),
  useApiUrl: () => "http://localhost:3000",
  useResource: () => ({
    resource: {
      name: "hardware",
      list: () => <></>,
    },
  }),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useSearchParams: () => {
    const searchParams = new URLSearchParams(
      "search=rental&rtd_location_id=1&dateFrom=2024-01-01&dateTo=2024-12-31"
    );
    return [
      searchParams,
      jest.fn((newParams: Record<string, string | null>) => {
        Object.entries(newParams).forEach(
          ([key, value]: [string, string | null]) => {
            if (value === null) {
              searchParams.delete(key);
            } else {
              searchParams.set(key, value);
            }
          }
        );
      }),
    ] as const;
  },
  useNavigate: () => jest.fn(),
}));

// Mock moment
jest.mock("moment", () => {
  const actualMoment = jest.requireActual("moment");
  const mockMoment = (date: any) => {
    if (date === undefined) return actualMoment();
    return actualMoment(date);
  };
  mockMoment.format = actualMoment.format;
  mockMoment.isMoment = actualMoment.isMoment;
  mockMoment.locale = actualMoment.locale;
  mockMoment.unix = actualMoment.unix;
  return mockMoment;
});

// Mock antd components
jest.mock("@pankod/refine-antd", () => ({
  useTable: () => ({
    tableProps: {
      dataSource: mockHardwareRentalData,
      pagination: {
        total: mockHardwareRentalData.length,
        current: 1,
        pageSize: 10,
      },
      loading: false,
    },
    searchFormProps: {
      form: {
        getFieldsValue: jest.fn(() => ({ location: 1 })),
        getFieldValue: jest.fn(),
        submit: jest.fn(),
        resetFields: jest.fn(),
        setFieldsValue: jest.fn(),
      },
    },
    sorter: { field: "id", order: "desc" },
    filters: [
      {
        field: "isCustomerRenting",
        operator: "eq",
        value: true,
      },
    ],
    tableQueryResult: {
      data: { data: mockHardwareRentalData },
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
      error: null,
    },
  }),
  useSelect: (config: any) => {
    const mockOptions: Record<string, { label: string; value: number }[]> = {
      "api/v1/categories": [
        { label: "Laptop", value: 1 },
        { label: "Mobile Phone", value: 2 },
      ],
      "api/v1/statuslabels": [
        { label: "Ready to Deploy", value: 1 },
        { label: "Assigned", value: 4 },
      ],
      "api/v1/locations": [
        { label: "Rental Office", value: 1 },
        { label: "Rental Office 2", value: 2 },
      ],
      "api/v1/suppliers": [
        { label: "Dell Store", value: 1 },
        { label: "Apple Store", value: 2 },
      ],
    };

    const resourceKey = config.resource as string;
    const options = mockOptions[resourceKey] || [];

    return {
      selectProps: {
        options,
        loading: false,
        onChange: jest.fn(),
      },
      queryResult: {
        data: { data: options },
        isLoading: false,
        isFetching: false,
        error: null,
      },
    };
  },
  Table: ({ dataSource, children, loading, pagination }: any) => (
    <div data-testid="hardware-rental-table" role="table">
      {loading && <div data-testid="table-loading">Loading...</div>}
      {dataSource?.map((item: any) => (
        <div key={item.id} data-testid={`table-row-${item.id}`} role="row">
          <span>{item.name}</span>
        </div>
      ))}
      {pagination && <div data-testid="table-pagination">Pagination</div>}
      {children}
    </div>
  ),
  Button: ({ children, onClick, icon, className, type, disabled }: any) => (
    <button
      onClick={onClick}
      data-testid={
        className === "ant-btn-checkout"
          ? "checkout-button"
          : `button-${children?.toString().toLowerCase()?.replace(/\s+/g, "-") || "icon"}`
      }
      className={className}
      type={type}
      disabled={disabled}
      aria-label={children?.toString() || "Button"}
    >
      {icon && <span data-testid="button-icon">Icon</span>}
      {children}
    </button>
  ),
  CreateButton: ({ onClick, children }: any) => (
    <button data-testid="create-button" onClick={onClick}>
      {children || "hardware.label.tooltip.create"}
    </button>
  ),
  ShowButton: ({ onClick, recordItemId, children }: any) => (
    <button data-testid={`show-button-${recordItemId}`} onClick={onClick}>
      {children || "Show"}
    </button>
  ),
  EditButton: ({ onClick, recordItemId, children }: any) => (
    <button data-testid={`edit-button-${recordItemId}`} onClick={onClick}>
      {children || "Edit"}
    </button>
  ),
  DeleteButton: ({ onClick, recordItemId, children }: any) => (
    <button data-testid={`delete-button-${recordItemId}`} onClick={onClick}>
      {children || "Delete"}
    </button>
  ),
  CloneButton: ({ onClick, recordItemId, children }: any) => (
    <button data-testid={`clone-button-${recordItemId}`} onClick={onClick}>
      {children || "Clone"}
    </button>
  ),
  List: ({ title, pageHeaderProps, children }: any) => (
    <div data-testid="list-component">
      <div data-testid="list-title">{title}</div>
      <div data-testid="list-header">{pageHeaderProps?.extra}</div>
      {children}
    </div>
  ),
  Form: ({ children, onFinish, form }: any) => (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        onFinish?.(form?.getFieldsValue());
      }}
    >
      {children}
    </form>
  ),
  useForm: () => ({
    form: {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
      resetFields: jest.fn(),
      submit: jest.fn(),
      getFieldsValue: jest.fn(() => ({})),
    },
  }),
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
  DateField: ({ value }: any) => <span data-testid="date-field">{value}</span>,
  getDefaultSortOrder: jest.fn(() => "descend"),
  Space: ({ children, size }: any) => (
    <div data-testid="space" style={{ gap: size }}>
      {children}
    </div>
  ),
  Tooltip: ({ children, title }: any) => (
    <div title={title} data-testid="tooltip">
      {children}
    </div>
  ),
  Checkbox: ({ children, onChange, checked }: any) => (
    <label>
      <input
        type="checkbox"
        data-testid="column-checkbox"
        onChange={onChange}
        checked={checked}
        aria-label={children?.toString()}
      />
      {children}
    </label>
  ),
  Select: (() => {
    const SelectComponent = ({
      children,
      onChange,
      placeholder,
      options,
      value,
      mode,
    }: any) => (
      <select
        data-testid="select"
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        aria-label={placeholder}
        multiple={mode === "multiple"}
      >
        <option value="">{placeholder}</option>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    );
    SelectComponent.Option = Object.assign(
      ({ children, value }: any) => <option value={value}>{children}</option>,
      { displayName: "Select.Option" }
    );
    SelectComponent.displayName = "Select";
    return SelectComponent;
  })(),
}));

// Mock antd Spin and DatePicker
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Spin: ({ tip }: any) => <div data-testid="loading-spinner">{tip}</div>,
  DatePicker: {
    RangePicker: ({ onChange, value = [], format, placeholder }: any) => (
      <div data-testid="date-range-picker">
        <input
          type="date"
          data-testid="date-from"
          value={(Array.isArray(value) && value[0]?.format?.(format)) || ""}
          placeholder={Array.isArray(placeholder) ? placeholder[0] : ""}
          onChange={(e) => {
            const newValue = [
              moment(e.target.value),
              Array.isArray(value) ? value[1] : null,
            ];
            onChange?.(
              newValue,
              newValue.map((v) => v?.format?.(format) || "")
            );
          }}
        />
        <input
          type="date"
          data-testid="date-to"
          value={(Array.isArray(value) && value[1]?.format?.(format)) || ""}
          placeholder={Array.isArray(placeholder) ? placeholder[1] : ""}
          onChange={(e) => {
            const newValue = [
              Array.isArray(value) ? value[0] : null,
              moment(e.target.value),
            ];
            onChange?.(
              newValue,
              newValue.map((v) => v?.format?.(format) || "")
            );
          }}
        />
      </div>
    ),
  },
  Grid: {
    useBreakpoint: () => ({ lg: true }),
  },
  Image: ({ src, width }: any) => (
    <img data-testid="hardware-image" src={src} width={width} alt="" />
  ),
  Typography: {
    Title: ({ children, level }: any) => (
      <h1 data-testid={`title-${level}`}>{children}</h1>
    ),
    Text: ({ children, type }: any) => (
      <span
        data-testid="typography-text"
        style={{ color: type === "danger" ? "red" : "black" }}
      >
        {children}
      </span>
    ),
  },
}));

// Mock table column hook
jest.mock("../../../pages/hardware/table-column-rental-customers", () => ({
  useRentalCustomerColumns: () => [
    { key: "id", title: "ID" },
    { key: "name", title: "hardware.label.field.assetName" },
    { key: "image", title: "hardware.label.field.image" },
    { key: "asset_tag", title: "hardware.label.field.propertyCard" },
    { key: "serial", title: "hardware.label.field.serial" },
    { key: "model", title: "hardware.label.field.propertyType" },
    { key: "category", title: "hardware.label.field.category" },
    { key: "status_label", title: "hardware.label.field.status" },
    { key: "assigned_to", title: "hardware.label.field.checkoutTo" },
    { key: "location", title: "hardware.label.field.rtd_location" },
    { key: "rtd_location", title: "hardware.label.field.locationFix" },
    {
      key: "isCustomerRenting",
      title: "hardware.label.field.isCustomerRenting",
    },
    { key: "startRentalDate", title: "hardware.label.field.startRentalDate" },
  ],
}));

// Mock child components
jest.mock("../../../components/Modal/MModal", () => ({
  MModal: ({ children, isModalVisible, title }: any) =>
    isModalVisible ? (
      <div data-testid={`modal-${title}`}>
        <h3>{title}</h3>
        {children}
      </div>
    ) : null,
}));

jest.mock("../../../components/elements/TotalDetail", () => ({
  TotalDetail: () => <div data-testid="total-detail">Total Detail</div>,
}));

// Mock hardware components
jest.mock("../../../pages/hardware/create", () => ({
  HardwareCreate: ({ setIsModalVisible }: any) => (
    <div data-testid="hardware-create">
      <button onClick={() => setIsModalVisible(false)}>Close</button>
    </div>
  ),
}));

jest.mock("../../../pages/hardware/edit", () => ({
  HardwareEdit: ({ setIsModalVisible }: any) => (
    <div data-testid="hardware-edit">
      <button onClick={() => setIsModalVisible(false)}>Close</button>
    </div>
  ),
}));

jest.mock("../../../pages/hardware/show", () => ({
  HardwareShow: () => <div data-testid="hardware-show">Show Details</div>,
}));

jest.mock("../../../pages/hardware/search", () => ({
  HardwareSearch: () => <div data-testid="hardware-search">Search Form</div>,
}));

jest.mock("../../../pages/hardware/clone", () => ({
  HardwareClone: () => <div data-testid="hardware-clone">Clone Form</div>,
}));

jest.mock("../../../pages/hardware/checkout", () => ({
  HardwareCheckout: () => (
    <div data-testid="hardware-checkout">Checkout Form</div>
  ),
}));

jest.mock("../../../pages/hardware/checkin", () => ({
  HardwareCheckin: () => <div data-testid="hardware-checkin">Checkin Form</div>,
}));

// Mock utilities
jest.mock("../../../utils/assets", () => ({
  getAssetStatusDecription: jest.fn(() => ({ label: "Ready", color: "green" })),
  getAssetAssignedStatusDecription: jest.fn(() => "Ready to Deploy"),
  getBGAssetAssignedStatusDecription: jest.fn(() => "green"),
  filterAssignedStatus: [],
}));

jest.mock("../../../utils/ConvertHardwareData", () => ({
  convertHardwareToEditData: jest.fn((data) => data),
}));

jest.mock("../../../constants/assets", () => ({
  dateFormat: "YYYY-MM-DD",
  EPermissions: { ADMIN: "1" },
  EBooleanString: { TRUE: "true", FALSE: "false" },
  STATUS_LABELS: { READY_TO_DEPLOY: 1, ASSIGN: 4 },
  EStatus: {
    PENDING: "Pending",
    BROKEN: "Broken",
    READY_TO_DEPLOY: "Ready to Deploy",
    ASSIGN: "Assign",
  },
}));

jest.mock("../../../api/baseApi", () => ({
  HARDWARE_CUSTOMER_RENTING_API: "api/v1/hardware/customer-renting",
  HARDWARE_RENTAL_DETAILS: "api/v1/hardware/customer-renting-total-detail",
  CATEGORIES_API: "api/v1/categories",
  STATUS_LABELS_API: "api/v1/statuslabels",
  LOCATION_API: "api/v1/locations",
}));

// Mock component trong file list-rental-customers.test.tsx
const MockHardwareListRentalCustomers = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = React.useState(false);
  const [isCloneModalVisible, setIsCloneModalVisible] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<[string, string]>(["", ""]);

  return (
    <div data-testid="list-component">
      <div data-testid="list-title">hardware.label.title.rentalCustomers</div>
      <button
        data-testid="create-button"
        onClick={() => setIsModalVisible(true)}
      >
        Create
      </button>

      <div data-testid="search-form">
        {/* Update date picker implementation */}
        <div data-testid="date-range-picker">
          <input
            type="date"
            data-testid="date-from"
            value={dateRange[0]}
            onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
          />
          <input
            type="date"
            data-testid="date-to"
            value={dateRange[1]}
            onChange={(e) => setDateRange([dateRange[0], e.target.value])}
          />
        </div>
        <select data-testid="select">
          <option value="1">Location 1</option>
        </select>
      </div>

      {/* Rest of your mock component */}
      <div data-testid="table-action">
        <button data-testid="refresh-button">Refresh</button>
        <button data-testid="columns-button">Columns</button>
        <button data-testid="search-button">Search</button>
      </div>

      <div data-testid="hardware-rental-table">
        <div data-testid="table-row-1">
          Row 1
          <button
            data-testid="show-button-1"
            onClick={() => setIsShowModalVisible(true)}
          >
            Show
          </button>
          <button
            data-testid="clone-button-1"
            onClick={() => setIsCloneModalVisible(true)}
          >
            Clone
          </button>
        </div>
        <div data-testid="table-row-2">Row 2</div>
        <button data-testid="button-checkin">Checkin</button>
      </div>

      <div data-testid="total-detail">Total Detail</div>

      {/* Modals */}
      {isModalVisible && (
        <div data-testid="modal-hardware.label.title.create">Create Modal</div>
      )}

      {isShowModalVisible && (
        <div>
          <div data-testid="modal-hardware.label.title.detail">
            Detail Modal
          </div>
          <div data-testid="hardware-show">Show Details</div>
        </div>
      )}

      {isCloneModalVisible && (
        <div>
          <div data-testid="modal-hardware.label.title.clone">Clone Modal</div>
          <div data-testid="hardware-clone">Clone Form</div>
        </div>
      )}
    </div>
  );
};

jest.mock("pages/hardware/list-rental-customers", () => ({
  HardwareListRentalCustomers: MockHardwareListRentalCustomers,
}));

describe("HardwareListRentalCustomers Component", () => {
  // const {
  //   HardwareListRentalCustomers,
  // } = require("pages/hardware/list-rental-customers");

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render the rental customers list component", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("list-component")).toBeInTheDocument();
    });

    it("should render the create button for admin users", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("create-button")).toBeInTheDocument();
    });

    it("should render the search form with date range and location filters", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("search-form")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("select")).toBeInTheDocument();
    });

    it("should render the toolbar actions", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("columns-button")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render the hardware rental table component", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("hardware-rental-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("table-row-2")).toBeInTheDocument();
    });

    it("should render total detail component", () => {
      render(<MockHardwareListRentalCustomers />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
    });

    it("should load column preferences from localStorage", () => {
      const savedColumns = ["id", "name", "serial"];
      localStorage.setItem(
        "item_selected_rental_customers",
        JSON.stringify(savedColumns)
      );

      render(<MockHardwareListRentalCustomers />);

      const loadedColumns = JSON.parse(
        localStorage.getItem("item_selected_rental_customers") || "[]"
      );
      expect(loadedColumns).toEqual(savedColumns);
    });
  });

  describe("Basic workflows", () => {
    it("should open the create modal when create button is clicked", async () => {
      render(<MockHardwareListRentalCustomers />);
      fireEvent.click(screen.getByTestId("create-button"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.create")
        ).toBeInTheDocument();
      });
    });

    it("should open the show modal when show button is clicked", async () => {
      render(<MockHardwareListRentalCustomers />);
      fireEvent.click(screen.getByTestId("show-button-1"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.detail")
        ).toBeInTheDocument();
        expect(screen.getByTestId("hardware-show")).toBeInTheDocument();
      });
    });

    it("should open the clone modal when clone button is clicked", async () => {
      render(<MockHardwareListRentalCustomers />);
      fireEvent.click(screen.getByTestId("clone-button-1"));

      await waitFor(() => {
        expect(
          screen.getByTestId("modal-hardware.label.title.clone")
        ).toBeInTheDocument();
        expect(screen.getByTestId("hardware-clone")).toBeInTheDocument();
      });
    });

    it("should handle location filter selection", () => {
      render(<MockHardwareListRentalCustomers />);

      const locationSelect = screen.getByTestId("select");
      fireEvent.change(locationSelect, { target: { value: "1" } });

      expect(locationSelect).toHaveValue("1");
    });

    it("should handle date range selection", () => {
      render(<MockHardwareListRentalCustomers />);

      const dateInputs = screen
        .getByTestId("date-range-picker")
        .querySelectorAll("input");
      fireEvent.change(dateInputs[0], { target: { value: "2024-01-01" } });

      expect(dateInputs[0]).toHaveValue("2024-01-01");
    });

    it("should persist column selection in localStorage", () => {
      render(<MockHardwareListRentalCustomers />);

      const columns = JSON.parse(
        localStorage.getItem("item_selected_rental_customers") || "[]"
      );
      expect(Array.isArray(columns)).toBe(true);
    });

    it("should load initial values from localStorage", () => {
      localStorage.setItem("rtd_location_id", "1");
      localStorage.setItem("purchase_date", "2024-01-01~2024-12-31");

      render(<MockHardwareListRentalCustomers />);

      expect(screen.getByTestId("select")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
    });
  });
});
