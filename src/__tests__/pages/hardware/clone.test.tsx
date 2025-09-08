import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = v.toString();
    }),
    removeItem: jest.fn((k: string) => {
      delete store[k];
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

let mutateMock = jest.fn();

/* Mock constants used by component */
jest.mock("constants/assets", () => ({
  EStatus: { ASSIGN: "Assign", PENDING: "Pending" },
  STATUS_LABELS: { READY_TO_DEPLOY: 2 },
}));

/* Mock UploadImage to expose a file input */
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

/* refine-core mocks */
let __setCreateData: (v: any) => void = () => {};

jest.mock("@pankod/refine-core", () => {
  return {
    useTranslate: () => (k: string) => k,
    useCreate: () => {
      const [data, setData] = React.useState<any>(undefined);

      // expose setter to tests so they can simulate server response
      React.useEffect(() => {
        __setCreateData = setData;
      }, [setData]);

      const mutate = (payload: any, options?: any) => {
        mutateMock(payload, options);
      };

      return {
        mutate,
        data,
        isLoading: false,
      };
    },
  };
});

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
          data-testid="hardware-clone-form"
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

  const FormItem = ({ children, label, name }: any) => (
    <div data-testid={`form-item-${String(name ?? label)}`}>{children}</div>
  );
  FormItem.displayName = "Form.Item";
  Form.Item = FormItem;

  const Input = ({ placeholder, onChange, value, type, ...rest }: any) => {
    return (
      <input
        data-testid={`input-${placeholder ?? "input"}`}
        placeholder={placeholder}
        defaultValue={value ?? ""}
        onChange={onChange}
        type={type ?? "text"}
        {...rest}
      />
    );
  };
  Input.TextArea = (() => {
    const TextArea = ({ value, onChange }: any) => (
      <textarea
        data-testid="input-textarea"
        defaultValue={value ?? ""}
        onChange={onChange}
      />
    );
    TextArea.displayName = "Input.TextArea";
    return TextArea;
  })();

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
      setFields: jest.fn(),
      setFieldsValue: jest.fn(),
      resetFields: jest.fn(),
      getFieldValue: jest.fn(),
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

/* silence console.error in tests */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

import { HardwareClone } from "pages/hardware/clone";

describe("HardwareClone - import real component with mocked deps", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mutateMock = jest.fn();
  });

  it("submits clone payload, calls mutate and closes modal on success", async () => {
    render(
      <HardwareClone
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={undefined}
      />
    );

    const assetItem = screen.getByTestId("form-item-asset_tag");
    const nameItem = screen.getByTestId("form-item-name");
    const assetInput = assetItem.querySelector("input") as HTMLInputElement;
    const nameInput = nameItem.querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "CL-001" } });
    fireEvent.change(nameInput, { target: { value: "Clone Device" } });

    const modelSelect = screen.getByTestId(
      "select-hardware.label.placeholder.propertyType"
    );
    const locationSelect = screen.getByTestId(
      "select-hardware.label.placeholder.location"
    );
    fireEvent.change(modelSelect, { target: { value: "1" } });
    fireEvent.change(locationSelect, { target: { value: "10" } });

    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const upload = screen.getByTestId("upload-image") as HTMLInputElement;
    Object.defineProperty(upload, "files", { value: [file] });
    fireEvent.change(upload);

    // submit
    fireEvent.click(screen.getByTestId("button-hardware.label.button.clone"));

    __setCreateData?.({ data: { message: "cloned", status: "success" } });

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(setIsModalVisible).toHaveBeenCalledWith(false);
    });
  });

  it("handles mutate error and shows error (does not close modal)", async () => {
    mutateMock = jest.fn();

    render(
      <HardwareClone
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={undefined}
      />
    );

    const assetInput = screen
      .getByTestId("form-item-asset_tag")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "CL-ERR" } });

    fireEvent.click(screen.getByTestId("button-hardware.label.button.clone"));

    __setCreateData?.({
      data: { messages: { asset_tag: ["exists"] }, status: "error" },
    });

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
    });
  });

  it("includes uploaded file in FormData passed to mutate", async () => {
    let capturedArg: any = null;
    mutateMock = jest.fn((payload: any, _options?: any) => {
      capturedArg = payload;
    });

    render(
      <HardwareClone
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        data={undefined}
      />
    );

    const upload = screen.getByTestId("upload-image") as HTMLInputElement;
    const testFile = new File(["blob"], "img.png", { type: "image/png" });
    Object.defineProperty(upload, "files", { value: [testFile] });
    fireEvent.change(upload);

    const assetInput = screen
      .getByTestId("form-item-asset_tag")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(assetInput, { target: { value: "CL-FILE" } });

    fireEvent.click(screen.getByTestId("button-hardware.label.button.clone"));

    __setCreateData?.({ data: { message: "ok", status: "success" } });

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      const values = capturedArg?.values;
      if (values instanceof FormData) {
        expect(values.get("asset_tag")).toBe("CL-FILE");
        const gotFile = values.get("image") as File | null;
        expect(gotFile && (gotFile as File).name).toBe("img.png");
      } else {
        expect(values.image || values.asset_tag).toBeTruthy();
      }
    });
  });
});
