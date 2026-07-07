import axios from "axios";
import FormData from "form-data";

import { AI_CONFIG } from "../config/ai.js";

export async function transcribeAudio(
  audioBuffer,
  filename,
  language
) {
  const formData = new FormData();

  formData.append("audio", audioBuffer, filename);

  formData.append("language", language);

  try {
    const response = await axios.post(
      `${AI_CONFIG.whisperUrl}/transcribe`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return {
      transcript: response.data.text,
      language: response.data.language,
    };
  } catch (error) {
    console.error("Whisper Service Error:", error.message);

    throw new Error("Failed to transcribe audio.");
  }
}