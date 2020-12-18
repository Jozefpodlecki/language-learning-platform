import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./pl.json";
import i18n from "i18next";
import pl from "./pl.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            pl: {
                translation: pl,
            },
            en: {
                translation: en,
            },
        },
        lng: "pl",
        fallbackLng: "pl",

        interpolation: {
            escapeValue: false,
        },
    });
