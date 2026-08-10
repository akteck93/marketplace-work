import { NextResponse } from 'next/server';
import { SAMPLE_PROPOSALS } from '@/lib/store';

export async function GET(request, { params }) {
  const { id } = await params;
  const proposal = SAMPLE_PROPOSALS.find(p => p.id === id);
  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  return NextResponse.json({ success: true, proposal });
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const propIndex = SAMPLE_PROPOSALS.findIndex(p => p.id === id);
    if (propIndex !== -1) {
      SAMPLE_PROPOSALS[propIndex] = { ...SAMPLE_PROPOSALS[propIndex], ...body };
      return NextResponse.json({ success: true, proposal: SAMPLE_PROPOSALS[propIndex] });
    }
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
