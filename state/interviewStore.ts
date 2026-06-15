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

    setAnswer: () => {
        //todo
    },
        
    
}));