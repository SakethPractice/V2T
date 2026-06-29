export type SpeechEvent = "start" | "end" | "cancel" | "error";

export interface SpeechEventMap {
  start: void;
  end: void;
  cancel: void;
  error: Error;
}

export enum SpeechPriority {
  NAVIGATION = 1,
  USER_ACTION = 2,
  AUTO_QUESTION = 3,
  AUTO_INSTRUCTIONS = 4,
  AI_COMPANION = 5,
  BACKGROUND = 6,
}

export type SpeechEventCallback<T = unknown> = (payload: T) => void;

export interface SpeechItem {
  text: string;
  language: string;

  delay?: number;

  metadata?: Record<string, unknown>;
}

export interface SpeechSequence {
  id?: string;

  priority?: SpeechPriority;

  items: SpeechItem[];
}