import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientHardwareSearch } from "pages/hardware_client/search";
import { FormProps } from "@pankod/refine-antd";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

describe("ClientHardwareSearch Component", () => {
  const mockSetIsModalVisible = jest.fn();
  const mockOnFinish = jest.fn();

  const mockSearchFormProps: FormProps = {
    onFinish: mockOnFinish,
  };

  const renderComponent = (props: FormProps = mockSearchFormProps) =>
    render(
      <ClientHardwareSearch
        isModalVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
        searchFormProps={props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render all input fields and the search button", () => {
      renderComponent();

      expect(
        screen.getByLabelText("hardware.label.field.assetName")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.field.propertyCard")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.field.serial")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.field.propertyType")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.field.status")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.field.checkoutTo")
      ).toBeInTheDocument();
      expect(
        screen.getByText("hardware.label.button.search")
      ).toBeInTheDocument();
    });

    it("should render the form with empty input fields initially", () => {
      renderComponent();

      expect(
        screen.getByLabelText("hardware.label.field.assetName")
      ).toHaveValue("");
      expect(
        screen.getByLabelText("hardware.label.field.propertyCard")
      ).toHaveValue("");
      expect(screen.getByLabelText("hardware.label.field.serial")).toHaveValue(
        ""
      );
      expect(
        screen.getByLabelText("hardware.label.field.propertyType")
      ).toHaveValue("");
      expect(screen.getByLabelText("hardware.label.field.status")).toHaveValue(
        ""
      );
      expect(
        screen.getByLabelText("hardware.label.field.checkoutTo")
      ).toHaveValue("");
    });
  });
  it("respects initialValues passed via searchFormProps.initialValues", () => {
    const customProps: FormProps = {
      onFinish: mockOnFinish,
      initialValues: {
        name: "INIT_NAME",
        asset_tag: "INIT_AT",
        serial: "INIT_S",
      },
    };
    renderComponent(customProps);

    expect(screen.getByLabelText("hardware.label.field.assetName")).toHaveValue(
      "INIT_NAME"
    );
    expect(
      screen.getByLabelText("hardware.label.field.propertyCard")
    ).toHaveValue("INIT_AT");
    expect(screen.getByLabelText("hardware.label.field.serial")).toHaveValue(
      "INIT_S"
    );
  });

  describe("Basic workflows", () => {
    it("should call setIsModalVisible(false) when the form is submitted", async () => {
      renderComponent();

      const searchButton = screen.getByText("hardware.label.button.search");
      await act(async () => {
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("should call onFinish with the correct form values when the form is submitted", async () => {
      renderComponent();

      const nameInput = screen.getByLabelText("hardware.label.field.assetName");
      const assetTagInput = screen.getByLabelText(
        "hardware.label.field.propertyCard"
      );
      const serialInput = screen.getByLabelText("hardware.label.field.serial");
      const modelInput = screen.getByLabelText(
        "hardware.label.field.propertyType"
      );
      const statusInput = screen.getByLabelText("hardware.label.field.status");
      const assignedToInput = screen.getByLabelText(
        "hardware.label.field.checkoutTo"
      );
      const searchButton = screen.getByText("hardware.label.button.search");

      await act(async () => {
        await userEvent.type(nameInput, "Device A");
        await userEvent.type(assetTagInput, "AT-123");
        await userEvent.type(serialInput, "S-001");
        await userEvent.type(modelInput, "Model X");
        await userEvent.type(statusInput, "Ready");
        await userEvent.type(assignedToInput, "user1");
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: "Device A",
          asset_tag: "AT-123",
          serial: "S-001",
          model: "Model X",
          status_label: "Ready",
          assigned_to: "user1",
        });
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("should call onFinish with undefined values if no input values are provided", async () => {
      renderComponent();

      const searchButton = screen.getByText("hardware.label.button.search");

      await act(async () => {
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: undefined,
          asset_tag: undefined,
          serial: undefined,
          model: undefined,
          status_label: undefined,
          assigned_to: undefined,
        });
      });
    });

    it("should allow partial form submission with only one field filled", async () => {
      renderComponent();

      const nameInput = screen.getByLabelText("hardware.label.field.assetName");
      const searchButton = screen.getByText("hardware.label.button.search");

      await act(async () => {
        await userEvent.type(nameInput, "Partial Device");
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: "Partial Device",
        });
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });
  });
});
