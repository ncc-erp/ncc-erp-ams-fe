import { STATUS_TAX_TOKEN } from "constants/tax_token";
import i18n from "../i18n";
import { ASSIGNED_STATUS } from "constants/assets";
import { ITaxTokenResponse } from "interfaces/tax_token";

export const getTaxTokenStatusDecription = (value: number) =>
    value === STATUS_TAX_TOKEN.NOT_ACTIVATE
        ? i18n.t("tax_token.label.field.not_active")
        : i18n.t("tax_token.label.field.assign")

export const getBGTaxTokenStatusDecription = (value: number) =>
    value === STATUS_TAX_TOKEN.NOT_ACTIVATE
        ? "#00a65a"
        : "#0073b7"

export const getTaxTokenAssignedStatusDecription = (value: number) =>
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

export const getDetailTaxTokenStatus = (value: ITaxTokenResponse | undefined) =>
    value?.status_id ===  STATUS_TAX_TOKEN.NOT_ACTIVATE
        ? i18n.t("tax_token.label.detail.not_active")
        :i18n.t("tax_token.label.detail.assign")
