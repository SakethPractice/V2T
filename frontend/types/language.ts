export type SupportedLanguage =
  | "en"
  | "te"
  | "hi"
  | "kn"
  | "ta"
  | "mr"
  | "gu";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}