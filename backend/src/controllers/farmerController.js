import Farmer from "../models/Farmer.js";
import InterviewSession from "../models/InterviewSession.js";

/**
 * POST /api/farmers/submit
 *
 * Flow:
 *   1. Receive sessionId
 *   2. Find the InterviewSession
 *   3. Extract responses (farmer, farm, blocks)
 *   4. Create Farmer document
 *   5. Mark session as completed
 *   6. Return success
 */
export const submitFarmer = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    // Step 1 — Find the session
    const session = await InterviewSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status === "completed") {
      return res.status(409).json({
        success: false,
        message: "Session already submitted",
      });
    }

    // Step 2 — Extract responses
    const { farmer = {}, farm = {}, blocks = [] } =
      session.responses ?? {};

    // Step 3 — Create Farmer document
    // If the phone was already submitted once (edge case: double-tap),
    // return the existing farmer record instead of throwing a duplicate error.
    let farmerDoc = await Farmer.findOne({ phone: session.phone });

    if (!farmerDoc) {
      farmerDoc = await Farmer.create({
        phone: session.phone,
        farmer,
        farm,
        blocks,
        submittedAt: new Date(),
      });
    }

    // Step 4 — Mark session completed
    session.status = "completed";
    await session.save();

    return res.status(201).json({
      success: true,
      message: "Farmer submitted successfully",
      farmerId: farmerDoc._id,
    });
  } catch (error) {
    console.error("submitFarmer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit farmer",
    });
  }
};