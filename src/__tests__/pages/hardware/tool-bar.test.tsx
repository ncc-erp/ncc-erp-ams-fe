import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolbarActions } from "../../../pages/hardware/tool-bar";

// Mock useTranslate trả về chính key
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

describe("ToolbarActions Component", () => {
  const mockColumns = [
    { key: "column1", title: "Column 1" },
    { key: "column2", title: "Column 2" },
  ];
  const mockSelectedColumns = ["column1"];
  const mockOnToggleColumn = jest.fn();
  const mockOnRefresh = jest.fn();
  const mockOnOpenSearch = jest.fn();

  const renderComponent = () =>
    render(
      <ToolbarActions
        columns={mockColumns}
        selectedColumns={mockSelectedColumns}
        onToggleColumn={mockOnToggleColumn}
        onRefresh={mockOnRefresh}
        onOpenSearch={mockOnOpenSearch}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Check render", () => {
    it("should render all buttons and dropdown", () => {
      renderComponent();
      expect(screen.getByLabelText("sync")).toBeInTheDocument(); // Refresh
      expect(screen.getByLabelText("menu")).toBeInTheDocument(); // Columns
      expect(screen.getByLabelText("file-search")).toBeInTheDocument(); // Search
    });

    it("should display all column checkboxes when dropdown is open", () => {
      renderComponent();
      fireEvent.click(screen.getByLabelText("menu"));

      mockColumns.forEach((col) => {
        expect(
          screen.getByRole("checkbox", { name: col.title })
        ).toBeInTheDocument();
      });
    });

    it("should render checkbox as checked when column is in selectedColumns", () => {
      renderComponent();
      fireEvent.click(screen.getByLabelText("menu"));

      const columnCheckbox = screen.getByRole("checkbox", { name: "Column 1" });
      expect(columnCheckbox).toBeChecked();

      const uncheckedColumn = screen.getByRole("checkbox", {
        name: "Column 2",
      });
      expect(uncheckedColumn).not.toBeChecked();
    });
  });

  describe("Basic workflows", () => {
    it("should call onRefresh when Refresh button is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByLabelText("sync"));
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it("should toggle dropdown when Columns button is clicked", () => {
      renderComponent();

      const menuButton = screen.getByLabelText("menu");
      const menu = screen.getByRole("navigation");

      fireEvent.click(menuButton);
      expect(menu).toHaveClass("menu active");

      fireEvent.click(menuButton);
      expect(menu).toHaveClass("menu inactive");
    });

    it("should call onToggleColumn when a column is toggled", () => {
      renderComponent();
      fireEvent.click(screen.getByLabelText("menu"));

      fireEvent.click(screen.getByRole("checkbox", { name: "Column 1" }));
      expect(mockOnToggleColumn).toHaveBeenCalledWith(mockColumns[0]);
    });

    it("should call onOpenSearch when Search button is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByLabelText("file-search"));
      expect(mockOnOpenSearch).toHaveBeenCalledTimes(1);
    });

    it("should close dropdown when clicking outside", () => {
      renderComponent();
      const menu = screen.getByRole("navigation");

      fireEvent.click(screen.getByLabelText("menu"));
      expect(menu).toHaveClass("menu active");

      fireEvent.click(document.body);
      expect(menu).toHaveClass("menu inactive");
    });
  });
});
