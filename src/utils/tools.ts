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

export const getToolStatusDecription = (
  value: IToolResponse,
  t: (key: string) => string
) => {
  const statusMapping: Record<string, { label: string; color: string }> = {
    Assign: { label: t("tools.label.detail.assign"), color: "#0073b7" },
    "Ready to Deploy": {
      label: t("tools.label.detail.readyToDeploy"),
      color: "#00a65a",
    },
    Broken: { label: t("tools.label.detail.broken"), color: "red" },
    Pending: { label: t("tools.label.detail.pending"), color: "#f39c12" },
    Default: { label: t("tools.label.detail.default"), color: "gray" },
  };

  const result = statusMapping[value.name] || {
    label: t("tools.label.detail.unknown"),
    color: "gray",
  }; // Giá trị mặc định
  return result;
};

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

export const getDetailToolStatus = (
  value: IToolResponse | undefined,
  t: (key: string) => string
) => {
  if (!value?.status_label?.name) {
    return t("tools.label.detail.unknown");
  }

  const statusMapping: Record<string, string> = {
    Assign: t("tools.label.detail.assign"),
    "Ready to Deploy": t("tools.label.detail.readyToDeploy"),
    Broken: t("tools.label.detail.broken"),
    Pending: t("tools.label.detail.pending"),
    Default: t("tools.label.detail.default"),
    "Waiting Checkout": t("tools.label.detail.waitingAcceptCheckout"),
    "Waiting Checkin": t("tools.label.detail.waitingAcceptCheckin"),
  };

  return (
    statusMapping[value.status_label.name] || t("tools.label.detail.unknown")
  );
};

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
