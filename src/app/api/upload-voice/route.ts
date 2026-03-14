import { NextRequest, NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';
import { extractEventsFromTranscript } from '@/lib/agents/eventExtractor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 });
    }

    const model = getModel();
    const today = new Date().toISOString().slice(0, 10);

    // Send audio to Gemini for transcription (Gemini 1.5 supports audio)
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'audio/webm';

    const transcriptPrompt = `You are a transcription assistant. Transcribe this voice note exactly as spoken. Output only the transcript, no extra commentary. If the audio is unclear or empty, output "".`;

    const result = await model.generateContent([
      { inlineData: { mimeType, data: base64 } },
      { text: transcriptPrompt },
    ]);

    const response = result.response;
    const text = response.text?.()?.trim() ?? '';

    const events = text ? await extractEventsFromTranscript(text) : [];

    return NextResponse.json({ transcript: text, events });
  } catch (e) {
    console.error('Upload/transcribe error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}
