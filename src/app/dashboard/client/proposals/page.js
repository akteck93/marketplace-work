import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClientProposalsView from "./ClientProposalsView";

export default async function ClientProposalsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  // Fetch all proposals submitted for jobs owned by this client
  const proposals = await prisma.proposal.findMany({
    where: {
      job: {
        clientId: session.user.id
      }
    },
    include: {
      freelancer: true,
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

  const formattedProposals = proposals.map(p => ({
    id: p.id,
    jobId: p.jobId,
    jobTitle: p.job?.title || 'Unknown Job',
    freelancerId: p.freelancerId,
    freelancerName: p.freelancer?.name || 'Freelancer',
    freelancerEmail: p.freelancer?.email || '',
    bidAmount: p.bidAmount,
    coverLetter: p.coverLetter,
    status: p.status,
    createdAt: p.createdAt.toISOString()
  }));

  return <ClientProposalsView proposals={formattedProposals} />;
}
