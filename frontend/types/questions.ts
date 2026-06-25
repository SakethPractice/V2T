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
  question: Translation;
  type: QuestionType;
  required: boolean;

  options?: string[];

  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: RegExp;
}