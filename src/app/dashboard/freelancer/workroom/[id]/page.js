import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import WorkroomClientUI from "./WorkroomClientUI";

export default async function FreelancerWorkroomPage({ params }) {
  const resolvedParams = await params;
  const jobId = resolvedParams.id;
  
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  // Fetch the contract and client info
  const contract = await prisma.contract.findFirst({
    where: { 
      jobId: jobId,
      freelancerId: session.user.id
    },
    include: {
      client: true,
      job: true
    }
  });

  if (!contract) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You do not have an active contract for this job.</p>
      </div>
    );
  }

  // Sanitize client data to avoid passing secrets
  const clientData = {
    name: contract.client.name,
    email: contract.client.email,
    phone: contract.client.phone || "Not Provided",
    avatarUrl: contract.client.avatarUrl
  };

  return (
    <WorkroomClientUI 
      job={contract.job} 
      clientData={clientData} 
      contractId={contract.id}
    />
  );
}
