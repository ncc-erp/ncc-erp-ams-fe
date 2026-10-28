import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QrCodeDetail } from "../../../pages/hardware/qr-code";
import { IHardwareResponse } from "../../../interfaces/hardware";
import { useReactToPrint } from "react-to-print";

// Mock @pankod/refine-antd
jest.mock("@pankod/refine-antd", () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Modal: ({ title, visible, footer, children }: any) =>
    visible ? (
      <div>
        <h1>{title}</h1>
        <div>{children}</div>
        <div>{footer}</div>
      </div>
    ) : null,
}));

// Mock useTranslate
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

// Mock react-to-print
jest.mock("react-to-print", () => ({
  useReactToPrint: jest.fn(),
}));

// Mock QrControlPanel
jest.mock("../../../pages/hardware/qr-control-panel", () => ({
  __esModule: true,
  default: ({ handleFieldChange, handlePrint }: any) => (
    <div>
      <span onClick={() => handleFieldChange("name")}>name</span>
      <button onClick={handlePrint}>Print</button>
    </div>
  ),
}));

// Mock MultiQrCards
jest.mock("../../../pages/hardware/muti-qr-cards", () => ({
  __esModule: true,
  default: ({ hardwareList, handleDeleteQrCode }: any) => (
    <div>
      {hardwareList.map((h: any) => (
        <div key={h.id}>
          <span>{h.name}</span>
          <button onClick={() => handleDeleteQrCode(h.id)}>x</button>
        </div>
      ))}
    </div>
  ),
}));

// Mock SingleQrCard
jest.mock("../../../pages/hardware/single-qr-card", () => ({
  __esModule: true,
  default: ({ detail }: any) => (
    <div>
      <span>{detail.name}</span>
    </div>
  ),
}));

