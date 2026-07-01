import express from "express";
import { tts } from "../controllers/ttsController.js";

const router = express.Router();

router.post("/", tts);

export default router;