import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import ScrollToTopButton from "components/elements/button/ScrollToTopButton";
import { DATA_TEST_ID } from "__tests__/constants/data-test-id";

// Mock the custom hooks
jest.mock("hooks/useDebouncedEventListener");
jest.mock("hooks/useWindowWidth");

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, "scrollTo", {
  value: mockScrollTo,
  writable: true,
});

// Import the mocked hooks
import useDebouncedEventListener from "hooks/useDebouncedEventListener";
import useWindowWidth from "hooks/useWindowWidth";

const mockUseDebouncedEventListener =
  useDebouncedEventListener as jest.MockedFunction<
    typeof useDebouncedEventListener
  >;
const mockUseWindowWidth = useWindowWidth as jest.MockedFunction<
  typeof useWindowWidth
>;

describe("ScrollToTopButton", () => {
  let scrollCallback: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollTo.mockClear();

    // Setup mock for useDebouncedEventListener to capture the callback
    mockUseDebouncedEventListener.mockImplementation(
      (event, callback, delay) => {
        scrollCallback = callback;
      }
    );

    // Default window width (desktop)
    mockUseWindowWidth.mockReturnValue(1200);

    // Reset pageYOffset
    Object.defineProperty(window, "pageYOffset", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders button with correct attributes", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBe("Scroll to top");
  });

  test("button is hidden by default when page offset is less than 250", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
    expect(button.style.display).toBe("none");
  });

  test("button becomes visible when page offset is greater than 250", async () => {
    render(<ScrollToTopButton />);

    // Simulate scroll past threshold
    Object.defineProperty(window, "pageYOffset", {
      value: 300,
      writable: true,
    });

    // Trigger the scroll callback
    act(() => {
      scrollCallback();
    });

    await waitFor(() => {
      const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
      expect(button.style.display).toBe("block");
    });
  });

  test("button becomes hidden when scrolling back to top", async () => {
    render(<ScrollToTopButton />);

    // First scroll down to make button visible
    Object.defineProperty(window, "pageYOffset", {
      value: 300,
      writable: true,
    });
    act(() => {
      scrollCallback();
    });

    await waitFor(() => {
      const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
      expect(button.style.display).toBe("block");
    });

    // Then scroll back to top
    Object.defineProperty(window, "pageYOffset", {
      value: 100,
      writable: true,
    });
    act(() => {
      scrollCallback();
    });

    await waitFor(() => {
      const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
      expect(button.style.display).toBe("none");
    });
  });

  test("clicking button scrolls to top smoothly", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByTestId(DATA_TEST_ID.SCROLL_TO_TOP_BUTTON);
    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
