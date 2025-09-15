import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { Scanner } from "pages/hardware/scanner";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// --- Mock useTranslate để trả về chính key ---
jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: () => (key: string) => key,
}));

// --- Mock PopupDetailDevice ---
jest.mock("pages/hardware/popupDetailDevice", () => ({
  __esModule: true,
  default: ({ id, onClose }: { id: string; onClose: () => void }) => (
    <div data-testid="popup-detail-device">
      <p>Device ID: {id}</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// --- Mock MModal ---
jest.mock("components/Modal/MModal", () => ({
  MModal: ({ isModalVisible, title, children }: any) =>
    isModalVisible ? <div data-testid="modal">{title || children}</div> : null,
}));

// --- Mock ZXing library ---
const mockDecodeFromVideoDevice = jest.fn();
const mockReset = jest.fn();

jest.mock("@zxing/library", () => ({
  BrowserMultiFormatReader: jest.fn(() => ({
    decodeFromVideoDevice: mockDecodeFromVideoDevice,
    reset: mockReset,
  })),
  BarcodeFormat: { QR_CODE: "QR_CODE" },
}));

describe("Scanner Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe("Check render", () => {
    it("should render the scan button", () => {
      render(<Scanner />);
      expect(screen.getByText("Scan")).toBeInTheDocument();
    });

    it("should render video element when scanning starts", () => {
      const { container } = render(<Scanner />);
      // Sync fireEvent, không cần await
      act(() => {
        fireEvent.click(screen.getByText("Scan"));
      });
      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();
    });

    it("should render modal when QR code is invalid (not QR_CODE)", async () => {
      mockDecodeFromVideoDevice.mockImplementation((_, __, callback) => {
        // Callback async, wrap trong act async
        Promise.resolve().then(() =>
          act(() =>
            callback({
              getBarcodeFormat: () => "CODE128",
              getText: () => "invalid",
            })
          )
        );
      });

      render(<Scanner />);
      act(() => {
        fireEvent.click(screen.getByText("Scan")); // Sync fireEvent
      });

      const modal = await screen.findByTestId("modal");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveTextContent(/invalid qr code/i);
    });

    it("should render device details when QR code is valid", async () => {
      mockDecodeFromVideoDevice.mockImplementation((_, __, callback) => {
        Promise.resolve().then(() =>
          act(() =>
            callback({
              getBarcodeFormat: () => "QR_CODE",
              getText: () => "https://example.com/detail-device?id=123",
            })
          )
        );
      });

      render(<Scanner />);
      act(() => {
        fireEvent.click(screen.getByText("Scan")); // Sync fireEvent
      });

      const popup = await screen.findByTestId("popup-detail-device");
      expect(popup).toBeInTheDocument();
      expect(popup).toHaveTextContent("Device ID: 123");
    });
  });

  describe("Basic workflows", () => {
    it("should start scanning when the scan button is clicked", () => {
      render(<Scanner />);
      act(() => {
        fireEvent.click(screen.getByText("Scan")); // Sync fireEvent
      });
      expect(mockDecodeFromVideoDevice).toHaveBeenCalled();
    });

    it("should stop scanning when the component is unmounted", () => {
      const { unmount } = render(<Scanner />);
      act(() => {
        fireEvent.click(screen.getByText("Scan")); // Sync fireEvent
      });
      unmount();
      expect(mockReset).toHaveBeenCalled();
    });

    it("should close device details modal when close button is clicked", async () => {
      mockDecodeFromVideoDevice.mockImplementation((_, __, callback) => {
        Promise.resolve().then(() =>
          act(() =>
            callback({
              getBarcodeFormat: () => "QR_CODE",
              getText: () => "https://example.com/detail-device?id=123",
            })
          )
        );
      });

      render(<Scanner />);
      act(() => {
        fireEvent.click(screen.getByText("Scan")); // Sync fireEvent
      });

      const popup = await screen.findByTestId("popup-detail-device");
      expect(popup).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByText("Close")); // Sync fireEvent
      });

      expect(
        screen.queryByTestId("popup-detail-device")
      ).not.toBeInTheDocument();
    });
  });
});
