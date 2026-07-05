import express from "express";
import multer from "multer";

import { processAudioAnswer } from "../controllers/sttController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/process",
  upload.single("audio"),
  processAudioAnswer
);

export default router;