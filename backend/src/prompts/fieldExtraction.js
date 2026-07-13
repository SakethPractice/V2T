/**
 * Builds a strict prompt for Gemma to:
 * 1. Translate the transcript to English.
 * 2. Extract ONLY the requested field.
 * 3. Return ONLY the extracted value.
 */
const COMMON_PROMPT = `
You are an information extraction engine.

Translate the transcript to English and then use that value downstream.

Extract ONLY the requested field. Perform Calculations for area conversions and round off to nearest 2 decimals, and for age nearest year.

Return ONLY the extracted value.

If multiple values are mentioned, follow the field instructions and ignore unrelated values.

If the transcript contains information unrelated to the requested field, ignore it completely.

Never explain.

Never return JSON.

Never return complete sentences.

Never include field names.

If extraction fails:
- text fields -> TO_BE_FILLED
- numeric fields -> empty
`;

const FIELD_RULES = {

    "farmer.age": `
Extract ONLY the farmer's age.

Return only digits.

Convert spoken numbers to digits.

Convert months into years.

Round to nearest year.
`,

    "farmer.gender": `
Allowed values

Male
Female
Other

Anything except Male or Female becomes Other.

Return one word only.
`,

"farm.Tarea": `
Extract ONLY the TOTAL farm area.

The transcript may contain both total area and cultivated area.

Extract ONLY the TOTAL area.

Ignore cultivated area.

Ignore block area.

Convert all units to acres.
Acres = Hectares * 2.47105
Acres = Guntas / 40
Acres = Cents / 100
Acres = Kunte / 40 (if 1 kunte = 1 gunta)

Return only the numeric value.
`,

"farm.Uarea": `
Extract ONLY the USED or CULTIVATED area.

The transcript may contain both total area and cultivated area.

Extract ONLY the cultivated (used) area.

Ignore total area.

Ignore block area.

Convert all units to acres.
Acres = Hectares * 2.47105
Acres = Guntas / 40
Acres = Cents / 100
Acres = Kunte / 40 (if 1 kunte = 1 gunta)

Return only the numeric value.
`,

"block.area": `
Extract ONLY the area of this block.

Convert every unit to acres.
Acres = Hectares * 2.47105
Acres = Guntas / 40
Acres = Cents / 100
Acres = Kunte / 40 (if 1 kunte = 1 gunta)

Return only the number.
`,

"farmer.address": `
Extract ONLY the street-level address.

Include:
- House number
- Door number
- Plot number
- Survey number
- Apartment
- Layout
- Road
- Street
- Cross
- Main road

Do NOT include:
- Village
- Taluk
- District
- State
- Country
- PIN code

Return only the address.

If no street-level address exists:
TO_BE_FILLED
`,

"farmer.pincode": `
Extract the PIN code.

Rules

Exactly six digits.

Convert spoken numbers to digits.

Return only digits.

Do not combine unrelated numbers.

Only return a value if exactly one valid 6-digit PIN code is present.
`,


"farm.blockCount": `
Extract the number of blocks.

Convert spoken numbers into digits.

Allowed values

1-20

If outside range

return empty.
`,


"farm.type": `
Choose ONE value.

Allowed values

Non-Chemical
Integrated
Mixed
Regenerative Farming

Return only one value.

No other output is allowed.
`,

"farm.watersrc":`
Choose ONE value.

Allowed values

Borewell
Open well
Canal
River
Pond
Rainwater

Return only one value.

No other output is allowed.
`,

"block.soil":`
Choose ONE value.

Allowed values

Black
Loamy
Sandy
Sandyloamy
Red
Laterite
Alluvial

Return only one value.

No other output is allowed.
`,

"block.farmingType":`
Choose ONE value.

Allowed values

Integrated
Non-Chemical

Return only one value.

No other output is allowed.
`

};

const DEFAULT_TEXT_RULE = `
Extract the value.

Return only the extracted text.

If unavailable

TO_BE_FILLED
`;

const DEFAULT_NUMBER_RULE = `
Extract the numeric value.

Convert words into digits.

Return only the number.

If unavailable

return empty.
`;

export function buildFieldExtractionPrompt(fieldName, transcript,) {

    const NUMBER_FIELDS = new Set([
  "farmer.age",
  "farmer.pincode",
  "farm.Tarea",
  "farm.Uarea",
  "farm.blockCount",
  "block.area",
]);

const rules =
  FIELD_RULES[fieldName] ??
  (NUMBER_FIELDS.has(fieldName)
    ? DEFAULT_NUMBER_RULE
    : DEFAULT_TEXT_RULE);

    return `
${COMMON_PROMPT}

Field

${fieldName}

Instructions

${rules}

Transcript
"""
${transcript}
"""
`.trim();

}