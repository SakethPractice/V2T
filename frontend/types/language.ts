export const SUPPORTED_LANGUAGES = [
  "en",
  "te",
  "hi",
  "kn",
  "ta",
  "mr",
  "gu",
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export type Translation = Record<LanguageCode, string>;

export const DEFAULT_LANGUAGE: LanguageCode = "en";