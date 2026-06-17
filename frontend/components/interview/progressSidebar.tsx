import { CheckCircle, Clock3, Circle } from "lucide-react";
import { useInterviewStore } from "../../state/interviewStore";
import {
  getSectionStatuses,
  getCompletionPercentage,
} from "../../utils/progressHelpers";

export default function ProgressSidebar() {
  const { questions, responses, currentQuestionIndex, goToQuestion } =
    useInterviewStore();

  const sectionStatuses = getSectionStatuses(
    questions,
    responses,
    currentQuestionIndex
  );

  const completionPercentage = getCompletionPercentage(
    questions,
    responses
  );

  const handleSectionClick = (sectionIndex: number) => {
    const section = sectionStatuses[sectionIndex];
    if (!section.isDisabled) {
      goToQuestion(section.firstQuestionIndex);
    }
  };

  const getStatusIcon = (status: typeof sectionStatuses[0]["status"]) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle
            size={20}
            className="text-green-600 flex-shrink-0"
          />
        );
      case "current":
        return (
          <Clock3
            size={20}
            className="text-blue-600 animate-spin flex-shrink-0"
          />
        );
      case "notStarted":
        return (
          <Circle
            size={20}
            className="text-slate-300 flex-shrink-0"
          />
        );
      case "disabled":
        return (
          <Circle
            size={20}
            className="text-slate-200 flex-shrink-0"
          />
        );
    }
  };

  const getStatusColor = (status: typeof sectionStatuses[0]["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "current":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "notStarted":
        return "bg-slate-50 border-slate-200 hover:bg-slate-100";
      case "disabled":
        return "bg-slate-50 border-slate-100 cursor-not-allowed opacity-50";
    }
  };

  const getTextColor = (status: typeof sectionStatuses[0]["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-700";
      case "current":
        return "text-blue-700";
      case "notStarted":
        return "text-slate-700";
      case "disabled":
        return "text-slate-500";
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Progress
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm font-medium text-slate-600">
            {completionPercentage}% Complete
          </p>
        </div>

        {/* Section Buttons */}
        <div className="space-y-3">
          {sectionStatuses.map((section, index) => (
            <button
              key={section.section}
              onClick={() => handleSectionClick(index)}
              disabled={section.isDisabled}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                border
                transition-all
                ${getStatusColor(section.status)}
                ${section.isDisabled ? "" : "cursor-pointer"}
              `}
            >
              {getStatusIcon(section.status)}

              <div className="flex-1 text-left">
                <p
                  className={`
                    font-medium
                    ${getTextColor(section.status)}
                  `}
                >
                  {section.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {section.status === "completed" && "✓ Completed"}
                  {section.status === "current" && "In Progress"}
                  {section.status === "notStarted" && "Not Started"}
                  {section.status === "disabled" && "Locked"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📝 Answer all questions in each section to proceed to the
            next phase.
          </p>
        </div>
      </div>
    </aside>
  );
}