describe("QrCodeDetail Component", () => {
  const mockCloseModal = jest.fn();

  const mockDetail: IHardwareResponse[] = [
    {
      id: 1,
      name: "Hardware 1",
      asset_tag: "TAG001",
      serial: "SERIAL001",
      model: { id: 1, name: "Model 1" },
      model_number: "M001",
      status_label: {
        id: 1,
        name: "Status 1",
        status_type: "",
        status_meta: "",
      },
      category: { id: 1, name: "Category 1" },
      manufacturer: { id: 1, name: "Manufacturer 1" },
      supplier: { id: 1, name: "Supplier 1" },
      notes: "",
      order_number: "ORD001",
      location: { id: 1, name: "Location 1" },
      rtd_location: { id: 1, name: "RTD Location 1" },
      image: "",
      warranty_months: "12",
      warranty_expires: { date: "", formatted: "" },
      purchase_cost: 1000,
      purchase_date: { date: "", formatted: "" },
      assigned_to: {
        id: 1,
        name: "User 1",
        username: "user1",
        first_name: "User",
        last_name: "One",
      },
      last_audit_date: "",
      requestable: "1",
      physical: 1,
      note: "",
      expected_checkin: { date: "", formatted: "" },
      last_checkout: { date: "", formatted: "" },
      assigned_location: { id: 1, name: "Assigned Location 1" },
      assigned_user: 1,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 1,
        assigned_asset: "",
        assigned_location: { id: 1, name: "Assigned Location 1" },
      },
      user_can_checkout: true,
      user_can_checkin: true,
      assigned_status: 1,
      checkin_at: { date: "", formatted: "" },
      created_at: { datetime: "", formatted: "" },
      updated_at: { datetime: "", formatted: "" },
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      withdraw_from: 0,
    },
    {
      id: 2,
      name: "Hardware 2",
      asset_tag: "TAG002",
      serial: "SERIAL002",
      model: { id: 2, name: "Model 2" },
      model_number: "M002",
      status_label: {
        id: 2,
        name: "Status 2",
        status_type: "",
        status_meta: "",
      },
      category: { id: 2, name: "Category 2" },
      manufacturer: { id: 2, name: "Manufacturer 2" },
      supplier: { id: 2, name: "Supplier 2" },
      notes: "",
      order_number: "ORD002",
      location: { id: 2, name: "Location 2" },
      rtd_location: { id: 2, name: "RTD Location 2" },
      image: "",
      warranty_months: "12",
      warranty_expires: { date: "", formatted: "" },
      purchase_cost: 2000,
      purchase_date: { date: "", formatted: "" },
      assigned_to: {
        id: 2,
        name: "User 2",
        username: "user2",
        first_name: "User",
        last_name: "Two",
      },
      last_audit_date: "",
      requestable: "1",
      physical: 1,
      note: "",
      expected_checkin: { date: "", formatted: "" },
      last_checkout: { date: "", formatted: "" },
      assigned_location: { id: 2, name: "Assigned Location 2" },
      assigned_user: 2,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 2,
        assigned_asset: "",
        assigned_location: { id: 2, name: "Assigned Location 2" },
      },
      user_can_checkout: true,
      user_can_checkin: true,
      assigned_status: 2,
      checkin_at: { date: "", formatted: "" },
      created_at: { datetime: "", formatted: "" },
      updated_at: { datetime: "", formatted: "" },
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      withdraw_from: 0,
    },
  ];

  const renderComponent = (detail: IHardwareResponse | IHardwareResponse[]) =>
    render(<QrCodeDetail detail={detail} closeModal={mockCloseModal} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render multiple QR codes when detail is an array", () => {
      renderComponent(mockDetail);

      mockDetail.forEach((hardware) => {
        expect(screen.getByText(hardware.name)).toBeInTheDocument();
      });
    });

    it("should render a single QR code when detail is an object", () => {
      renderComponent(mockDetail[0]);

      expect(screen.getByText(mockDetail[0].name)).toBeInTheDocument();
    });

    it("should render the control panel", () => {
      renderComponent(mockDetail);

      expect(screen.getByText("name")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("should call closeModal when all QR codes are deleted", async () => {
      renderComponent(mockDetail);

      // Delete first QR code
      let deleteButtons = screen.getAllByText("x");
      fireEvent.click(deleteButtons[0]);

      let confirmButton = screen.getByText("hardware.label.field.condition");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockCloseModal).not.toHaveBeenCalled();
      });

      // Delete second QR code
      deleteButtons = screen.getAllByText("x");
      fireEvent.click(deleteButtons[0]);

      confirmButton = screen.getByText("hardware.label.field.condition");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
      });
    });

    it("should toggle selected fields when a field is clicked", () => {
      renderComponent(mockDetail);

      const field = screen.getByText("name");

      fireEvent.click(field);
      expect(screen.getByText("Hardware 1")).toBeInTheDocument();

      fireEvent.click(field);
    });

    it("should call the print function when the print button is clicked", async () => {
      const mockPrint = jest.fn();
      (useReactToPrint as jest.Mock).mockReturnValue(mockPrint);

      renderComponent(mockDetail);

      const printButton = screen.getByText("Print");
      fireEvent.click(printButton);

      await waitFor(() => {
        expect(mockPrint).toHaveBeenCalledTimes(1);
      });
    });

    it("should open and close the delete confirmation modal", () => {
      renderComponent(mockDetail);

      const deleteButton = screen.getAllByText("x")[0];
      fireEvent.click(deleteButton);

      const modalTitle = screen.getByRole("heading", {
        name: /hardware.label.field.confirmDeleteQr/i,
      });
      expect(modalTitle).toBeInTheDocument();

      const cancelButton = screen.getByText("buttons.cancel");
      fireEvent.click(cancelButton);

      expect(
        screen.queryByRole("heading", {
          name: /hardware.label.field.confirmDeleteQr/i,
        })
      ).not.toBeInTheDocument();
    });
  });
});
