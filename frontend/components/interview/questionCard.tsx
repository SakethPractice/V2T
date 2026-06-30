import { useTranslation } from "../../hooks/useTranslation";
import { Volume2 } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-500">
          {t("interview.questionOf", {
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
        className="
          mt-4
          self-end
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-blue-50
          px-4
          py-2
          text-sm
          font-medium
          text-blue-700
          transition-colors
          hover:bg-blue-100
          hover:text-blue-800
        "
      >
        <Volume2 size={16} />
        {t("interview.repeatQuestion")}
      </button>
    </div>
  );
}
