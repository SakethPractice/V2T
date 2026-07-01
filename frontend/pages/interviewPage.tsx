import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPincode } from "../services/pincodeService";
import { useInterviewStore } from "../state/interviewStore";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../hooks/useTranslation";
import { saveSession } from "../services/sessionService";
import { getSession } from "../services/sessionService";
import { addBlockQuestions } from "../question-engine/engine/interviewEngine";
import { hydrateInterviewSession } from "../utils/sessionHydration";
import voiceEngine from "../services/speech/tts";
import { SpeechPriority } from "../types/speech";
import {
  createQuestionOptionSpeechItems,
  createQuestionSpeechItems,
} from "../services/speech/questionSpeech";
import QuestionCard from "../components/interview/questionCard";
import OptionButtons from "../components/interview/optionButtons";

import {
  DATE_MASK_MAX_LENGTH,
  sanitizeAnswer,
  validateAnswer,
} from "../utils/validator";

import ProgressSidebar from "../components/interview/progressSidebar";

export default function InterviewPage() {

  const navigate = useNavigate();

  const { language } = useLanguage();
  const { t } = useTranslation();

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
    autoReadEnabled,
  } = useInterviewStore();

  const [answer, setAnswerValue] = useState("");

  const [error, setError] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSpeechBusy, setIsSpeechBusy] = useState(
    voiceEngine.isSpeaking()
  );

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

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

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      const savedSessionId = localStorage.getItem("sessionId");

      if (!savedSessionId) {
        setIsHydrating(false);
        return;
      }

      if (sessionId === savedSessionId && questions.length > 0) {
        setIsHydrating(false);
        return;
      }

      try {
        const data = await getSession(savedSessionId);

        if (cancelled) return;

        const { questions: restoredQuestions, resumeQuestionId } =
          hydrateInterviewSession(data.session);

        setQuestions(restoredQuestions);

        if (resumeQuestionId) {
          const index = restoredQuestions.findIndex(
            (q) => q.field === resumeQuestionId
          );

          if (index !== -1) {
            goToQuestion(index);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [goToQuestion, questions.length, sessionId, setQuestions]);

  useEffect(() => {
    setAnswerValue(
      String(getSavedAnswer())
    );
  }, [currentQuestionIndex, responses]);

  useEffect(() => {
    const syncSpeechState = () => {
      setIsSpeechBusy(voiceEngine.isSpeaking());
    };

    syncSpeechState();

    const interval = setInterval(syncSpeechState, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

useEffect(() => {
  if (isHydrating || !currentQuestion) {
    return;
  }

  if (!autoReadEnabled) {
    voiceEngine.stop();
    return;
  }

  voiceEngine.stop();

  voiceEngine.playSequence({
    priority: SpeechPriority.AUTO_QUESTION,
    items: createQuestionSpeechItems(currentQuestion, language),
  });

  return () => {
    voiceEngine.stop();
  };
}, [currentQuestion, language, isHydrating, autoReadEnabled]);
 
  // Autosave: fires whenever responses or currentQuestionIndex change.
  // Debounced by 1000ms so rapid typing doesn't flood the API.
  // Guards: sessionId must exist, questions must be loaded,
  // currentQuestion must resolve — prevents saves during initialization.
  useEffect(() => {
    if (
      isHydrating ||
      !sessionId ||
      !currentQuestion ||
      questions.length === 0
    ) return;
 
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
 
    autosaveTimer.current = setTimeout(() => {
      saveSession(
        sessionId,
        responses,
        currentQuestion.field,
        language,
      );
    }, 1000);
 
    // Cancel any pending save if the component unmounts mid-debounce.
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [responses, currentQuestionIndex, currentQuestion?.field, language, isHydrating, sessionId, questions.length]);
 

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

  const handleRepeatQuestion = () => {
    if (!currentQuestion) return;

    voiceEngine.stop();

    voiceEngine.playSequence({
      priority: SpeechPriority.USER_ACTION,
      items: createQuestionSpeechItems(currentQuestion, language),
    });
  };

  const handleReadOptions = () => {
    if (!currentQuestion?.options?.length || isSpeechBusy) {
      return;
    }

    void voiceEngine.playSequence({
      priority: SpeechPriority.USER_ACTION,
      items: createQuestionOptionSpeechItems(
        currentQuestion,
        language
      ),
    });
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
      return (
        <OptionButtons
          name={currentQuestion.id}
          options={currentQuestion.options}
          value={currentAnswer}
          onChange={setAnswerValue}
          className={isGenderQuestion ? "sm:grid-cols-3" : "sm:grid-cols-2"}
        />
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
              {t("interview.selectedImage", {
                fileName: currentAnswer,
              })}
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
          currentQuestion.placeholder?.[language] ??
          placeholderMap[currentQuestion.field] ??
          t("interview.typeAnswer")
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

  if (isHydrating) {
    return <div>{t("common.loading")}</div>;
  }

  if (!currentQuestion) {
    return <div>No active interview session found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Main Content */}
      <div className="flex-1 py-8 px-4 pb-32 overflow-y-auto md:pb-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold">
              {t("language.title")}
            </h1>

            <p className="text-slate-500 mt-2">
              {t("interview.questionOf", {
                current: currentQuestionIndex + 1,
                total: questions.length,
              })}
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
          <div className="mb-6">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              section={t(`sections.${currentQuestion.section}`)}
              question={
                currentQuestion.question[language] ??
                currentQuestion.question.en
              }
              onRepeat={handleRepeatQuestion}
            />
          </div>

          {/* Answer Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">
              {t("interview.answerLabel")}
            </h3>

            {currentQuestion.options?.length ? (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleReadOptions}
                  disabled={isSpeechBusy}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span aria-hidden="true">🔊</span>
                  {t("interview.readOptions")}
                </button>
              </div>
            ) : null}

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
              onClick={() => {
                voiceEngine.stop();
                previousQuestion();
              }}
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
              {t("common.previous")}
            </button>

            <button
              onClick={() => {
                voiceEngine.stop();
                handleNext();
              }}
              className="
                px-6 py-3
                bg-blue-600
                text-white
                rounded-xl
                hover:bg-blue-700
              "
            >
              {t("common.next")}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            onClick={async () => {
              if (!currentQuestion || !sessionId) {
                return;
              }

              try {
                await saveSession(
                  sessionId,
                  responses,
                  currentQuestion.field,
                  language,
                );

                alert("Draft saved successfully!");
              } catch (error) {
                console.error(error);
                alert("Failed to save draft.");
              }
            }}
            disabled={!sessionId}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("common.save")}
          </button>

          <button
            onClick={() => navigate("/review")}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {t("common.review")}
          </button>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="hidden md:block">
        <ProgressSidebar />
      </div>
    </div>
  );
};
