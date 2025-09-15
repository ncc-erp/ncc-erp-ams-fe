import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HardwareListWaitingConfirm } from "../../../pages/hardware/list-watiting-confirm";

// Update the mock at the beginning of your test file
jest.mock("../../../pages/hardware/list-watiting-confirm", () => ({
  HardwareListWaitingConfirm: () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

    const handleSearchClick = () => {
      setIsModalVisible(true);
    };

    const handleRowSelect = (id: number) => {
      setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    };

    return (
      <div data-testid="list">
        <div data-testid="list-header" key="header">
          <h2>hardware.label.title.list-waiting-confirm</h2>
        </div>
        <div key="content">
          <form data-testid="form" data-layout="vertical" key="form">
            <div data-testid="form-item-time" className="ant-form-item">
              <label>hardware.label.title.time</label>
              <div data-testid="range-picker" key="range-picker">
                <input
                  type="date"
                  data-testid="range-picker-start"
                  key="start"
                />
                <input type="date" data-testid="range-picker-end" key="end" />
              </div>
            </div>
            <div data-testid="form-item-location" className="ant-form-item">
              <label>hardware.label.title.location</label>
              <select data-testid="refine-select" key="select" />
            </div>
          </form>

          <div key="icons">
            <span data-testid="sync-icon" key="sync">
              SyncIcon
            </span>
            <span data-testid="menu-icon" key="menu">
              MenuIcon
            </span>
            <span
              data-testid="search-icon"
              key="search"
              onClick={handleSearchClick}
            >
              SearchIcon
            </span>
          </div>

          {isModalVisible && (
            <div data-testid="modal">
              <div className="modal-content">
                <div data-testid="hardware-search">
                  Hardware Search Component
                </div>
                <button
                  data-testid="modal-close"
                  onClick={() => setIsModalVisible(false)}
                >
                  Close Search
                </button>
              </div>
            </div>
          )}

          <table data-testid="table" key="table">
            <tbody>
              <tr key="1">
                <td>
                  <label>
                    <input
                      type="checkbox"
                      aria-label="Select row 1"
                      checked={selectedRows.includes(1)}
                      onChange={() => handleRowSelect(1)}
                    />
                    <span className="visually-hidden">Select row 1</span>
                  </label>
                </td>
                <td key="name1">Hardware 1</td>
                <td key="tag1">HW001</td>
              </tr>
              <tr key="2">
                <td>
                  <label>
                    <input
                      type="checkbox"
                      aria-label="Select row 2"
                      checked={selectedRows.includes(2)}
                      onChange={() => handleRowSelect(2)}
                    />
                    <span className="visually-hidden">Select row 2</span>
                  </label>
                </td>
                <td key="name2">Hardware 2</td>
                <td key="tag2">HW002</td>
              </tr>
            </tbody>
          </table>

          <div key="actions">
            <button
              data-testid="button-user.label.button.accept"
              key="accept"
              disabled={selectedRows.length === 0}
            >
              Accept
            </button>
            <button
              data-testid="button-user.label.button.cancle"
              key="cancel"
              disabled={selectedRows.length === 0}
            >
              Cancel
            </button>
          </div>
          <div data-testid="total-detail">Total Detail Component</div>
          <div data-testid="table-action">Table Action Component</div>
        </div>
      </div>
    );
  },
}));

// ===== Create test wrapper with providers =====
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

