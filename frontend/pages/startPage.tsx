import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startSession } from "../services/sessionService";
import { useInterviewStore } from "../state/interviewStore";
import { hydrateInterviewSession } from "../utils/sessionHydration";

export default function StartPage() {
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {

    if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }
  try {
    setLoading(true);

    const result = await startSession(phone);

    const store = useInterviewStore.getState();
    store.resetInterview();
    localStorage.setItem("sessionId", result.session.sessionId);

    if (result.resume) {
      const { questions, resumeQuestionId } = hydrateInterviewSession(
        result.session
      );

      store.setQuestions(questions);

      if (resumeQuestionId) {
        const resumeIndex = questions.findIndex(
          (question) => question.field === resumeQuestionId
        );

        if (resumeIndex !== -1) {
          store.goToQuestion(resumeIndex);
        }
      }

      setLoading(false);
      navigate("/interview");
      return;
    }

    // Fresh session: keep the typed phone locally until language is chosen.
    store.setSessionId(result.session.sessionId);
    store.setPhone(phone);

    setLoading(false);
    navigate("/language");
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-2">
        Farmer Onboarding
      </h1>

      <p className="text-gray-600 text-center mb-6">
        Enter your mobile number to continue
      </p>

      <input
        type="tel"
        maxLength={10}
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value.replace(/\D/g, "")
          )
        }
        placeholder="Mobile Number"
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={handleContinue}
        disabled={loading || !/^\d{10}$/.test(phone)}
        className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg disabled:bg-gray-300"
      >
        {loading ? "Loading..." : "Continue"}
      </button>
    </div>
  </div>
);
}
