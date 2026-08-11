import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, DollarSign, Calendar } from "lucide-react";

export default async function FreelancerProposalsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  const proposals = await prisma.proposal.findMany({
    where: { freelancerId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            My Submitted Proposals 📝
          </h2>
          <p className="text-sm text-slate-500 mt-1">Track status of your submitted bids and proposals.</p>
        </div>
        <Link 
          href="/jobs" 
          className="px-5 py-2.5 bg-[#2d5bff] hover:bg-[#1a47e6] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition"
        >
          Find More Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {proposals.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Proposals Submitted</h3>
            <p className="text-xs text-slate-500">Explore open jobs and submit your first bid.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 px-4 py-2 bg-[#2d5bff] text-white text-xs font-bold rounded-lg"
            >
              Browse Job Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">My Bid</th>
                    <th className="pb-3 font-medium">Cover Letter Preview</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date Submitted</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {proposals.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 pr-4">
                        <Link href={`/jobs/${p.jobId}`} className="font-bold text-slate-900 hover:text-[#2d5bff]">
                          {p.job?.title || 'Job Listing'}
                        </Link>
                      </td>
                      <td className="py-4 pr-4 font-black text-emerald-600">${p.bidAmount}</td>
                      <td className="py-4 pr-4 text-slate-600 italic line-clamp-2 max-w-md">
                        "{p.coverLetter}"
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          p.status === 'ACCEPTED' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : p.status === 'REJECTED' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
