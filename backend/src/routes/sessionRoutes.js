import express from "express";
import { startSession,completeSession,saveAnswer,saveSession,getSession,updateLanguage } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.post("/complete", completeSession);
router.post("/save-answer", saveAnswer);
router.post("/language", updateLanguage);
router.post("/save",saveSession);
router.get("/:sessionId",getSession);

export default router;
