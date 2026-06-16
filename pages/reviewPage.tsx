import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../state/interviewStore";

import ReviewCard from "../components/review/reviewCard";
import ReviewRow from "../components/review/reviewRow";

export default function ReviewPage() {
  const responses = useInterviewStore(
    (state) => state.responses
  );

  const navigate = useNavigate();

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
          <ReviewRow
            label="Name"
            value={responses.farmer.name}
          />

          <ReviewRow
            label="Date of Birth"
            value={responses.farmer.DOB}
          />

          <ReviewRow
            label="Gender"
            value={responses.farmer.gender}
          />

          <ReviewRow
            label="Mobile Number"
            value={responses.farmer.mobile_num}
          />

          <ReviewRow
            label="Village"
            value={responses.farmer.village}
          />

          <ReviewRow
            label="Pincode"
            value={responses.farmer.pincode}
          />
        </ReviewCard>

        {/* Farm Details */}
        <ReviewCard title="Farm Details">
          <ReviewRow
            label="Farm Name"
            value={responses.farm.name}
          />

          <ReviewRow
            label="Address"
            value={responses.farm.address}
          />

          <ReviewRow
            label="Total Area"
            value={responses.farm.Tarea}
          />

          <ReviewRow
            label="Used Area"
            value={responses.farm.Uarea}
          />

          <ReviewRow
            label="Unit"
            value={responses.farm.unit}
          />

          <ReviewRow
            label="Farm Type"
            value={responses.farm.type}
          />

          <ReviewRow
            label="Water Source"
            value={responses.farm.watersrc}
          />

          <ReviewRow
            label="Soil Type"
            value={responses.farm.soil}
          />

          <ReviewRow
            label="Block Count"
            value={responses.farm.blockCount}
          />
        </ReviewCard>

        {/* Blocks */}
        {responses.blocks.map((block, index) => (
  <ReviewCard
    key={index}
    title={`Block ${index + 1}`}
  >
    <ReviewRow
      label="Name"
      value={block.name}
    />

    <ReviewRow
      label="Area"
      value={block.area}
    />

    <ReviewRow
      label="Farming Type"
      value={block.farmingType}
    />

    <ReviewRow
      label="Water Source"
      value={block.watersrc}
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