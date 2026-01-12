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

      const base64Data = btoa(rawWebAppData);

      const payload = {
        hashData: base64Data,
      };

      const response = await post({
        url: MEZON_LOGIN_BY_HASH_API,
        payload,
      });

      const newAccessToken = response?.data?.access_token;
      if (newAccessToken) {
        localStorage.setItem(TOKEN_KEY, newAccessToken);

        const url = new URL(window.location.href);
        url.searchParams.delete("data");
        window.history.replaceState({}, document.title, url.toString());

        window.location.reload();
      }
    } catch (error) {
      console.error("Mezon login failed:", error);
    } finally {
      setLoadingMezonByHash(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authDataFromUrl = urlParams.get("data");

    if (authDataFromUrl) {
      const decodedData = decodeURIComponent(authDataFromUrl);
      handleLogin(decodedData);
    }

    if (window.Mezon && window.Mezon.WebView) {
      window.Mezon.WebView.postEvent("PING", { message: "PING" }, () => {});

      const handlePong = () => {
        localStorage.setItem(LocalStorageKey.IS_IN_MEZON, "true");
      };

      const handleUserHash = (_: any, userHashData: MezonUserHash) => {
        if (!authDataFromUrl && userHashData?.message?.web_app_data) {
          handleLogin(userHashData.message.web_app_data);
        }
      };

      const handleUserInfo = (_: any, userData: MezonUserProfile) => {
        if (userData?.user) {
          mezonUserProfileRef.current = userData;
        }
      };

      window.Mezon.WebView.onEvent("PONG", handlePong);

      window.Mezon.WebView.postEvent("SEND_BOT_ID", {
        appId: process.env.REACT_APP_MEZON_APP_ID,
      });

      window.Mezon.WebView.onEvent("USER_HASH_INFO", handleUserHash);
      window.Mezon.WebView.onEvent("CURRENT_USER_INFO", handleUserInfo);

      return () => {
        window.Mezon.WebView?.offEvent("PONG", handlePong);
        window.Mezon.WebView?.offEvent("USER_HASH_INFO", handleUserHash);
        window.Mezon.WebView?.offEvent("CURRENT_USER_INFO", handleUserInfo);
      };
    }
  }, []);

  return { loadingMezonByHash };
};
