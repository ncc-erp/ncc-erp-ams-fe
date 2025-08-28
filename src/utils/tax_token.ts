import { ASSIGNED_STATUS } from "constants/assets";
import { ITaxTokenResponse } from "interfaces/tax_token";
import { t } from "../i18n";

export const getTaxTokenStatusDecription = (value: ITaxTokenResponse) => {
  const statusMapping: Record<string, { label: string; color: string }> = {
    Assign: { label: t("hardware.label.detail.assign"), color: "#0073b7" },
    "Ready to Deploy": {
      label: t("hardware.label.detail.readyToDeploy"),
      color: "#00a65a",
    },
    Broken: { label: t("hardware.label.detail.broken"), color: "red" },
    Pending: { label: t("hardware.label.detail.pending"), color: "#f39c12" },
    Default: { label: t("hardware.label.detail.default"), color: "gray" },
    "Waiting Checkout": {
      label: t("hardware.label.detail.waitingAcceptCheckout"),
      color: "#f39c12",
    },
    "Waiting Checkin": {
      label: t("hardware.label.detail.waitingAcceptCheckin"),
      color: "#f39c12",
    },
  };

  const result = statusMapping[value.name] || {
    label: t("hardware.label.detail.unknown"),
    color: "gray",
  }; // Giá trị mặc định
  return result;
};

export const getBGTaxTokenStatusDecription = (value: ITaxTokenResponse) =>
  value.name === t("hardware.label.field.assign")
    ? "#0073b7"
    : value.name === t("hardware.label.field.readyToDeploy")
      ? "#00a65a"
      : value.name === t("hardware.label.field.broken")
        ? "red"
        : value.name === t("hardware.label.field.pending")
          ? "#f39c12"
          : "";

export const getTaxTokenAssignedStatusDecription = (value: number) =>
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

export const getBGTaxTokenAssignedStatusDecription = (value: number) =>
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

export const getDetailTaxTokenStatus = (
  value: ITaxTokenResponse | undefined,
  t: (key: string) => string
) => {
  if (!value?.status_label?.name) {
    return { label: t("tax_token.label.detail.unknown"), color: "gray" };
  }

  const statusMapping: Record<string, { label: string; color: string }> = {
    Assign: { label: t("tax_token.label.detail.assign"), color: "#0073b7" },
    "Ready to Deploy": {
      label: t("tax_token.label.detail.readyToDeploy"),
      color: "#00a65a",
    },
    Broken: { label: t("tax_token.label.detail.broken"), color: "red" },
    Pending: { label: t("tax_token.label.detail.pending"), color: "#f39c12" },
    Default: { label: t("tax_token.label.detail.default"), color: "gray" },
    "Waiting Checkout": {
      label: t("tax_token.label.detail.waitingAcceptCheckout"),
      color: "#f39c12",
    },
    "Waiting Checkin": {
      label: t("tax_token.label.detail.waitingAcceptCheckin"),
      color: "#f39c12",
    },
  };

  return (
    statusMapping[value.status_label.name] || {
      label: t("tax_token.label.detail.unknown"),
      color: "gray",
    }
  );
};
