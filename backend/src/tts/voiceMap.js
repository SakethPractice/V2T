const VOICE_MAP = Object.freeze({
  en: {
    voice: "en-US-EmmaMultilingualNeural",
    locale: "en-US",
    name: "English",
  },

  hi: {
    voice: "hi-IN-SwaraNeural",
    locale: "hi-IN",
    name: "Hindi",
  },

  kn: {
    voice: "kn-IN-SapnaNeural",
    locale: "kn-IN",
    name: "Kannada",
  },

  te: {
    voice: "te-IN-ShrutiNeural",
    locale: "te-IN",
    name: "Telugu",
  },

  ta: {
    voice: "ta-IN-PallaviNeural",
    locale: "ta-IN",
    name: "Tamil",
  },

  mr: {
    voice: "mr-IN-AarohiNeural",
    locale: "mr-IN",
    name: "Marathi",
  },

  gu: {
    voice: "gu-IN-DhwaniNeural",
    locale: "gu-IN",
    name: "Gujarati",
  },
});

export function getVoice(language) {
  return VOICE_MAP[language]?.voice ?? VOICE_MAP.en.voice;
}

export function isSupportedLanguage(language) {
  return language in VOICE_MAP;
}

export function getLocale(language) {
  return VOICE_MAP[language]?.locale ?? "en-US";
}

export { VOICE_MAP };