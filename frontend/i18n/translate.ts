import {
  DEFAULT_LANGUAGE,
  LanguageCode,
  Translation,
} from "../types/language";

export function translate(
  translation: Translation | undefined,
  language: LanguageCode
): string {
  if (!translation) return "";

  return (
    translation[language] ??
    translation[DEFAULT_LANGUAGE]
  );
}