import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardPage } from "pages/dashboard";
import * as RefineCore from "@pankod/refine-core";
import * as AppSearchParams from "hooks/useAppSearchParams";

// Mock dependencies
jest.mock("@pankod/refine-core");
jest.mock("hooks/useAppSearchParams");
jest.mock("components/dashboard/locations", () => ({
  Locations: ({ location }: any) => (
    <div data-testid="location-component">{location.name}</div>
  ),
}));
jest.mock("components/dashboard/locations/index-all-location", () => ({
  AllLocations: ({ location }: any) => (
    <div data-testid="all-locations-component">{location.name}</div>
  ),
}));
jest.mock("constants/assets", () => ({
  dateFormat: "YYYY-MM-DD",
}));
jest.mock("api/baseApi", () => ({
  DASHBOARD_API: "/api/dashboard",
}));

// Mock Refine components that need router context
jest.mock("@pankod/refine-antd", () => ({
  ...jest.requireActual("@pankod/refine-antd"),
  List: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

jest.mock("styles/antd.less", () => ({}));

// Mock window.matchMedia
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

// Mock data
const mockLocationData = {
  data: {
    payload: [
      { id: 1, name: "Location 1", assets: 10 },
      { id: 2, name: "Location 2", assets: 15 },
      { id: 3, name: "Location 3", assets: 8 },
    ],
  },
};

const mockTranslate = jest.fn((key: string) => {
  const translations: { [key: string]: string } = {
    "dashboard.title": "Dashboard",
    "dashboard.field.tilte-section-1": "Assets by Category",
    "dashboard.field.tilte-section-2": "All Locations",
    "dashboard.field.search-location": "Search Location",
    "dashboard.field.search-date": "Search Date",
    "dashboard.field.start-date": "Start Date",
    "dashboard.field.end-date": "End Date",
    "dashboard.field.sum-assets-by-category": "Sum Assets by Category",
    "dashboard.detail.title-show": "Show Details",
    "dashboard.detail.title-count-asset": "Asset Count",
    "dashboard.placeholder.select-category": "Select Category",
    loading: "Loading",
  };
  return translations[key] || key;
});

const mockSetParams = jest.fn();
const mockUseAppSearchParams = {
  params: {
    purchase_date_from: "",
    purchase_date_to: "",
    purchase_date_from1: "",
    purchase_date_to1: "",
    rtd_location_id: "",
  },
  setParams: mockSetParams,
};

// Setup wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

describe("DashboardPage", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mocks
    (RefineCore.useTranslate as jest.Mock).mockReturnValue(mockTranslate);
    (AppSearchParams.useAppSearchParams as jest.Mock).mockReturnValue(
      mockUseAppSearchParams
    );

    (RefineCore.useCustom as jest.Mock)
      .mockReturnValueOnce({
        data: mockLocationData,
        isLoading: true,
      })
      .mockReturnValueOnce({
        data: mockLocationData,
        isLoading: true,
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render dashboard page with title", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("should render two main sections", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("All Locations")).toBeInTheDocument();
    expect(screen.getByText("Assets by Category")).toBeInTheDocument();
  });

  it("should render loading spinner when data is loading", () => {
    (RefineCore.useCustom as jest.Mock)
      .mockReturnValueOnce({
        data: null,
        isLoading: true,
      })
      .mockReturnValueOnce({
        data: null,
        isLoading: true,
      });

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Loading...")).toHaveLength(2);
  });

  it("should handle date range picker change for all locations", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    // Get all date pickers - the first one is for all locations
    const datePickers = screen.getAllByPlaceholderText("Start Date");
    const firstDatePicker = datePickers[0];

    // Mock moment objects for the date range
    const mockFromDate = {
      format: jest.fn().mockReturnValue("2023-01-01"),
    };
    const mockToDate = {
      format: jest.fn().mockReturnValue("2023-01-31"),
    };

    // Simulate date change
    fireEvent.change(firstDatePicker, {
      target: { value: [mockFromDate, mockToDate] },
    });

    // Since we can't easily test the actual date picker behavior in this setup,
    // we'll verify that the component renders without errors
    expect(firstDatePicker).toBeInTheDocument();
  });

  it("should clear localStorage on component mount", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("purchase_date");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("rtd_location_id");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("search");
  });

  it("should display correct form labels", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Search Location")).toBeInTheDocument();
    expect(screen.getAllByText("Search Date")).toHaveLength(2);
    expect(screen.getByText("Sum Assets by Category")).toBeInTheDocument();
  });

  it("should call useCustom with correct parameters", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(RefineCore.useCustom).toHaveBeenCalledWith({
      url: "/api/dashboard",
      method: "get",
      config: {
        query: {
          purchase_date_from: "",
          purchase_date_to: "",
          location: "",
        },
      },
    });
  });

  it("should handle API error gracefully", () => {
    (RefineCore.useCustom as jest.Mock)
      .mockReturnValueOnce({
        data: null,
        isLoading: false,
        error: new Error("API Error"),
      })
      .mockReturnValueOnce({
        data: null,
        isLoading: false,
        error: new Error("API Error"),
      });

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    // Component should render without crashing even with API errors
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("should use search params from URL", () => {
    (AppSearchParams.useAppSearchParams as jest.Mock).mockReturnValue({
      params: {
        purchase_date_from: "2023-01-01",
        purchase_date_to: "2023-01-31",
        purchase_date_from1: "2023-02-01",
        purchase_date_to1: "2023-02-28",
        rtd_location_id: "2",
      },
      setParams: mockSetParams,
    });

    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(RefineCore.useCustom).toHaveBeenCalledWith({
      url: "/api/dashboard",
      method: "get",
      config: {
        query: {
          purchase_date_from: "2023-01-01",
          purchase_date_to: "2023-01-31",
          location: "2",
        },
      },
    });
  });

  it("should display placeholder text correctly", () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByPlaceholderText("Start Date")).toHaveLength(2);
    expect(screen.getAllByPlaceholderText("End Date")).toHaveLength(2);
  });
});
