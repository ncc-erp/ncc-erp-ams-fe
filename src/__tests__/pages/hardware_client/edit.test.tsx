import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = String(v);
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
let useCustomMock = jest.fn();

jest.mock("components/elements/uploadImage", () => ({
  UploadImage: ({ setFile }: any) => (
    <input
      data-testid="upload-image-client-edit"
      type="file"
      onChange={(e: any) => {
        const f = e.target.files && e.target.files[0];
        if (f) setFile(f);
      }}
    />
  ),
}));

jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (k: string) => k,
  useNotification: () => ({ open: openNotificationMock }),
  useCustom: (cfg: any) => useCustomMock(cfg),
}));

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
          data-testid="hardware-client-edit-form"
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

  const FormItem = ({ children, name, initialValue }: any) => {
    const child = React.Children.only(children);
    const childProps: any = {};
    if (initialValue !== undefined) {
      childProps.defaultValue = initialValue;
      childProps.value = undefined;
    }
    return (
      <div data-testid={`form-item-${String(name ?? "")}`}>
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
  Input.TextArea = TextArea;

  const Select = ({ selectProps, onChange, placeholder }: any) => (
    <select
      data-testid={`select-${placeholder ?? "select"}`}
      onChange={(e) => {
        const val = e.target.value;
        onChange?.(val);
      }}
    >
      <option value="">--</option>
      {(selectProps?.options ?? []).map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

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
    Button,
    useForm,
    useSelect,
    Col: ({ children }: any) => <div>{children}</div>,
    Row: ({ children }: any) => <div>{children}</div>,
    Typography: { Text: ({ children }: any) => <span>{children}</span> },
  };
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

import { ClientHardwareEdit } from "pages/hardware_client/edit";

const setIsModalVisible = jest.fn();

const sampleData: any = {
  id: 5,
  name: "DeviceX",
  serial: "S1",
  model: { id: 2 },
  order_number: "ORD",
  notes: "n",
  asset_tag: "ATX",
  status_label: { id: 3 },
  warranty_months: "6 months",
  purchase_cost: "1,000",
  purchase_date: { date: "2025-09-01" },
  rtd_location: { id: 7 },
  supplier: { id: 9 },
  assigned_to: "user1",
  image: null,
};

const renderComponent = (props = {}) =>
  render(
    <ClientHardwareEdit
      isModalVisible={true}
      setIsModalVisible={setIsModalVisible}
      data={sampleData}
      {...props}
    />
  );
describe("ClientHardwareEdit (hardware_client/edit) - integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    useCustomMock = jest.fn();
  });

  it("renders form and key controls", () => {
    useCustomMock.mockReturnValue({ refetch: jest.fn(), isFetching: false });

    renderComponent();

    expect(screen.getByTestId("hardware-client-edit-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-item-asset_tag")).toBeInTheDocument();
    expect(screen.getByTestId("form-item-name")).toBeInTheDocument();
    expect(screen.getByTestId("upload-image-client-edit")).toBeInTheDocument();
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

    renderComponent();

    const assetInput = screen
      .getByTestId("form-item-asset_tag")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "AT-NEW" } });

    const upload = screen.getByTestId(
      "upload-image-client-edit"
    ) as HTMLInputElement;
    const file = new File(["d"], "pic.png", { type: "image/png" });
    Object.defineProperty(upload, "files", { value: [file] });
    fireEvent.change(upload);

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
      error: { response: { data: { messages: { asset_tag: ["exists"] } } } },
    }));
    useCustomMock.mockReturnValue({ refetch: refetchError, isFetching: false });

    renderComponent();

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
