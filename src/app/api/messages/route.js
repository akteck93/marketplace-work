import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('contractId');

    if (!contractId) {
      return NextResponse.json({ success: false, error: 'Missing contractId' }, { status: 400 });
    }

    // Verify user is part of the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    });

    if (!contract || (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { contractId },
      include: {
        sender: {
          select: { name: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { contractId, text } = await req.json();

    if (!contractId || !text) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    // Verify user is part of the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    });

    if (!contract || (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        contractId,
        senderId: session.user.id
      },
      include: {
        sender: {
          select: { name: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
