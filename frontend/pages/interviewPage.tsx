import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { initializeInterview } from "../question-engine/engine/interviewEngine";
import { fetchPincode } from "../services/pincodeService";
import { useInterviewStore } from "../state/interviewStore";
import { saveSession } from "../services/sessionService";

import { addBlockQuestions } from "../question-engine/engine/interviewEngine";

import {
  DATE_MASK_MAX_LENGTH,
  sanitizeAnswer,
  validateAnswer,
} from "../utils/validator";

import ProgressSidebar from "../components/interview/progressSidebar";
import { useLanguage } from "../hooks/useLanguage";
import { SupportedLanguage } from "../types/language";

export default function InterviewPage() {

  const navigate = useNavigate();
  const selectedLanguage = useLanguage();

  const {
    questions,
    currentQuestionIndex,
    setQuestions,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    setAnswer,
    responses,
    sessionId,
    resumeQuestionId,
    setResumeQuestionId,
  } = useInterviewStore();

  const [answer, setAnswerValue] = useState("");

  const [error, setError] = useState("");

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialResumeQuestionId = useRef(resumeQuestionId);

  useEffect(() => {
    const interviewQuestions = initializeInterview();

    setQuestions(interviewQuestions);

    if (initialResumeQuestionId.current) {
      const index = interviewQuestions.findIndex(
        (q) => q.field === initialResumeQuestionId.current
      );

      if (index !== -1) {
        goToQuestion(index);
      }

      setResumeQuestionId("");
    }
  }, [
    goToQuestion,
    setQuestions,
    setResumeQuestionId,
  ]);

  useEffect(() => {
  setAnswerValue(
    String(getSavedAnswer())
  );
}, [currentQuestionIndex,responses]);

 
  // Autosave: fires whenever responses or currentQuestionIndex change.
  // Debounced by 1000ms so rapid typing doesn't flood the API.
  // Guards: sessionId must exist, questions must be loaded,
  // currentQuestion must resolve — prevents saves during initialization.
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
 
    if (!sessionId || !currentQuestion || questions.length === 0) return;
 
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
 
    autosaveTimer.current = setTimeout(() => {
      saveSession(
        sessionId,
        responses,
        currentQuestion.field
      );
    }, 1000);
 
    // Cancel any pending save if the component unmounts mid-debounce.
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [responses, currentQuestionIndex]);
 

  const currentQuestion = questions[currentQuestionIndex];

  const getQuestionText = (
    question: string | Partial<Record<SupportedLanguage, string>> | undefined
  ) => {
    if (!question) return "";

    if (typeof question === "string") {
      return question;
    }

    return (
      question[selectedLanguage] ??
      question.en ??
      ""
    );
  };

