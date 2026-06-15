import { Question, QuestionSection } from "./questions"
import { InterviewResponses } from "./response";

export interface InterviewStore {
  currentQuestionIndex: number;

  questions: Question[];

  responses: InterviewResponses;

  setQuestions: (questions: Question[]) => void;

  setAnswer: (
    section: QuestionSection,
    field: string,
    value: unknown,
    blockIndex?: number
  ) => void;

  nextQuestion: () => void;

  previousQuestion: () => void;

  resetInterview: () => void;
}