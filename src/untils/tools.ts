import { ASSIGNED_STATUS } from "constants/assets";
import { IToolResponse } from "interfaces/tool";
import { t } from "../i18n";

export const getToolAssignedStatusDecription = (value: number) =>
  value === ASSIGNED_STATUS.DEFAULT
    ? t("tools.label.detail.default")
    : value === ASSIGNED_STATUS.PENDING_ACCEPT
      ? t("tools.label.detail.pendingAccept")
      : value === ASSIGNED_STATUS.ACCEPT
        ? t("tools.label.detail.accept")
        : value === ASSIGNED_STATUS.REFUSE
          ? t("tools.label.detail.refuse")
          : value === ASSIGNED_STATUS.WAITING_CHECKOUT
            ? t("tools.label.detail.waitingAcceptCheckout")
            : value === ASSIGNED_STATUS.WAITING_CHECKIN
              ? t("tools.label.detail.waitingAcceptCheckin")
              : "";

export const getBGToolAssignedStatusDecription = (value: number) =>
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

export const getToolStatusDecription = (value: IToolResponse) =>
  value.name === t("tools.label.field.assign")
    ? t("tools.label.detail.assign")
    : value.name === t("tools.label.field.readyToDeploy")
      ? t("tools.label.detail.readyToDeploy")
      : value.name === t("tools.label.field.broken")
        ? t("tools.label.detail.broken")
        : value.name === t("tools.label.field.pending")
          ? t("tools.label.detail.pending")
          : "";

export const getBGToolStatusDecription = (value: IToolResponse) =>
  value.name === t("tools.label.field.assign")
    ? "#0073b7"
    : value.name === t("tools.label.field.readyToDeploy")
      ? "#00a65a"
      : value.name === t("tools.label.field.broken")
        ? "red"
        : value.name === t("tools.label.field.pending")
          ? "#f39c12"
          : "";

export const getDetailToolStatus = (value: IToolResponse | undefined) =>
  value?.status_label?.name === t("tools.label.field.assign")
    ? t("tools.label.detail.assign")
    : value?.status_label?.name === t("tools.label.field.readyToDeploy")
      ? t("tools.label.detail.readyToDeploy")
      : value?.status_label?.name === t("tools.label.field.broken")
        ? t("tools.label.detail.broken")
        : value?.status_label?.name === t("tools.label.field.pending")
          ? t("tools.label.detail.pending")
          : "";

export const filterAssignedStatus = [
  {
    text: t("tools.label.detail.default"),
    value: ASSIGNED_STATUS.DEFAULT,
  },
  {
    text: t("tools.label.detail.waitingAcceptCheckout"),
    value: ASSIGNED_STATUS.WAITING_CHECKOUT,
  },
  {
    text: t("tools.label.detail.waitingAcceptCheckin"),
    value: ASSIGNED_STATUS.WAITING_CHECKIN,
  },
  {
    text: t("tools.label.detail.accept"),
    value: ASSIGNED_STATUS.ACCEPT,
  },
  {
    text: t("tools.label.detail.refuse"),
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
