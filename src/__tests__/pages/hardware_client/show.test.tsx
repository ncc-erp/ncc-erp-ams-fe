import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@pankod/refine-core", () => ({
  useTranslate: () => (k: string) => k,
}));

jest.mock("@pankod/refine-antd", () => {
  return {
    Typography: {
      Title: ({ children }: any) =>
        React.createElement(
          "div",
          { "data-testid": "typography-title" },
          children
        ),
      Text: ({ children, ...rest }: any) =>
        React.createElement(
          "span",
          { ...rest, "data-testid": "typography-text" },
          children
        ),
    },
    Tag: ({ children }: any) =>
      React.createElement("span", { "data-testid": "tag" }, children),
    Row: ({ children }: any) => React.createElement("div", null, children),
    Col: ({ children }: any) => React.createElement("div", null, children),
    Grid: { useBreakpoint: jest.fn(() => ({ lg: true })) },
  };
});

const getDetailAssetStatusMock = jest.fn();

jest.mock("utils/assets", () => {
  const real = jest.requireActual("utils/assets");
  getDetailAssetStatusMock.mockImplementation(
    (value: any, t: (k: string) => string) =>
      real.getDetailAssetStatus(value, t)
  );
  return {
    getDetailAssetStatus: (...args: any[]) => getDetailAssetStatusMock(...args),
  };
});

import { ClientHardwareShow } from "pages/hardware_client/show";
import { Grid } from "@pankod/refine-antd";

describe("ClientHardwareShow (hardware_client/show) - render", () => {
  const baseDetail = {
    assigned_to: { name: "Alice" },
    name: "Device A",
    serial: "SN-123",
    manufacturer: { name: "Maker Co" },
    category: { name: "Laptops" },
    model: { name: "Model X" },
    purchase_date: { formatted: "2025-01-02" },
    supplier: { name: "Supplier Inc" },
    warranty_months: "12",
    warranty_expires: { date: "2026-01-02" },
    notes: "Some notes",
    rtd_location: { name: "HQ" },
    created_at: { datetime: "2025-01-01T08:00:00Z" },
    updated_at: { datetime: "2025-06-01T08:00:00Z" },
    last_checkout: { formatted: "2025-07-01" },
    checkin_counter: 2,
    checkout_counter: 3,
    requests_counter: 1,
    purchase_cost: "1,000",
    status_label: {
      id: 2,
      name: "Ready to Deploy",
      status_type: "",
      status_meta: "",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders key fields and status tag when detail provided (desktop breakpoint)", () => {
    (Grid.useBreakpoint as jest.Mock).mockReturnValue({ lg: true });

    render(
      <ClientHardwareShow
        setIsModalVisible={() => {}}
        detail={baseDetail as any}
      />
    );

    expect(getDetailAssetStatusMock).toHaveBeenCalledWith(
      baseDetail,
      expect.any(Function)
    );
    expect(screen.getByTestId("tag")).toHaveTextContent(
      "hardware.label.detail.readyToDeploy"
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Device A")).toBeInTheDocument();
    expect(screen.getByText("SN-123")).toBeInTheDocument();
    expect(screen.getByText("Maker Co")).toBeInTheDocument();
    expect(screen.getByText("Laptops")).toBeInTheDocument();
    expect(screen.getByText("Model X")).toBeInTheDocument();
    expect(screen.getByText("2025-01-02")).toBeInTheDocument();
    expect(screen.getByText("Supplier Inc")).toBeInTheDocument();
    expect(screen.getByText(/\b12\b/)).toBeInTheDocument();
    expect(screen.getByText("Some notes")).toBeInTheDocument();
    expect(screen.getByText("HQ")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(
      screen.getByText(String(baseDetail.checkin_counter))
    ).toBeInTheDocument();
    expect(
      screen.getByText(String(baseDetail.checkout_counter))
    ).toBeInTheDocument();
    expect(
      screen.getByText(String(baseDetail.requests_counter))
    ).toBeInTheDocument();
    expect(screen.getByText("2025-07-01")).toBeInTheDocument();
  });

  it("renders without assigned_to and handles mobile breakpoint", () => {
    (Grid.useBreakpoint as jest.Mock).mockReturnValue({ lg: false });

    const detailNoAssign = {
      ...baseDetail,
      assigned_to: undefined,
      name: "Device B",
    };

    render(
      <ClientHardwareShow
        setIsModalVisible={() => {}}
        detail={detailNoAssign as any}
      />
    );

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Device B")).toBeInTheDocument();
    expect(screen.getByText("SN-123")).toBeInTheDocument();
    expect(screen.getByTestId("tag")).toHaveTextContent(
      "hardware.label.detail.readyToDeploy"
    );
  });

  it("renders gracefully when detail is undefined", () => {
    (Grid.useBreakpoint as jest.Mock).mockReturnValue({ lg: true });

    render(
      <ClientHardwareShow setIsModalVisible={() => {}} detail={undefined} />
    );

    expect(screen.queryByTestId("tag")).toHaveTextContent(
      "hardware.label.detail.unknown"
    );
    expect(screen.queryByText("Device A")).not.toBeInTheDocument();
  });
});
