import "i18next";

import vi from "../public/locales/vi/common.json";
import en from "../public/locales/en/common.json";
import de from "../public/locales/de/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof vi | typeof en | typeof de;
    };
  }
}
