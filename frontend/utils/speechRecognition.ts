import { LanguageCode } from "../types/language";
import { SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from "../types/speechRecognition";

export interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;

  start(): void;
  stop(): void;
}

interface BrowserWindow extends Window {
  SpeechRecognition?: {
    new (): BrowserSpeechRecognition;
  };

  webkitSpeechRecognition?: {
    new (): BrowserSpeechRecognition;
  };
}

export const SPEECH_RECOGNITION_LANGUAGES: Record<
  LanguageCode,
  string
> = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ta: "ta-IN",
  mr: "mr-IN",
  gu: "gu-IN",
};

export function getSpeechRecognitionConstructor() {
  const browserWindow = window as BrowserWindow;

  return (
    browserWindow.SpeechRecognition ??
    browserWindow.webkitSpeechRecognition
  );
}