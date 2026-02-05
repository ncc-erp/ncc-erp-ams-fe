import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HardwareTable } from "../../../pages/hardware/table";

// ========================
// Mock các thành phần từ @pankod/refine-antd
// ========================
jest.mock("@pankod/refine-antd", () => {
  const MockTable: any = ({
    children,
    dataSource,
    className,
    pagination,
  }: any) => {
    const columns: any[] = React.Children.toArray(children);

    return (
      <div>
        <table data-testid="mock-table" className={className}>
          <thead>
            <tr>
              {columns.map((col: any, i: number) => (
                <th key={i}>{col.props.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource?.map((record: any) => (
              <tr key={record.id}>
                {columns.map((col: any, colIndex: number) => {
                  if (col.props.render) {
                    return (
                      <td key={colIndex}>
                        {col.props.render(record[col.props.dataIndex], record)}
                      </td>
                    );
                  }
                  return <td key={colIndex}>{record[col.props.dataIndex]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {pagination && pagination.total > 10 && (
          <div data-testid="mock-pagination">Total: {pagination.total}</div>
        )}
      </div>
    );
  };

  // Column chỉ để giữ props
  MockTable.Column = ({ _title, _dataIndex, _render }: any) => null;
  MockTable.Column.displayName = "MockTable.Column";

  return {
    Table: MockTable,
    Space: ({ children }: any) => <div>{children}</div>,
    Tooltip: ({ title, children }: any) => (
      <div>
        <span>{title}</span>
        {children}
      </div>
    ),
    ShowButton: ({ onClick }: any) => (
      <button data-testid="show-button" onClick={onClick}>
        Show
      </button>
    ),
    EditButton: ({ onClick }: any) => (
      <button data-testid="edit-button" onClick={onClick}>
        Edit
      </button>
    ),
    DeleteButton: ({ onClick, onSuccess }: any) => (
      <button
        data-testid="delete-button"
        onClick={() => {
          onClick?.();
          onSuccess?.();
        }}
      >
        Delete
      </button>
    ),
  };
});

// ========================
// Mock useTranslate
// ========================
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

describe("HardwareTable Component", () => {
  const mockColumns = [
    { key: "name", title: "Name" },
    { key: "status", title: "Status" },
  ];

  const mockSelectedColumns = ["name", "status"];

  const mockTableProps = {
    dataSource: [
      { id: 1, name: "Hardware 1", status: "Active" },
      { id: 2, name: "Hardware 2", status: "Inactive" },
    ],
    pagination: { total: 2 },
  };

  const mockOnShow = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDeleteSuccess = jest.fn();

  const renderComponent = (tableProps = mockTableProps) =>
    render(
      <HardwareTable
        columns={mockColumns}
        selectedColumns={mockSelectedColumns}
        tableProps={tableProps}
        onShow={mockOnShow}
        onEdit={mockOnEdit}
        onDeleteSuccess={mockOnDeleteSuccess}
        resourceName="hardware"
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ========================
  // Check render
  // ========================
  describe("Check render", () => {
    it("should render the table with correct columns", () => {
      renderComponent();

      expect(screen.getByTestId("mock-table")).toBeInTheDocument();

      mockColumns.forEach((col) => {
        expect(screen.getByText(col.title)).toBeInTheDocument();
      });
    });

    it("should render the correct number of rows", () => {
      renderComponent();

      const rows = screen.getAllByRole("row");
      // 1 header row + 2 data rows
      expect(rows.length).toBe(3);
    });
  });

  // ========================
  // Basic workflows
  // ========================
  describe("Basic workflows", () => {
    it("should call onShow when Show button is clicked", () => {
      renderComponent();

      const showButtons = screen.getAllByTestId("show-button");
      fireEvent.click(showButtons[0]);

      expect(mockOnShow).toHaveBeenCalledWith(mockTableProps.dataSource[0]);
    });

    it("should call onEdit when Edit button is clicked", () => {
      renderComponent();

      const editButtons = screen.getAllByTestId("edit-button");
      fireEvent.click(editButtons[1]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockTableProps.dataSource[1]);
    });

    it("should call onDeleteSuccess when Delete button is clicked", () => {
      renderComponent();

      const deleteButtons = screen.getAllByTestId("delete-button");
      fireEvent.click(deleteButtons[0]);

      expect(mockOnDeleteSuccess).toHaveBeenCalledTimes(1);
    });

    it("should render pagination when total rows exceed 10", () => {
      const updatedTableProps = {
        ...mockTableProps,
        pagination: { total: 15 },
      };

      renderComponent(updatedTableProps);

      expect(screen.getByTestId("mock-pagination")).toHaveTextContent(
        "Total: 15"
      );
      expect(screen.getByTestId("mock-table")).not.toHaveClass("list-table");
    });

    it("should not render pagination when total rows are 10 or less", () => {
      const updatedTableProps = {
        ...mockTableProps,
        pagination: { total: 10 },
      };

      renderComponent(updatedTableProps);

      expect(screen.getByTestId("mock-table")).toHaveClass("list-table");
      expect(screen.queryByTestId("mock-pagination")).not.toBeInTheDocument();
    });
  });
});