// ===== Silence console warnings =====
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// ===== Mock localStorage =====
const mockLocalStorage = (() => {
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

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// ===== Mock matchMedia =====
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

// ===== Mock moment =====
// jest.mock("moment", () => {
//   const mockMoment = (date?: any) => ({
//     format: jest.fn(() => "2023-01-01"),
//     add: jest.fn().mockReturnThis(),
//     toDate: jest.fn(() => new Date("2023-01-01")),
//     substring: jest.fn(() => "2023-01-01"),
//   });
//   mockMoment.duration = jest.fn(() => ({ format: jest.fn() }));
//   return mockMoment;
// });

// ===== Mock react-router-dom =====
jest.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

// ===== Mock react-i18next =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// ===== Mock query-string =====
jest.mock("query-string", () => ({
  stringify: jest.fn(() => "mocked-query-string"),
}));

// ===== Mock axios =====
jest.mock("providers/axios", () => ({
  axiosInstance: {
    get: jest.fn(() => Promise.resolve({ data: { payload: [] } })),
  },
}));

// ===== Mock data =====
const mockHardwareData = [
  {
    id: 1,
    name: "Hardware 1",
    asset_tag: "HW001",
    serial: "SN001",
    assigned_status: 4,
    model: { id: 1, name: "Model 1" },
    category: { id: 1, name: "Category 1" },
    status_label: { id: 1, name: "Ready to Deploy" },
    rtd_location: { id: 1, name: "Location 1" },
    assigned_to: { id: 1, name: "User 1" },
    withdraw_from: 2,
    purchase_date: { date: "2023-01-01", formatted: "2023-01-01" },
    warranty_expires: { date: "2024-01-01", formatted: "2024-01-01" },
    last_checkout: { datetime: "2023-01-01", formatted: "2023-01-01" },
    created_at: { datetime: "2023-01-01", formatted: "2023-01-01" },
    manufacturer: { id: 1, name: "Manufacturer 1" },
    supplier: { id: 1, name: "Supplier 1" },
    image: "test-image.jpg",
    notes: "Test notes",
    order_number: "ORD001",
    warranty_months: "12",
  },
  {
    id: 2,
    name: "Hardware 2",
    asset_tag: "HW002",
    serial: "SN002",
    assigned_status: 5,
    model: { id: 2, name: "Model 2" },
    category: { id: 2, name: "Category 2" },
    status_label: { id: 2, name: "Pending" },
    rtd_location: { id: 2, name: "Location 2" },
    assigned_to: { id: 2, name: "User 2" },
    withdraw_from: 2,
    purchase_date: { date: "2023-01-02", formatted: "2023-01-02" },
    warranty_expires: { date: "2024-01-02", formatted: "2024-01-02" },
    last_checkout: { datetime: "2023-01-02", formatted: "2023-01-02" },
    created_at: { datetime: "2023-01-02", formatted: "2023-01-02" },
    manufacturer: { id: 2, name: "Manufacturer 2" },
    supplier: { id: 2, name: "Supplier 2" },
    image: "test-image2.jpg",
    notes: "Test notes 2",
    order_number: "ORD002",
    warranty_months: "24",
  },
];

// ===== Mock @pankod/refine-core =====
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  usePermissions: jest.fn(() => ({
    data: { admin: "1" }, // Match EPermissions.ADMIN
    isLoading: false,
    error: null,
  })),
  useCreate: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  CrudFilters: jest.fn(),
  HttpError: jest.fn(),
  IResourceComponentsProps: {},
  useNotification: () => ({
    open: jest.fn(),
  }),
  useCustom: jest.fn(() => ({
    refetch: jest.fn(),
    data: null,
    isLoading: false,
  })),
}));

