import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, Mic, RotateCcw, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchLocationDetailsByPincode } from "../services/pincodeService";
import { useInterviewStore } from "../state/interviewStore";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../hooks/useTranslation";
import { useVoiceJob } from "../hooks/useVoiceJob";
import { saveSession,getSession } from "../services/sessionService";
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

  const [isMicBlinking, setIsMicBlinking] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPendingNudge, setIsPendingNudge] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];

  const voiceJob = useVoiceJob({
    questionId: currentQuestion?.id ?? "",
    language,
    targetField: currentQuestion?.field ?? "",
  });

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
    // BUG FIX #1: Clear voice job state when moving to next question
    // Prevents extracted value from previous question leaking to current question
    voiceJob.clearRecording();
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

  // BUG FIX #4: Show transcript in input field during recording, not in dummy text box
  useEffect(() => {
    // Only update input with transcript if status is recording AND there's new transcript
    if (voiceJob.state.status === "recording") {
      setAnswerValue(voiceJob.state.browserTranscript || "");
    }
  }, [voiceJob.state.browserTranscript, voiceJob.state.status]);

  // When voiceJob completes extraction, populate input and persist to zustand
  useEffect(() => {
    if (
      voiceJob.state.status === "completed" &&
      voiceJob.state.extractedValue &&
      currentQuestion
    ) {
      let finalValue = String(voiceJob.state.extractedValue);

      // BUG FIX #3: For options questions, try to match the extracted value to an available option
      if (currentQuestion.options && currentQuestion.options.length > 0) {
        const extracted = finalValue.toLowerCase().trim();
        let matchedOption = currentQuestion.options.find((opt) => {
        const optText = (
          typeof opt === "string"
            ? opt
            : opt.en ?? opt
        ).toLowerCase().trim();

        return optText === extracted;
      });

      if (!matchedOption) {
        matchedOption = currentQuestion.options.find((opt) => {
          const optText = (
            typeof opt === "string"
              ? opt
              : opt.en ?? opt
          ).toLowerCase().trim();

          return extracted.includes(optText);
        });
      }
      }

      setAnswerValue(finalValue);
      setAnswer(currentQuestion.section, currentQuestion.field, finalValue);
      voiceJob.clearRecording(); // Clear after applying to prevent leaking to next question
    }
  }, [voiceJob.state.status, voiceJob.state.extractedValue, currentQuestion, setAnswer]);

useEffect(() => {
    if (isHydrating || !currentQuestion) {
      return;
    }

    if (!autoReadEnabled) {
      voiceEngine.stop();
      return;
    }

    voiceEngine.stop();
    setIsMicBlinking(false);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);

    // Play the sequence (question + options)
    voiceEngine.playSequence({
      priority: SpeechPriority.AUTO_QUESTION,
      items: createQuestionSpeechItems(currentQuestion, language),
    }).catch(console.error);

    // Tell our new effect to start watching for the end of speech
    setIsPendingNudge(true);

    return () => {
      voiceEngine.stop();
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    };
  }, [currentQuestion, language, isHydrating, autoReadEnabled]);

  useEffect(() => {
  if (answer.trim()) {
    setIsMicBlinking(false);

    if (nudgeTimer.current) {
      clearTimeout(nudgeTimer.current);
      nudgeTimer.current = null;
    }

    setIsPendingNudge(false);
  }
}, [answer]);

