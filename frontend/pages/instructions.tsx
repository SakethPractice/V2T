import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Instructions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            className="
              px-6 py-3
              bg-blue-600
              text-white
              rounded-xl
              hover:bg-blue-700
            "
          >
            {t("instructions.startInterview")}
          </button>
        </div>
      </div>
    </div>
  );
}