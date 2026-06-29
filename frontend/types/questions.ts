import { Translation } from "./language";

export type QuestionType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "image";

export type QuestionSection =
  | "farmer"
  | "farm"
  | "block"
  | "review";

export interface Question {
  id: string;
  section: QuestionSection;
  field: string;
  question: Translation; // Main interview question
  placeholder?: Translation; // Input placeholder
  type: QuestionType;

  options?: Translation[];

  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: RegExp;
}