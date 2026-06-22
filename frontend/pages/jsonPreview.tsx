import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInterviewStore } from "../state/interviewStore";
import { completeSession } from "../services/sessionService";

export default function JsonPreview() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { responses, sessionId } = useInterviewStore((state) => ({
    responses: state.responses,
    sessionId: state.sessionId,
  }));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await completeSession(sessionId);
      navigate("/success");
    } catch (error) {
      console.error(error);
      alert("Failed to complete session");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
          <h1 className="text-4xl font-bold">
            JSON Preview
          </h1>

          <p className="text-slate-500 mt-3">
            Review the generated interview data
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 overflow-auto mb-8">
          <pre className="text-green-400 text-sm">
            {JSON.stringify(responses, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex justify-between">
          <button
            onClick={() => navigate("/review")}
            className="
              px-6 py-3
              rounded-xl
              border border-slate-300
            "
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="
              px-6 py-3
              rounded-xl
              bg-blue-600
              text-white
              disabled:bg-slate-400
            "
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}