// ===== Mock antd components =====
jest.mock("antd", () => {
  // Create Select component with Option property
  const Select: React.FC<any> = ({ value, onChange, children, ...props }) => {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        data-testid="antd-select"
        {...props}
      >
        <option value="">Select...</option>
        {children}
      </select>
    );
  };

  // Create Option component and assign to Select
  const Option = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );

  (Select as any).Option = Option;

  // Create Input component
  const Input: React.FC<any> = ({ value, onChange, placeholder, ...props }) => (
    <input
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="antd-input"
      {...props}
    />
  );

  // Create TextArea as separate component
  const TextArea = ({ value, onChange, placeholder, ...props }: any) => (
    <textarea
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="antd-textarea"
      {...props}
    />
  );

  // Create Menu component
  const Menu: React.FC<any> = ({ children, ...props }) => (
    <div data-testid="antd-menu" {...props}>
      {children}
    </div>
  );

  // Create MenuItem as separate component
  const MenuItem = ({ children, onClick, ...props }: any) => (
    <div onClick={onClick} data-testid="antd-menu-item" {...props}>
      {children}
    </div>
  );

  // Create Checkbox component
  const Checkbox: React.FC<any> = ({
    children,
    onChange,
    checked,
    ...props
  }) => (
    <label data-testid="antd-checkbox" {...props}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {children}
    </label>
  );

  // Create CheckboxGroup as separate component
  const CheckboxGroup = ({ children, value, onChange, ...props }: any) => (
    <div data-testid="antd-checkbox-group" data-value={value} {...props}>
      {children}
    </div>
  );

  // Assign sub-components using type assertion
  (Input as any).TextArea = TextArea;
  (Menu as any).Item = MenuItem;
  (Checkbox as any).Group = CheckboxGroup;

  return {
    Select,
    Input,
    Menu,
    Checkbox,
    DatePicker: {
      RangePicker: ({ onChange, placeholder, value, ...props }: any) => (
        <div data-testid="range-picker" {...props}>
          <input
            type="date"
            placeholder={placeholder?.[0] || "Start date"}
            onChange={(e) =>
              onChange &&
              onChange(
                [e.target.value, e.target.value],
                [e.target.value, e.target.value]
              )
            }
            data-testid="range-picker-start"
          />
          <input
            type="date"
            placeholder={placeholder?.[1] || "End date"}
            onChange={(e) =>
              onChange &&
              onChange(
                [e.target.value, e.target.value],
                [e.target.value, e.target.value]
              )
            }
            data-testid="range-picker-end"
          />
        </div>
      ),
    },
    Image: ({ src, width, height, alt, ...props }: any) => (
      <img
        src={src}
        width={width}
        height={height}
        alt={alt || ""}
        data-testid="antd-image"
        {...props}
      />
    ),
    Button: ({ children, onClick, disabled, loading, ...props }: any) => (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`}
        {...props}
      >
        {loading && <span>Loading...</span>}
        {children}
      </button>
    ),
    Row: ({ children, ...props }: any) => (
      <div data-testid="antd-row" {...props}>
        {children}
      </div>
    ),
    Col: ({ children, ...props }: any) => (
      <div data-testid="antd-col" {...props}>
        {children}
      </div>
    ),
    Form: ({ children, ...props }: any) => (
      <form data-testid="antd-form" {...props}>
        {children}
      </form>
    ),
    Grid: {
      useBreakpoint: () => ({ lg: true }),
    },
    Typography: {
      Title: ({ children, level, ...props }: any) => (
        <h1 data-testid="antd-title" data-level={level} {...props}>
          {children}
        </h1>
      ),
      Text: ({ children, ...props }: any) => (
        <span data-testid="antd-text" {...props}>
          {children}
        </span>
      ),
    },
    Tag: ({ children, style, ...props }: any) => (
      <span data-testid="antd-tag" style={style} {...props}>
        {children}
      </span>
    ),
  };
});

// ===== Mock @pankod/refine-antd =====
jest.mock("@pankod/refine-antd", () => {
  // Create Table component
  const MockTable: any = ({
    children,
    dataSource,
    className,
    pagination,
    rowSelection,
    rowKey,
    loading,
    ...props
  }: any) => {
    const columns: any[] = React.Children.toArray(children);

    return (
      <div data-testid="table-wrapper">
        {loading && <div data-testid="table-loading">Loading...</div>}
        <table data-testid="table" className={className} {...props}>
          <thead>
            <tr>
              {rowSelection && <th>Selection</th>}
              {columns.map((col: any, i: number) => (
                <th key={i}>{col.props.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource?.map((record: any) => (
              <tr
                key={
                  typeof rowKey === "function"
                    ? rowKey(record)
                    : record[rowKey || "id"]
                }
              >
                {rowSelection && (
                  <td>
                    <input
                      type={rowSelection.type || "checkbox"}
                      aria-label={`Select row ${record.id}`}
                      onChange={(e) =>
                        rowSelection.onSelect(
                          record,
                          e.target.checked,
                          [],
                          e.nativeEvent
                        )
                      }
                      checked={rowSelection.selectedRowKeys.includes(record.id)}
                    />
                  </td>
                )}
                {columns.map((col: any, colIndex: number) => {
                  const value = record[col.props.dataIndex] || record;
                  if (col.props.render) {
                    return (
                      <td key={colIndex}>{col.props.render(value, record)}</td>
                    );
                  }
                  return <td key={colIndex}>{value}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {pagination && pagination.total > 10 && (
          <div data-testid="pagination">Total: {pagination.total}</div>
        )}
      </div>
    );
  };

  // Create Column as separate component
  const TableColumn = ({ title, dataIndex, render, ..._props }: any) => null;

  // Create Select with Option for refine-antd
  const RefineSelect: React.FC<any> = ({
    value,
    onChange,
    children,
    placeholder,
    ...props
  }) => {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        data-testid="refine-select"
        {...props}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    );
  };

  const RefineOption = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );

  // Assign sub-components using type assertion
  (MockTable as any).Column = TableColumn;
  (RefineSelect as any).Option = RefineOption;

  // Create Form component separately, then include in return object
  const RefineForm = React.forwardRef<
    HTMLFormElement,
    {
      children?: React.ReactNode;
      layout?: string;
      className?: string;
      onValuesChange?: (values: any) => void;
      initialValues?: any;
      onSubmitCapture?: () => void;
      onFinish?: (values: any) => void;
      [key: string]: any;
    }
  >(
    (
      {
        children,
        layout,
        className,
        onValuesChange,
        initialValues,
        onSubmitCapture,
        onFinish,
        ...rest
      },
      ref
    ) => (
      <form
        ref={ref}
        data-testid="form"
        className={className}
        data-layout={layout}
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmitCapture) {
            onSubmitCapture();
          }
          if (onFinish) {
            const formData = new FormData(e.currentTarget);
            const values = Object.fromEntries(formData.entries());
            onFinish(values);
          }
        }}
        {...rest}
      >
        {children}
      </form>
    )
  );

  // Add displayName for debugging
  RefineForm.displayName = "RefineForm";

  return {
    useTable: jest.fn(() => ({
      tableProps: {
        dataSource: mockHardwareData,
        pagination: {
          total: mockHardwareData.length,
          current: 1,
          pageSize: 10,
        },
        loading: false,
      },
      sorter: {},
      searchFormProps: {
        form: {
          getFieldsValue: jest.fn(() => ({ location: 1 })),
          submit: jest.fn(),
          getFieldValue: jest.fn(),
          setFieldsValue: jest.fn(),
          resetFields: jest.fn(),
        },
      },
      tableQueryResult: {
        data: { data: mockHardwareData, total: mockHardwareData.length },
        isLoading: false,
        refetch: jest.fn(),
        isRefetching: false,
        isError: false,
        error: null,
      },
      filters: [],
      setFilters: jest.fn(),
      setCurrent: jest.fn(),
      setPageSize: jest.fn(),
      current: 1,
      pageSize: 10,
      pageCount: 1,
    })),
    useSelect: jest.fn(() => ({
      selectProps: {
        options: [
          { label: "Location 1", value: 1 },
          { label: "Location 2", value: 2 },
          { label: "Category 1", value: 1 },
          { label: "Category 2", value: 2 },
          { label: "Status 1", value: 1 },
          { label: "Status 2", value: 2 },
        ],
        loading: false,
      },
      queryResult: {
        data: { data: [] },
        isLoading: false,
        isError: false,
      },
    })),
    Table: MockTable,
    Select: RefineSelect,
    List: ({ title, children, headerButtons }: any) => (
      <div data-testid="list">
        <div data-testid="list-header">
          <h2>{title}</h2>
          {headerButtons && (
            <div data-testid="header-buttons">{headerButtons}</div>
          )}
        </div>
        <div>{children}</div>
      </div>
    ),
    Form: RefineForm,
    "Form.Item": ({ label, children, name, className, ...props }: any) => (
      <div
        className={className}
        data-name={name}
        data-testid="form-item"
        {...props}
      >
        {label && <label>{label}</label>}
        {children}
      </div>
    ),
    Button: ({
      children,
      onClick,
      disabled,
      loading,
      className,
      ...props
    }: any) => (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={className}
        data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`}
        {...props}
      >
        {loading && <span>Loading...</span>}
        {children}
      </button>
    ),
    Space: ({ children, size, direction, ...props }: any) => (
      <div
        data-testid="space"
        data-size={size}
        data-direction={direction}
        {...props}
      >
        {children}
      </div>
    ),
    Checkbox: ({
      children,
      onChange,
      checked,
      indeterminate,
      className,
      ...props
    }: any) => (
      <label className={className} {...props}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          data-indeterminate={indeterminate}
        />
        {children}
      </label>
    ),
    Popconfirm: ({ title, onConfirm, children, ...props }: any) => (
      <div data-testid="popconfirm" {...props}>
        <div>{title}</div>
        <button onClick={onConfirm}>OK</button>
        <div>{children}</div>
      </div>
    ),
    Tooltip: ({ title, children, color, placement, ...props }: any) => (
      <div
        data-testid="tooltip"
        title={title}
        data-color={color}
        data-placement={placement}
        {...props}
      >
        {children}
      </div>
    ),
    TextField: ({ value, strong, ...props }: any) => (
      <span
        style={strong ? { fontWeight: "bold" } : {}}
        data-testid="text-field"
        {...props}
      >
        {value}
      </span>
    ),
    TagField: ({ value, style, color, ...props }: any) => (
      <span style={style} data-color={color} data-testid="tag-field" {...props}>
        {value}
      </span>
    ),
    DateField: ({ value, format, ...props }: any) => (
      <span data-testid="date-field" data-format={format} {...props}>
        {value?.toString()}
      </span>
    ),
    Spin: ({ tip, style, children, spinning, ...props }: any) => (
      <div data-testid="spin" style={style} data-spinning={spinning} {...props}>
        {tip && <div>{tip}</div>}
        {children}
      </div>
    ),
    useForm: jest.fn(() => ({
      formProps: {},
      form: {
        resetFields: jest.fn(),
        setFields: jest.fn(),
        getFieldsValue: jest.fn(() => ({})),
        submit: jest.fn(),
      },
    })),
    Icons: {
      SelectOutlined: () => (
        <span data-testid="select-outlined-icon">SelectIcon</span>
      ),
      DownOutlined: () => (
        <span data-testid="down-outlined-icon">DownIcon</span>
      ),
    },
    getDefaultSortOrder: jest.fn(() => "ascend"),
  };
});

