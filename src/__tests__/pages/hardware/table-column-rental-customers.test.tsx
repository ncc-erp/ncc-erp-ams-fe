import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRentalCustomerColumns } from "../../../pages/hardware/table-column-rental-customers";

// ========================
// Mock @pankod/refine-antd
// ========================
jest.mock("@pankod/refine-antd", () => ({
  TextField: ({
    value,
    onClick,
    style,
  }: {
    value: any;
    onClick?: () => void;
    style?: React.CSSProperties;
  }) => (
    <span data-testid="mock-textfield" onClick={onClick} style={style}>
      {value}
    </span>
  ),
  DateField: ({ value }: { value: any }) => (
    <span data-testid="mock-datefield">{value?.toString()}</span>
  ),
  TagField: ({
    value,
    style,
    color,
  }: {
    value: any;
    style?: React.CSSProperties;
    color?: string;
  }) => (
    <span
      data-testid="mock-tagfield"
      style={{ ...style, background: style?.background || color }}
    >
      {value}
    </span>
  ),
  getDefaultSortOrder: jest.fn(() => null),
}));

// ========================
// Mock utils
// ========================
import {
  getAssetAssignedStatusDecription,
  getBGAssetAssignedStatusDecription,
} from "utils/assets";

jest.mock("utils/assets", () => ({
  getAssetAssignedStatusDecription: jest.fn(
    (value: number) => `Status ${value}`
  ),
  getAssetStatusDecription: jest.fn(() => ({
    label: "Active",
    color: "green",
  })),
  getBGAssetAssignedStatusDecription: jest.fn(() => "green"),
  filterAssignedStatus: [],
}));

// ========================
// Mock refine-core
// ========================
const mockList = jest.fn();
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
  useNavigation: () => ({
    list: mockList,
  }),
}));

describe("useRentalCustomerColumns Hook", () => {
  const sorter = {};
  const filterCategory = [{ text: "Category 1", value: "1" }];
  const filterStatus_Label = [{ text: "Status 1", value: "1" }];

  const TestComponent = () => {
    const columns = useRentalCustomerColumns({
      sorter,
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
    it("should render the correct number of columns", () => {
      render(<TestComponent />);
      const columnElements = screen.getAllByTestId(/column-/);
      expect(columnElements.length).toBe(16); // Tổng số cột được định nghĩa
    });

    it("should render specific columns", () => {
      render(<TestComponent />);
      expect(screen.getByTestId("column-id")).toBeInTheDocument();
      expect(screen.getByTestId("column-name")).toBeInTheDocument();
      expect(screen.getByTestId("column-status_label")).toBeInTheDocument();
      expect(screen.getByTestId("column-assigned_to")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    beforeEach(() => {
      mockList.mockClear();
      (getAssetAssignedStatusDecription as jest.Mock).mockClear();
      (getBGAssetAssignedStatusDecription as jest.Mock).mockClear();
    });

    it("should call list function when clicking on rtd_location column", () => {
      const TestComponentWithClick = () => {
        const columns = useRentalCustomerColumns({
          sorter,
          filterCategory,
          filterStatus_Label,
        });

        const rtdLocationColumn = columns.find(
          (col) => col.key === "rtd_location"
        );

        const record = {
          id: 1,
          name: "Location 1",
          status_label: { id: 2 },
          rtd_location: { id: 1, name: "Location 1" },
        };

        const renderFunction = rtdLocationColumn?.render as any;
        const element = renderFunction(record.rtd_location, record);

        return <div data-testid="rtd-location">{element}</div>;
      };

      const { getByTestId } = render(<TestComponentWithClick />);
      const wrapper = getByTestId("rtd-location");
      const rtdLocationElement = wrapper.firstChild as HTMLElement;

      fireEvent.click(rtdLocationElement);

      expect(mockList).toHaveBeenCalledWith(
        "location_details?id=1&name=Location 1&status_id=2"
      );
    });

    it("should render TagField with correct color for status_label column", () => {
      const TestComponentWithStatus = () => {
        const columns = useRentalCustomerColumns({
          sorter,
          filterCategory,
          filterStatus_Label,
        });

        const statusColumn = columns.find((col) => col.key === "status_label");

        const record = {
          status_label: { id: 1 },
        };

        const renderFunction = statusColumn?.render as any;
        const element = renderFunction(record.status_label, record);

        return <div data-testid="status-label">{element}</div>;
      };

      const { getByTestId } = render(<TestComponentWithStatus />);
      const wrapper = getByTestId("status-label");
      const statusLabelElement = wrapper.firstChild as HTMLElement;

      expect(statusLabelElement).toBeInTheDocument();
      expect(statusLabelElement).toHaveStyle("background: green");
      expect(statusLabelElement).toHaveTextContent("Active");
    });

    it("should render TagField with correct text and color for assigned_status column", () => {
      const TestComponentWithAssigned = () => {
        const columns = useRentalCustomerColumns({
          sorter,
          filterCategory,
          filterStatus_Label,
        });

        const assignedColumn = columns.find(
          (col) => col.key === "assigned_status"
        );

        const record = {
          assigned_status: 5,
        };

        const renderFunction = assignedColumn?.render as any;
        const element = renderFunction(record.assigned_status, record);

        return <div data-testid="assigned-status">{element}</div>;
      };

      const { getByTestId } = render(<TestComponentWithAssigned />);
      const wrapper = getByTestId("assigned-status");
      const assignedElement = wrapper.firstChild as HTMLElement;

      expect(getAssetAssignedStatusDecription).toHaveBeenCalledWith(5);
      expect(getBGAssetAssignedStatusDecription).toHaveBeenCalledWith(5);

      expect(assignedElement).toBeInTheDocument();
      expect(assignedElement).toHaveTextContent("Status 5");
      expect(assignedElement).toHaveStyle("background: green");
    });
  });
});
