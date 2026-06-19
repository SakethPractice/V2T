import { Question, QuestionSection } from "./questions"
import { InterviewResponses } from "./response";

export interface InterviewStore {
  sessionId: string;
  currentQuestionIndex: number;
  questions: Question[];
 
  responses: InterviewResponses;

  setQuestions: (questions: Question[]) => void;

  setSessionId: (sessionId: string) => void;

  setResponses: (responses: any) => void;

  setAnswer: (
    section: QuestionSection,
    field: string,
    value: unknown,
    blockIndex?: number
  ) => void;

  nextQuestion: () => void;

  previousQuestion: () => void;

  goToQuestion: (index: number) => void;

  resetInterview: () => void;
}