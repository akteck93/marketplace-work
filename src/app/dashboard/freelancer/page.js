import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import FreelancerDashboard from "./FreelancerDashboard";
import { redirect } from "next/navigation";

export default async function FreelancerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  // Fetch actual data from database
  const contracts = await prisma.contract.findMany({
    where: { freelancerId: session.user.id },
    include: {
      client: true,
      milestones: true,
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Fetch Job Feed (Jobs that are OPEN and not created by this freelancer, which is always true)
  const availableJobs = await prisma.job.findMany({
    include: {
      client: true,
      _count: {
        select: { proposals: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 20 // Limit to 20 recent jobs for now
  });

  const formattedContracts = contracts.map(c => ({
    id: c.id,
    jobTitle: c.job.title,
    clientName: c.client.name,
    amount: c.amount,
    status: c.status,
    milestones: c.milestones,
  }));

  const formattedJobs = availableJobs.map(j => ({
    id: j.id,
    title: j.title,
    description: j.description,
    budget: j.budget,
    type: j.type,
    skills: j.skills,
    clientName: j.client.name,
    proposalsCount: j._count.proposals,
    createdAt: j.createdAt.toISOString()
  }));

  return (
    <FreelancerDashboard 
      initialContracts={formattedContracts} 
      jobFeed={formattedJobs} 
      user={session.user}
    />
  );
}
