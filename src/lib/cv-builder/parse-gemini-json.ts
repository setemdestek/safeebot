/**
 * Strips markdown code fences from Gemini responses and parses as JSON.
 */
export function parseGeminiJSON(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
