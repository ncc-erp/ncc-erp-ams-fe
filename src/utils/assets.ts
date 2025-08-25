import { ASSIGNED_STATUS } from "constants/assets";
import { IHardwareResponse } from "interfaces/hardware";
import { t } from "../i18n";

export const getAssetAssignedStatusDecription = (value: number) =>
  value === ASSIGNED_STATUS.DEFAULT
    ? t("hardware.label.detail.default")
    : value === ASSIGNED_STATUS.PENDING_ACCEPT
      ? t("hardware.label.detail.pendingAccept")
      : value === ASSIGNED_STATUS.ACCEPT
        ? t("hardware.label.detail.accept")
        : value === ASSIGNED_STATUS.REFUSE
          ? t("hardware.label.detail.refuse")
          : value === ASSIGNED_STATUS.WAITING_CHECKOUT
            ? t("hardware.label.detail.waitingAcceptCheckout")
            : value === ASSIGNED_STATUS.WAITING_CHECKIN
              ? t("hardware.label.detail.waitingAcceptCheckin")
              : "";

export const getBGAssetAssignedStatusDecription = (value: number) =>
  value === ASSIGNED_STATUS.DEFAULT
    ? "gray"
    : value === ASSIGNED_STATUS.PENDING_ACCEPT
      ? "#00a65a"
      : value === ASSIGNED_STATUS.ACCEPT
        ? "#0073b7"
        : value === ASSIGNED_STATUS.REFUSE
          ? "red"
          : value === ASSIGNED_STATUS.WAITING_CHECKOUT
            ? "#f39c12"
            : value === ASSIGNED_STATUS.WAITING_CHECKIN
              ? "#f39c12"
              : "gray";

export const getAssetStatusDecription = (value: IHardwareResponse) =>
  value.name === t("hardware.label.field.assign")
    ? t("hardware.label.detail.assign")
    : value.name === t("hardware.label.field.readyToDeploy")
      ? t("hardware.label.detail.readyToDeploy")
      : value.name === t("hardware.label.field.broken")
        ? t("hardware.label.detail.broken")
        : value.name === t("hardware.label.field.pending")
          ? t("hardware.label.detail.pending")
          : "";

export const getBGAssetStatusDecription = (value: IHardwareResponse) =>
  value.name === t("hardware.label.field.assign")
    ? "#0073b7"
    : value.name === t("hardware.label.field.readyToDeploy")
      ? "#00a65a"
      : value.name === t("hardware.label.field.broken")
        ? "red"
        : value.name === t("hardware.label.field.pending")
          ? "#f39c12"
          : "";

export const getDetailAssetStatus = (value: IHardwareResponse | undefined) =>
  value?.status_label?.name === t("hardware.label.field.assign")
    ? t("hardware.label.detail.assign")
    : value?.status_label?.name === t("hardware.label.field.readyToDeploy")
      ? t("hardware.label.detail.readyToDeploy")
      : value?.status_label?.name === t("hardware.label.field.broken")
        ? t("hardware.label.detail.broken")
        : value?.status_label?.name === t("hardware.label.field.pending")
          ? t("hardware.label.detail.pending")
          : "";

export const getDetailAssetStatusByName = (value: string) => {
  const statusMap: { [key: string]: string } = {
    [t("hardware.label.field.assign")]: t("hardware.label.detail.assign"),
    [t("hardware.label.field.readyToDeploy")]: t(
      "hardware.label.detail.readyToDeploy"
    ),
    [t("hardware.label.field.broken")]: t("hardware.label.detail.broken"),
    [t("hardware.label.field.pending")]: t("hardware.label.detail.pending"),
  };

  return statusMap[value] || "";
};

export const filterAssignedStatus = [
  {
    text: t("hardware.label.detail.default"),
    value: ASSIGNED_STATUS.DEFAULT,
  },
  {
    text: t("hardware.label.detail.waitingAcceptCheckout"),
    value: ASSIGNED_STATUS.WAITING_CHECKOUT,
  },
  {
    text: t("hardware.label.detail.waitingAcceptCheckin"),
    value: ASSIGNED_STATUS.WAITING_CHECKIN,
  },
  {
    text: t("hardware.label.detail.accept"),
    value: ASSIGNED_STATUS.ACCEPT,
  },
  {
    text: t("hardware.label.detail.refuse"),
    value: ASSIGNED_STATUS.REFUSE,
  },
];

export function parseJwt(token: string | null): any {
  if (!token) return;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
