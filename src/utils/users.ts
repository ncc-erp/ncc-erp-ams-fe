import { t } from "../i18n";
import { AccessType } from "constants/permissions";

export const getPermissionsUser = (value: any) =>
  value?.admin === AccessType.allow
    ? t("user.label.title.admin")
    : value?.branchadmin === AccessType.allow
      ? t("user.label.title.branchadmin")
      : value?.superuser === AccessType.allow
        ? t("user.label.title.superuser")
        : "";

export const sum = (a: number, b: number) => {
  return a + b;
};
