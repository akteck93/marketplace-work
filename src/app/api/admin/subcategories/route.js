import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { categoryId, name, slug, description } = await req.json();

    if (!categoryId || !name || !slug) {
      return NextResponse.json({ success: false, error: 'categoryId, name, and slug are required' }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId,
        name,
        slug,
        description
      }
    });

    return NextResponse.json({ success: true, subcategory });
  } catch (error) {
    console.error('Create subcategory error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
