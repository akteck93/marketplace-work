import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        subcategories: {
          orderBy: { name: 'asc' }
        }
      }
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
