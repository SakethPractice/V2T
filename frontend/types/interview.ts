import { Question, QuestionSection } from "./questions"
import { InterviewResponses } from "./response";
import { LanguageCode } from "./language";
export interface InterviewStore {
  selectedLanguage: LanguageCode;

  sessionId: string;
  phone: string;
  currentQuestionIndex: number;
  resumeQuestionId: string;
  questions: Question[];
 
  responses: InterviewResponses;

setLanguage: (lang: LanguageCode) => void;

  setQuestions: (questions: Question[]) => void;

  setSessionId: (sessionId: string) => void;

  setPhone: (phone: string) => void;

  setResponses: (responses: any) => void;

  setResumeQuestionId: (resumeQuestionId: string) => void;

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