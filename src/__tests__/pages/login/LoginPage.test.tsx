import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { LoginPage } from "../../../pages/login/login";
import { useLogin } from "@pankod/refine-core";
import dataProvider from "../../../providers/dataProvider";

// Initialize i18n for testing
i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        "pages.login.title": "Sign In",
        "pages.login.username": "Username",
        "pages.login.password": "Password",
        "pages.login.remember": "Remember me",
        "pages.login.signin": "Sign In",
        "pages.login.signinMezon": "Sign in with Mezon",
      },
    },
  },
});

// Mock window.location
delete (window as any).location;
window.location = {
  href: "",
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
} as any;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock the hooks
jest.mock("../../../hooks/useLoginWithMezon", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../hooks/useMezonLoginByHash", () => ({
  useMezonLoginByHash: jest.fn(),
}));

jest.mock("@pankod/refine-core", () => ({
  useLogin: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock("../../../providers/dataProvider", () => ({
  post: jest.fn(),
}));

describe("LoginPage", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Could not parse CSS stylesheet")
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = "";
  });

  const mockEnv = (showManualLogin: string) => {
    const original = process.env;
    process.env = {
      ...original,
      REACT_APP_SHOW_MANUAL_LOGIN: showManualLogin || "true",
    };
    return () => {
      process.env = original;
    };
  };

  const renderLoginPage = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <LoginPage />
        </I18nextProvider>
      </QueryClientProvider>
    );
  };

  describe("Page Render Tests", () => {
    it("should render the login page with all elements", () => {
      const restore = mockEnv("true");
      renderLoginPage();

      const getByAttribute = (attribute: string, value: string) =>
        screen.getByText(
          (_, element) => element?.getAttribute(attribute) === value
        );
      const titleElement = getByAttribute("data-test-id", "title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent("Sign In");

      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("●●●●●●●●")).toBeInTheDocument();

      const signInButton = getByAttribute("data-test-id", "signin-btn");
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveTextContent("Sign In");

      const mezonButton = getByAttribute("data-test-id", "signin-mezon-btn");
      expect(mezonButton).toBeInTheDocument();
      expect(mezonButton).toHaveTextContent("Sign in with Mezon");

      restore();
    });
  });

  describe("Login Flow Tests", () => {
    // it("should validate required fields", async () => {
    //   const restore = mockEnv("true");
    //   renderLoginPage();
    //   const signInButton = screen.getByTestId("signin-btn");
    //   fireEvent.click(signInButton);
    //   await waitFor(() => {
    //     expect(screen.getByText("Username is required")).toBeInTheDocument();
    //     expect(screen.getByText("Password is required")).toBeInTheDocument();
    //   });
    //   restore();
    // });

    it("should handle manual login form submission", async () => {
      const mockLogin = jest.fn();
      (useLogin as jest.Mock).mockReturnValue({
        mutate: mockLogin,
        isLoading: false,
      });

      const restore = mockEnv("true");
      renderLoginPage();

      const getByAttribute = (attribute: string, value: string) =>
        screen.getByText(
          (_, element) => element?.getAttribute(attribute) === value
        );

      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("●●●●●●●●"), {
        target: { value: "password123" },
      });

      const signInButton = getByAttribute("data-test-id", "signin-btn");
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
          remember: false,
        });
      });

      restore();
    });

    // it("should handle Mezon login flow", async () => {
    //   const mockPost = jest.fn().mockResolvedValue({
    //     data: { url: "https://mezon.auth/url" },
    //   });
    //   (dataProvider.post as jest.Mock) = mockPost;

    //   renderLoginPage();
    //   const mezonButton = screen.getByTestId("signin-mezon-btn");
    //   fireEvent.click(mezonButton);

    //   await waitFor(() => {
    //     expect(mockPost).toHaveBeenCalled();
    //     expect(window.location.href).toBe("https://mezon.auth/url");
    //   });
    // });

    it("should show loading state during Mezon login", async () => {
      const mockPost = jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: { url: "test" } }), 100)
            )
        );
      (dataProvider.post as jest.Mock) = mockPost;

      renderLoginPage();

      const getByAttribute = (attribute: string, value: string) =>
        screen.getByText(
          (_, element) => element?.getAttribute(attribute) === value
        );

      const mezonButton = getByAttribute("data-test-id", "signin-mezon-btn");
      fireEvent.click(mezonButton);

      expect(mezonButton).toHaveClass("ant-btn-loading");

      await waitFor(() => {
        expect(mezonButton).not.toHaveClass("ant-btn-loading");
      });
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper form labels and accessibility attributes", () => {
      const restore = mockEnv("true");
      renderLoginPage();
      const usernameInput = screen.getByLabelText("Username");
      const passwordInput = screen.getByLabelText("Password");
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      restore();
    });
  });
});
