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
  question: string;
  type: QuestionType;
  required: boolean;

  options?: string[];

  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: RegExp;
}