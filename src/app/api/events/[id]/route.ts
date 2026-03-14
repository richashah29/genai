import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/store';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = eventStore.delete(id);
  return NextResponse.json({ deleted: ok });
}
