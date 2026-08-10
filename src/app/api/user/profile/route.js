import { NextResponse } from 'next/server';
import { SAMPLE_USERS } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const user = SAMPLE_USERS.find(u => u.id === id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json({ success: true, users: SAMPLE_USERS });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const userIndex = SAMPLE_USERS.findIndex(u => u.id === body.id);
    if (userIndex !== -1) {
      SAMPLE_USERS[userIndex] = { ...SAMPLE_USERS[userIndex], ...body };
      return NextResponse.json({ success: true, user: SAMPLE_USERS[userIndex] });
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
