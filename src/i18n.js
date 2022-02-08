import { initReactI18next } from "react-i18next";
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import i18n from "i18next";
import backend from "i18next-xhr-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};


i18n
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
        // Turn off the use of React Suspense
        useSuspense: false
      }
  });

  export default i18n;