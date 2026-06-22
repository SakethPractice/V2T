import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startSession } from "../services/sessionService";
import { useInterviewStore } from "../state/interviewStore";

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

    store.setSessionId(
      result.session.sessionId
    );

    if (result.resume) {
      store.setResponses(
        result.session.responses
      );

      // Restore phone from the saved session so the
      // mobile_num question is pre-filled on draft resume.
      store.setPhone(
        result.session.phone
      );

      // Tell the interview page which question to jump to.
      store.setResumeQuestionId(
        result.session.currentQuestionId
      );

      setLoading(false);
      navigate("/interview");
      return;
    } else {
      // Fresh session — store the phone the user just typed.
      store.setPhone(phone);
    }

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
