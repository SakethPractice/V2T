import { transcribeAudio } from "../services/whisperService.js";
import { createFieldExtractionPrompt } from "../services/promptService.js";
import { extractField } from "../services/ollamaService.js";

export async function processAudioAnswer(req, res) {
  try {
    const { language, targetField, browserTranscript } = req.body;

    if (!language || !targetField) {
      return res.status(400).json({
        success: false,
        message: "language and targetField are required.",
      });
    }

    if (!req.file && !browserTranscript) {
      return res.status(400).json({
        success: false,
        message: "Either audio or browserTranscript is required.",
      });
    }

    const fallbackTranscript =
      typeof browserTranscript === "string"
        ? browserTranscript.trim()
        : "";

    let transcript = "";
    let detectedLanguage = language;
    let fallbackUsed = false;

    if (req.file) {
      try {
        const whisperResult = await transcribeAudio(
          req.file.buffer,
          req.file.originalname,
          language
        );

        transcript = whisperResult.transcript?.trim() || "";
        detectedLanguage = whisperResult.language || language;
      } catch (whisperError) {
        if (fallbackTranscript) {
          transcript = fallbackTranscript;
          fallbackUsed = true;
        } else {
          throw whisperError;
        }
      }
    }

    if (!transcript && fallbackTranscript) {
      transcript = fallbackTranscript;
      fallbackUsed = true;
    }

    const prompt = createFieldExtractionPrompt(targetField, transcript);

    // Step 3: Gemma
    const value = await extractField(prompt);

    return res.status(200).json({
      success: true,
      transcript,
      value,
      language: detectedLanguage,
      field: targetField,
      fallbackUsed,
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