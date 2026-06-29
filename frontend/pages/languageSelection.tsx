import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInterviewStore } from "../state/interviewStore";
import { useLanguage } from "../hooks/useLanguage";
import { LANGUAGE_OPTIONS } from "../constants/languageSelect";
import { updateSessionLanguage } from "../services/sessionService";
import type { LanguageCode } from "../types/language";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [savingLanguage, setSavingLanguage] = useState(false);
  const resumeQuestionId = useInterviewStore(
    (state) => state.resumeQuestionId
  );
  const sessionId = useInterviewStore((state) => state.sessionId);

  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = async (langCode: LanguageCode) => {
    const activeSessionId = sessionId || localStorage.getItem("sessionId") || "";

    if (!activeSessionId) {
      alert("Session not found. Please restart the interview.");
      return;
    }

    try {
      setSavingLanguage(true);
      await updateSessionLanguage(activeSessionId, langCode);
      setLanguage(langCode);
    } catch (error) {
      console.error(error);
      alert("Failed to save language. Please try again.");
    } finally {
      setSavingLanguage(false);
    }
  };

  const handleContinue = () => {
    navigate(
      resumeQuestionId
        ? "/interview"
        : "/instructions"
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Farmer Onboarding
          </h1>

          <p className="text-slate-500 mt-3">
            Choose your preferred language
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              disabled={savingLanguage}
              className={`
                w-full
                p-4
                rounded-xl
                border-2
                text-left
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed

                ${
                  language === lang.code
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-400"
                }
              `}
            >
              <div>
                <p className="font-medium">
                  {lang.nativeName}
                </p>

                <p className="text-sm text-slate-500">
                  {lang.englishName}
                </p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={savingLanguage}
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-blue-700
            transition
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}
