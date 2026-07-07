import axios from "axios";

import { AI_CONFIG } from "../config/ai.js";

export async function extractField(prompt) {
  try {
    const response = await axios.post(
      `${AI_CONFIG.ollamaUrl}/api/generate`,
      {
        model: AI_CONFIG.ollamaModel,
        prompt,
        stream: false,
      }
    );

    return response.data.response.trim();
  } catch (error) {
    console.error("Ollama Service Error:", error.message);

    throw new Error("Failed to extract field using Ollama.");
  }
}