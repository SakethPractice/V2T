import { useNavigate } from "react-router-dom";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10">

        <div className="flex flex-col items-center text-center">

          <CheckCircle2
            size={96}
            className="text-green-600 mb-6"
          />

          <h1 className="text-3xl font-bold text-slate-800">
            Interview Submitted
          </h1>

          <p className="text-slate-500 mt-3 max-w-sm">
            Your interview has been successfully completed and saved.
          </p>

          <div className="w-full mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">
              Reference ID
            </p>

            <p className="text-lg font-semibold text-slate-800 mt-1">
              INT-2025-001
            </p>
          </div>

          <div className="w-full mt-8 space-y-3">

            <button
              onClick={() => navigate("/")}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                text-white
                py-3
                rounded-xl
                font-medium
                hover:bg-blue-700
                transition
              "
            >
              <RotateCcw size={18} />
              Start New Interview
            </button>


          </div>

        </div>

      </div>
    </div>
  );
}