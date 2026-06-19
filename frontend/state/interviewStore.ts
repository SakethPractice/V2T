import { create } from "zustand";

import { InterviewStore } from "../types/interview";
import { InterviewResponses } from "../types/response";

export const useInterviewStore = create<InterviewStore> ((set) => ({
    currentQuestionIndex: 0,
    sessionId: "",
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

    setSessionId: (sessionId: string) =>
        set({
            sessionId,
        }),

    setResponses: (responses: InterviewResponses) =>
        set({
            responses,
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
            currentQuestionIndex: Math.max(
                0,
                Math.min(index, state.questions.length - 1)
            ),
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

    if (section === "block") {
  const blockPart = field.split(".")[0];

  const blockIndex = Number(
    blockPart.match(/\d+/)?.[0]
  );

  const property = field.split(".")[1];

  const blocks = [
    ...state.responses.blocks,
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