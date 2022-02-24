import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // for all available options read the backend's repository readme file /locales/{{lng}}/{{ns}}.json
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      crossDomain: false,
    },
  });

export default i18n;
