import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";
import common_vi from "../public/locales/vi/common.json";
import common_en from "../public/locales/en/common.json";

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["vi", "en", "de"],
    // lng: "vn",
    // backend: {
    //   loadPath: "/locales/{{lng}}/{{ns}}.json",
    // },
    // defaultNS: "common",
    fallbackLng: ["vi", "en", "de"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      vi: {
        translation: common_vi,
      },
      en: {
        translation: common_en,
      },
    },
  });

export default i18n;