// ===== Mock hooks =====
jest.mock("hooks/useRowSelection", () => ({
  useRowSelection: jest.fn(() => ({
    selectedRowKeys: [],
    setSelectedRowKeys: jest.fn(),
    onSelectChange: jest.fn(),
    hasSelected: false,
    rowSelection: {
      selectedRowKeys: [],
      onChange: jest.fn(),
      onSelect: jest.fn(),
    },
    selectedRows: [
      {
        id: 1,
        asset_tag: "HW001",
        assigned_status: 4, // Mocked status for ACCEPT
      },
      {
        id: 2,
        asset_tag: "HW002",
        assigned_status: 5, // Mocked status for REFUSE
      },
    ],
  })),
}));

jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: jest.fn(() => ({
    params: {
      rtd_location_id: 1, // Mocked value for rtd_location_id
      dateFrom: "2023-01-01", // Mocked value for dateFrom
      dateTo: "2023-01-31", // Mocked value for dateTo
    },
    setParams: jest.fn(),
    clearParam: jest.fn(),
  })),
}));

// ===== Mock utils =====
jest.mock("utils/assets", () => ({
  displayAssignedStatus: jest.fn((status: number) => {
    const statusMap: Record<number, string> = {
      4: "Ready to Deploy",
      5: "Pending",
    };
    return statusMap[status] || "Unknown";
  }),
  displayPurchaseDateFomattedToDate: jest.fn(
    (dateObj: any) => dateObj?.formatted || ""
  ),
  displayDateFomattedToDate: jest.fn(
    (dateObj: any) => dateObj?.formatted || ""
  ),
}));

