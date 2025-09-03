import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchFilterForm } from "../../../pages/hardware/search-filter-form";
import { Form } from "@pankod/refine-antd";
import * as ReactRouterDom from "react-router-dom";
import moment from "moment";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Cannot read properties of null (reading 'removeEventListener')"
      )
    ) {
      return;
    }
    originalError(...args);
  };
});

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    DatePicker: {
      ...antd.DatePicker,
      RangePicker: ({ onChange }: any) => (
        <div>
          <input
            data-testid="mock-rangepicker"
            id="purchase_date"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const m = moment(value, "YYYY-MM-DD");
                onChange([m, m], [value, value]);
              }
            }}
          />
          {/* ✅ thêm nút clear riêng */}
          <button
            data-testid="mock-rangepicker-clear"
            onClick={() => onChange(null, null)}
          >
            Clear
          </button>
        </div>
      ),
    },
  };
});

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

// Mock useTranslate
jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (key: string) => key,
}));

// Mock useSelect
jest.mock("@pankod/refine-antd", () => ({
  ...jest.requireActual("@pankod/refine-antd"),
  useSelect: jest.fn(() => ({
    selectProps: {
      options: [
        { value: 1, label: "Location 1" },
        { value: 2, label: "Location 2" },
      ],
    },
  })),
}));

describe("SearchFilterForm Component", () => {
  const mockSetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => (key in store ? store[key] : null),
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => delete store[key],
        clear: () => (store = {}),
      };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock useSearchParams
    jest
      .spyOn(ReactRouterDom, "useSearchParams")
      .mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  const TestWrapper = () => {
    const [form] = Form.useForm();
    return <SearchFilterForm searchFormProps={{ form }} />;
  };

  const renderComponent = () => render(<TestWrapper />);

  describe("Check render", () => {
    it("should render all form fields", () => {
      renderComponent();
      expect(
        screen.getByLabelText("hardware.label.title.time")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("hardware.label.title.location")
      ).toBeInTheDocument();
    });

    it("should render the Select with correct options", () => {
      renderComponent();
      const selectInput = screen.getByRole("combobox", { hidden: true });
      fireEvent.mouseDown(selectInput);
      expect(screen.getByText("Location 1")).toBeInTheDocument();
      expect(screen.getByText("Location 2")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("should call setSearchParams when Select value changes", async () => {
      renderComponent();
      const selectInput = screen.getByRole("combobox", { hidden: true });
      fireEvent.mouseDown(selectInput);
      fireEvent.click(screen.getByText("Location 1"));
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });

    it("should clear search params when Select is set to 'all'", async () => {
      renderComponent();
      const selectInput = screen.getByRole("combobox", { hidden: true });
      fireEvent.mouseDown(selectInput);
      fireEvent.click(screen.getByText("all"));
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });

    it("should call setSearchParams when RangePicker value changes", async () => {
      renderComponent();
      const rangeInput = screen.getByTestId("mock-rangepicker");
      fireEvent.change(rangeInput, { target: { value: "2023-01-01" } });
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });

    it("should clear search params when RangePicker value is cleared", async () => {
      renderComponent();
      const clearBtn = screen.getByTestId("mock-rangepicker-clear");
      fireEvent.click(clearBtn);
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });
  });
});
