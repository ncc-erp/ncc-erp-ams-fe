import { AuthProvider } from "@pankod/refine-core";
import dataProvider from "providers/dataProvider";

export const TOKEN_KEY = "nhfi49hinsdjfnkaur8u3jshbd";


export const authProvider: AuthProvider = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  login: async ({ username, password, tokenId, profileObj, tokenObj }) => {
    const { post } = dataProvider;
    const url = tokenId ? "api/v1/auth/google" : "oauth/token";
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

    return post({
      url: url,
      payload: payload,
    }).then((data: any) => {
      localStorage.setItem(TOKEN_KEY, data.data.access_token);
      return;
    }); // todo others
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
  getUserIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: 1,
    });
  },
};
