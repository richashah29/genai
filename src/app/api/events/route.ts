import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/store';
import type { ExtractedEvent } from '@/lib/types';

export function GET() {
  const events = eventStore.getAll();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ExtractedEvent & { reminderMinutesBefore?: number };
    const {
      title,
      withPerson,
      date,
      time,
      location,
      notes,
      reminderMinutesBefore = 30,
    } = body;
    if (!title || !date || !time) {
      return NextResponse.json({ error: 'Missing title, date, or time' }, { status: 400 });
    }
    const event = eventStore.add({
      title,
      withPerson,
      date,
      time,
      location,
      notes,
      reminderMinutesBefore: Number(reminderMinutesBefore) || 30,
    });
    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}
