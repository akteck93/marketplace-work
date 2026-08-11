import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Folder, Plus, ArrowRight, Eye, Briefcase } from "lucide-react";

export default async function ClientProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  // Fetch all projects posted by this client
  const jobs = await prisma.job.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { proposals: true }
      }
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            My Posted Projects 📁
          </h2>
          <p className="text-sm text-slate-500 mt-1">All contract listings created by you on Workiffy 3D.</p>
        </div>
        <Link 
          href="/jobs/create" 
          className="px-5 py-2.5 bg-[#2d5bff] hover:bg-[#1a47e6] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-[#2d5bff]/20 transition"
        >
          <Plus className="w-4 h-4" /> Post a New Project
        </Link>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {jobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-4">
            <Folder className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-800">No Projects Posted Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Aapne abhi tak koi project post nahi kiya hai.</p>
            </div>
            <Link
              href="/jobs/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d5bff] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Post Your First Project Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-medium">Project Title & Description</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Received Bids</th>
                    <th className="pb-3 font-medium">Date Posted</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 pr-4">
                        <Link href={`/jobs/${job.id}`} className="font-bold text-slate-900 text-sm hover:text-[#2d5bff]">
                          {job.title}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{job.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills?.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-black text-emerald-600 text-sm">${job.budget}</td>
                      <td className="py-4 pr-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-1 rounded-md font-extrabold text-[10px]">
                          {job._count.proposals} Proposals
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-400 text-[11px]">
                        {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
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
