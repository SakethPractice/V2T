const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface SynthesizeRequest {
  text: string;
  language: string;
  signal?: AbortSignal;
}

export async function synthesizeSpeech({
  text,
  language,
  signal,
}: SynthesizeRequest): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/tts`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      text,
      language,
    }),
  });

  if (!response.ok) {
    let message = "Speech generation failed";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.blob();
}