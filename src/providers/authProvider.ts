import { AuthProvider } from "@pankod/refine-core";
import dataProvider from "providers/dataProvider";
import { UserAPI } from "api/userApi";
import { GET_ME_API } from "api/baseApi";
import { parseJwt } from "untils/assets";
import { DETAIL_DEVICE_ROUTE } from "constants/route";
import { LocalStorageKey } from "enums/LocalStorageKey";

export const TOKEN_KEY = "nhfi49hinsdjfnkaur8u3jshbd";

export const authProvider: AuthProvider = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  login: async ({ username, password, tokenId, profileObj, tokenObj }) => {
    const { post } = dataProvider;
    const url = tokenId ? "api/v1/auth/google" : "api/v1/auth/login";
    const payload = tokenId
      ? {
          token_id: tokenId,
          profile_obj: profileObj,
          client_secret: tokenObj,
        }
      : {
          grant_type: "password",
          client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
          client_secret: process.env.REACT_APP_AUTH_SECRET_KEY,
          username: username,
          password: password,
        };
    const data = await post({
      url: url,
      payload: payload,
    });
    localStorage.setItem(TOKEN_KEY, data.data.access_token);

    if (tokenId) {
      return Promise.resolve("/users");
    }
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    const route = window.location.pathname;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token || route === DETAIL_DEVICE_ROUTE) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  getUserIdentity: async () => {
    const permissionRes = await UserAPI.getAll(GET_ME_API);
    localStorage.setItem(
      "username",
      JSON.stringify(permissionRes.data.username)
    );
    const token = localStorage.getItem(LocalStorageKey.USERNAME);
    if (token) {
      return Promise.resolve(token);
    }
    return Promise.reject();
  },
  getPermissions: function () {
    const scopes = parseJwt(localStorage.getItem(TOKEN_KEY))?.scopes;

    let permissions = {} as any;
    scopes?.forEach((item: any) => {
      permissions[item] = "1";
    });
    if (!permissions["admin"]) {
      permissions["admin"] = "0";
      if (permissions["branchadmin"]) {
        permissions["branchadmin"] = "2";
      }
    }
    permissions = JSON.stringify(permissions);
    return Promise.resolve(JSON.parse(permissions as string));
  },
};
