import { NextRequest, NextResponse } from 'next/server';
import { chatStore } from '@/lib/store';

export function GET(req: NextRequest) {
  const agent = req.nextUrl.searchParams.get('agent') as 'people' | 'wellness' | null;
  const history = chatStore.getHistory(agent ?? undefined);
  return NextResponse.json(history);
}
