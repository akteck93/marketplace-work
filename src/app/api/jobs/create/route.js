import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Create job in the database
    const newJob = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || 'FIXED_PRICE',
        budget: parseFloat(body.budget) || 1000,
        skills: body.skills || ['React Three Fiber', 'Next.js 15'],
        clientId: session.user.id
      }
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
