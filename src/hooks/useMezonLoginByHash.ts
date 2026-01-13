import { LocalStorageKey } from "enums/LocalStorageKey";
import { MezonUserHash, MezonUserProfile } from "interfaces/mezon";
import { TOKEN_KEY } from "providers/authProvider";
import dataProvider from "providers/dataProvider";
import { useEffect, useState, useRef } from "react";
import { MEZON_LOGIN_BY_HASH_API } from "api/baseApi";

export const useMezonLoginByHash = () => {
  const { post } = dataProvider;
  const accessToken = localStorage.getItem(TOKEN_KEY);

  const [loadingMezonByHash, setLoadingMezonByHash] = useState(false);
  const mezonUserProfileRef = useRef<MezonUserProfile | null>(null);

  const handleLogin = async (rawWebAppData: string) => {
    if (loadingMezonByHash || accessToken) return;

    try {
      setLoadingMezonByHash(true);

      // DEBUG 1: Log raw data from Mezon
      console.log("=== MEZON CLIENT DEBUG START ===");
      console.log("1. Raw webAppData from Mezon:", rawWebAppData);
      console.log("1.a. Length:", rawWebAppData.length);

      // DEBUG 2: Show what we're encoding
      const base64Data = btoa(rawWebAppData);
      console.log("2. Base64 encoded data:", base64Data);
      console.log("2.a. Base64 length:", base64Data.length);

      // DEBUG 3: Verify we can decode it back
      const verifyDecode = atob(base64Data);
      console.log("3. Verify decode (should match raw):", verifyDecode);
      console.log("3.a. Match:", verifyDecode === rawWebAppData);

      // DEBUG 4: Parse the raw data to show structure
      const params = rawWebAppData.split("&");
      console.log("4. Parsed parameters:", params);

      const parsedData: Record<string, string> = {};
      params.forEach((param, index) => {
        const [key, value] = param.split("=");
        if (key && value) {
          parsedData[key] = decodeURIComponent(value);
          console.log(`4.${index}. ${key}:`, value);
          if (key === "hash") {
            console.log(`4.${index}.a. HASH VALUE:`, value);
          }
        }
      });
      console.log("5. Full parsed data object:", parsedData);

      const payload = {
        hashData: base64Data,
      };

      console.log("6. Payload being sent to server:", payload);

      const response = await post({
        url: MEZON_LOGIN_BY_HASH_API,
        payload,
      });

      console.log("7. Server response:", response);

      const newAccessToken = response?.data?.access_token;
      if (newAccessToken) {
        console.log("8. Login successful, token received");
        localStorage.setItem(TOKEN_KEY, newAccessToken);

        const url = new URL(window.location.href);
        url.searchParams.delete("data");
        window.history.replaceState({}, document.title, url.toString());

        window.location.reload();
      }
      console.log("=== MEZON CLIENT DEBUG END ===");
    } catch (error) {
      console.error("Mezon login failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
    } finally {
      setLoadingMezonByHash(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authDataFromUrl = urlParams.get("data");

    console.log("Initial check - authDataFromUrl:", authDataFromUrl);

    if (authDataFromUrl) {
      console.log("Found auth data in URL, attempting login...");
      handleLogin(authDataFromUrl);
    }

    if (window.Mezon && window.Mezon.WebView) {
      console.log("Mezon WebView detected, setting up event listeners");

      window.Mezon.WebView.postEvent("PING", { message: "PING" }, () => {});

      const handlePong = () => {
        console.log("PONG received from Mezon");
        localStorage.setItem(LocalStorageKey.IS_IN_MEZON, "true");
      };

      const handleUserHash = (_: any, userHashData: MezonUserHash) => {
        console.log("USER_HASH_INFO event received:", userHashData);
        console.log("web_app_data:", userHashData?.message?.web_app_data);

        if (!authDataFromUrl && userHashData?.message?.web_app_data) {
          console.log("Attempting login with web_app_data from event");
          handleLogin(userHashData.message.web_app_data);
        }
      };

      const handleUserInfo = (_: any, userData: MezonUserProfile) => {
        console.log("CURRENT_USER_INFO event received:", userData);
        if (userData?.user) {
          mezonUserProfileRef.current = userData;
        }
      };

      window.Mezon.WebView.onEvent("PONG", handlePong);

      window.Mezon.WebView.postEvent("SEND_BOT_ID", {
        appId: process.env.REACT_APP_MEZON_APP_ID,
      });
      console.log(
        "Sent SEND_BOT_ID with appId:",
        process.env.REACT_APP_MEZON_APP_ID
      );

      window.Mezon.WebView.onEvent("USER_HASH_INFO", handleUserHash);
      window.Mezon.WebView.onEvent("CURRENT_USER_INFO", handleUserInfo);

      return () => {
        window.Mezon.WebView?.offEvent("PONG", handlePong);
        window.Mezon.WebView?.offEvent("USER_HASH_INFO", handleUserHash);
        window.Mezon.WebView?.offEvent("CURRENT_USER_INFO", handleUserInfo);
      };
    } else {
      console.log("Mezon WebView not detected");
    }
  }, []);

  return { loadingMezonByHash };
};
