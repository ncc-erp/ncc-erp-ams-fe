import i18n from "../i18n";
import { AccessType } from "constants/permissions";

export const getPermissionsUser = (value: any) =>
    value?.admin === AccessType.allow 
    ? i18n.t("user.label.title.admin")
    : value?.branchadmin  === AccessType.allow
    ? i18n.t("user.label.title.branchadmin")
    : value?.superuser === AccessType.allow
    ? i18n.t("user.label.title.superuser") : ""



