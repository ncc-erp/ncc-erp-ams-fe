import React from "react";
import { render, screen } from "@testing-library/react";
import SingleQrCard from "../../../pages/hardware/single-qr-card";
import { IHardwareResponse } from "../../../interfaces/hardware";

describe("SingleQrCard Component", () => {
  const mockDetail: IHardwareResponse = {
    id: 1,
    name: "Test Hardware",
  } as IHardwareResponse;

  const mockRenderSelectedFields = jest.fn((modelName: string) => (
    <div data-testid="selected-fields">{modelName}</div>
  ));

  const mockGenerateRedirectUrl = jest.fn(
    (detail: IHardwareResponse) => `https://example.com/hardware/${detail.id}`
  );

  const renderComponent = (
    layout: "above" | "below" | null,
    paddingStyle: string
  ) =>
    render(
      <SingleQrCard
        detail={mockDetail}
        layout={layout}
        paddingStyle={paddingStyle}
        renderSelectedFields={mockRenderSelectedFields}
        generateRedirectUrl={mockGenerateRedirectUrl}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render nothing if detail is null", () => {
      render(
        <SingleQrCard
          detail={null as any}
          layout="above"
          paddingStyle="10px"
          renderSelectedFields={mockRenderSelectedFields}
          generateRedirectUrl={mockGenerateRedirectUrl}
        />
      );
      expect(screen.queryByTestId("single-qr-card")).not.toBeInTheDocument();
    });

    it("should render QR code and selected fields above when layout is 'above'", () => {
      const { container } = renderComponent("above", "10px");

      expect(screen.getByTestId("selected-fields")).toHaveTextContent(
        mockDetail.name
      );
      const qrCode = container.querySelector(".qr-code");
      expect(qrCode).toBeInTheDocument();
    });

    it("should render QR code and selected fields below when layout is 'below'", () => {
      const { container } = renderComponent("below", "10px");

      expect(screen.getByTestId("selected-fields")).toHaveTextContent(
        mockDetail.name
      );
      const qrCode = container.querySelector(".qr-code");
      expect(qrCode).toBeInTheDocument();
    });

    it("should apply the correct padding style", () => {
      const { container } = renderComponent("above", "20px");
      const qrCardContent = container.querySelector(".qr-card-content");
      expect(qrCardContent).toHaveStyle("padding: 20px");
    });
  });

  describe("Basic workflows", () => {
    it("should call renderSelectedFields with the correct model name", () => {
      renderComponent("above", "10px");
      expect(mockRenderSelectedFields).toHaveBeenCalledWith(mockDetail.name);
    });

    it("should call generateRedirectUrl with the correct detail", () => {
      renderComponent("above", "10px");
      expect(mockGenerateRedirectUrl).toHaveBeenCalledWith(mockDetail);
    });

    it("should generate the correct QR code value", () => {
      const { container } = renderComponent("above", "10px");
      const qrCode = container.querySelector(".qr-code");
      expect(qrCode).toBeInTheDocument();
      expect(mockGenerateRedirectUrl).toHaveBeenCalledWith(mockDetail);
    });
  });
});
