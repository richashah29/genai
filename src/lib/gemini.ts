import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Missing GOOGLE_API_KEY or GEMINI_API_KEY');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getModel(name: string = 'gemini-1.5-flash') {
  if (!genAI) throw new Error('Google API key not set. Add GOOGLE_API_KEY or GEMINI_API_KEY to .env.local');
  return genAI.getGenerativeModel({ model: name });
}
