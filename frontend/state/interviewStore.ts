import { create } from "zustand";
import i18n from "../i18n";
import { InterviewStore } from "../types/interview";
import { InterviewResponses } from "../types/response";

export const useInterviewStore = create<InterviewStore> ((set) => ({
    selectedLanguage: "en",
    currentQuestionIndex: 0,
    sessionId: "",
    phone: "",
    resumeQuestionId:"",
    questions: [],

    responses:
    {
        farmer: {},
        farm: {},
        blocks: [],
    },

    setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({
            selectedLanguage: language,
        });
        },
        
    setQuestions: (questions) => 
        set({
            questions,
        }),

    setSessionId: (sessionId: string) =>
        set({
            sessionId,
        }),
    
    setPhone: (phone: string) =>
        set({
            phone,
        }),

    setResumeQuestionId: (resumeQuestionId: string) =>
        set({
            resumeQuestionId,
        }),

    setResponses: (responses: InterviewResponses) =>
      set({
        responses: {
          farmer: responses?.farmer ?? {},
          farm: responses?.farm ?? {},
          blocks: responses?.blocks ?? [],
        },
      }),

    nextQuestion: () =>
        set((state) => ({
            currentQuestionIndex: Math.min(
                state.currentQuestionIndex + 1,
                state.questions.length - 1
            ),
        })),

    previousQuestion:() =>
        set((state) => ({
            currentQuestionIndex: Math.max(0,state.currentQuestionIndex - 1),
        })),

    goToQuestion: (index: number) =>
        set((state) => ({
            currentQuestionIndex:
                state.questions.length === 0
                    ? Math.max(0, index)
                    : Math.max(
                        0,
                        Math.min(index, state.questions.length - 1)
                    ),
        })),

    resetInterview: () =>
    set({
        currentQuestionIndex: 0,

        phone:"",

        resumeQuestionId: "",

        questions: [],

        responses: {
            farmer: {},
            farm: {},
            blocks: [],
        },
    }),

    
    setAnswer: (
  section,
  field,
  value
) =>
  set((state) => {
    if (!field || typeof field !== "string") return {};

    const parts = field.split(".");
    if (parts.length < 2) return {};

    const key = parts[1];

    if (section === "farmer") {
      return {
        responses: {
          ...state.responses,

          farmer: {
            ...(state.responses.farmer ?? {}),

            [key]: value,
          },
        },
      };
    }

    if (section === "farm") {
      return {
        responses: {
          ...state.responses,

          farm: {
            ...(state.responses.farm ?? {}),

            [key]: value,
          },
        },
      };
    }

    if (section === "block") {
      // support both "blocks[0].name" and "block0.name"
      const match1 = field.match(/^blocks\[(\d+)\]\.(.+)$/);
      const match2 = field.match(/^block(\d+)\.(.+)$/);
      const blockIndex = match1 ? Number(match1[1]) : match2 ? Number(match2[1]) : -1;
      const property = match1 ? match1[2] : match2 ? match2[2] : key;

      if (blockIndex < 0 || Number.isNaN(blockIndex)) return {};

      const blocks = [
        ...(state.responses.blocks ?? []),
      ];

      blocks[blockIndex] =
        blocks[blockIndex] ?? {};

      blocks[blockIndex] = {
        ...blocks[blockIndex],

        [property]: value,
      };

      return {
        responses: {
          ...state.responses,

          blocks,
        },
      };
    }

    return {};
  }),
        
    
}));
