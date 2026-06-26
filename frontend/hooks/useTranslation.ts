import { useTranslation as useI18nTranslation } from "react-i18next";
import { useLanguage } from "./useLanguage";

export function useTranslation() {
  const { t } = useI18nTranslation();

  const { language, setLanguage } = useLanguage();

  return {
    t,
    language,
    changeLanguage: setLanguage,
  };
}