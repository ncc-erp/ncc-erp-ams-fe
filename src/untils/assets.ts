import { ASSIGNED_STATUS } from "constants/assets";
import { IHardwareResponse } from "interfaces/hardware";
import i18n from "../i18n";

export const getAssetAssignedStatusDecription = (value: number) =>
  value === ASSIGNED_STATUS.DEFAULT
    ? i18n.t("hardware.label.detail.default")
    : value === ASSIGNED_STATUS.PENDING_ACCEPT
    ? i18n.t("hardware.label.detail.pendingAccept")
    : value === ASSIGNED_STATUS.ACCEPT
    ? i18n.t("hardware.label.detail.accept")
    : value === ASSIGNED_STATUS.REFUSE
    ? i18n.t("hardware.label.detail.refuse")
    : value === ASSIGNED_STATUS.WAITING_CHECKOUT 
    ? i18n.t("hardware.label.detail.waitingAcceptCheckout") 
    : value === ASSIGNED_STATUS.WAITING_CHECKIN 
    ? i18n.t("hardware.label.detail.waitingAcceptCheckin") : "";

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
    value.name === i18n.t("hardware.label.field.assign")
      ? i18n.t("hardware.label.detail.assign")
      : value.name === i18n.t("hardware.label.field.readyToDeploy")
      ? i18n.t("hardware.label.detail.readyToDeploy")
      : value.name === i18n.t("hardware.label.field.broken")
      ? i18n.t("hardware.label.detail.broken")
      : value.name === i18n.t("hardware.label.field.pending")
      ? i18n.t("hardware.label.detail.pending")
      : value.name === i18n.t("hardware.label.field.checkin")
      ? i18n.t("hardware.label.detail.checkin")
      : "";
  
export const getBGAssetStatusDecription = (value: IHardwareResponse) =>
    value.name === i18n.t("hardware.label.field.assign")
      ? "#0073b7"
      : value.name === i18n.t("hardware.label.field.readyToDeploy")
      ? "#00a65a"
      : value.name === i18n.t("hardware.label.field.broken")
      ? "red"
      : value.name === i18n.t("hardware.label.field.pending")
      ? "#f39c12"
      : value.name === i18n.t("hardware.label.field.checkin")
      ? "red"
      : "";