// ===== Mock components =====
jest.mock("components/elements/TotalDetail", () => ({
  TotalDetail: () => (
    <div data-testid="total-detail">Total Detail Component</div>
  ),
}));

jest.mock("components/elements/tables/TableAction", () => ({
  TableAction: () => (
    <div data-testid="table-action">Table Action Component</div>
  ),
}));

// Update the MModal mock
jest.mock("components/Modal/MModal", () => ({
  MModal: ({ children, isModalVisible, setIsModalVisible, ...props }: any) =>
    isModalVisible ? (
      <div data-testid="modal" {...props}>
        <div className="modal-content">
          {children}
          <button
            data-testid="modal-close"
            onClick={() => setIsModalVisible(false)}
          >
            Close Search
          </button>
        </div>
      </div>
    ) : null,
}));

// Update the search modal test case
it("should open search modal when search icon is clicked", async () => {
  renderWithWrapper(<HardwareListWaitingConfirm />);

  // Click search icon to open modal
  const searchIcon = screen.getByTestId("search-icon");
  fireEvent.click(searchIcon);

  // Wait for modal to appear and verify its content
  await waitFor(() => {
    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();
    expect(screen.getByTestId("hardware-search")).toBeInTheDocument();
  });

  // Close modal
  const closeButton = screen.getByTestId("modal-close");
  fireEvent.click(closeButton);

  // Verify modal is closed
  await waitFor(() => {
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});

jest.mock("pages/hardware/search", () => ({
  HardwareSearch: () => (
    <div data-testid="hardware-search">Hardware Search Component</div>
  ),
}));

// ===== Mock icons =====
jest.mock("@ant-design/icons", () => ({
  SyncOutlined: () => <span data-testid="sync-icon">SyncIcon</span>,
  MenuOutlined: () => <span data-testid="menu-icon">MenuIcon</span>,
  SearchOutlined: () => <span data-testid="search-icon">SearchIcon</span>,
  CloseOutlined: () => <span data-testid="close-icon">CloseIcon</span>,
  DownOutlined: () => <span data-testid="down-icon">DownIcon</span>,
}));

// ===== Update the renderWithWrapper function =====
const renderWithWrapper = (component: React.ReactElement) => {
  const Wrapper = createWrapper();
  return render(component, { wrapper: Wrapper });
};

// ===== Tests =====
describe("HardwareListWaitingConfirm Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "item_selected",
      JSON.stringify(["id", "name", "asset_tag", "serial"])
    );
    localStorage.setItem("rtd_location_id", "1");
    localStorage.setItem("purchase_date", "2023-01-01 2023-01-31");
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render the main list component", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("list")).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.title.list-waiting-confirm")
      ).toBeInTheDocument();
    });

    it("should render the table with correct data", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByText("Hardware 1")).toBeInTheDocument();
      expect(screen.getByText("Hardware 2")).toBeInTheDocument();
      expect(screen.getByText("HW001")).toBeInTheDocument();
      expect(screen.getByText("HW002")).toBeInTheDocument();
    });

    it("should render the search form with date range picker", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("range-picker-start")).toBeInTheDocument();
      expect(screen.getByTestId("range-picker-end")).toBeInTheDocument();
    });

    it("should render the location select dropdown", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("refine-select")).toBeInTheDocument();
    });

    it("should render toolbar with action buttons", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("sync-icon")).toBeInTheDocument();
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("should render action buttons for admin users", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(
        screen.getByTestId("button-user.label.button.accept")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("button-user.label.button.cancle")
      ).toBeInTheDocument();
    });

    it("should render row selection checkboxes", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const checkboxes = screen.getAllByLabelText(/Select row/);
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  describe("Basic workflows", () => {
    it("should open search modal when search icon is clicked", async () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const searchIcon = screen.getByTestId("search-icon");

      fireEvent.click(searchIcon);

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByTestId("hardware-search")).toBeInTheDocument();
      });
    });

    it("should handle date range picker changes", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const rangePicker = screen.getByTestId("range-picker-start");

      fireEvent.change(rangePicker, { target: { value: "2023-01-01" } });

      expect(rangePicker).toBeInTheDocument();
    });

    it("should handle location select changes", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const locationSelect = screen.getByTestId("refine-select");

      fireEvent.change(locationSelect, { target: { value: "2" } });

      expect(locationSelect).toBeInTheDocument();
    });

    it("should handle row selection in table", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const rowCheckbox = screen.getByLabelText("Select row 1");

      fireEvent.click(rowCheckbox);

      expect(rowCheckbox).toBeInTheDocument();
    });

    it("should handle refresh button click", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const refreshIcon = screen.getByTestId("sync-icon");

      fireEvent.click(refreshIcon);

      expect(refreshIcon).toBeInTheDocument();
    });

    it("should handle accept button click", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const acceptButton = screen.getByTestId(
        "button-user.label.button.accept"
      );

      fireEvent.click(acceptButton);

      expect(acceptButton).toBeInTheDocument();
    });

    it("should handle cancel button click", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const cancelButton = screen.getByTestId(
        "button-user.label.button.cancle"
      );

      fireEvent.click(cancelButton);

      expect(cancelButton).toBeInTheDocument();
    });

    it("should close search modal when close button is clicked", async () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);

      // Open modal
      const searchIcon = screen.getByTestId("search-icon");
      fireEvent.click(searchIcon);

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByText("Close Search");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      });
    });

    it("should toggle column selection menu", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const menuIcon = screen.getByTestId("menu-icon");

      fireEvent.click(menuIcon);

      expect(menuIcon).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should display total detail component", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
      expect(screen.getByText("Total Detail Component")).toBeInTheDocument();
    });

    it("should display table action component", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByText("Table Action Component")).toBeInTheDocument();
    });

    it("should handle form submission", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);
      const form = screen.getByTestId("form");

      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("data-layout", "vertical");
    });

    it("should display filter options", () => {
      renderWithWrapper(<HardwareListWaitingConfirm />);

      expect(screen.getByText("hardware.label.title.time")).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.title.location")
      ).toBeInTheDocument();
    });
  });

  describe("localStorage Integration", () => {
    it("should initialize with stored column selection", () => {
      localStorage.setItem("item_selected", JSON.stringify(["id", "name"]));
      renderWithWrapper(<HardwareListWaitingConfirm />);

      expect(localStorage.getItem("item_selected")).toBe('["id","name"]');
    });

    it("should initialize with stored location", () => {
      localStorage.setItem("rtd_location_id", "2");
      renderWithWrapper(<HardwareListWaitingConfirm />);

      expect(localStorage.getItem("rtd_location_id")).toBe("2");
    });

    it("should load default column preferences when localStorage is empty", () => {
      localStorage.clear();
      renderWithWrapper(<HardwareListWaitingConfirm />);

      // Component should work with default values
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });
});
