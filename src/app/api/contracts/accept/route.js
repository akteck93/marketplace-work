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

    const { proposalId } = await request.json();

    if (!proposalId) {
      return NextResponse.json({ success: false, error: "Proposal ID is required" }, { status: 400 });
    }

    // Find proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true }
    });

    if (!proposal || proposal.job.clientId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Proposal not found or un-owned" }, { status: 404 });
    }

    // Update proposal status to ACCEPTED
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED" }
    });

    // Create a new active contract
    const contract = await prisma.contract.create({
      data: {
        jobId: proposal.jobId,
        clientId: session.user.id,
        freelancerId: proposal.freelancerId,
        amount: proposal.bidAmount,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, contract });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
