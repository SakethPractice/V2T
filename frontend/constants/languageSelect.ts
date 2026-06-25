import { LanguageCode } from "../types/language";

export interface LanguageOption {
  code: LanguageCode;
  englishName: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    englishName: "English",
    nativeName: "English",
  },
  {
    code: "te",
    englishName: "Telugu",
    nativeName: "తెలుగు",
  },
  {
    code: "hi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
  },
  {
    code: "kn",
    englishName: "Kannada",
    nativeName: "ಕನ್ನಡ",
  },
  {
    code: "ta",
    englishName: "Tamil",
    nativeName: "தமிழ்",
  },
  {
    code: "mr",
    englishName: "Marathi",
    nativeName: "मराठी",
  },
  {
    code: "gu",
    englishName: "Gujarati",
    nativeName: "ગુજરાતી",
  },
];