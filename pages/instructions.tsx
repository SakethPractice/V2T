import { useNavigate } from "react-router-dom";

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Instructions
        </h1>

        <div className="space-y-4 mb-8">

          <div className="flex gap-3">
            <span>✓</span>
            <p>Answer all questions carefully.</p>
          </div>

          <div className="flex gap-3">
            <span>✓</span>
            <p>You may answer using voice or manual input.</p>
          </div>

          <div className="flex gap-3">
            <span>✓</span>
            <p>You can review your answers before submission.</p>
          </div>

          <div className="flex gap-3">
            <span>✓</span>
            <p>Ensure all information provided is accurate.</p>
          </div>

          <div className="flex gap-3">
            <span>✓</span>
            <p>Questions can be replayed during the interview.</p>
          </div>

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
            Back
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
            Start Interview
          </button>

        </div>

      </div>
    </div>
  );
}