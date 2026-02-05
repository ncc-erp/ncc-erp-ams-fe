import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PopupDetailDevice from "../../../pages/hardware/popupDetailDevice";

// ===== Mock refine-antd components =====
jest.mock("@pankod/refine-antd", () => {
  const Modal = ({ title, visible, onCancel, children }: any) =>
    visible ? (
      <div>
        <h1>{title}</h1>
        <div>{children}</div>
        <button data-testid="modal-close" onClick={onCancel}>
          Close
        </button>
      </div>
    ) : null;

  const Descriptions: any = ({ children }: any) => <div>{children}</div>;
  Descriptions.Item = ({ label, children }: any) => (
    <div>
      <strong>{label}</strong>
      <div>{children}</div>
    </div>
  );
  Descriptions.Item.displayName = "Descriptions.Item";

  const Typography = { Text: ({ children }: any) => <span>{children}</span> };

  return { Modal, Descriptions, Typography };
});

// ===== Mock refine-core =====
const mockUseCustom = jest.fn();
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  useCustom: (...args: any[]) => mockUseCustom(...args),
}));

// ===== Silence console.error for react warnings =====
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe("PopupDetailDevice Component", () => {
  const mockOnClose = jest.fn();

  const sampleDevice = {
    id: 42,
    name: "Device X",
    serial: "SN-001",
    manufacturer: { name: "Acme" },
    category: { name: "Category A" },
    model: { name: "Model Y" },
    purchase_date: { formatted: "2023-01-01" },
    location: { name: "Location 1" },
    status_label: { name: "OK" },
    assigned_to: { name: "John Doe" },
    created_at: { formatted: "2023-02-01" },
    updated_at: { formatted: "2023-02-02" },
    purchase_cost: { formatted: "$100" },
    checkin_counter: 1,
    checkout_counter: 2,
    notes: "Some notes",
    warranty_months: "12",
    warranty_expires: { formatted: "2024-01-01" },
    requests_counter: 0,
    supplier: "Supplier A",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===== Helper: match text bất kể nested nodes, tránh multiple nodes error =====
  const matchText = (text: string) => {
    const elements = screen.getAllByText((content) => content.includes(text));
    expect(elements.length).toBeGreaterThan(0);
  };

  describe("Render with different states", () => {
    it("renders all device details correctly (Normal)", async () => {
      mockUseCustom.mockReturnValue({
        data: { data: sampleDevice },
        isLoading: false,
      });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      matchText("hardware.label.title.detail");
      matchText(String(sampleDevice.id));
      matchText(sampleDevice.name);
      matchText(sampleDevice.serial);
      matchText(sampleDevice.manufacturer.name);
      matchText(sampleDevice.category.name);
      matchText(sampleDevice.model.name);
      matchText(sampleDevice.purchase_date.formatted);
      matchText(sampleDevice.supplier);
      matchText(sampleDevice.location.name);
      matchText(sampleDevice.assigned_to.name);
      matchText(sampleDevice.created_at.formatted);
      matchText(sampleDevice.updated_at.formatted);
      matchText(sampleDevice.purchase_cost.formatted);
      matchText(String(sampleDevice.checkin_counter));
      matchText(String(sampleDevice.checkout_counter));
      matchText(sampleDevice.notes);
      matchText(sampleDevice.warranty_months);
      matchText(sampleDevice.warranty_expires.formatted);
      matchText(String(sampleDevice.requests_counter));
    });

    it("renders 'Loading...' for all fields when isLoading=true", async () => {
      mockUseCustom.mockReturnValue({ data: null, isLoading: true });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
    });

    it("renders 'n/a' for missing fields when data is empty", async () => {
      mockUseCustom.mockReturnValue({ data: { data: {} }, isLoading: false });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      expect(screen.getAllByText("n/a").length).toBeGreaterThan(0);
    });

    it("renders broken status correctly", async () => {
      const brokenDevice = {
        ...sampleDevice,
        status_label: { name: "hardware.label.field.broken" },
      };
      mockUseCustom.mockReturnValue({
        data: { data: brokenDevice },
        isLoading: false,
      });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      matchText("hardware.label.detail.broken");
      matchText(brokenDevice.assigned_to.name);
    });
  });

  describe("Basic workflows", () => {
    it("calls onClose when modal close button is clicked", async () => {
      mockUseCustom.mockReturnValue({
        data: { data: sampleDevice },
        isLoading: false,
      });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("displays device data correctly after rendering", async () => {
      mockUseCustom.mockReturnValue({
        data: { data: sampleDevice },
        isLoading: false,
      });

      await act(async () => {
        render(<PopupDetailDevice id="42" onClose={mockOnClose} />);
      });

      matchText(sampleDevice.name);
      matchText(sampleDevice.serial);
      matchText(sampleDevice.manufacturer.name);
    });
  });
});
