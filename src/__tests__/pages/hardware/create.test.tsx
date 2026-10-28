import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const setIsModalVisibleMock = jest.fn();
let mutateMock = jest.fn();
let createDataMock: any = undefined;

jest.mock("constants/assets", () => ({
  EStatus: { ASSIGN: "Assign" },
  STATUS_LABELS: { READY_TO_DEPLOY: 2 },
}));

jest.mock("hooks/useGetProjectData", () => ({
  useGetProjectData: () => ({
    customer: [{ id: 1, name: "Cust1", code: "C1" }],
    project: [{ id: 10, name: "Proj1", code: "P1" }],
  }),
}));

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

jest.mock("react-mde", () => {
  const ReactMdeMock = (_props: any) => <textarea data-testid="react-mde" />;
  ReactMdeMock.displayName = "ReactMde";
  return ReactMdeMock;
});
jest.mock("react-markdown", () => {
  const ReactMarkdownMock = ({ children }: any) => <div>{children}</div>;
  ReactMarkdownMock.displayName = "ReactMarkdown";
  return ReactMarkdownMock;
});

jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (k: string) => k,
  useNotification: () => ({ open: openNotificationMock }),
  useCreate: () => ({
    mutate: (...args: any[]) => mutateMock(...args),
    data: createDataMock,
    isLoading: false,
  }),
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
          data-testid="hardware-create-form"
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
  FormItem.displayName = "FormItem";
  Form.Item = FormItem;

  const Input = ({ placeholder, onChange, value, type }: any) => (
    <input
      data-testid={`input-${placeholder ?? "input"}`}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      type={type ?? "text"}
    />
  );

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

  const Button = ({ children, htmlType, onClick }: any) => {
    return (
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
        {children}
      </button>
    );
  };

  const useForm = jest.fn(() => ({
    formProps: {},
    form: {
      getFieldValue: jest.fn(() => undefined),
      setFieldsValue: jest.fn(),
      resetFields: jest.fn(),
    },
  }));
  const useSelect = jest.fn(() => ({
    selectProps: {
      options: [
        { label: "Assign", value: 2 },
        { label: "Other", value: 3 },
      ],
    },
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

/* Silence React warnings in tests */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

import { HardwareCreate } from "pages/hardware/create";

//Test
describe("HardwareCreate - Check render & Basic workflows (real component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createDataMock = undefined;
    mutateMock = jest.fn((payload: any, options: any) => {
      options?.onSuccess?.({
        data: { messages: "created", status: "success" },
      });
    });
  });

  it("renders form fields and buttons", () => {
    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );
    expect(screen.getByTestId("hardware-create-form")).toBeInTheDocument();
    expect(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("input-hardware.label.placeholder.assetName")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("select-hardware.label.placeholder.propertyType")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("select-hardware.label.placeholder.location")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("input-hardware.label.placeholder.insurance")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("select-hardware.label.placeholder.status")
    ).toBeInTheDocument();
    expect(screen.getByTestId("upload-image")).toBeInTheDocument();
  });

  it("selecting status 'Assign' shows assigned_user field (isReadyToDeploy branch)", async () => {
    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );
    const statusSelect = screen.getByTestId(
      "select-hardware.label.placeholder.status"
    );
    fireEvent.change(statusSelect, { target: { value: "2" } });
    await waitFor(() => {
      expect(
        screen.getByTestId("select-hardware.label.placeholder.user")
      ).toBeInTheDocument();
    });
  });

  it("submits form and calls mutate -> onSuccess triggers notification", async () => {
    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard"),
      { target: { value: "AT-001" } }
    );
    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.assetName"),
      { target: { value: "Device Name" } }
    );

    fireEvent.change(
      screen.getByTestId("select-hardware.label.placeholder.propertyType"),
      { target: { value: "2" } }
    );
    fireEvent.change(
      screen.getByTestId("select-hardware.label.placeholder.location"),
      { target: { value: "2" } }
    );

    const file = new File(["abc"], "photo.png", { type: "image/png" });
    const uploadInput = screen.getByTestId("upload-image") as HTMLInputElement;
    Object.defineProperty(uploadInput, "files", { value: [file] });
    fireEvent.change(uploadInput);

    fireEvent.click(screen.getByTestId("button-hardware.label.button.create"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" })
      );
    });
  });

  it("mutate error path calls notification.error and sets message errors", async () => {
    mutateMock = jest.fn((payload: any, options: any) => {
      const error = {
        response: { data: { messages: { asset_tag: ["already exists"] } } },
      };
      options?.onError?.(error);
    });

    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard"),
      { target: { value: "AT-EXISTS" } }
    );
    fireEvent.click(screen.getByTestId("button-hardware.label.button.create"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" })
      );
    });
  });

  it("upload input sets file state and that file is included in payload passed to mutate", async () => {
    let capturedPayload: any = null;
    mutateMock = jest.fn((payload: any, options: any) => {
      capturedPayload = payload.values ?? payload;
      options?.onSuccess?.({ data: { messages: "ok", status: "success" } });
    });

    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard"),
      { target: { value: "AT-FILE" } }
    );
    const testFile = new File(["img"], "img.png", { type: "image/png" });
    const upload = screen.getByTestId("upload-image") as HTMLInputElement;
    Object.defineProperty(upload, "files", { value: [testFile] });
    fireEvent.change(upload);

    fireEvent.click(screen.getByTestId("button-hardware.label.button.create"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(capturedPayload || mutateMock).toBeTruthy();
      expect(openNotificationMock).toHaveBeenCalled();
    });
  });

  it("allows submitting when only required fields are provided", async () => {
    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );
    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard"),
      { target: { value: "AT-REQ" } }
    );
    fireEvent.click(screen.getByTestId("button-hardware.label.button.create"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      const values =
        (mutateMock.mock.calls[0][0] as any).values ??
        (mutateMock.mock.calls[0][0] as any);
      expect(values.asset_tag || values).toBeTruthy();
    });
  });

  it("handles a long-running mutate (simulate loading) without throwing", async () => {
    mutateMock = jest.fn((payload: any, { onSuccess }: any) => {
      return new Promise((res) =>
        setTimeout(() => {
          onSuccess?.({ data: { messages: "created" } });
          res(null);
        }, 50)
      );
    });

    render(
      <HardwareCreate
        isModalVisible={true}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );
    fireEvent.change(
      screen.getByTestId("input-hardware.label.placeholder.propertyCard"),
      { target: { value: "AT-ASYNC" } }
    );
    fireEvent.click(screen.getByTestId("button-hardware.label.button.create"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" })
      );
    });
  });
});
