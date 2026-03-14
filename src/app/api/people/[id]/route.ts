import { NextRequest, NextResponse } from 'next/server';
import { peopleStore } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json() as { relationship?: string; notes?: string; happyMoments?: string[] };
  const updated = peopleStore.update(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}
