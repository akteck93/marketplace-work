"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Folder, 
  ClipboardList, 
  Activity, 
  Wallet, 
  Users, 
  MessageSquare,
  CheckCircle2,
  FileText,
  Plus,
  MoreHorizontal,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock Data for Charts
const spendingData = [
  { name: '1 May', value: 20000 },
  { name: '8 May', value: 35000 },
  { name: '15 May', value: 48650 },
  { name: '22 May', value: 28000 },
  { name: '29 May', value: 32000 },
];

const projectStatusData = [
  { name: 'In Progress', value: 4, color: '#2d5bff' },
  { name: 'Open', value: 2, color: '#10ac84' },
  { name: 'On Hold', value: 1, color: '#feca57' },
  { name: 'Completed', value: 12, color: '#ff6b6b' },
];

export default function ClientDashboard({ initialJobs = [], initialProposals = [], initialContracts = [], user }) {
  const handleAcceptProposal = async (proposalId) => {
    try {
      const res = await fetch('/api/contracts/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Welcome back, {user?.name || 'Client'}! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your projects.</p>
        </div>
        <Link 
          href="/jobs/create" 
          className="px-5 py-2.5 bg-[#2d5bff] hover:bg-[#1a47e6] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-[#2d5bff]/20 transition"
        >
          <Plus className="w-4 h-4" /> Post a New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2d5bff]/10 flex items-center justify-center">
              <Folder className="w-5 h-5 text-[#2d5bff]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Posted Projects</span>
          </div>
          <div className="text-2xl font-black text-slate-800">{initialJobs.length}</div>
          <span className="text-[10px] font-semibold text-[#2d5bff] mt-1">Live in database</span>
        </div>

        {/* Proposals Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Proposals Received</span>
          </div>
          <div className="text-2xl font-black text-slate-800">{initialProposals.length}</div>
          <span className="text-[10px] font-semibold text-emerald-600 mt-1">Total submitted bids</span>
        </div>

        {/* Active Contracts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#6c5ce7]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Active Contracts</span>
          </div>
          <div className="text-2xl font-black text-slate-800">{initialContracts.length}</div>
          <span className="text-[10px] font-semibold text-[#6c5ce7] mt-1">In progress</span>
        </div>

        {/* Escrow Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Escrow Secured</span>
          </div>
          <div className="text-2xl font-black text-slate-800">
            ${initialJobs.reduce((sum, j) => sum + (j.budget || 0), 0).toLocaleString()}
          </div>
          <span className="text-[10px] font-semibold text-amber-600 mt-1">Total job budgets</span>
        </div>
      </div>

      {/* Projects and Proposals Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* My Posted Projects */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">My Posted Projects</h3>
              <p className="text-xs text-slate-400">Projects currently live for freelancers</p>
            </div>
            <Link href="/jobs/create" className="text-xs font-bold text-[#2d5bff] hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Post New
            </Link>
          </div>

          {initialJobs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 my-4 space-y-3">
              <Folder className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Aapne abhi tak koi project post nahi kiya hai.</p>
              <Link
                href="/jobs/create"
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#2d5bff] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Post Your First Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-medium">Project Title</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Proposals</th>
                    <th className="pb-3 font-medium">Date Posted</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {initialJobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="py-4 pr-4">
                        <Link href={`/jobs/${job.id}`} className="font-bold text-slate-800 hover:text-[#2d5bff]">
                          {job.title}
                        </Link>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{job.description}</div>
                      </td>
                      <td className="py-4 pr-4 font-bold text-emerald-600">${job.budget}</td>
                      <td className="py-4 pr-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-md font-bold text-[10px]">
                          {job.proposalsCount} Bids
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-400 text-[10px]">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Incoming Proposals */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Received Proposals</h3>
              <p className="text-xs text-slate-400">Applicants bidding on your jobs</p>
            </div>
          </div>

          {initialProposals.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 my-4 space-y-2">
              <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Abhi koi proposals receive nahi hue hain.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {initialProposals.map((prop) => (
                <div key={prop.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#2d5bff]/10 text-[#2d5bff] font-bold text-xs flex items-center justify-center">
                        {prop.freelancerName?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{prop.freelancerName}</div>
                        <div className="text-[10px] text-slate-400">Applied for: {prop.jobTitle || 'Your Project'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-600">${prop.bidAmount}</div>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                        {prop.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic line-clamp-2">
                    "{prop.coverLetter}"
                  </p>

                  {prop.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm transition"
                      >
                        Accept Proposal & Award
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Rated Providers */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Top Rated Providers For You</h3>
            <button className="text-xs font-semibold text-[#2d5bff]">View all</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Amit Kumar</div>
                  <div className="text-[10px] text-slate-500">Web Development</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.8 <span className="text-slate-400 font-normal">(128)</span>
                </div>
                <button className="px-3 py-1 bg-[#2d5bff]/10 text-[#2d5bff] hover:bg-[#2d5bff] hover:text-white transition text-[10px] font-bold rounded">
                  Invite
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Priya Sharma</div>
                  <div className="text-[10px] text-slate-500">Mobile App Development</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9 <span className="text-slate-400 font-normal">(96)</span>
                </div>
                <button className="px-3 py-1 bg-[#2d5bff]/10 text-[#2d5bff] hover:bg-[#2d5bff] hover:text-white transition text-[10px] font-bold rounded">
                  Invite
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-800">DesignHub Studio</div>
                  <div className="text-[10px] text-slate-500">Logo & Branding</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.7 <span className="text-slate-400 font-normal">(78)</span>
                </div>
                <button className="px-3 py-1 bg-[#2d5bff]/10 text-[#2d5bff] hover:bg-[#2d5bff] hover:text-white transition text-[10px] font-bold rounded">
                  Invite
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Neha Verma</div>
                  <div className="text-[10px] text-slate-500">Content Writing</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.8 <span className="text-slate-400 font-normal">(105)</span>
                </div>
                <button className="px-3 py-1 bg-[#2d5bff]/10 text-[#2d5bff] hover:bg-[#2d5bff] hover:text-white transition text-[10px] font-bold rounded">
                  Invite
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
