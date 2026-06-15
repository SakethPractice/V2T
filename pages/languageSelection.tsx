import { useState } from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "en", label: "English" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
];

export default function LanguageSelection() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleContinue = () => {
    // later:
    // setLanguage(selectedLanguage);

    navigate("/instructions");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Farm Onboarding
          </h1>

          <p className="text-slate-500 mt-3">
            Choose your preferred language
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`
                w-full
                p-4
                rounded-xl
                border-2
                text-left
                transition-all

                ${
                  selectedLanguage === language.code
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-400"
                }
              `}
            >
              {language.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-blue-700
            transition
          "
        >
          Continue
        </button>

      </div>
    </div>
  );
}