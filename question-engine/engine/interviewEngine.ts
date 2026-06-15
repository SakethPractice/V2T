import { Question } from "../../types/questions";

import { farmerQuestions } from "../farmer/questions";

import { farmQuestions } from "../farm/questions";

import { generateBlockQuestions } from "../generators/blockQuestionGenerator";

export const initializeInterview = () : Question[] => {
    return[
        ...farmerQuestions,
        ...farmQuestions,
    ];
};


export const addBlockQuestions = (
    questions: Question[],
    blockCount: number

) : Question[] => {
    const blockQuestions = generateBlockQuestions(blockCount);

    return [
        ...questions,
        ...blockQuestions,
    ];
};