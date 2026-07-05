export const AI_CONFIG = {
  whisperUrl:
    process.env.WHISPER_URL || "http://127.0.0.1:8000",

  ollamaUrl:
    process.env.OLLAMA_URL || "http://localhost:11434",

  ollamaModel: 
    process.env.OLLAMA_MODEL || "gemma3:4b",
};