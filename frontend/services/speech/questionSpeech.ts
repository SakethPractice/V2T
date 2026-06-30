import { SpeechItem } from "../../types/speech";
import { Question } from "../../types/questions";

export function createQuestionSpeechItems(
  question: Question,
  language: string
): SpeechItem[] {
  const items: SpeechItem[] = [
    {
      text:
        question.question[
          language as keyof typeof question.question
        ] ?? question.question.en,
      language,
    },
  ];

  if (question.options?.length) {
    for (const option of question.options) {
      items.push({
        text:
          typeof option === "string"
            ? option
            : option[
                language as keyof typeof option
              ] ?? option.en,
        language,
      });
    }
  }

  return items;
}
