import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

export default async function FreelancerProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  const contracts = await prisma.contract.findMany({
    where: { freelancerId: session.user.id },
    include: { client: true, job: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            My Active Projects & Contracts 💼
          </h2>
          <p className="text-sm text-slate-500 mt-1">All projects awarded to you by clients.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {contracts.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Active Projects Yet</h3>
            <p className="text-xs text-slate-500">Jab client aapke proposal ko accept karega, project yahan show hoga.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 px-4 py-2 bg-[#2d5bff] text-white text-xs font-bold rounded-lg"
            >
              Browse Jobs & Apply
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Project Title</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Earnings Budget</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Awarded Date</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 pr-4 font-bold text-slate-900">{c.job?.title || 'Contract Job'}</td>
                    <td className="py-4 pr-4 text-slate-700 font-medium">{c.client?.name}</td>
                    <td className="py-4 pr-4 font-black text-emerald-600">${c.amount}</td>
                    <td className="py-4 pr-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
