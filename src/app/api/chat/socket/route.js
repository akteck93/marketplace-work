import { NextResponse } from 'next/server';
import { SAMPLE_MESSAGES } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let messages = [...SAMPLE_MESSAGES];
  if (userId) {
    messages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
  }

  return NextResponse.json({ success: true, messages });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: body.senderId || 'usr_client_1',
      senderName: body.senderName || 'Client',
      receiverId: body.receiverId || 'usr_freelancer_1',
      text: body.text,
      offerCard: body.offerCard || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    SAMPLE_MESSAGES.push(newMsg);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
