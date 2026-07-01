import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../hooks/useLanguage";
import { useInterviewStore } from "../state/interviewStore";
import voiceEngine from "../services/speech/tts";
import { SpeechItem, SpeechPriority } from "../types/speech";

export default function Instructions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { autoReadEnabled, setAutoReadEnabled } = useInterviewStore((state) => ({
    autoReadEnabled: state.autoReadEnabled,
    setAutoReadEnabled: state.setAutoReadEnabled,
  }));

  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    voiceEngine.stop();

    if (!autoReadEnabled) {
      return;
    }

    const steps = t("instructions.steps", {
      returnObjects: true,
    }) as string[];

    const items: SpeechItem[] = [
      {
        text: t("instructions.title"),
        language,
      },
    ];

    for (const step of steps) {
      items.push({
        text: step,
        language,
      });
    }

    items.push(
      {
        text: t("instructions.consentTitle"),
        language,
      },
      {
        text: t("instructions.consentStatement"),
        language,
      },
      {
        text: t("instructions.consentCheckbox"),
        language,
      }
    );

    voiceEngine.playSequence({
      priority: SpeechPriority.AUTO_INSTRUCTIONS,
      items,
    });

    return () => {
      voiceEngine.stop();
    };
  }, [language, autoReadEnabled, t]);

  const steps = t("instructions.steps", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("instructions.title")}
        </h1>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <span>✓</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <button
            type="button"
            onClick={() => setAutoReadEnabled(!autoReadEnabled)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span className="text-sm font-medium text-slate-700">
              {t("instructions.autoRead")}
            </span>

            <span
              className={`
                relative inline-flex h-8 w-16 shrink-0 items-center rounded-full p-1 transition-colors
                ${autoReadEnabled ? "bg-emerald-500" : "bg-rose-500"}
              `}
              aria-hidden="true"
            >
              <span
                className={`
                  inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform
                  ${autoReadEnabled ? "translate-x-8" : "translate-x-0"}
                `}
              />
            </span>
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold mb-3">
            {t("instructions.consentTitle")}
          </h2>

          <p className="text-sm text-slate-700 leading-6 mb-4">
            {t("instructions.consentStatement")}
          </p>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <span className="text-sm text-slate-700">
              {t("instructions.consentCheckbox")}
            </span>
          </label>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              voiceEngine.stop();
              navigate("/");
            }}
            className="
              px-6 py-3
              border border-slate-300
              rounded-xl
              hover:bg-slate-100
            "
          >
            {t("common.back")}
          </button>

          <button
            onClick={() => {
              voiceEngine.stop();
              navigate("/interview");
            }}
            disabled={!consentGiven}
            className={`
              px-6 py-3
              rounded-xl
              font-medium
              transition-colors
              ${
                consentGiven
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            {t("instructions.startInterview")}
          </button>
        </div>
      </div>
    </div>
  );
}
