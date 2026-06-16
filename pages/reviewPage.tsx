import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../state/interviewStore";
import ReviewCard from "../components/review/reviewCard";
import EditableReviewRow from "../components/review/editableRow";

export default function ReviewPage() {
  const { responses, questions } = useInterviewStore((state) => ({
    responses: state.responses,
    questions: state.questions,
  }));

  const navigate = useNavigate();

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
            value={responses.farmer.name}
            section="farmer"
            field="farmer.name"
            question={getQuestionForField("farmer.name")}
          />

          <EditableReviewRow
            label="Date of Birth"
            value={responses.farmer.DOB}
            section="farmer"
            field="farmer.DOB"
            question={getQuestionForField("farmer.DOB")}
          />

          <EditableReviewRow
            label="Gender"
            value={responses.farmer.gender}
            section="farmer"
            field="farmer.gender"
            question={getQuestionForField("farmer.gender")}
          />

          <EditableReviewRow
            label="Mobile Number"
            value={responses.farmer.mobile_num}
            section="farmer"
            field="farmer.mobile_num"
            question={getQuestionForField("farmer.mobile_num")}
          />

          <EditableReviewRow
            label="Village"
            value={responses.farmer.village}
            section="farmer"
            field="farmer.village"
            question={getQuestionForField("farmer.village")}
          />

          <EditableReviewRow
            label="Pincode"
            value={responses.farmer.pincode}
            section="farmer"
            field="farmer.pincode"
            question={getQuestionForField("farmer.pincode")}
          />
        </ReviewCard>

        {/* Farm Details */}
        <ReviewCard title="Farm Details">
          <EditableReviewRow
            label="Farm Name"
            value={responses.farm.name}
            section="farm"
            field="farm.name"
            question={getQuestionForField("farm.name")}
          />

          <EditableReviewRow
            label="Address"
            value={responses.farm.address}
            section="farm"
            field="farm.address"
            question={getQuestionForField("farm.address")}
          />

          <EditableReviewRow
            label="Total Area"
            value={responses.farm.Tarea}
            section="farm"
            field="farm.Tarea"
            question={getQuestionForField("farm.Tarea")}
          />

          <EditableReviewRow
            label="Used Area"
            value={responses.farm.Uarea}
            section="farm"
            field="farm.Uarea"
            question={getQuestionForField("farm.Uarea")}
          />

          <EditableReviewRow
            label="Unit"
            value={responses.farm.unit}
            section="farm"
            field="farm.unit"
            question={getQuestionForField("farm.unit")}
          />

          <EditableReviewRow
            label="Farm Type"
            value={responses.farm.type}
            section="farm"
            field="farm.type"
            question={getQuestionForField("farm.type")}
          />

          <EditableReviewRow
            label="Water Source"
            value={responses.farm.watersrc}
            section="farm"
            field="farm.watersrc"
            question={getQuestionForField("farm.watersrc")}
          />

          <EditableReviewRow
            label="Soil Type"
            value={responses.farm.soil}
            section="farm"
            field="farm.soil"
            question={getQuestionForField("farm.soil")}
          />

          <EditableReviewRow
            label="Block Count"
            value={responses.farm.blockCount}
            section="farm"
            field="farm.blockCount"
            question={getQuestionForField("farm.blockCount")}
          />
        </ReviewCard>

{responses.blocks.map((block, index) => (
  <ReviewCard
    key={index}
    title={`Block ${index + 1}`}
  >
    <EditableReviewRow
      label="Name"
      value={block.name}
      section="block"
      field={`block${index}.name`}
      question={getQuestionForField(`block${index}.name`)}
    />

    <EditableReviewRow
      label="Area"
      value={block.area}
      section="block"
      field={`block${index}.area`}
      question={getQuestionForField(`block${index}.area`)}
    />

    <EditableReviewRow
      label="Farming Type"
      value={block.farmingType}
      section="block"
      field={`block${index}.farmingType`}
      question={getQuestionForField(`block${index}.farmingType`)}
    />

    <EditableReviewRow
      label="Water Source"
      value={block.watersrc}
      section="block"
      field={`block${index}.watersrc`}
      question={getQuestionForField(`block${index}.watersrc`)}
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
            justify-between
          "
        >

          <button
            onClick={() => navigate("/preview")}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}