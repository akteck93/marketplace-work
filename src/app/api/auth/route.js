import { NextResponse } from 'next/server';
import { SAMPLE_USERS } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'FREELANCER';
  
  const user = SAMPLE_USERS.find(u => u.role === role) || SAMPLE_USERS[0];
  return NextResponse.json({ success: true, user });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: body.name || 'New Talent',
      email: body.email || 'user@workiffy.io',
      role: body.role || 'FREELANCER',
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: body.bio || '3D Web & Full Stack Specialist',
      hourlyRate: parseFloat(body.hourlyRate) || 85,
      skills: body.skills || ['React Three Fiber', 'Next.js 15'],
      kycVerified: true,
      createdAt: new Date().toISOString()
    };
    SAMPLE_USERS.push(newUser);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
