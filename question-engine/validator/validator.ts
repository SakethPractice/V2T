import { Question } from "../../types/questions"

export function validateAnswer(
  question: Question,
  answer: any
): string | null {

  if (
    question.required &&
    (answer === null ||
      answer === undefined ||
      answer === "")
  ) {
    return "This field is required";
  }

  if (question.type === "number") {

    const value = Number(answer);

    if (isNaN(value)) {
      return "Must be a number";
    }

    if (
      question.min !== undefined &&
      value < question.min
    ) {
      return `Minimum value is ${question.min}`;
    }

    if (
      question.max !== undefined &&
      value > question.max
    ) {
      return `Maximum value is ${question.max}`;
    }
  }

  if (question.type === "text") {

    if (
      question.minLength &&
      answer.length < question.minLength
    ) {
      return `Minimum length is ${question.minLength}`;
    }

    if (
      question.maxLength &&
      answer.length > question.maxLength
    ) {
      return `Maximum length is ${question.maxLength}`;
    }

    if (
      question.pattern &&
      !question.pattern.test(answer)
    ) {
      return "Invalid format";
    }
  }

  return null;
}