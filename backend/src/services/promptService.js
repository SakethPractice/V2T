import { buildFieldExtractionPrompt } from "../prompts/fieldExtraction.js";

/**
 * Creates the prompt used for field extraction.
 *
 * @param {string} fieldName
 * @param {string} transcript
 * @returns {string}
 */
export function createFieldExtractionPrompt(fieldName, transcript) {
  return buildFieldExtractionPrompt(fieldName, transcript);
}