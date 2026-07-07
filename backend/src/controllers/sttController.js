import { transcribeAudio } from "../services/whisperService.js";
import { createFieldExtractionPrompt } from "../services/promptService.js";
import { extractField } from "../services/ollamaService.js";

export async function processAudioAnswer(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    const { language, targetField } = req.body;

    if (!language || !targetField) {
      return res.status(400).json({
        success: false,
        message: "language and targetField are required.",
      });
    }

    // Step 1: Whisper
    const { transcript, language: detectedLanguage } =
      await transcribeAudio(
        req.file.buffer,
        req.file.originalname,
        language
      );

    // Step 2: Prompt
    const prompt = createFieldExtractionPrompt(
      targetField,
      transcript
    );

    // Step 3: Gemma
    const value = await extractField(prompt);

    return res.status(200).json({
      success: true,
      transcript,
      value,
      language: detectedLanguage,
      field: targetField,
    });
  } catch (error) {
    console.error("STT Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process audio.",
      error: error.message,
    });
  }
}