import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './translations';

/* i18n was set up using the following guide:
 * https://dev.to/adrai/how-to-properly-internationalize-a-react-application-using-i18next-3hdb
 *
 * Language detector: https://github.com/i18next/i18next-browser-languageDetector
 * i18next options: https://www.i18next.com/overview/configuration-options
 *
 * Add `?lng=LANGUAGE` to URL to set language. See `translations.ts` for the available languages.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: resources
  });

export default i18n;
