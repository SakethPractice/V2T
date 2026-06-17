import { Question } from "../frontend/types/questions"

export function validateAnswer(
  question: Question,
  answer: any
): string | null {
  const normalizedAnswer =
    typeof answer === "string"
      ? answer.trim()
      : answer;

  if (
    question.required &&
    (normalizedAnswer === null ||
      normalizedAnswer === undefined ||
      normalizedAnswer === "")
  ) {
    return "This field is required";
  }

  if (question.type === "number") {

    const value = Number(normalizedAnswer);

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
      normalizedAnswer.length < question.minLength
    ) {
      return `Minimum length is ${question.minLength}`;
    }

    if (
      question.maxLength &&
      normalizedAnswer.length > question.maxLength
    ) {
      return `Maximum length is ${question.maxLength}`;
    }

    if (
      question.pattern &&
      !question.pattern.test(normalizedAnswer)
    ) {
      return "Invalid format";
    }
  }

  if (question.type === "date") {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(normalizedAnswer)) {
      return "Use dd/mm/yyyy format";
    }

    const [day, month, year] =
      normalizedAnswer.split("/").map(Number);

    const parsedDate = new Date(year, month - 1, day);

    const isValidDate =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    if (!isValidDate) {
      return "Enter a valid date";
    }
  }

  return null;
}

export const DATE_MASK_MAX_LENGTH = 10;

const formatDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const sanitizeAnswer = (
  field: string,
  value: string
): string => {
  switch (field) {
    case "farmer.name":
      return value.replace(/[^a-zA-Z\s.'-]/g, "");
    case "farmer.mobile_num":
      return value.replace(/\D/g, "").slice(0, 10);
    case "farmer.pincode":
      return value.replace(/\D/g, "").slice(0, 6);
    case "farmer.DOB":
      return formatDateInput(value).slice(0, DATE_MASK_MAX_LENGTH);
    default:
      return value;
  }
};
