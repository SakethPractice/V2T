import { Question, QuestionSection } from "../types/questions";
import { InterviewResponses } from "../types/response";

export interface SectionStatus {
  section: QuestionSection;
  status: "completed" | "current" | "notStarted" | "disabled";
  firstQuestionIndex: number;
  isDisabled: boolean;
}

const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

const getNestedValue = (
  responses: InterviewResponses,
  section: "farmer" | "farm",
  field: string
) => {
  const key = field.split(".")[1];

  return section === "farmer"
    ? responses.farmer?.[key as keyof typeof responses.farmer]
    : responses.farm?.[key as keyof typeof responses.farm];
};

const getBlockValue = (
  responses: InterviewResponses,
  field: string
) => {
  const match = field.match(/blocks\[(\d+)\]\.(.*)/);

  if (!match) return undefined;

  const blockIndex = Number(match[1]);
  const property = match[2];

  return responses.blocks?.[blockIndex]?.[
    property as keyof typeof responses.blocks[number]
  ];
};

const isQuestionAnswered = (
  question: Question,
  responses: InterviewResponses
) => {
  if (!question.field) return false;

  switch (question.section) {
    case "farmer":
      return hasValue(
        getNestedValue(responses, "farmer", question.field)
      );

    case "farm":
      return hasValue(
        getNestedValue(responses, "farm", question.field)
      );

    case "block":
      return hasValue(
        getBlockValue(responses, question.field)
      );

    default:
      return false;
  }
};

export const getSectionStatuses = (
  questions: Question[],
  responses: InterviewResponses,
  currentQuestionIndex: number
): SectionStatus[] => {
  const currentSection = questions[currentQuestionIndex]?.section;

  const farmerQuestions = questions.filter(
    (q) => q.section === "farmer"
  );

  const farmQuestions = questions.filter(
    (q) => q.section === "farm"
  );

  const blockQuestions = questions.filter(
    (q) => q.section === "block"
  );

  const blockCount = Number(responses.farm?.blockCount ?? 0);
  const isBlocksAvailable = blockCount > 0;

  const isFarmerComplete = farmerQuestions.every((q) =>
    isQuestionAnswered(q, responses)
  );

  const isFarmComplete = farmQuestions.every((q) =>
    isQuestionAnswered(q, responses)
  );

  const isBlocksComplete =
    isBlocksAvailable &&
    blockQuestions.every((q) =>
      isQuestionAnswered(q, responses)
    );

  return [
    {
      section: "farmer",
      status: isFarmerComplete
        ? "completed"
        : currentSection === "farmer"
        ? "current"
        : "notStarted",

      firstQuestionIndex:
        farmerQuestions.length > 0
          ? questions.indexOf(farmerQuestions[0])
          : 0,

      isDisabled: false,
    },

    {
      section: "farm",
      status: isFarmComplete
        ? "completed"
        : currentSection === "farm"
        ? "current"
        : "notStarted",

      firstQuestionIndex:
        farmQuestions.length > 0
          ? questions.indexOf(farmQuestions[0])
          : 0,

      isDisabled: false,
    },

    {
      section: "block",

      status: isBlocksComplete
        ? "completed"
        : currentSection === "block"
        ? "current"
        : isBlocksAvailable
        ? "notStarted"
        : "disabled",

      firstQuestionIndex:
        blockQuestions.length > 0
          ? questions.indexOf(blockQuestions[0])
          : 0,

      isDisabled: !isBlocksAvailable,
    },
  ];
};

export const getCompletionPercentage = (
  questions: Question[],
  responses: InterviewResponses
): number => {
  const blockCount = Number(responses.farm?.blockCount ?? 0);

  const activeQuestions = questions.filter((q) => {
    if (q.section !== "block") return true;
    return blockCount > 0;
  });

  if (activeQuestions.length === 0) return 0;

  const completed = activeQuestions.filter((q) =>
    isQuestionAnswered(q, responses)
  ).length;

  return Math.round(
    (completed / activeQuestions.length) * 100
  );
};