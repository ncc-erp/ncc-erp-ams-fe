import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "components/layout/header";
import {
  useGetIdentity,
  useLogout,
  useNavigation,
  usePermissions,
  useTranslate,
} from "@pankod/refine-core";
import { EPermissions } from "constants/permissions";
import dataProvider from "providers/dataProvider";

// Mock window.matchMedia before any imports
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

// Mock hooks
jest.mock("@pankod/refine-core", () => ({
  useGetIdentity: jest.fn(),
  useLogout: jest.fn(),
  useNavigation: jest.fn(),
  usePermissions: jest.fn(),
  useTranslate: jest.fn(),
}));

// Mock provider
jest.mock("providers/dataProvider", () => ({
  __esModule: true,
  default: {
    custom: jest.fn(),
  },
}));

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoQrCodeSharp: ({ onClick }: any) => (
    <button data-testid="qr-icon" onClick={onClick}>
      QR Icon
    </button>
  ),
}));

// Mock Scanner component
jest.mock("pages/hardware/scanner", () => ({
  Scanner: () => <div data-testid="scanner-component">Scanner Component</div>,
}));

const mockLogout = jest.fn();
const mockPush = jest.fn();
const mockCustom = jest.fn();
const mockTranslate = jest.fn((key: string) => key);

describe("Header component", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Setup default mocks
    (useLogout as jest.Mock).mockReturnValue({ mutate: mockLogout });
    (useNavigation as jest.Mock).mockReturnValue({ push: mockPush });
    (useTranslate as jest.Mock).mockReturnValue(mockTranslate);
    (dataProvider.custom as jest.Mock).mockImplementation(mockCustom);
  });

  it("should render username and avatar if available", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Test User", avatar: "avatar.png" },
    });
    (usePermissions as jest.Mock).mockReturnValue({ data: {} });

    render(<Header />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Test User" })).toHaveAttribute(
      "src",
      "avatar.png"
    );
  });

  it("should call logout and redirect on logout button click", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Test User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({ data: {} });

    render(<Header />);

    fireEvent.click(screen.getByLabelText("logout"));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should render sync button only for admin and trigger syncHrm when clicked", async () => {
    mockCustom.mockResolvedValueOnce({});
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Admin User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({
      data: { admin: EPermissions.ADMIN },
    });

    render(<Header />);

    // Find sync button by aria-label
    const syncBtn = screen.getByLabelText("sync");
    expect(syncBtn).toBeInTheDocument();

    fireEvent.click(syncBtn);

    await waitFor(() => {
      expect(mockCustom).toHaveBeenCalledWith({
        url: expect.any(String),
        method: "get",
      });
    });
  });

  it("should not render sync button for non-admin users", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Regular User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({
      data: { admin: "USER" }, // Not admin
    });

    render(<Header />);

    // Sync button should not be present for non-admin
    expect(screen.queryByLabelText("sync")).not.toBeInTheDocument();
  });

  it("should open modal scanner when QR icon clicked (admin only)", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Admin User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({
      data: { admin: EPermissions.ADMIN },
    });

    render(<Header />);

    fireEvent.click(screen.getByTestId("qr-icon"));

    expect(screen.getByText("Scan QR")).toBeInTheDocument();
    expect(screen.getByTestId("scanner-component")).toBeInTheDocument();
  });

  it("should not render QR icon for non-admin users", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Regular User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({
      data: { admin: "USER" },
    });

    render(<Header />);

    // QR icon should not be present for non-admin
    expect(screen.queryByTestId("qr-icon")).not.toBeInTheDocument();
  });

  it("should handle userIdentity as string correctly", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: '"Test User with quotes"',
    });
    (usePermissions as jest.Mock).mockReturnValue({ data: {} });

    render(<Header />);

    expect(screen.getByText("Test User with quotes")).toBeInTheDocument();
  });

  it("should handle empty userIdentity", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: null,
    });
    (usePermissions as jest.Mock).mockReturnValue({ data: {} });

    render(<Header />);

    expect(screen.getByLabelText("logout")).toBeInTheDocument();
  });

  it("should display modal when QR icon is clicked", () => {
    (useGetIdentity as jest.Mock).mockReturnValue({
      data: { name: "Admin User" },
    });
    (usePermissions as jest.Mock).mockReturnValue({
      data: { admin: EPermissions.ADMIN },
    });

    render(<Header />);

    const qrBtn = screen.getByTestId("qr-icon");
    fireEvent.click(qrBtn);

    expect(screen.getByText("Scan QR")).toBeInTheDocument();
    expect(screen.getByTestId("scanner-component")).toBeInTheDocument();
  });
});
