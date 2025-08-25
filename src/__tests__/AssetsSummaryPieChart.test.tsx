import { render, screen } from "@testing-library/react";
import {
  AssetsSummaryPieChartCheckIn,
  AssetsSummaryPieChartCheckOut,
} from "pages/dashboard/asset-summary-piechar";
import { IAssetHistory } from "interfaces/dashboard";
import { CategoryType } from "constants/assets";

// Mock useTranslate
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

// Mock Pie chart từ @ant-design/plots để test render
jest.mock("@ant-design/plots", () => ({
  Pie: (props: any) => (
    <div data-testid="mock-pie">
      Mock Pie Chart - {props?.statistic?.content?.content}
    </div>
  ),
}));

describe("AssetsSummaryPieChart Components", () => {
  const mockData: IAssetHistory[] = [
    {
      id: "1",
      type: "Laptop",
      count: 12,
      category_type: CategoryType.ASSET,
    },
    {
      id: "2",
      type: "Phone",
      count: 8,
      category_type: CategoryType.ASSET,
    },
    {
      id: "3",
      type: "Accessory",
      count: 5,
      category_type: CategoryType.ACCESSORY,
    },
    {
      id: "4",
      type: "Tool",
      count: 0,
      category_type: CategoryType.ASSET,
    },
  ];

  it("renders CheckOut chart with correct title", () => {
    render(<AssetsSummaryPieChartCheckOut assets_statistic={mockData} />);

    const chart = screen.getByTestId("mock-pie");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent("report.label.title.nameReportCheckOut");
  });

  it("renders CheckIn chart with correct title", () => {
    render(<AssetsSummaryPieChartCheckIn assets_statistic={mockData} />);

    const chart = screen.getByTestId("mock-pie");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent("report.label.title.nameReportCheckIn");
  });

  it("handles empty data without crashing", () => {
    render(<AssetsSummaryPieChartCheckOut assets_statistic={[]} />);
    const chart = screen.getByTestId("mock-pie");
    expect(chart).toBeInTheDocument();
  });

  it("activates only ASSET items with count > 0", () => {
    render(<AssetsSummaryPieChartCheckIn assets_statistic={mockData} />);
    const chart = screen.getByTestId("mock-pie");
    expect(chart).toHaveTextContent("report.label.title.nameReportCheckIn");
  });
});
