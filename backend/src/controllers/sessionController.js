import { v4 as uuidv4 } from "uuid";
import InterviewSession from "../models/InterviewSession.js";

export const startSession = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const existingSession =
      await InterviewSession.findOne({
        phone,
        status: "in_progress",
      });

    if (existingSession) {
      return res.json({
        resume: true,
        session: existingSession,
      });
    }

    const newSession =
      await InterviewSession.create({
        sessionId: uuidv4(),
        phone,
      });

    return res.status(201).json({
      resume: false,
      session: newSession,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to start session",
    });
  }
};