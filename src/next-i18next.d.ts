import "i18next";

import commonVi from "../public/locales/vi/common.json";
import commonEn from "../public/locales/en/common.json";
import commonDe from "../public/locales/de/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof commonVi | typeof commonEn | typeof commonDe;
    };
  }
}
