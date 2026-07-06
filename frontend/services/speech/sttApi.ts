export interface ProcessAudioRequest {
  audioBlob: Blob;
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
  language,
  targetField,
}: ProcessAudioRequest): Promise<ProcessAudioResponse> {
  const formData = new FormData();

  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", language);
  formData.append("targetField", targetField);

  const response = await fetch(STT_api, {
    method: "POST",
    body: formData,
  });

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