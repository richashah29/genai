import { NextRequest, NextResponse } from 'next/server';
import { chatStore } from '@/lib/store';
import { peopleAgentReply } from '@/lib/agents/peopleAgent';
import { wellnessAgentReply } from '@/lib/agents/wellnessAgent';

export async function POST(req: NextRequest) {
  try {
    const { message, agent } = await req.json() as { message: string; agent: 'people' | 'wellness' };
    if (!message || !agent || !['people', 'wellness'].includes(agent)) {
      return NextResponse.json({ error: 'Invalid message or agent' }, { status: 400 });
    }
    chatStore.add({ role: 'user', content: message, agent });
    const reply = agent === 'people' ? await peopleAgentReply(message) : await wellnessAgentReply(message);
    chatStore.add({ role: 'assistant', content: reply, agent });
    return NextResponse.json({ reply });
  } catch (e) {
    console.error('Chat error:', e);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
