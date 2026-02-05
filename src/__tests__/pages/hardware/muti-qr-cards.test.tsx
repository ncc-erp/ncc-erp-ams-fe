import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MultiQrCards from "../../../pages/hardware/muti-qr-cards";
import { IHardwareResponse } from "../../../interfaces/hardware";

describe("MultiQrCards Component", () => {
  const mockHardwareList: IHardwareResponse[] = [
    { id: 1, name: "Hardware 1" } as IHardwareResponse,
    { id: 2, name: "Hardware 2" } as IHardwareResponse,
  ];

  const mockRenderSelectedFields = jest.fn((modelName: string) => (
    <div data-testid="selected-fields">{modelName}</div>
  ));

  const mockGenerateRedirectUrl = jest.fn(
    (hardware: IHardwareResponse) =>
      `https://example.com/hardware/${hardware.id}`
  );

  const mockHandleDeleteQrCode = jest.fn();

  const renderComponent = (layout: "above" | "below" | null) =>
    render(
      <MultiQrCards
        hardwareList={mockHardwareList}
        layout={layout}
        paddingStyle="10px"
        renderSelectedFields={mockRenderSelectedFields}
        generateRedirectUrl={mockGenerateRedirectUrl}
        handleDeleteQrCode={mockHandleDeleteQrCode}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render the correct number of QR cards", () => {
      renderComponent("above");
      const qrCards = screen.getAllByTestId("selected-fields");
      expect(qrCards.length).toBe(mockHardwareList.length);
    });

    it("should render selected fields above the QR code when layout is 'above'", () => {
      renderComponent("above");
      mockHardwareList.forEach((hardware) => {
        expect(screen.getByText(hardware.name)).toBeInTheDocument();
      });
    });

    it("should render selected fields below the QR code when layout is 'below'", () => {
      renderComponent("below");
      mockHardwareList.forEach((hardware) => {
        expect(screen.getByText(hardware.name)).toBeInTheDocument();
      });
    });

    it("should render delete button for each QR card", () => {
      renderComponent("above");
      const deleteButtons = screen.getAllByText("x");
      expect(deleteButtons.length).toBe(mockHardwareList.length);
    });
  });

  describe("Basic workflows", () => {
    it("should call handleDeleteQrCode with the correct id when delete button is clicked", () => {
      renderComponent("above");
      const deleteButtons = screen.getAllByText("x");

      fireEvent.click(deleteButtons[0]);
      expect(mockHandleDeleteQrCode).toHaveBeenCalledWith(
        mockHardwareList[0].id
      );

      fireEvent.click(deleteButtons[1]);
      expect(mockHandleDeleteQrCode).toHaveBeenCalledWith(
        mockHardwareList[1].id
      );
    });

    it("should call renderSelectedFields with the correct model name", () => {
      renderComponent("above");
      mockHardwareList.forEach((hardware) => {
        expect(mockRenderSelectedFields).toHaveBeenCalledWith(hardware.name);
      });
    });

    // it("should generate the correct QR code value for each hardware", () => {
    //   renderComponent("above");
    //   mockHardwareList.forEach((hardware) => {
    //     expect(mockGenerateRedirectUrl).toHaveBeenCalledWith(hardware);
    //   });
    // });
  });
});
