import axios from "axios";
import { HttpError } from "@pankod/refine-core";
import { authProvider } from "providers/authProvider";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const token = authProvider.getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentToken = authProvider.getToken();
      if (currentToken) {
        localStorage.removeItem("unauthorized");
        localStorage.setItem("unauthorized", "true");
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    }
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);
