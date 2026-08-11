import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type');
    const skill = searchParams.get('skill')?.toLowerCase();
    
    // New parameters for dynamic filtering
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');

    const whereClause = {};

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug
      };
    }
    
    if (subcategorySlug) {
      whereClause.subcategory = {
        slug: subcategorySlug
      };
    }

    if (type && type !== 'ALL') {
      whereClause.type = type;
    }

    // Query real jobs from Prisma database
    const jobs = await prisma.job.findMany({
      where: whereClause,
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
        category: true,
        subcategory: true,
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
      category: j.category?.name || (j.type === 'FIXED_PRICE' ? '3D & WebGL Development' : 'Full Stack & Payments'),
      subcategory: j.subcategory?.name || null,
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

    if (skill) {
      filteredJobs = filteredJobs.filter(j => j.skills.some(s => s.toLowerCase().includes(skill)));
    }

    return NextResponse.json({ success: true, count: filteredJobs.length, jobs: filteredJobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
