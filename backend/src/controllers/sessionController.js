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

export const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findOne({
      sessionId,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.status = "completed";

    await session.save();

    res.json({
      message: "Session completed",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to complete session",
    });
  }
};

export const saveAnswer = async (req, res) => {
  try {
    const {
      sessionId,
      questionId,
      answer,
      currentQuestionId,
    } = req.body;

    const session = await InterviewSession.findOne({
      sessionId,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.answers[questionId] = answer;

    session.currentQuestionId = currentQuestionId;

    session.lastSavedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};

export const saveSession = async (req, res) => {
  try {
    const {
      sessionId,
      responses,
      currentQuestionId,
    } = req.body;

    const session =
      await InterviewSession.findOne({
        sessionId,
      });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.responses = responses;

    session.currentQuestionId =
      currentQuestionId;

    session.lastSavedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Draft saved",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save draft",
    });
  }
};