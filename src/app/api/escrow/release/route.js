import { NextResponse } from 'next/server';
import { SAMPLE_CONTRACTS, SAMPLE_NOTIFICATIONS } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const { contractId, milestoneId, action } = body; // action: 'SUBMIT' | 'RELEASE'

    const contract = SAMPLE_CONTRACTS.find(c => c.id === contractId);
    if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

    const milestone = contract.milestones.find(m => m.id === milestoneId);
    if (!milestone) return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });

    if (action === 'SUBMIT') {
      milestone.status = 'SUBMITTED';
      contract.status = 'IN_REVIEW';
      SAMPLE_NOTIFICATIONS.unshift({
        id: `n_${Date.now()}`,
        title: 'Work Deliverable Submitted',
        message: `Milestone "${milestone.title}" submitted for client review ($${milestone.amount}).`,
        time: 'Just now',
        read: false
      });
    } else if (action === 'RELEASE') {
      milestone.isApproved = true;
      milestone.status = 'RELEASED';
      
      const allApproved = contract.milestones.every(m => m.isApproved);
      if (allApproved) {
        contract.status = 'COMPLETED';
      }

      SAMPLE_NOTIFICATIONS.unshift({
        id: `n_${Date.now()}`,
        title: 'Escrow Funds Released',
        message: `$${milestone.amount} released from Escrow to Freelancer Wallet for milestone "${milestone.title}".`,
        time: 'Just now',
        read: false
      });
    }

    return NextResponse.json({ success: true, contract, milestone });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
