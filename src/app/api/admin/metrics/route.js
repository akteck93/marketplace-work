import { NextResponse } from 'next/server';
import { SAMPLE_CONTRACTS, SAMPLE_JOBS, SAMPLE_USERS } from '@/lib/store';

export async function GET() {
  const gmvTotal = SAMPLE_CONTRACTS.reduce((acc, c) => acc + (c.amount || 0), 0) + 524000;
  const platformFeeRevenue = gmvTotal * 0.10; // 10% fee
  const activeContractsCount = SAMPLE_CONTRACTS.filter(c => c.status === 'ACTIVE' || c.status === 'IN_REVIEW').length + 28;
  const openJobsCount = SAMPLE_JOBS.filter(j => j.status === 'OPEN').length + 42;
  const totalUsersCount = SAMPLE_USERS.length + 1840;

  return NextResponse.json({
    success: true,
    metrics: {
      gmvTotal,
      platformFeeRevenue,
      activeContractsCount,
      openJobsCount,
      totalUsersCount,
      escrowHoldBalance: 84500,
      disputeCount: 2
    }
  });
}
