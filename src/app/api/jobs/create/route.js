import { NextResponse } from 'next/server';
import { SAMPLE_JOBS } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const newJob = {
      id: `job_${Date.now()}`,
      title: body.title,
      description: body.description,
      type: body.type || 'FIXED_PRICE',
      budget: parseFloat(body.budget) || 1000,
      category: body.category || '3D & WebGL Development',
      skills: body.skills || ['React Three Fiber', 'Next.js 15'],
      clientId: body.clientId || 'usr_client_1',
      clientName: body.clientName || 'Metaverse Labs Inc',
      clientVerified: true,
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      status: 'OPEN'
    };

    SAMPLE_JOBS.unshift(newJob);
    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
