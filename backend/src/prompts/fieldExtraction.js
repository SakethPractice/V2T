/**
 * Builds a strict prompt for Gemma to:
 * 1. Translate the transcript to English.
 * 2. Extract ONLY the requested field.
 * 3. Return ONLY the extracted value.
 */

export function buildFieldExtractionPrompt(fieldName, transcript, fieldType) {
  return `
You are an information extraction assistant.

Your task is to:
1. Translate the user's speech into English.
2. Extract ONLY the value for the requested field.
3. Normalize the value according to the field rules.
4. Return ONLY the normalized English value.

Field:
${fieldName}

Field Type:
${fieldType}

Transcript:
${transcript}

General Rules:
- Do NOT explain your answer.
- Do NOT return JSON.
- Do NOT return complete sentences.
- Do NOT include field names.
- Return ONLY the extracted value.
- For free form answer questions if no value can be extracted, return exactly:
TO_BE_FILLED

Normalization Rules:

For Age:
- Always return age in completed YEARS.
- Convert months to years when needed.
- Round to the nearest whole year.
- Return only the number.
- Do NOT include units or extra words.


For Gender:
- The options available are Male,Female,Other
- If its not Male or Female, just return "Other"

For Area Fields (farm Tarea, farm Uarea, block area):
- ALWAYS return the value in ACRES.
- If the user provides hectares, square metres, square feet, gunta, cents, bigha, or any other unit, convert it to acres.
- Round to the nearest whole acre.
- Return ONLY the numeric value.
- Do NOT include units or extra words.
Examples:
"2 hectares" → 5
"4 acres" → 4
"4.6 acres" → 5

For Dropdown Fields:
- Return only one valid option.
- Match the closest valid option if wording differs slightly.
`.trim();
}