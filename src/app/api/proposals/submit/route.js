import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, bidAmount, coverLetter } = body;

    if (!jobId || !bidAmount || !coverLetter) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Create proposal in database
    const proposal = await prisma.proposal.create({
      data: {
        jobId,
        freelancerId: session.user.id,
        bidAmount: parseFloat(bidAmount),
        coverLetter,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
