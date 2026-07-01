import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../state/interviewStore";
import ReviewCard from "../components/review/reviewCard";
import EditableReviewRow from "../components/review/editableRow";
import { saveSession, submitFarmer } from "../services/sessionService";

export default function ReviewPage() {
  const { responses, questions, sessionId } = useInterviewStore((state) => ({
    responses: state.responses,
    questions: state.questions,
    sessionId: state.sessionId,
  }));

  const navigate = useNavigate();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const handleRowSave = () => undefined;

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await submitFarmer(sessionId);
      navigate("/success", {
        state: { submissionId: result.farmerId },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit farmer");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
      saveSession(sessionId, responses, "review");
    }, 500);

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [responses, sessionId]);

  const getQuestionForField = (field: string) => {
    const normalizedField = field.replace(
      /^block(\d+)\./,
      (_, index) => `blocks[${index}].`
    );

    return questions.find(
      (question) => question.field === normalizedField
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            p-8
            mb-8
          "
        >
          <h1 className="text-4xl font-bold text-slate-900">
            Review Your Interview
          </h1>

          <p className="text-slate-500 mt-3">
            Verify your information before submission
          </p>
        </div>

        {/* Farmer Details */}
        <ReviewCard title="Farmer Details">
          <EditableReviewRow
            label="Name"
            value={responses?.farmer?.name ?? ""}
            section="farmer"
            field="farmer.name"
            question={getQuestionForField("farmer.name")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Age"
            value={responses?.farmer?.age ?? ""}
            section="farmer"
            field="farmer.age"
            question={getQuestionForField("farmer.age")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Gender"
            value={responses?.farmer?.gender ?? ""}
            section="farmer"
            field="farmer.gender"
            question={getQuestionForField("farmer.gender")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Mobile Number"
            value={responses?.farmer?.mobile_num ?? ""}
            section="farmer"
            field="farmer.mobile_num"
            question={getQuestionForField("farmer.mobile_num")}
            editable={false}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Village"
            value={responses?.farmer?.village ?? ""}
            section="farmer"
            field="farmer.village"
            question={getQuestionForField("farmer.village")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Pincode"
            value={responses?.farmer?.pincode ?? ""}
            section="farmer"
            field="farmer.pincode"
            question={getQuestionForField("farmer.pincode")}
            onSave={handleRowSave}
          />
        </ReviewCard>

        {/* Farm Details */}
        <ReviewCard title="Farm Details">
          <EditableReviewRow
            label="Farm Name"
            value={responses?.farm?.name ?? ""}
            section="farm"
            field="farm.name"
            question={getQuestionForField("farm.name")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Address"
            value={responses?.farm?.address ?? ""}
            section="farm"
            field="farm.address"
            question={getQuestionForField("farm.address")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Total Area"
            value={responses?.farm?.Tarea ?? ""}
            section="farm"
            field="farm.Tarea"
            question={getQuestionForField("farm.Tarea")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Used Area"
            value={responses?.farm?.Uarea ?? ""}
            section="farm"
            field="farm.Uarea"
            question={getQuestionForField("farm.Uarea")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Farm Type"
            value={responses?.farm?.type ?? ""}
            section="farm"
            field="farm.type"
            question={getQuestionForField("farm.type")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Water Source"
            value={responses?.farm?.watersrc ?? ""}
            section="farm"
            field="farm.watersrc"
            question={getQuestionForField("farm.watersrc")}
            onSave={handleRowSave}
          />

          <EditableReviewRow
            label="Block Count"
            value={responses?.farm?.blockCount ?? ""}
            section="farm"
            field="farm.blockCount"
            question={getQuestionForField("farm.blockCount")}
            onSave={handleRowSave}
          />
        </ReviewCard>

{(responses?.blocks ?? []).map((block, index) => (
  <ReviewCard
    key={index}
    title={`Block ${index + 1}`}
  >
    <EditableReviewRow
      label="Name"
      value={block?.name ?? ""}
      section="block"
      field={`block${index}.name`}
      question={getQuestionForField(`block${index}.name`)}
      onSave={handleRowSave}
    />

    <EditableReviewRow
      label="Area"
      value={block?.area ?? ""}
      section="block"
      field={`block${index}.area`}
      question={getQuestionForField(`block${index}.area`)}
      onSave={handleRowSave}
    />

    <EditableReviewRow
      label="Farming Type"
      value={block?.farmingType ?? ""}
      section="block"
      field={`block${index}.farmingType`}
      question={getQuestionForField(`block${index}.farmingType`)}
      onSave={handleRowSave}
    />

    <EditableReviewRow
      label="Soil Type"
      value={block?.soil ?? ""}
      section="block"
      field={`block${index}.soil`}
      question={getQuestionForField(`block${index}.soil`)}
      onSave={handleRowSave}
    />

    <EditableReviewRow
      label="Water Source"
      value={block?.watersrc ?? ""}
      section="block"
      field={`block${index}.watersrc`}
      question={getQuestionForField(`block${index}.watersrc`)}
      onSave={handleRowSave}
    />
  </ReviewCard>
))}

        {/* Navigation */}
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            p-5
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:justify-between
            sm:items-center
          "
        >
          
          <button
            onClick={() => navigate("/interview")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors sm:w-auto"
          >
            ← Back to Onboarding
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="
              w-full
              sm:w-auto
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-medium
              hover:bg-blue-700
              disabled:bg-slate-400
              transition
            "
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}
