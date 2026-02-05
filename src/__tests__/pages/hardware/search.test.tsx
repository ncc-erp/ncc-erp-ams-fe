import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolSearch } from "../../../pages/tools/search";
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

describe("ToolSearch Component", () => {
  const mockSetIsModalVisible = jest.fn();
  const mockOnFinish = jest.fn();

  const mockSearchFormProps: FormProps = {
    onFinish: mockOnFinish,
  };

  const renderComponent = () =>
    render(
      <ToolSearch
        isModalVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
        searchFormProps={mockSearchFormProps}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Describe for "Check render"
  describe("Check render", () => {
    it("should render all input fields and the search button", () => {
      renderComponent();

      expect(
        screen.getByLabelText("tools.label.field.name")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("tools.label.field.version")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("tools.label.field.manufacturer")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("tools.label.field.category")
      ).toBeInTheDocument();
      expect(screen.getByText("tools.label.button.search")).toBeInTheDocument();
    });

    it("should render the form with empty input fields initially", () => {
      renderComponent();

      expect(screen.getByLabelText("tools.label.field.name")).toHaveValue("");
      expect(screen.getByLabelText("tools.label.field.version")).toHaveValue(
        ""
      );
      expect(
        screen.getByLabelText("tools.label.field.manufacturer")
      ).toHaveValue("");
      expect(screen.getByLabelText("tools.label.field.category")).toHaveValue(
        ""
      );
    });
  });

  // Describe for "Basic workflows"
  describe("Basic workflows", () => {
    it("should call setIsModalVisible(false) when the form is submitted", async () => {
      renderComponent();

      const searchButton = screen.getByText("tools.label.button.search");
      await act(async () => {
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("should call onFinish with the correct form values when the form is submitted", async () => {
      renderComponent();

      const nameInput = screen.getByLabelText("tools.label.field.name");
      const versionInput = screen.getByLabelText("tools.label.field.version");
      const manufacturerInput = screen.getByLabelText(
        "tools.label.field.manufacturer"
      );
      const categoryInput = screen.getByLabelText("tools.label.field.category");
      const searchButton = screen.getByText("tools.label.button.search");

      await act(async () => {
        await userEvent.type(nameInput, "Tool Name");
        await userEvent.type(versionInput, "1.0");
        await userEvent.type(manufacturerInput, "Manufacturer Name");
        await userEvent.type(categoryInput, "Category Name");
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: "Tool Name",
          version: "1.0",
          manufacturer: "Manufacturer Name",
          category: "Category Name",
        });
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("should call onFinish with undefined values if no input values are provided", async () => {
      renderComponent();

      const searchButton = screen.getByText("tools.label.button.search");

      await act(async () => {
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: undefined,
          version: undefined,
          manufacturer: undefined,
          category: undefined,
        });
      });
    });

    it("should allow partial form submission with only one field filled", async () => {
      renderComponent();

      const nameInput = screen.getByLabelText("tools.label.field.name");
      const searchButton = screen.getByText("tools.label.button.search");

      await act(async () => {
        await userEvent.type(nameInput, "Partial Name");
        await userEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalledWith({
          name: "Partial Name",
        });
        expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
      });
    });
  });
});
