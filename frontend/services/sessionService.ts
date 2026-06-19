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