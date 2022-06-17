import { axiosInstance } from "providers/axios";

export const UserAPI = {
  getAll: function (url: string) {
    return axiosInstance.request({
      method: "GET",
      url: url,
    });
  },
};
