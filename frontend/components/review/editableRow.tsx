import { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Question } from "../../types/questions";
import { sanitizeAnswer, validateAnswer } from "../../utils/validator";
import { useInterviewStore } from "../../state/interviewStore";

interface EditableReviewRowProps {
  label: string;
  value?: string | number;

  section: "farmer" | "farm" | "block";

  field: string;

  question?: Question;
  onSave?: () => void;
}

export default function EditableReviewRow({
  label,
  value,
  section,
  field,
  question,
  onSave,
}: EditableReviewRowProps) {
  const setAnswer = useInterviewStore(
    (state) => state.setAnswer
  );

  const [isEditing, setIsEditing] = useState(false);

  const [editValue, setEditValue] = useState(
    value?.toString() ?? ""
  );

  const [error, setError] =
  useState("");

  useEffect(() => {
    if (!isEditing) {
      setEditValue(value?.toString() ?? "");
    }
  }, [isEditing, value]);

  const handleSave = () => {
    const validationError = question
      ? validateAnswer(question, editValue)
      : null;

    if (validationError) {
      setError(validationError);
      return;
    }

    setAnswer(
      section,
      field,
      editValue
    );

    onSave?.();
    setError("");
    setIsEditing(false);
  };

  const handleInputChange = (rawValue: string) => {
    const sanitized = question
      ? sanitizeAnswer(question.field, rawValue)
      : rawValue;

    setEditValue(sanitized);

    if (error) {
      setError("");
    }
  };

  const handleCancel = () => {
    setEditValue(
      value?.toString() ?? ""
    );

    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-slate-100">

      <span className="text-slate-500">
        {label}
      </span>

      {isEditing ? (
        <>
          {question?.type === "select" && question.options ? (
            <select
              value={editValue}
              onChange={(e) =>
                handleInputChange(e.target.value)
              }
              className="
                border
                border-slate-300
                rounded-lg
                px-3
                py-2
                w-full
              "
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={
                question?.type === "number"
                  ? "number"
                  : "text"
              }
              value={editValue}
              onChange={(e) =>
                handleInputChange(e.target.value)
              }
              inputMode={
                question?.type === "date"
                  ? "numeric"
                  : question?.type === "number"
                  ? "numeric"
                  : "text"
              }
              maxLength={
                question?.type === "date"
                  ? 10
                  : question?.maxLength
              }
              min={
                question?.type === "number"
                  ? question.min
                  : undefined
              }
              max={
                question?.type === "number"
                  ? question.max
                  : undefined
              }
              className="
                border
                border-slate-300
                rounded-lg
                px-3
                py-2
                w-full
              "
            />
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">

            <button
              onClick={handleSave}
              className="text-green-600"
            >
              <Check size={18} />
            </button>

            <button
              onClick={handleCancel}
              className="text-red-600"
            >
              <X size={18} />
            </button>

          </div>
        </>
      ) : (
        <>
          <span className="text-right font-medium text-slate-800">
            {value ?? "-"}
          </span>

          <button
            onClick={() => setIsEditing(true)}
            className="
              flex
              justify-end
              text-slate-500
              hover:text-slate-800
            "
          >
            <Pencil size={18} />
          </button>
        </>
      )}

    </div>
  );
}
