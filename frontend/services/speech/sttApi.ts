export interface ProcessAudioRequest {
  audioBlob?: Blob;
  browserTranscript?: string;
  language: string;
  targetField: string;
}

export interface ProcessAudioResponse {
  success: boolean;
  transcript: string;
  value: string;
  language: string;
  field: string;
  message?: string;
  error?: string;
}

const STT_api = import.meta.env.VITE_STT_API_URL;

export async function uploadAudioForExtraction({
  audioBlob,
  browserTranscript,
  language,
  targetField,
}: ProcessAudioRequest): Promise<ProcessAudioResponse> {
  const formData = new FormData();

  if (audioBlob) {
    formData.append("audio", audioBlob, "recording.webm");
  }

  if (browserTranscript) {
    formData.append("browserTranscript", browserTranscript);
  }

  formData.append("language", language);
  formData.append("targetField", targetField);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  let response: Response;

  try {
    response = await fetch(STT_api, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("STT request timed out");
    }
    throw err;
  } finally {
    window.clearTimeout(timeoutId);
  }

  const text = await response.text();

  let data: ProcessAudioResponse | { message?: string } = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid response from server: ${text}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to process audio.");
  }

  return data as ProcessAudioResponse;
}