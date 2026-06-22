import express from "express";
import { submitFarmer } from "../controllers/farmerController.js";

const router = express.Router();

// POST /api/farmers/submit
router.post("/submit", submitFarmer);

export default router;