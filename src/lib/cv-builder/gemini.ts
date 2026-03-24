import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

export async function callGemini(prompt: string): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API call failed:', err instanceof Error ? err.message : err);
    throw err;
  }
}
