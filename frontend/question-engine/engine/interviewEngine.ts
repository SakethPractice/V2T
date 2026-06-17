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
): Question[] => {
  const blockQuestions =
    generateBlockQuestions(blockCount);

  const photoIndex = questions.findIndex(
    (question) =>
      question.field === "farm.photo"
  );

  if (photoIndex === -1) {
    return [
      ...questions,
      ...blockQuestions,
    ];
  }

  const beforePhoto =
    questions.slice(0, photoIndex);

  const photoQuestion =
    questions[photoIndex];

  const afterPhoto =
    questions.slice(photoIndex + 1);

  return [
    ...beforePhoto,

    ...blockQuestions,

    photoQuestion,

    ...afterPhoto,
  ];
};