import { NextResponse } from 'next/server';
import { SAMPLE_PROPOSALS, SAMPLE_JOBS } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const newProposal = {
      id: `prop_${Date.now()}`,
      jobId: body.jobId,
      freelancerId: body.freelancerId || 'usr_freelancer_1',
      freelancerName: body.freelancerName || 'Alex Rivera',
      freelancerAvatar: body.freelancerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      freelancerRate: body.freelancerRate || 95,
      bidAmount: parseFloat(body.bidAmount) || 1000,
      coverLetter: body.coverLetter,
      status: 'PENDING',
      milestones: body.milestones || [{ title: 'Deliverable 1', amount: parseFloat(body.bidAmount) || 1000 }],
      createdAt: new Date().toISOString()
    };

    SAMPLE_PROPOSALS.unshift(newProposal);
    
    // Update proposal count on target job
    const targetJob = SAMPLE_JOBS.find(j => j.id === body.jobId);
    if (targetJob) {
      targetJob.proposalsCount = (targetJob.proposalsCount || 0) + 1;
    }

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
