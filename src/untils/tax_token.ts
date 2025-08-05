import { STATUS_TAX_TOKEN } from "constants/tax_token";
import { t } from "../i18n";
import { ASSIGNED_STATUS } from "constants/assets";
import { ITaxTokenResponse } from "interfaces/tax_token";

export const getTaxTokenStatusDecription = (value: ITaxTokenResponse) =>
  // value === STATUS_TAX_TOKEN.NOT_ACTIVATE
  //     ? t("tax_token.label.field.not_active")
  //     : t("tax_token.label.field.assign")
  value.name === t("hardware.label.field.assign")
    ? t("hardware.label.detail.assign")
    : value.name === t("hardware.label.field.readyToDeploy")
      ? t("hardware.label.detail.readyToDeploy")
      : value.name === t("hardware.label.field.broken")
        ? t("hardware.label.detail.broken")
        : value.name === t("hardware.label.field.pending")
          ? t("hardware.label.detail.pending")
          : "";

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
  value: ITaxTokenResponse | undefined
) =>
  value?.status_label?.name === t("hardware.label.field.assign")
    ? t("hardware.label.detail.assign")
    : value?.status_label?.name === t("hardware.label.field.readyToDeploy")
      ? t("hardware.label.detail.readyToDeploy")
      : value?.status_label?.name === t("hardware.label.field.broken")
        ? t("hardware.label.detail.broken")
        : value?.status_label?.name === t("hardware.label.field.pending")
          ? t("hardware.label.detail.pending")
          : "";
