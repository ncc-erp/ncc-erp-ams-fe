import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { MEZON_LOGIN_BY_HASH_API } from "api/baseApi";
import { LocalStorageKey } from "enums/LocalStorageKey";
import { useMezonLoginByHash } from "hooks/useMezonLoginByHash";
import dataProvider from "providers/dataProvider";
import { TOKEN_KEY } from "providers/authProvider";

jest.mock("providers/dataProvider", () => ({
  post: jest.fn(),
}));

window.Mezon = {
  WebView: {
    postEvent: jest.fn(),
    onEvent: jest.fn(),
    offEvent: jest.fn(),
    receiveEvent: jest.fn(),
  },
};

describe("useMezonLoginByHash", () => {
  let eventHandlers: Map<string, (...args: any[]) => void>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    eventHandlers = new Map();

    jest.spyOn(window.history, "replaceState").mockImplementation(() => {});
    window.history.pushState(
      {},
      "",
      "/?data=user_id=123&auth_date=1234567890&hash=abc123"
    );

    (window.Mezon.WebView.onEvent as jest.Mock).mockImplementation(
      (eventName: string, handler: (...args: any[]) => void) => {
        eventHandlers.set(eventName, handler);
      }
    );

    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("URL-based Authentication", () => {
    it("should login successfully when URL has data param", async () => {
      const mockToken = "fake-access-token-123";
      const mockRawData = "user_id=123&auth_date=1234567890&hash=abc123";
      const encoded = encodeURIComponent(mockRawData);

      window.history.pushState({}, "", `/?data=${encoded}`);

      (dataProvider.post as jest.Mock).mockResolvedValue({
        data: { access_token: mockToken },
      });

      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

      const { result } = renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalledWith({
          url: MEZON_LOGIN_BY_HASH_API,
          payload: {
            hashData: btoa(mockRawData),
          },
        });
      });

      expect(setItemSpy).toHaveBeenCalledWith(TOKEN_KEY, mockToken);

      expect(window.history.replaceState).toHaveBeenCalled();

      await waitFor(() => {
        expect(result.current.loadingMezonByHash).toBe(false);
      });
    });

    it("should NOT login if access token already exists", async () => {
      const mockRawData = "user_id=123";

      localStorage.setItem(TOKEN_KEY, "existing-token");
      window.history.pushState({}, "", `/?data=${mockRawData}`);

      renderHook(() => useMezonLoginByHash());

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).not.toHaveBeenCalled();
    });

    it("should handle API error gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      (dataProvider.post as jest.Mock).mockRejectedValue(
        new Error("Network Error")
      );

      const { result } = renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalled();
      });

      expect(consoleSpy).toHaveBeenCalled();

      await waitFor(() => {
        expect(result.current.loadingMezonByHash).toBe(false);
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(window.history.replaceState).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should NOT reload if API returns no token", async () => {
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      (dataProvider.post as jest.Mock).mockResolvedValue({
        data: {},
      });

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalled();
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    it("should handle URL-encoded data correctly", async () => {
      const mockToken = "test-token";
      const rawData = "user_id=123&username=test@user";
      const encodedData = encodeURIComponent(rawData);

      window.history.pushState({}, "", `/?data=${encodedData}`);

      (dataProvider.post as jest.Mock).mockResolvedValue({
        data: { access_token: mockToken },
      });

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalledWith({
          url: MEZON_LOGIN_BY_HASH_API,
          payload: {
            hashData: btoa(decodeURIComponent(encodedData)),
          },
        });
      });
    });
  });

  describe("Mezon WebView Integration", () => {
    it("should send PING event on mount", () => {
      renderHook(() => useMezonLoginByHash());

      expect(window.Mezon.WebView.postEvent).toHaveBeenCalledWith(
        "PING",
        { message: "PING" },
        expect.any(Function)
      );
    });

    it("should set IS_IN_MEZON flag when PONG received", async () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("PONG")).toBe(true);
      });

      const pongHandler = eventHandlers.get("PONG");
      pongHandler?.();

      expect(setItemSpy).toHaveBeenCalledWith(
        LocalStorageKey.IS_IN_MEZON,
        "true"
      );
    });

    it("should send SEND_BOT_ID event with app ID", () => {
      process.env.REACT_APP_MEZON_APP_ID = "test-mezon-app-id";

      renderHook(() => useMezonLoginByHash());

      expect(window.Mezon.WebView.postEvent).toHaveBeenCalledWith(
        "SEND_BOT_ID",
        { appId: "test-mezon-app-id" }
      );
    });

    it("should login when USER_HASH_INFO event received", async () => {
      const mockToken = "mezon-token-456";
      const mockWebAppData = "user_id=456&auth_date=9876543210&hash=xyz";

      (dataProvider.post as jest.Mock).mockResolvedValue({
        data: { access_token: mockToken },
      });

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("USER_HASH_INFO")).toBe(true);
      });

      const userHashHandler = eventHandlers.get("USER_HASH_INFO");
      userHashHandler?.(null, {
        message: { web_app_data: mockWebAppData },
      });

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalledWith({
          url: MEZON_LOGIN_BY_HASH_API,
          payload: {
            hashData: btoa(mockWebAppData),
          },
        });
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBe(mockToken);
    });

    it("should NOT login via USER_HASH_INFO if URL data exists", async () => {
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      (dataProvider.post as jest.Mock).mockResolvedValue({
        data: { access_token: "url-token" },
      });

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalledTimes(1);
      });

      (dataProvider.post as jest.Mock).mockClear();

      await waitFor(() => {
        expect(eventHandlers.has("USER_HASH_INFO")).toBe(true);
      });

      const userHashHandler = eventHandlers.get("USER_HASH_INFO");
      userHashHandler?.(null, {
        message: { web_app_data: "user_id=789" },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).not.toHaveBeenCalled();
    });

    it("should NOT login via USER_HASH_INFO if token exists", async () => {
      localStorage.setItem(TOKEN_KEY, "existing-token");

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("USER_HASH_INFO")).toBe(true);
      });

      const userHashHandler = eventHandlers.get("USER_HASH_INFO");
      userHashHandler?.(null, {
        message: { web_app_data: "user_id=789" },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).not.toHaveBeenCalled();
    });

    it("should store user profile from CURRENT_USER_INFO event", async () => {
      const mockUserData = {
        user: {
          id: "123",
          username: "testuser",
          display_name: "Test User",
        },
      };

      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("CURRENT_USER_INFO")).toBe(true);
      });

      const userInfoHandler = eventHandlers.get("CURRENT_USER_INFO");
      userInfoHandler?.(null, mockUserData);

      expect(window.Mezon.WebView.onEvent).toHaveBeenCalledWith(
        "CURRENT_USER_INFO",
        expect.any(Function)
      );
    });

    it("should cleanup event listeners on unmount", () => {
      const { unmount } = renderHook(() => useMezonLoginByHash());

      expect(window.Mezon.WebView.onEvent).toHaveBeenCalledWith(
        "PONG",
        expect.any(Function)
      );
      expect(window.Mezon.WebView.onEvent).toHaveBeenCalledWith(
        "USER_HASH_INFO",
        expect.any(Function)
      );
      expect(window.Mezon.WebView.onEvent).toHaveBeenCalledWith(
        "CURRENT_USER_INFO",
        expect.any(Function)
      );

      unmount();

      expect(window.Mezon.WebView.offEvent).toHaveBeenCalledWith(
        "PONG",
        expect.any(Function)
      );
      expect(window.Mezon.WebView.offEvent).toHaveBeenCalledWith(
        "USER_HASH_INFO",
        expect.any(Function)
      );
      expect(window.Mezon.WebView.offEvent).toHaveBeenCalledWith(
        "CURRENT_USER_INFO",
        expect.any(Function)
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing Mezon WebView gracefully", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const originalMezon = window.Mezon;
      delete (window as any).Mezon;

      renderHook(() => useMezonLoginByHash());

      expect(consoleSpy).toHaveBeenCalledWith("Mezon WebView not detected");

      window.Mezon = originalMezon;
      consoleSpy.mockRestore();
    });

    it("should handle empty web_app_data in USER_HASH_INFO", async () => {
      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("USER_HASH_INFO")).toBe(true);
      });

      const userHashHandler = eventHandlers.get("USER_HASH_INFO");
      userHashHandler?.(null, {
        message: { web_app_data: "" },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).not.toHaveBeenCalled();
    });

    it("should handle malformed USER_HASH_INFO event data", async () => {
      renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(eventHandlers.has("USER_HASH_INFO")).toBe(true);
      });

      const userHashHandler = eventHandlers.get("USER_HASH_INFO");

      userHashHandler?.(null, null);
      userHashHandler?.(null, {});
      userHashHandler?.(null, { message: {} });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).not.toHaveBeenCalled();
    });

    it("should handle concurrent login attempts", async () => {
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      (dataProvider.post as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: { access_token: "token" } }), 200)
          )
      );

      renderHook(() => useMezonLoginByHash());

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(dataProvider.post).toHaveBeenCalledTimes(1);

      await waitFor(
        () => {
          expect(window.history.replaceState).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });
  });

  describe("Loading State", () => {
    it("should set loading to true during API call", async () => {
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      let resolvePost: (value: any) => void;
      const postPromise = new Promise((resolve) => {
        resolvePost = resolve;
      });

      (dataProvider.post as jest.Mock).mockReturnValue(postPromise);

      const { result } = renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(result.current.loadingMezonByHash).toBe(true);
      });

      resolvePost!({ data: { access_token: "token" } });

      await waitFor(() => {
        expect(result.current.loadingMezonByHash).toBe(false);
      });
    });

    it("should reset loading state on error", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockRawData = "user_id=123";

      window.history.pushState({}, "", `/?data=${mockRawData}`);

      (dataProvider.post as jest.Mock).mockRejectedValue(
        new Error("API Error")
      );

      const { result } = renderHook(() => useMezonLoginByHash());

      await waitFor(() => {
        expect(dataProvider.post).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.loadingMezonByHash).toBe(false);
      });

      consoleSpy.mockRestore();
    });
  });
});
