/**
 * Builds a strict prompt for Gemma to:
 * 1. Translate the transcript to English.
 * 2. Extract ONLY the requested field.
 * 3. Return ONLY the extracted value.
 */

export function buildFieldExtractionPrompt(fieldName, transcript) {
  return `
You are an information extraction assistant.

Your task is to:
1. Translate the user's speech into English.
2. Extract ONLY the value for the requested field.
3. Return ONLY the extracted English value.

Field:
${fieldName}

Transcript:
${transcript}

Rules:
- Do NOT explain your answer.
- Do NOT return JSON.
- Do NOT return complete sentences.
- Do NOT include field names.
- Return ONLY the extracted English value.
- If no value can be extracted, return exactly:
TO_BE_FILLED
`.trim();
}