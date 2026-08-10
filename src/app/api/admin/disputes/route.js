import { NextResponse } from 'next/server';
import { SAMPLE_DISPUTES } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ success: true, disputes: SAMPLE_DISPUTES });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { disputeId, resolution } = body; // resolution: 'REFUND_CLIENT' | 'RELEASE_FREELANCER' | 'SPLIT_50_50'

    const dispute = SAMPLE_DISPUTES.find(d => d.id === disputeId);
    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });

    dispute.status = `RESOLVED_${resolution}`;
    dispute.resolvedAt = new Date().toISOString();

    return NextResponse.json({ success: true, dispute });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
