const API_URL = "http://localhost:5000/api/sessions";

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
  responses: object,
  currentQuestionId: string
): Promise<void>
{
  if(!sessionId) return;

  await fetch(`${API_URL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      responses,
      currentQuestionId,
    }),
  });
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
