import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useHardwareColumns } from "pages/hardware/table-column";

// Mock TextField và DateField
jest.mock("@pankod/refine-antd", () => ({
  TextField: ({ value }: { value: any }) => <span>{value}</span>,
  DateField: ({ value }: { value: any }) => <span>{value?.toString()}</span>,
  getDefaultSortOrder: jest.fn(() => null),
}));

describe("useHardwareColumns Hook", () => {
  const mockT = (key: string) => key;
  const mockList = jest.fn();
  const sorter = {};

  const filterCategory: Array<{ text: string; value: string }> = [];
  const filterStatus_Label: Array<{ text: string; value: string }> = [];

  const TestComponent = () => {
    const columns = useHardwareColumns({
      sorter,
      t: mockT,
      list: mockList,
      filterCategory,
      filterStatus_Label,
    });

    return (
      <div>
        {columns.map((col) => (
          <div key={col.key} data-testid={`column-${col.key}`}>
            {col.title}
          </div>
        ))}
      </div>
    );
  };

  describe("Check render", () => {
    it("should return correct number of columns", () => {
      render(<TestComponent />);
      const columnElements = screen.getAllByTestId(/column-/);
      expect(columnElements.length).toBe(6);
    });

    it("should render TextField for id, name, maintenance_cycle", () => {
      render(<TestComponent />);
      expect(screen.getByTestId("column-id")).toBeInTheDocument();
      expect(screen.getByTestId("column-name")).toBeInTheDocument();
      expect(
        screen.getByTestId("column-maintenance_cycle")
      ).toBeInTheDocument();
    });

    it("should render Tag for status_label column", () => {
      render(<TestComponent />);
      expect(screen.getByTestId("column-status_label")).toBeInTheDocument();
    });

    it("should render webhook column", () => {
      render(<TestComponent />);
      expect(screen.getByTestId("column-webhook")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("should call list function when clicking webhook div", () => {
      const TestComponentWithWebhook = () => {
        const columns = useHardwareColumns({
          sorter,
          t: mockT,
          list: mockList,
          filterCategory,
          filterStatus_Label,
        });

        const webhookColumn = columns.find((col) => col.key === "webhook");

        const mockRecord = {
          id: 123,
          name: "Test Webhook",
          maintenance_date: { date: new Date().toISOString() },
        };

        const renderFunction = webhookColumn?.render as any;
        const element = renderFunction?.(mockRecord, mockRecord);

        return <div data-testid="webhook-div">{element}</div>;
      };

      const { getByTestId } = render(<TestComponentWithWebhook />);
      const wrapperDiv = getByTestId("webhook-div");

      const clickableDiv = wrapperDiv.firstChild as HTMLElement;
      expect(clickableDiv).toBeInTheDocument();

      fireEvent.click(clickableDiv);

      expect(mockList).toHaveBeenCalledWith(
        "webhook_details?id=123&name=Test Webhook"
      );
    });

    it("should render Tag with correct color for status_label column", () => {
      const TestComponentWithStatus = () => {
        const columns = useHardwareColumns({
          sorter,
          t: mockT,
          list: mockList,
          filterCategory,
          filterStatus_Label,
        });

        const statusColumn = columns.find((col) => col.key === "status_label");

        const record = {
          maintenance_date: { date: new Date().toISOString() },
          id: 123,
          name: "Test Hardware",
        };

        const renderFunction = statusColumn?.render as any;
        const element = renderFunction?.("", record);

        return <div data-testid="status-div">{element}</div>;
      };

      const { getByTestId } = render(<TestComponentWithStatus />);
      const statusNode = getByTestId("status-div");

      expect(statusNode).toBeInTheDocument();
      const tag = statusNode.querySelector(".ant-tag");
      expect(tag).toBeTruthy();
    });
  });
});
