import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ClientDashboard from "./ClientDashboard";
import { redirect } from "next/navigation";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  // Fetch actual data from database
  const jobs = await prisma.job.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      proposals: true,
      _count: {
        select: { proposals: true }
      }
    }
  });

  const contracts = await prisma.contract.findMany({
    where: { clientId: session.user.id },
    include: {
      freelancer: true,
      milestones: true,
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

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

  // Map to the format expected by the client component
  const formattedJobs = jobs.map(j => ({
    id: j.id,
    title: j.title,
    category: j.type, // Map enum to category
    budget: j.budget,
    proposalsCount: j._count.proposals,
  }));

  const formattedContracts = contracts.map(c => ({
    id: c.id,
    jobTitle: c.job.title,
    freelancerName: c.freelancer.name,
    amount: c.amount,
    status: c.status,
    milestones: c.milestones,
  }));

  const formattedProposals = proposals.map(p => ({
    id: p.id,
    jobId: p.jobId,
    freelancerId: p.freelancerId,
    freelancerName: p.freelancer.name,
    freelancerAvatar: p.freelancer.avatarUrl || "/default-avatar.png",
    freelancerRate: p.freelancer.hourlyRate || 0,
    bidAmount: p.bidAmount,
    coverLetter: p.coverLetter,
    status: p.status,
    milestones: [] // If you want to support milestone proposals, you can add them to the DB
  }));

  return (
    <ClientDashboard 
      initialJobs={formattedJobs} 
      initialContracts={formattedContracts}
      initialProposals={formattedProposals}
      user={session.user}
    />
  );
}
