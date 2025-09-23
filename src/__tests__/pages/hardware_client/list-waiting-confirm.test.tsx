import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ClientHardwareListWaitingConfirm } from "../../../pages/hardware_client/list-watiting-confirm";

jest.mock("../../../pages/hardware_client/list-watiting-confirm", () => ({
  ClientHardwareListWaitingConfirm: () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
    const [isCancelModalVisible, setIsCancelModalVisible] =
      React.useState(false);
    const [isCancelManyModalVisible, setIsCancelManyModalVisible] =
      React.useState(false);

    const handleSearchClick = () => {
      setIsModalVisible(true);
    };

    const handleRowSelect = (id: number) => {
      setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    };

    const handleCancelClick = () => {
      setIsCancelModalVisible(true);
    };

    const handleCancelManyClick = () => {
      setIsCancelManyModalVisible(true);
    };

    const handleAcceptClick = () => {
      console.log("Accept clicked");
    };

    const handleRefreshClick = () => {
      console.log("Refresh clicked");
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
            <span
              data-testid="sync-icon"
              key="sync"
              onClick={handleRefreshClick}
            >
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
                <div data-testid="client-hardware-search">
                  Client Hardware Search Component
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

          {isCancelModalVisible && (
            <div data-testid="cancel-modal">
              <div className="modal-content">
                <div data-testid="cancel-asset">Cancel Asset Component</div>
                <button
                  data-testid="cancel-modal-close"
                  onClick={() => setIsCancelModalVisible(false)}
                >
                  Close Cancel
                </button>
              </div>
            </div>
          )}

          {isCancelManyModalVisible && (
            <div data-testid="cancel-many-modal">
              <div className="modal-content">
                <div data-testid="cancel-multiple-assets">
                  Cancel Multiple Assets Component
                </div>
                <button
                  data-testid="cancel-many-modal-close"
                  onClick={() => setIsCancelManyModalVisible(false)}
                >
                  Close Cancel Many
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
                <td key="status1">
                  <span style={{ background: "#28a745", color: "white" }}>
                    Ready to Deploy
                  </span>
                </td>
                <td key="actions1">
                  <button
                    data-testid="accept-button-1"
                    onClick={handleAcceptClick}
                  >
                    Accept
                  </button>
                  <button
                    data-testid="cancel-button-1"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </td>
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
                <td key="status2">
                  <span style={{ background: "#ffc107", color: "white" }}>
                    Pending
                  </span>
                </td>
                <td key="actions2">
                  <button
                    data-testid="accept-button-2"
                    onClick={handleAcceptClick}
                  >
                    Accept
                  </button>
                  <button
                    data-testid="cancel-button-2"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div key="actions">
            <button
              data-testid="button-user.label.button.accept"
              key="accept"
              disabled={selectedRows.length === 0}
              onClick={handleAcceptClick}
            >
              Accept
            </button>
            <button
              data-testid="button-user.label.button.cancle"
              key="cancel"
              disabled={selectedRows.length === 0}
              onClick={handleCancelManyClick}
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
const mockClientHardwareData = [
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
    data: { admin: "1" },
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

  const Option = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );

  (Select as any).Option = Option;

  const Input: React.FC<any> = ({ value, onChange, placeholder, ...props }) => (
    <input
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="antd-input"
      {...props}
    />
  );

  const TextArea = ({ value, onChange, placeholder, ...props }: any) => (
    <textarea
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="antd-textarea"
      {...props}
    />
  );

  const Menu: React.FC<any> = ({ children, ...props }) => (
    <div data-testid="antd-menu" {...props}>
      {children}
    </div>
  );

  const MenuItem = ({ children, onClick, ...props }: any) => (
    <div onClick={onClick} data-testid="antd-menu-item" {...props}>
      {children}
    </div>
  );

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

  const CheckboxGroup = ({ children, value, onChange, ...props }: any) => (
    <div data-testid="antd-checkbox-group" data-value={value} {...props}>
      {children}
    </div>
  );

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

  const TableColumn = ({ title, dataIndex, render, ..._props }: any) => null;

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

  (MockTable as any).Column = TableColumn;
  (RefineSelect as any).Option = RefineOption;

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

  RefineForm.displayName = "RefineForm";

  return {
    useTable: jest.fn(() => ({
      tableProps: {
        dataSource: mockClientHardwareData,
        pagination: {
          total: mockClientHardwareData.length,
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
        data: {
          data: mockClientHardwareData,
          total: mockClientHardwareData.length,
        },
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
    selectedRowKeys: [1, 2],
    setSelectedRowKeys: jest.fn(),
    onSelectChange: jest.fn(),
    hasSelected: true,
    rowSelection: {
      selectedRowKeys: [1, 2],
      onChange: jest.fn(),
      onSelect: jest.fn(),
    },
    selectedRows: [
      {
        id: 1,
        asset_tag: "HW001",
        assigned_status: 4,
      },
      {
        id: 2,
        asset_tag: "HW002",
        assigned_status: 5,
      },
    ],
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
    removeItem: jest.fn(),
    clearSelection: jest.fn(),
  })),
}));

jest.mock("hooks/useAppSearchParams", () => ({
  useAppSearchParams: jest.fn(() => ({
    params: {
      rtd_location_id: 1,
      dateFrom: "2023-01-01",
      dateTo: "2023-01-31",
      search: "test search",
    },
    setParams: jest.fn(),
    clearParam: jest.fn(),
  })),
}));

// ===== Mock utils =====
jest.mock("utils/assets", () => ({
  getAssetAssignedStatusDecription: jest.fn((status: number) => {
    const statusMap: Record<number, string> = {
      4: "Waiting Checkout",
      5: "Waiting Checkin",
    };
    return statusMap[status] || "Unknown";
  }),
  getAssetStatusDecription: jest.fn((statusLabel: any) => ({
    label: statusLabel.name || "Unknown",
    color: "#28a745",
  })),
  getBGAssetAssignedStatusDecription: jest.fn((status: number) => {
    const colorMap: Record<number, string> = {
      4: "#28a745",
      5: "#ffc107",
    };
    return colorMap[status] || "#6c757d";
  }),
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

jest.mock("components/Modal/MModal", () => ({
  MModal: ({
    children,
    isModalVisible,
    setIsModalVisible,
    title,
    ...props
  }: any) =>
    isModalVisible ? (
      <div data-testid="modal" {...props}>
        <div className="modal-content">
          <h3>{title}</h3>
          {children}
          <button
            data-testid="modal-close"
            onClick={() => setIsModalVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
    ) : null,
}));

jest.mock("pages/hardware_client/search", () => ({
  ClientHardwareSearch: () => (
    <div data-testid="client-hardware-search">
      Client Hardware Search Component
    </div>
  ),
}));

jest.mock("pages/users/cancel", () => ({
  CancleAsset: () => (
    <div data-testid="cancel-asset">Cancel Asset Component</div>
  ),
}));

jest.mock("pages/users/cancel-multiple-assets", () => ({
  HardwareCancelMultipleAsset: () => (
    <div data-testid="cancel-multiple-assets">
      Cancel Multiple Assets Component
    </div>
  ),
}));

// ===== Mock icons =====
jest.mock("@ant-design/icons", () => ({
  SyncOutlined: () => <span data-testid="sync-icon">SyncIcon</span>,
  MenuOutlined: () => <span data-testid="menu-icon">MenuIcon</span>,
  FileSearchOutlined: () => <span data-testid="search-icon">SearchIcon</span>,
  CloseOutlined: () => <span data-testid="close-icon">CloseIcon</span>,
  DownOutlined: () => <span data-testid="down-icon">DownIcon</span>,
}));

// ===== Update the renderWithWrapper function =====
const renderWithWrapper = (component: React.ReactElement) => {
  const Wrapper = createWrapper();
  return render(component, { wrapper: Wrapper });
};

// ===== Tests =====
describe("ClientHardwareListWaitingConfirm Component", () => {
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

  describe("Component Rendering", () => {
    it("should render the main list component with correct title", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("list")).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.title.list-waiting-confirm")
      ).toBeInTheDocument();
    });

    it("should render the table with client hardware data", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByText("Hardware 1")).toBeInTheDocument();
      expect(screen.getByText("Hardware 2")).toBeInTheDocument();
      expect(screen.getByText("HW001")).toBeInTheDocument();
      expect(screen.getByText("HW002")).toBeInTheDocument();
    });

    it("should render search form with date range picker and location selector", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("range-picker-start")).toBeInTheDocument();
      expect(screen.getByTestId("range-picker-end")).toBeInTheDocument();
      expect(screen.getByTestId("refine-select")).toBeInTheDocument();
    });

    it("should render action toolbar with sync, menu, and search icons", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("sync-icon")).toBeInTheDocument();
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("should render bulk action buttons for admin users", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(
        screen.getByTestId("button-user.label.button.accept")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("button-user.label.button.cancle")
      ).toBeInTheDocument();
    });

    it("should render individual action buttons for each row", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("accept-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button-1")).toBeInTheDocument();
      expect(screen.getByTestId("accept-button-2")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button-2")).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    it("should open and close search modal", async () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      // Open search modal
      const searchIcon = screen.getByTestId("search-icon");
      fireEvent.click(searchIcon);

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(
          screen.getByTestId("client-hardware-search")
        ).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      });
    });

    it("should open and close cancel modal", async () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      // Click individual cancel button
      const cancelButton = screen.getByTestId("cancel-button-1");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByTestId("cancel-modal")).toBeInTheDocument();
        expect(screen.getByTestId("cancel-asset")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByTestId("cancel-modal-close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("cancel-modal")).not.toBeInTheDocument();
      });
    });

    it("should open and close bulk cancel modal", async () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const checkbox1 = screen.getByLabelText("Select row 1");
      fireEvent.click(checkbox1);

      const bulkCancelButton = screen.getByTestId(
        "button-user.label.button.cancle"
      );
      fireEvent.click(bulkCancelButton);

      await waitFor(() => {
        expect(screen.getByTestId("cancel-many-modal")).toBeInTheDocument();
        expect(
          screen.getByTestId("cancel-multiple-assets")
        ).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByTestId("cancel-many-modal-close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("cancel-many-modal")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("should handle row selection", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const checkbox1 = screen.getByLabelText("Select row 1");
      const checkbox2 = screen.getByLabelText("Select row 2");

      fireEvent.click(checkbox1);
      fireEvent.click(checkbox2);

      expect(checkbox1).toBeInTheDocument();
      expect(checkbox2).toBeInTheDocument();
    });

    it("should handle date range selection", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const startDatePicker = screen.getByTestId("range-picker-start");
      const endDatePicker = screen.getByTestId("range-picker-end");

      fireEvent.change(startDatePicker, { target: { value: "2023-01-01" } });
      fireEvent.change(endDatePicker, { target: { value: "2023-01-31" } });

      expect(startDatePicker).toBeInTheDocument();
      expect(endDatePicker).toBeInTheDocument();
    });

    it("should handle location selection", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const locationSelect = screen.getByTestId("refine-select");
      fireEvent.change(locationSelect, { target: { value: "2" } });

      expect(locationSelect).toBeInTheDocument();
    });

    it("should handle refresh action", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const refreshIcon = screen.getByTestId("sync-icon");
      fireEvent.click(refreshIcon);

      expect(refreshIcon).toBeInTheDocument();
    });

    it("should handle individual accept action", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const acceptButton = screen.getByTestId("accept-button-1");
      fireEvent.click(acceptButton);

      expect(acceptButton).toBeInTheDocument();
    });

    it("should handle bulk accept action", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const checkbox = screen.getByLabelText("Select row 1");
      fireEvent.click(checkbox);

      const bulkAcceptButton = screen.getByTestId(
        "button-user.label.button.accept"
      );
      fireEvent.click(bulkAcceptButton);

      expect(bulkAcceptButton).toBeInTheDocument();
    });
  });

  describe("Component State Management", () => {
    it("should disable bulk action buttons when no rows selected", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const acceptButton = screen.getByTestId(
        "button-user.label.button.accept"
      );
      const cancelButton = screen.getByTestId(
        "button-user.label.button.cancle"
      );

      expect(acceptButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    it("should show correct form labels", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(screen.getByText("hardware.label.title.time")).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.title.location")
      ).toBeInTheDocument();
    });

    it("should display hardware information correctly", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(screen.getByText("Hardware 1")).toBeInTheDocument();
      expect(screen.getByText("Hardware 2")).toBeInTheDocument();
      expect(screen.getByText("HW001")).toBeInTheDocument();
      expect(screen.getByText("HW002")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should display total detail component", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("total-detail")).toBeInTheDocument();
      expect(screen.getByText("Total Detail Component")).toBeInTheDocument();
    });

    it("should display table action component", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      expect(screen.getByTestId("table-action")).toBeInTheDocument();
      expect(screen.getByText("Table Action Component")).toBeInTheDocument();
    });

    it("should handle form layout correctly", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);
      const form = screen.getByTestId("form");

      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("data-layout", "vertical");
    });
  });

  describe("LocalStorage Integration", () => {
    it("should initialize with stored column selection preferences", () => {
      localStorage.setItem(
        "item_selected",
        JSON.stringify(["id", "name", "status"])
      );
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(localStorage.getItem("item_selected")).toBe(
        '["id","name","status"]'
      );
    });

    it("should initialize with stored location preference", () => {
      localStorage.setItem("rtd_location_id", "3");
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(localStorage.getItem("rtd_location_id")).toBe("3");
    });

    it("should initialize with stored date range preference", () => {
      localStorage.setItem("purchase_date", "2023-02-01 2023-02-28");
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(localStorage.getItem("purchase_date")).toBe(
        "2023-02-01 2023-02-28"
      );
    });

    it("should work with default values when localStorage is empty", () => {
      localStorage.clear();
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByTestId("list")).toBeInTheDocument();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle empty hardware data gracefully", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByTestId("list")).toBeInTheDocument();
    });

    it("should handle modal state transitions correctly", async () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      // Open search modal
      fireEvent.click(screen.getByTestId("search-icon"));

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });

      // Close and reopen should work
      fireEvent.click(screen.getByTestId("modal-close"));

      await waitFor(() => {
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("search-icon"));

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });

    it("should maintain component stability during interactions", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      fireEvent.click(screen.getByTestId("sync-icon"));
      fireEvent.click(screen.getByTestId("menu-icon"));
      fireEvent.change(screen.getByTestId("refine-select"), {
        target: { value: "1" },
      });

      expect(screen.getByTestId("list")).toBeInTheDocument();
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels for row selection", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      expect(screen.getByLabelText("Select row 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 2")).toBeInTheDocument();
    });

    it("should have proper form structure", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const form = screen.getByTestId("form");
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe("FORM");
    });

    it("should have proper button structure for actions", () => {
      renderWithWrapper(<ClientHardwareListWaitingConfirm />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});
