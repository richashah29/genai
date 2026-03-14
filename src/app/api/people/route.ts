import { NextRequest, NextResponse } from 'next/server';
import { peopleStore } from '@/lib/store';

export function GET() {
  return NextResponse.json(peopleStore.getAll());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name: string; relationship: string; notes?: string };
    const { name, relationship, notes } = body;
    if (!name || !relationship) {
      return NextResponse.json({ error: 'Missing name or relationship' }, { status: 400 });
    }
    const person = peopleStore.add({ name, relationship, notes });
    return NextResponse.json(person);
  } catch {
    return NextResponse.json({ error: 'Failed to add person' }, { status: 500 });
  }
}
