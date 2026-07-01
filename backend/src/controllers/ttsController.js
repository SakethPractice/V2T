import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

import { getVoice, isSupportedLanguage, } from "../tts/voiceMap.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const tts = (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || !language) {
      return res.status(400).json({
        success: false,
        message: "Text and language are required.",
      });
    }

    if (text.length > 5000) {
    return res.status(400).json({
        success: false,
        message: "Text exceeds maximum length (5000 characters)",
    });
    }

    if (!isSupportedLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language.",
      });
    }

    const voice = getVoice(language);

    const pythonScript = path.join(
      __dirname,
      "../tts/edgeTTS.py"
    );

    const python = spawn("python", [
      pythonScript,
      "--voice",
      voice,
      "--text",
      text,
    ]);

    const timeout = setTimeout(() => {
        python.kill();

        if (!res.headersSent) {
            res.status(504).json({
            success: false,
            message: "TTS request timed out",
            });
        }
        }, 30000);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    python.stdout.pipe(res);

    python.stderr.on("data", (data) => {
      console.error("Edge TTS Error:");
      console.error(data.toString());
    });

    python.on("error", (err) => {
      console.error(err);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to start Edge TTS.",
        });
      }
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Edge TTS exited with code ${code}`);
      }
    });

  } catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};