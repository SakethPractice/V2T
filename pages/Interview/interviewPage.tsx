import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { initializeInterview } from "../../question-engine/engine/interviewEngine";

import { useInterviewStore } from "../../state/interviewStore";

import { addBlockQuestions } from "../../question-engine/engine/interviewEngine";

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
    <div>
      <h2>
        Question {currentQuestionIndex + 1} of {questions.length}
      </h2>

      <h3>{currentQuestion.question}</h3>

      <input
        key={currentQuestion.id}
        type="text"
        value={answer}
        onChange={(e) => setAnswerValue(e.target.value)}
      />

      <div>
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button onClick={handleNext}>
  Next
</button>
      </div>
    </div>
  );
}
