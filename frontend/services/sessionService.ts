import type { InterviewResponses } from "../types/response";
import type { LanguageCode } from "../types/language";

const API_URL = "http://localhost:5000/api/sessions";
const FARMER_API_URL = "http://localhost:5000/api/farmers";

export async function startSession(phone: string) {
  const response = await fetch(`${API_URL}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  return response.json();
}

export async function saveSession(
  sessionId: string,
  responses: InterviewResponses,
  currentQuestionId: string,
  language?: LanguageCode
): Promise<void> {
  if (!sessionId) return;

  await fetch(`${API_URL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      responses,
      currentQuestionId,
      language,
    }),
  });
}

export async function updateSessionLanguage(
  sessionId: string,
  language: LanguageCode
): Promise<void> {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const response = await fetch(`${API_URL}/language`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      language,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to update language");
  }
}

export async function getSession(sessionId: string) {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const response = await fetch(`${API_URL}/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  return response.json();
}

export async function completeSession(
  sessionId: string
) {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const response = await fetch(`${API_URL}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to complete session");
  }

  return response.json();
}

export async function submitFarmer(
  sessionId: string
): Promise<{ farmerId: string; message: string; success: boolean }> {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const response = await fetch(`${FARMER_API_URL}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  const data = await response.json();

  if (!response.ok || !data?.farmerId) {
    throw new Error(data?.message || "Failed to submit farmer");
  }

  return data;
}
