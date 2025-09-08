import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

/* localStorage mock (used by app) */
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = v.toString();
    }),
    removeItem: jest.fn((k: string) => delete store[k]),
    clear: jest.fn(() => (store = {})),
    __store: () => store,
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

const openNotificationMock = jest.fn();
const useCustomMock = jest.fn();

/* Mock UploadImage to expose file input used in component */
jest.mock("components/elements/uploadImage", () => ({
  UploadImage: ({ setFile }: any) => (
    <input
      data-testid="upload-image"
      type="file"
      onChange={(e: any) => {
        const f = e.target.files && e.target.files[0];
        if (f) setFile(f);
      }}
    />
  ),
}));

/* Mock refine-core hooks used by the component */
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (k: string) => k,
  useNotification: () => ({ open: openNotificationMock }),
  useCustom: (cfg: any) => useCustomMock(cfg),
}));

/* Minimal @pankod/refine-antd mock similar to other tests */
jest.mock("@pankod/refine-antd", () => {
  const collectFormValues = (formEl: HTMLElement) => {
    const values: Record<string, any> = {};
    const items = Array.from(
      formEl.querySelectorAll('[data-testid^="form-item-"]')
    );
    items.forEach((item) => {
      const key =
        item.getAttribute("data-testid")?.replace("form-item-", "") ?? "";
      const input = item.querySelector("input, select, textarea");
      if (!input) return;
      if ((input as HTMLInputElement).type === "file") {
        values[key] = (input as HTMLInputElement).files?.[0];
      } else if (input.tagName === "SELECT") {
        values[key] = (input as HTMLSelectElement).value;
      } else {
        values[key] = (input as HTMLInputElement).value;
      }
    });
    return values;
  };

  let lastOnFinish: ((values?: any) => void) | null = null;

  const Form: any = ({ children, onFinish, ...rest }: any) => {
    if (children && React.Children.count(children) > 0) {
      return (
        <form
          data-testid="hardware-edit-form"
          {...rest}
          onSubmit={(e: any) => {
            e.preventDefault();
            try {
              const values = collectFormValues(e.currentTarget as HTMLElement);
              onFinish?.(values);
              lastOnFinish = onFinish ?? lastOnFinish;
            } catch (_err) {
              void _err;
            }
          }}
        >
          {children}
        </form>
      );
    } else {
      lastOnFinish = onFinish ?? lastOnFinish;
      return <div data-testid="form-placeholder" />;
    }
  };

  const FormItem = ({ children, label, name, initialValue }: any) => {
    // If child is an input-like node, set defaultValue from initialValue for tests to observe
    const child = React.Children.only(children);
    const childProps: any = {};
    if (initialValue !== undefined) {
      // map to common prop names
      childProps.defaultValue = initialValue;
      childProps.value = undefined;
    }
    return (
      <div data-testid={`form-item-${String(name ?? label)}`}>
        {React.cloneElement(child, childProps)}
      </div>
    );
  };
  Form.Item = FormItem;

  const Input = ({ placeholder, onChange, value, type, ...rest }: any) => (
    <input
      data-testid={`input-${placeholder ?? "input"}`}
      placeholder={placeholder}
      defaultValue={value ?? ""}
      onChange={onChange}
      type={type ?? "text"}
      {...rest}
    />
  );
  const TextArea = ({ value, onChange }: any) => (
    <textarea
      data-testid="input-textarea"
      defaultValue={value ?? ""}
      onChange={onChange}
    />
  );
  TextArea.displayName = "InputTextArea";
  Input.TextArea = TextArea;

  const Select = ({ selectProps, onChange, placeholder, options }: any) => (
    <select
      data-testid={`select-${placeholder ?? "select"}`}
      onChange={(e) => {
        const val = e.target.value;
        onChange?.(val);
      }}
    >
      <option value="">--</option>
      {(selectProps?.options ?? options ?? []).map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  const RadioGroup = ({ children, onChange }: any) => (
    <div data-testid="radio-group">
      {React.Children.map(children, (c: any) =>
        React.cloneElement(c, { onChange })
      )}
    </div>
  );
  const RadioComponent: any = ({ children, value, onChange }: any) => (
    <label data-testid={`radio-${value}`}>
      <input type="radio" value={value} onChange={onChange} />
      {children}
    </label>
  );
  RadioComponent.Group = RadioGroup;

  const Button = ({ children, htmlType, onClick }: any) => (
    <button
      data-testid={`button-${String(children)}`}
      type={htmlType}
      onClick={(e) => {
        if (typeof onClick === "function") onClick(e);
        if (htmlType === "submit" && typeof lastOnFinish === "function") {
          try {
            lastOnFinish({});
          } catch (_err) {
            void _err;
          }
        }
      }}
    >
      {String(children)}
    </button>
  );

  const useForm = jest.fn(() => ({
    formProps: {},
    form: {
      getFieldValue: jest.fn(() => undefined),
      setFieldsValue: jest.fn(),
      resetFields: jest.fn(),
      setFields: jest.fn(),
    },
  }));

  const useSelect = jest.fn(() => ({
    selectProps: { options: [{ label: "Opt1", value: 1 }] },
  }));

  return {
    Form,
    Input,
    Select,
    Radio: RadioComponent,
    Button,
    useForm,
    useSelect,
    Col: ({ children }: any) => <div>{children}</div>,
    Row: ({ children }: any) => <div>{children}</div>,
    Typography: { Text: ({ children }: any) => <span>{children}</span> },
    DatePicker: { RangePicker: () => <input data-testid="range-picker" /> },
  };
});

/* silence React warnings in tests */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

/* Now import the real component under test */
import { HardwareEdit } from "pages/hardware/edit";

describe("HardwareEdit - import real component with mocked deps", () => {
  const setIsModalVisible = jest.fn();
  const sampleData = {
    id: 123,
    name: "Device Test",
    asset_tag: "AT-123",
    purchase_date: { date: "2024-01-01", formatted: "Jan 1, 2024" },
    model: { id: 1 },
    rtd_location: { id: 10 },
    status_label: { id: 2 },
    supplier: { id: 5, name: "Supplier Inc" },
    webhook: { id: 3, name: "Webhook" },
    assigned_to: null,
    image: null,
    maintenance_date: { date: "" },
    maintenance_cycle: "",
    startRentalDate: { date: "" },
    purchase_cost: null,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it("renders form and key controls", () => {
    useCustomMock.mockReturnValue({ refetch: jest.fn(), isFetching: false });

    render(
      <HardwareEdit
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={sampleData}
      />
    );

    expect(screen.getByTestId("hardware-edit-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-item-asset_tag")).toBeInTheDocument();
    expect(screen.getByTestId("form-item-name")).toBeInTheDocument();
    expect(screen.getByTestId("upload-image")).toBeInTheDocument();
    expect(
      screen.getByTestId("button-hardware.label.button.update")
    ).toBeInTheDocument();
  });

  it("submits form -> calls refetch -> shows success notification and closes modal", async () => {
    const refetchFn = jest.fn(async () => ({
      isError: false,
      data: { data: { messages: "updated" } },
    }));
    useCustomMock.mockReturnValue({ refetch: refetchFn, isFetching: false });

    render(
      <HardwareEdit
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={sampleData}
      />
    );

    // change required field(s)
    const assetInput = screen
      .getByTestId("form-item-asset_tag")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "AT-NEW" } });

    fireEvent.click(screen.getByTestId("button-hardware.label.button.update"));

    await waitFor(() => {
      expect(refetchFn).toHaveBeenCalled();
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" })
      );
      expect(setIsModalVisible).toHaveBeenCalledWith(false);
    });
  });

  it("handles API error and shows error notification without closing modal", async () => {
    const refetchError = jest.fn(async () => ({
      isError: true,
      error: { response: { data: { messages: { field: ["bad"] } } } },
    }));
    useCustomMock.mockReturnValue({ refetch: refetchError, isFetching: false });

    render(
      <HardwareEdit
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={sampleData}
      />
    );

    const assetInput = screen
      .getByTestId("form-item-asset_tag")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "AT-ERR" } });

    fireEvent.click(screen.getByTestId("button-hardware.label.button.update"));

    await waitFor(() => {
      expect(refetchError).toHaveBeenCalled();
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" })
      );
      expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
    });
  });
});
