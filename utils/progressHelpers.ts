import { Question, QuestionSection } from "../types/questions";
import { InterviewResponses } from "../types/response";

export interface SectionStatus {
  section: QuestionSection;
  label: string;
  status: "completed" | "current" | "notStarted" | "disabled";
  firstQuestionIndex: number;
  isDisabled: boolean;
}

export const getSectionStatuses = (
  questions: Question[],
  responses: InterviewResponses,
  currentQuestionIndex: number
): SectionStatus[] => {
  const currentQuestion = questions[currentQuestionIndex];
  const currentSection = currentQuestion?.section;

  const farmerQuestions = questions.filter(
    (q) => q.section === "farmer"
  );
  const farmQuestions = questions.filter(
    (q) => q.section === "farm"
  );
  const blockQuestions = questions.filter(
    (q) => q.section === "block"
  );

  const isFarmerComplete = farmerQuestions.every((q) => {
    const key = q.field.split(".")[1];
    return (
      responses.farmer[key as keyof typeof responses.farmer] !==
      undefined
    );
  });

  const isFarmComplete = farmQuestions.every((q) => {
    const key = q.field.split(".")[1];
    return (
      responses.farm[key as keyof typeof responses.farm] !== undefined
    );
  });

  const isBlocksAvailable =
    responses.farm?.blockCount &&
    Number(responses.farm.blockCount) > 0;

  const isBlocksComplete =
    isBlocksAvailable &&
    blockQuestions.every((q) => {
      const match = q.field.match(/blocks\[(\d+)\]\.(.*)/);
      if (!match) return false;
      const blockIndex = Number(match[1]);
      const property = match[2];
      return (
        responses.blocks?.[blockIndex]?.[
          property as keyof typeof responses.blocks[number]
        ] !== undefined
      );
    });

  const statuses: SectionStatus[] = [
    {
      section: "farmer",
      label: "Farmer Details",
      status: isFarmerComplete
        ? "completed"
        : currentSection === "farmer"
          ? "current"
          : "notStarted",
      firstQuestionIndex: farmerQuestions.length > 0
        ? questions.indexOf(farmerQuestions[0])
        : 0,
      isDisabled: false,
    },
    {
      section: "farm",
      label: "Farm Details",
      status: isFarmComplete
        ? "completed"
        : currentSection === "farm"
          ? "current"
          : "notStarted",
      firstQuestionIndex: farmQuestions.length > 0
        ? questions.indexOf(farmQuestions[0])
        : 0,
      isDisabled: false,
    },
    {
      section: "block",
      label: "Block Details",
      status: isBlocksComplete
        ? "completed"
        : currentSection === "block"
          ? "current"
          : isBlocksAvailable
            ? "notStarted"
            : "disabled",
      firstQuestionIndex: blockQuestions.length > 0
        ? questions.indexOf(blockQuestions[0])
        : 0,
      isDisabled: !isBlocksAvailable,
    },
  ];

  return statuses;
};

export const getCompletionPercentage = (
  questions: Question[],
  responses: InterviewResponses
): number => {
  if (questions.length === 0) return 0;

  let completedCount = 0;

  questions.forEach((question) => {
    if (question.section === "farmer") {
      const key = question.field.split(".")[1];
      if (
        responses.farmer[key as keyof typeof responses.farmer] !==
        undefined
      ) {
        completedCount++;
      }
    } else if (question.section === "farm") {
      const key = question.field.split(".")[1];
      if (
        responses.farm[key as keyof typeof responses.farm] !== undefined
      ) {
        completedCount++;
      }
    } else if (question.section === "block") {
      const match = question.field.match(/blocks\[(\d+)\]\.(.*)/);
      if (match) {
        const blockIndex = Number(match[1]);
        const property = match[2];
        if (
          responses.blocks?.[blockIndex]?.[
            property as keyof typeof responses.blocks[number]
          ] !== undefined
        ) {
          completedCount++;
        }
      }
    }
  });

  return Math.round((completedCount / questions.length) * 100);
};
