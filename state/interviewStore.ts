import { create } from "zustand";

import { InterviewStore } from "../types/interviewStore";

export const useInterviewStore = create<InterviewStore> ((set) => ({
    currentQuestionIndex: 0,

    questions: [],

    responses:
    {
        farmer: {},
        farm: {},
        blocks: [],
    },

    setQuestions: (questions) => 
        set({
            questions,
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

    resetInterview: () =>
    set({
        currentQuestionIndex: 0,

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
    const key = field.split(".")[1];

    if (section === "farmer") {
      return {
        responses: {
          ...state.responses,

          farmer: {
            ...state.responses.farmer,

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
            ...state.responses.farm,

            [key]: value,
          },
        },
      };
    }

    return {};
  }),
        
    
}));