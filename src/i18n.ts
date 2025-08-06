import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";

import commonVi from "../public/locales/vi/common.json";
import commonEn from "../public/locales/en/common.json";
import commonDe from "../public/locales/de/common.json";

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    lng: "vi",
    supportedLngs: ["vi", "en", "de"],
    fallbackLng: ["vi", "en", "de"],
    interpolation: { escapeValue: false },
    resources: {
      vi: { translation: commonVi },
      en: { translation: commonEn },
      de: { translation: commonDe },
    },
  });

export const t = (key: string, options?: any): string => {
  return (i18n.t as any)(key, options);
};

export default i18n;
