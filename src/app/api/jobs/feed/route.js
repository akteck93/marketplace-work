import { NextResponse } from 'next/server';
import { SAMPLE_JOBS } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type');
  const skill = searchParams.get('skill')?.toLowerCase();
  const category = searchParams.get('category');

  let jobs = [...SAMPLE_JOBS];

  if (search) {
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(search) || 
      j.description.toLowerCase().includes(search)
    );
  }

  if (type && type !== 'ALL') {
    jobs = jobs.filter(j => j.type === type);
  }

  if (category && category !== 'ALL') {
    jobs = jobs.filter(j => j.category === category);
  }

  if (skill) {
    jobs = jobs.filter(j => j.skills.some(s => s.toLowerCase().includes(skill)));
  }

  return NextResponse.json({ success: true, count: jobs.length, jobs });
}
