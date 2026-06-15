import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { initializeInterview } from "../question-engine/engine/interviewEngine";

import { useInterviewStore } from "../state/interviewStore";

import { addBlockQuestions } from "../question-engine/engine/interviewEngine";

import { validateAnswer } from "../question-engine/validator/validator";

export default function InterviewPage() {

  const navigate = useNavigate();

  const {
    questions,
    currentQuestionIndex,
    setQuestions,
    nextQuestion,
    previousQuestion,
    setAnswer,
    responses,
  } = useInterviewStore();

  console.log(responses);

  const [answer, setAnswerValue] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const interviewQuestions = initializeInterview();

    setQuestions(interviewQuestions);
  }, [setQuestions]);

  useEffect(() => {
  setAnswerValue(
    String(getSavedAnswer())
  );
}, [currentQuestionIndex,responses]);

  const currentQuestion = questions[currentQuestionIndex];

  

const getSavedAnswer = () => {
  if (!currentQuestion) return "";

  const [section, key] =
    currentQuestion.field.split(".");

  if (section === "farmer") {
    return (
      responses.farmer[
        key as keyof typeof responses.farmer
      ] ?? ""
    );
  }

  if (section === "farm") {
    return (
      responses.farm[
        key as keyof typeof responses.farm
      ] ?? ""
    );
  }

  if (section.startsWith("blocks[")) {
    const blockIndex = Number(
      section.match(/\d+/)?.[0]
    );

    return (
      responses.blocks?.[blockIndex]?.[
        key as keyof typeof responses.blocks[number]
      ] ?? ""
    );
  }

  return "";
};

const handleNext = () => {
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
  <div className="min-h-screen bg-slate-100 py-8 px-4">
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
          {currentQuestion.question}
        </h2>

      </div>

      {/* Answer Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">
          Your Answer
        </h3>

        <input
          key={currentQuestion.id}
          type="text"
          value={answer}
          onChange={(e) => setAnswerValue(e.target.value)}
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
)};