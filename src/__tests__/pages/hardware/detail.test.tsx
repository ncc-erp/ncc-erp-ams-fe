import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DetailProduct } from "pages/hardware/detail";
import { HARDWARE_API } from "api/baseApi";

jest.mock("api/baseApi", () => ({
  HARDWARE_API: "api/v1/hardware",
}));

const useCustomMock = jest.fn();
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  useCustom: (cfg: any) => useCustomMock(cfg),
}));

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ search: "?id=123" }),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("DetailProduct - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("renders title and shows id from query when no device data", () => {
      useCustomMock.mockReturnValue({ data: null, isLoading: false });

      render(<DetailProduct />);

      expect(
        screen.getByText("hardware.label.title.detail")
      ).toBeInTheDocument();
      expect(screen.getByText("123")).toBeInTheDocument();

      const fallbacks = screen.getAllByText("n/a");
      expect(fallbacks.length).toBeGreaterThan(0);
    });
  });

  describe("Basic workflows", () => {
    it("calls useCustom with expected URL and renders device fields when data present", async () => {
      const device = {
        id: 123,
        name: "Device X",
        status_label: { name: "hardware.label.field.broken" },
        serial: "SN-001",
        manufacturer: { name: "Acme" },
        category: { name: "Cat 1" },
        model: { name: "Model A" },
        purchase_date: { formatted: "2024-01-01" },
        supplier: "Supplier Inc",
        location: { name: "Loc 1" },
        created_at: { formatted: "2024-01-02" },
        updated_at: { formatted: "2024-02-03" },
        purchase_cost: { formatted: "$100" },
        checkin_counter: 2,
        checkout_counter: 5,
        notes: "Some notes",
        warranty_expires: { formatted: "2025-01-01" },
        assigned_to: { name: "Alice" },
      };

      useCustomMock.mockReturnValue({
        data: { data: device },
        isLoading: false,
      });

      render(<DetailProduct />);

      await waitFor(() =>
        expect(useCustomMock).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `${HARDWARE_API}/123`,
            method: "get",
          })
        )
      );

      // device fields present
      expect(screen.getByText("Device X")).toBeInTheDocument();
      expect(screen.getByText("SN-001")).toBeInTheDocument();
      expect(screen.getByText("Acme")).toBeInTheDocument();
      expect(screen.getByText("Cat 1")).toBeInTheDocument();
      expect(screen.getByText("Model A")).toBeInTheDocument();
      expect(screen.getByText("2024-01-01")).toBeInTheDocument();
      expect(screen.getByText("Supplier Inc")).toBeInTheDocument();
      expect(screen.getByText("Loc 1")).toBeInTheDocument();
      expect(screen.getByText("2024-01-02")).toBeInTheDocument();
      expect(screen.getByText("2024-02-03")).toBeInTheDocument();
      expect(screen.getByText("$100")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Some notes")).toBeInTheDocument();
      expect(screen.getByText("2025-01-01")).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.detail.broken")
      ).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });
});
