import { Question } from "../../types/questions";

export const generateBlockQuestions = (
  blockCount: number
): Question[] => {
  const questions: Question[] = [];

  for (let i = 1; i <= blockCount; i++) {
    questions.push(
      {
        id: `block_${i}_name`,
        section: "block",
        field: `blocks[${i - 1}].name`,
        question: `What is the name of Block ${i}?`,
        type: "text",
        required: true,
      },

      {
        id: `block_${i}_area`,
        section: "block",
        field: `blocks[${i - 1}].area`,
        question: `What is the area of Block ${i}?`,
        type: "number",
        required: true,
      },

      {
        id: `block_${i}_farming_type`,
        section: "block",
        field: `blocks[${i - 1}].farmingType`,
        question: `What is the farming type of Block ${i}?`,
        type: "select",
        required: true,
        options: [
          "Organic",
          "Conventional",
          "Natural Farming",
          "Mixed",
        ],
      },

      {
        id: `block_${i}_water_source`,
        section: "block",
        field: `blocks[${i - 1}].watersrc`,
        question: `What is the water source for Block ${i}?`,
        type: "select",
        required: true,
        options: [
          "Borewell",
          "Canal",
          "Rainfed",
          "River",
          "Tank",
          "Other",
        ],
      }
    );
  }

  return questions;
};