import mongoose from "mongoose";

/**
 * Farmer Model
 *
 * Stores ONLY the final submitted onboarding data.
 * Session metadata (sessionId, status, currentQuestionId, lastSavedAt)
 * lives exclusively in InterviewSession — never duplicated here.
 */
const FarmerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    farmer: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    farm: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    blocks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model("Farmer", FarmerSchema);