// Start timer ONLY after all speech (including options) has finished
  useEffect(() => {
    // Note: Change "idle" to whatever your app uses when TTS is not active
    // (e.g., "ready", "waiting", or checking !voiceEngine.isSpeaking)
    if (isPendingNudge && voiceJob.state.status === "idle") {

      // Reset the flag so we don't start multiple timers
      setIsPendingNudge(false);

      // Use different idle durations depending on question type:
      // - select questions: 40s
      // - other questions: 30s
      const idleTimeout =
        currentQuestion?.type === "select" ? 40000 : 30000;

      if (nudgeTimer.current) {
        clearTimeout(nudgeTimer.current);
        nudgeTimer.current = null;
      }

      nudgeTimer.current = setTimeout(() => {
        // Only nudge if they haven't started recording or typing
        if (voiceJob.state.status !== "recording" && answer === "") {
          setIsMicBlinking(true);
          void voiceEngine.speak(t("interview.pressToAnswer"), language);
        }
      }, idleTimeout);
    }
  }, [isPendingNudge, voiceJob.state.status, answer, language, t, currentQuestion?.type]);
 
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

    const sanitized = sanitizeAnswer(
      currentQuestion.field,
      event.target.value
    );

    setAnswerValue(sanitized);
    // persist live to zustand so autosave can pick it up
    setAnswer(currentQuestion.section, currentQuestion.field, sanitized);
  };

  const handleRepeatQuestion = () => {
    if (!currentQuestion) return;

    voiceEngine.stop();

    // Ensure the idle nudge flow starts after the repeated question (and options)
    // have finished playing so the idle timer begins at the correct time.
    if (nudgeTimer.current) {
      clearTimeout(nudgeTimer.current);
      nudgeTimer.current = null;
    }
    setIsMicBlinking(false);
    setIsPendingNudge(true);

    voiceEngine.playSequence({
      priority: SpeechPriority.USER_ACTION,
      items: createQuestionSpeechItems(currentQuestion, language),
    });
  };

  const handleReadOptions = () => {
    if (!currentQuestion?.options?.length || isSpeechBusy) {
      return;
    }

    // Start the pending nudge flow so the idle timer will begin
    // after the options have finished being read (20s for select questions).
    if (nudgeTimer.current) {
      clearTimeout(nudgeTimer.current);
      nudgeTimer.current = null;
    }
    setIsMicBlinking(false);
    setIsPendingNudge(true);

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
        type={"text"}
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
    currentQuestion.field === "farmer.pincode" || 
    currentQuestion.field === "farm.pincode"
  ) {
    const locationData = await fetchLocationDetailsByPincode(answer);

    if (locationData) {
      const commonKeys = ["state", "district", "taluk", "village"] as const;

      commonKeys.forEach((key) => {
        setAnswer("farmer", `farmer.${key}`, locationData[key]);
        setAnswer("farm", `farm.${key}`, locationData[key]);
      });

      setAnswer("farmer", "farmer.pincode", answer);
      setAnswer("farm", "farm.pincode", answer);

      setAnswer("farm", "farm.lat", locationData.lat);
      setAnswer("farm", "farm.long", locationData.long);
      setAnswer("farm","farm.village",locationData.village);
      setAnswer("farmer","farmer.village",locationData.village);

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
              voiceStatus={voiceJob.state.status}
              browserTranscript={voiceJob.state.browserTranscript}
              aiTranscript={voiceJob.state.aiTranscript}
              extractedValue={voiceJob.state.extractedValue}
              
              onRecord={voiceJob.startRecording}
              onStop={voiceJob.stopRecording}
              onClearRecording={voiceJob.clearRecording}
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

            {/* BUG FIX #2: For image/photo questions, hide the STT buttons (mic, rerecord, speaker) */}
            {currentQuestion.type !== "image" && (
            <div className="mt-3 flex items-center gap-2">

              {voiceJob.state.status === "recording" ? (
                <button
                  type="button"
                  onClick={voiceJob.stopRecording}
                  className="rounded-lg border p-2 hover:bg-red-50"
                  title="Stop Recording"
                >
                  <Square className="h-5 w-5 text-red-600" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    voiceEngine.stop();
                    setIsMicBlinking(false);

                    if (nudgeTimer.current) {
                      clearTimeout(nudgeTimer.current);
                      nudgeTimer.current = null;
                    }

                    await voiceJob.startRecording();
                  }}
                  disabled={voiceJob.state.status === "processing"}
                  className={`rounded-lg border p-2 transition-colors ${
                    isMicBlinking 
                      ? "animate-border-blink bg-red-50 hover:bg-red-100 text-red-600" 
                      : "hover:bg-blue-50 text-blue-600"
                  } disabled:opacity-50`}
                  title="Start Recording"
                >
                  <Mic className={`h-5 w-5 ${isMicBlinking ? "text-red-600" : "text-blue-600"}`} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  voiceEngine.stop();

                  if (nudgeTimer.current) {
                    clearTimeout(nudgeTimer.current);
                    nudgeTimer.current = null;
                  }

                  setIsPendingNudge(false);
                  setIsMicBlinking(true);

                  setAnswerValue("");
                  voiceJob.clearRecording();

                  void voiceEngine.speak(
                    t("interview.pressToAnswer"),
                    language
                  );
                }}
                disabled={voiceJob.state.status === "recording"}
                className="rounded-lg border p-2 hover:bg-gray-100 disabled:opacity-50"
                title="Clear recording"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                  type="button"
                  onClick={() => {
                    if (voiceEngine.isSpeaking()) {
                      voiceEngine.stop();
                      return;
                    }

                    let textToSpeak =
                      currentAnswer ||
                      (currentQuestion.question[language] ??
                        currentQuestion.question.en);

                    if (!textToSpeak) return;

                    // Start pending nudge so the idle timer will begin after
                    // this manual TTS playback completes (matches repeat/read behavior).
                    if (nudgeTimer.current) {
                      clearTimeout(nudgeTimer.current);
                      nudgeTimer.current = null;
                    }
                    setIsMicBlinking(false);
                    setIsPendingNudge(true);

                    // Force TTS to read digit-by-digit for phone numbers and pincodes
                  if (
                    currentAnswer && 
                    (currentQuestion.field.includes("pincode") || currentQuestion.field.includes("mobile_num"))
                  ) {
                    textToSpeak = textToSpeak.split('').join(' ');
                  }

                    void voiceEngine.speak(String(textToSpeak), language);
                  }}
                  disabled={!currentAnswer.trim()}
                  className="rounded-lg border p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Listen"
                >
                <Volume2 className="h-5 w-5" />
              </button>

            </div>
            )}

            {/* BUG FIX #4: Hide dummy transcript box; transcript now shows in input field during recording */}
            {voiceJob.state.status === "processing" && (
              <div className="mt-2 text-sm text-gray-500">
                Processing...
              </div>
            )}

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
                setError("");
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
                setError("");
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
