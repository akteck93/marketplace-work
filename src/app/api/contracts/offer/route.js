import { NextResponse } from 'next/server';
import { SAMPLE_CONTRACTS, SAMPLE_NOTIFICATIONS } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const newContract = {
      id: `cnt_${Date.now()}`,
      jobId: body.jobId,
      jobTitle: body.jobTitle || 'Custom Freelance Contract',
      clientId: body.clientId || 'usr_client_1',
      clientName: body.clientName || 'Metaverse Labs Inc',
      freelancerId: body.freelancerId,
      freelancerName: body.freelancerName,
      amount: parseFloat(body.amount),
      escrowDeposited: parseFloat(body.amount),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      milestones: (body.milestones || []).map((m, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        title: m.title,
        amount: parseFloat(m.amount),
        isFunded: true,
        isApproved: false,
        status: idx === 0 ? 'ACTIVE' : 'PENDING'
      }))
    };

    SAMPLE_CONTRACTS.unshift(newContract);
    
    // System Notification
    SAMPLE_NOTIFICATIONS.unshift({
      id: `n_${Date.now()}`,
      title: 'Contract Awarded',
      message: `Contract awarded to ${body.freelancerName} for $${body.amount}. Escrow funded via Stripe Connect.`,
      time: 'Just now',
      read: false
    });

    return NextResponse.json({ success: true, contract: newContract });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
