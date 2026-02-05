import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QrControlPanel from "../../../pages/hardware/qr-control-panel";

jest.mock("antd", () => {
  const actualAntd = jest.requireActual("antd");

  const Select: React.FC<{
    value?: string;
    onChange?: (value: string) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
  }> = ({ value, onChange, children, disabled, style, ...props }) => {
    return (
      <select
        role="combobox"
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        style={style}
        {...props}
      >
        {children}
      </select>
    );
  };

  // Define Select.Option as a property of Select
  const Option = ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <option value={value}>{children}</option>;

  Option.displayName = "Select.Option";
  (Select as any).Option = Option;

  (Select as any).Option.displayName = "Select.Option";

  return {
    ...actualAntd,
    Select,
  };
});

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock rc-virtual-list để tránh lỗi removeEventListener
jest.mock("rc-virtual-list", () => ({
  __esModule: true,
  default: jest.fn(() => <div />),
}));

describe("QrControlPanel Component", () => {
  const mockSetLayout = jest.fn();
  const mockHandleFieldChange = jest.fn();
  const mockHandlePrint = jest.fn();

  const renderComponent = (layout: "above" | "below" | null) =>
    render(
      <QrControlPanel
        layout={layout}
        setLayout={mockSetLayout}
        handleFieldChange={mockHandleFieldChange}
        handlePrint={mockHandlePrint}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render the checkbox and print button", () => {
      renderComponent(null);

      expect(
        screen.getByText("user.label.title.codeDevice")
      ).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.field.qr_code")
      ).toBeInTheDocument();
    });

    it("should not render the layout dropdown when checkbox is unchecked", () => {
      renderComponent(null);

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("should render the layout dropdown when checkbox is checked", () => {
      renderComponent("above");

      const checkbox = screen.getByText("user.label.title.codeDevice");
      fireEvent.click(checkbox);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("should call handleFieldChange and setLayout when checkbox is clicked", () => {
      renderComponent(null);

      const checkbox = screen.getByText("user.label.title.codeDevice");
      fireEvent.click(checkbox);

      expect(mockHandleFieldChange).toHaveBeenCalledWith("name");
      expect(mockSetLayout).toHaveBeenCalledWith("below");
    });

    it("should call setLayout when a layout is selected from the dropdown", () => {
      renderComponent("above");

      const checkbox = screen.getByText("user.label.title.codeDevice");
      fireEvent.click(checkbox);

      const dropdown = screen.getByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "below" } });

      expect(mockSetLayout).toHaveBeenCalledWith("below");
    });

    it("should call handlePrint when the print button is clicked", () => {
      renderComponent(null);

      const printButton = screen.getByText("hardware.label.field.qr_code");
      fireEvent.click(printButton);

      expect(mockHandlePrint).toHaveBeenCalledTimes(1);
    });
  });
});