const getSavedAnswer = () => {
  if (!currentQuestion) return "";
  if (!currentQuestion.field) return "";

  const parts = currentQuestion.field.split(".");
  if (parts.length < 2) return "";

  const section = parts[0];
  const key = parts[1];

  if (section === "farmer") {
    return (
      responses?.farmer?.[key as keyof typeof responses.farmer] ?? ""
    );
  }

  if (section === "farm") {
    return (
      responses?.farm?.[key as keyof typeof responses.farm] ?? ""
    );
  }

  if (section.startsWith("blocks[") || section.startsWith("block")) {
    const idx = section.match(/\d+/)?.[0];
    if (!idx) return "";
    const blockIndex = Number(idx);

    return (
      responses?.blocks?.[blockIndex]?.[
        key as keyof typeof responses.blocks[number]
      ] ?? ""
    );
  }

  return "";
};

  const isGenderQuestion =
    currentQuestion?.field === "farmer.gender";

  const currentAnswer = useMemo(() => {
    if (currentQuestion?.type === "number" && answer === "") {
      return "";
    }

    return String(answer ?? "");
  }, [answer, currentQuestion?.type]);

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentQuestion) {
      return;
    }

    setAnswerValue(
      sanitizeAnswer(
        currentQuestion.field,
        event.target.value
      )
    );
  };

  const handleSelectChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setAnswerValue(event.target.value);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAnswerValue("");
      return;
    }

    setAnswerValue(file.name);
  };

  const renderAnswerInput = () => {
    if (!currentQuestion) {
      return null;
    }

    if (currentQuestion.type === "select" && currentQuestion.options) {
      if (isGenderQuestion) {
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {currentQuestion.options.map((option) => {
              const checked = currentAnswer === option;

              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    checked
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setAnswerValue(checked ? "" : option)
                    }
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span className="text-slate-700">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        );
      }

      return (
        <select
          key={currentQuestion.id}
          value={currentAnswer}
          onChange={handleSelectChange}
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <option value="">Select an option</option>

          {currentQuestion.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (currentQuestion.type === "image") {
      return (
        <div className="space-y-3">
          <input
            key={currentQuestion.id}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
              file:mr-4
              file:rounded-lg
              file:border-0
              file:bg-blue-50
              file:px-4
              file:py-2
              file:text-blue-700
            "
          />

          {currentAnswer && (
            <p className="text-sm text-slate-500">
              Selected image: {currentAnswer}
            </p>
          )}
        </div>
      );
    }

    const isDateQuestion =
      currentQuestion.type === "date";

    const isNumberQuestion =
      currentQuestion.type === "number";

    const placeholderMap: Record<string, string> = {
      "farmer.name": "Enter full name",
      "farmer.DOB": "dd/mm/yyyy",
      "farmer.mobile_num": "10-digit mobile number",
      "farmer.pincode": "6-digit pincode",
    };

    return (
      <input
        key={currentQuestion.id}
        type={isNumberQuestion ? "number" : "text"}
        value={currentAnswer}
        onChange={handleTextChange}
        placeholder={
          placeholderMap[currentQuestion.field] ??
          "Type your answer"
        }
        inputMode={
          isDateQuestion
            ? "numeric"
            : currentQuestion.field === "farmer.mobile_num" ||
                currentQuestion.field === "farmer.pincode" ||
                isNumberQuestion
              ? "numeric"
              : "text"
        }
        maxLength={
          isDateQuestion
            ? DATE_MASK_MAX_LENGTH
            : currentQuestion.field === "farmer.mobile_num"
              ? 10
              : currentQuestion.field === "farmer.pincode"
                ? 6
                : currentQuestion.maxLength
        }
        min={isNumberQuestion ? currentQuestion.min : undefined}
        max={isNumberQuestion ? currentQuestion.max : undefined}
        step={isNumberQuestion ? "any" : undefined}
        className="
          w-full
          border
          border-slate-300
          rounded-xl
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    );
  };

const handleNext = async () => {
  if (!currentQuestion) {
    return;
  }

  const validationError = validateAnswer(
    currentQuestion,
    answer
  );

  if (validationError) {
    setError(validationError);
    return;
  }

  setError("");

  setAnswer(
    currentQuestion.section,
    currentQuestion.field,
    answer
  );

  if (
  currentQuestion.field ===
  "farmer.village"
) {
  const pincode =
    await fetchPincode(answer);

  if (pincode) {
    setAnswer(
      "farmer",
      "farmer.pincode",
      pincode
    );
  }
}


  if (
    currentQuestion.field === "farm.blockCount" &&
    !questions.some(
      (question) => question.section === "block"
    )
  ) {
    const updatedQuestions = addBlockQuestions(
      questions,
      Number(answer)
    );

    setQuestions(updatedQuestions);
  }

  if (
    currentQuestionIndex ===
    questions.length - 1
  ) {
    navigate("/review");
    return;
  }

  nextQuestion();

  setAnswerValue("");
}; 

  if (!currentQuestion) {
    return <div>Loading interview...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Main Content */}
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold">
              Voice Interview Platform
            </h1>

            <p className="text-slate-500 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>

            <div className="w-full h-3 bg-slate-200 rounded-full mt-4">
              <div
                className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6">

            <div className="mb-4">
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                {currentQuestion.section}
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-relaxed">
              {getQuestionText(currentQuestion.question)}
            </h2>

          </div>

          {/* Answer Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">
              Your Answer
            </h3>

            {renderAnswerInput()}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="
                px-6 py-3
                border border-slate-300
                rounded-xl
                hover:bg-slate-100
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="
                px-6 py-3
                bg-blue-600
                text-white
                rounded-xl
                hover:bg-blue-700
              "
            >
              Next
            </button>
          </div>

        </div>
      </div>

      {/* Progress Sidebar */}
      <ProgressSidebar />
    </div>
  );
};
