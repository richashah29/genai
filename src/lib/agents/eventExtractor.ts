import { getModel } from '../gemini';
import type { ExtractedEvent } from '../types';

export async function extractEventsFromTranscript(transcript: string): Promise<ExtractedEvent[]> {
  const model = getModel();
  const today = new Date().toISOString().slice(0, 10);

  const prompt = `You are an event extraction agent. From the following voice note transcript, extract any mentioned events, appointments, or plans (e.g. "lunch with Sarah on Tuesday at noon", "doctor Thursday 2pm").
If no event is mentioned, return an empty JSON array.
Today's date is ${today}. Infer dates from relative phrases like "tomorrow", "next Tuesday", "this weekend".
Return a valid JSON array of objects only. Each object must have: "title" (string), "withPerson" (string or omit), "date" (YYYY-MM-DD), "time" (HH:mm 24-hour), "location" (string or omit), "notes" (string or omit). No other text, no markdown code blocks.

Transcript:
"""
${transcript}
"""`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text?.()?.trim() ?? '[]';

  try {
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned) as ExtractedEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
