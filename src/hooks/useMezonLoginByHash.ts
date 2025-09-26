import { LocalStorageKey } from "enums/LocalStorageKey";
import {
  LoginMezonByHashParams,
  MezonUserHash,
  MezonUserHashInfo,
  MezonUserProfile,
} from "interfaces/mezon";
import { TOKEN_KEY } from "providers/authProvider";
import dataProvider from "providers/dataProvider";
import { useEffect, useState } from "react";
import { MEZON_LOGIN_BY_HASH_API } from "api/baseApi";

export const useMezonLoginByHash = () => {
  const { post } = dataProvider;
  const accessToken: string | null = localStorage.getItem(TOKEN_KEY);

  const [mezonUserProfile, setMezonUserProfile] =
    useState<MezonUserProfile | null>(null);
  const [userHashInfo, setUserHashInfo] = useState<MezonUserHashInfo>({
    web_app_data: "",
  });

  const [loginMezonFailed, setLoginMezonFailed] = useState(false);
  const [loadingMezonByHash, setLoadingMezonByHash] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    Promise.resolve("/users");
  }, [accessToken]);

  useEffect(() => {
    if (window.Mezon && window.Mezon.WebView) {
      window.Mezon.WebView.postEvent("PING", { message: "PING" }, () => {});

      const handlePong = () => {
        localStorage.setItem(LocalStorageKey.IS_IN_MEZON, "true");
      };
      const handleUserHash = async (_: any, userHashData: MezonUserHash) => {
        setUserHashInfo(userHashData.message);
      };
      const handleUserInfo = async (_: any, userData: MezonUserProfile) => {
        if (userData?.user) {
          setMezonUserProfile((prev) => ({
            ...prev,
            ...userData,
          }));
        }
      };

      window.Mezon.WebView.onEvent("PONG", handlePong);
      window.Mezon.WebView.postEvent("SEND_BOT_ID", {
        appId: process.env.MEZON_APP_ID,
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

  useEffect(() => {
    if (!userHashInfo?.web_app_data || !mezonUserProfile?.user) {
      return;
    }

    const loginMezonByHash = async () => {
      try {
        setLoadingMezonByHash(true);
        const [dataCheck, hashKey] = userHashInfo.web_app_data.split("&hash=");

        const path = MEZON_LOGIN_BY_HASH_API;
        const payload: LoginMezonByHashParams = {
          dataCheck,
          hashKey,
          userEmail: mezonUserProfile.email || "",
          userName: mezonUserProfile.user.username || "",
        };

        const data = await post({
          url: path,
          payload,
        });

        const accessTokenTemp = data?.data?.access_token;
        if (accessTokenTemp) {
          localStorage.setItem(TOKEN_KEY, accessTokenTemp);
          Promise.resolve("/users");
          window.location.reload();
        }
      } catch {
        setLoginMezonFailed(true);
      } finally {
        setLoadingMezonByHash(false);
      }
    };

    loginMezonByHash();
  }, [userHashInfo, mezonUserProfile]);

  return { loginMezonFailed, loadingMezonByHash };
};
