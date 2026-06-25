import { useTranslation } from "../../hooks/useTranslation";

type QuestionCardProps = {
  questionNumber: number;
  totalQuestions: number;
  section: string;
  question: string;
  onRepeat?: () => void;
};

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  section,
  question,
  onRepeat,
}: QuestionCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-500">
          {t("common.questionOf", {
            current: questionNumber,
            total: totalQuestions,
          })}
        </span>

        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {section}
        </span>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        {question}
      </h2>

      <button
        onClick={onRepeat}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        🔊 {t("interview.repeatQuestion")}
      </button>
    </div>
  );
}