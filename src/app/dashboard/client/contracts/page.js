import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckSquare, Briefcase, User, Calendar } from "lucide-react";

export default async function ClientContractsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const contracts = await prisma.contract.findMany({
    where: { clientId: session.user.id },
    include: {
      freelancer: true,
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Active Contracts 📑
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage active work and awarded contracts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {contracts.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Active Contracts Yet</h3>
            <p className="text-xs text-slate-500">Jab aap kisi proposal ko accept karenge, contract yahan show hoga.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Job Title</th>
                  <th className="pb-3 font-medium">Freelancer</th>
                  <th className="pb-3 font-medium">Contract Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Awarded Date</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 pr-4 font-bold text-slate-900">{c.job?.title || 'Contract Job'}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#2d5bff]/10 text-[#2d5bff] font-bold text-[10px] flex items-center justify-center">
                          {c.freelancer?.name?.charAt(0) || 'F'}
                        </div>
                        <span className="font-semibold text-slate-700">{c.freelancer?.name}</span>
                      </div>
                    </td>
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
