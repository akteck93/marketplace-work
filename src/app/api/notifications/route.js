import { NextResponse } from 'next/server';
import { SAMPLE_NOTIFICATIONS } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ success: true, notifications: SAMPLE_NOTIFICATIONS });
}

export async function PATCH(request) {
  try {
    SAMPLE_NOTIFICATIONS.forEach(n => { n.read = true; });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
