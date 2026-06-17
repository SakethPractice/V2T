import express from "express";
import { startSession,completeSession,saveAnswer,saveSession } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.post("/complete", completeSession);
router.post("/save-answer", saveAnswer);
router.post("/save",saveSession);

export default router;