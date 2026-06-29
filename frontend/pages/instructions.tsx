import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Instructions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [consentGiven, setConsentGiven] = useState(false);

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

        {/* Consent Section */}
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
            onClick={() => navigate("/")}
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
            onClick={() => navigate("/interview")}
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