import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type');
    const skill = searchParams.get('skill')?.toLowerCase();

    // Query real jobs from Prisma database
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        _count: {
          select: { proposals: true }
        }
      }
    });

    let filteredJobs = jobs.map(j => ({
      id: j.id,
      title: j.title,
      description: j.description,
      type: j.type,
      budget: j.budget,
      category: j.type === 'FIXED_PRICE' ? '3D & WebGL Development' : 'Full Stack & Payments',
      skills: j.skills || [],
      clientId: j.clientId,
      clientName: j.client?.name || 'Verified Client',
      clientVerified: true,
      proposalsCount: j._count.proposals,
      createdAt: j.createdAt.toISOString(),
      status: 'OPEN'
    }));

    if (search) {
      filteredJobs = filteredJobs.filter(j => 
        j.title.toLowerCase().includes(search) || 
        j.description.toLowerCase().includes(search)
      );
    }

    if (type && type !== 'ALL') {
      filteredJobs = filteredJobs.filter(j => j.type === type);
    }

    if (skill) {
      filteredJobs = filteredJobs.filter(j => j.skills.some(s => s.toLowerCase().includes(skill)));
    }

    return NextResponse.json({ success: true, count: filteredJobs.length, jobs: filteredJobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
