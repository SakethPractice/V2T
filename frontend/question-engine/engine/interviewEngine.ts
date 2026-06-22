import { Question } from "../../types/questions";

import { farmerQuestions } from "../farmer/questions";

import { farmQuestions } from "../farm/questions";

import { generateBlockQuestions } from "../generators/blockQuestionGenerator";

import { useInterviewStore } from "../../state/interviewStore";
 
export const initializeInterview = () : Question[] => {
  
  // Pre-fill mobile_num from the phone stored at login,
  // but only if it hasn't already been answered (e.g. from a restored draft).
  const store = useInterviewStore.getState();
 
  if (
    store.phone &&
    !store.responses?.farmer?.mobile_num
  ) {
    store.setAnswer(
      "farmer",
      "farmer.mobile_num",
      store.phone
    );
  }
    const baseQuestions = [
        ...farmerQuestions,
        ...farmQuestions,
    ];

    const savedBlockCount = Number(
      store.responses?.farm?.blockCount ?? 0
    );

    if (savedBlockCount > 0) {
      return addBlockQuestions(
        baseQuestions,
        savedBlockCount
      );
    }

    return baseQuestions;
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