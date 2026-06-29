import mongoose from "mongoose";

const InterviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      index: true,
    },

    currentQuestionId: {
      type: String,
      default: "",
    },
    
    language: {
      type: String,
      default: "en",
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    responses: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        farmer: {},
        farm: {},
        blocks: [], // ← was "block", now standardized to "blocks"
      },
    },

    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "InterviewSession",
  InterviewSessionSchema
);