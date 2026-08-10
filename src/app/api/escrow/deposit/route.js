import { NextResponse } from 'next/server';
import { SAMPLE_CONTRACTS, SAMPLE_NOTIFICATIONS } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const { contractId, amount } = body;

    const contract = SAMPLE_CONTRACTS.find(c => c.id === contractId);
    if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

    contract.escrowDeposited = (contract.escrowDeposited || 0) + parseFloat(amount);
    
    SAMPLE_NOTIFICATIONS.unshift({
      id: `n_${Date.now()}`,
      title: 'Stripe Escrow Deposit',
      message: `$${amount} deposited into Escrow Hold status for Contract #${contractId}`,
      time: 'Just now',
      read: false
    });

    return NextResponse.json({ 
      success: true, 
      escrowDeposited: contract.escrowDeposited,
      status: 'FUNDS_HELD_IN_ESCROW'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
