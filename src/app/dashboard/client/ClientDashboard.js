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
  MoreHorizontal
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
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Welcome back, {user?.name || 'Rahul'}! <span className="text-2xl">👋</span>
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
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
          </div>
          <div className="text-2xl font-black text-slate-800">07</div>
          <Link href="/dashboard/client/projects" className="text-[10px] font-semibold text-[#2d5bff] mt-1 hover:underline">View all projects →</Link>
        </div>

        {/* Proposals Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Proposals Received</span>
          </div>
          <div className="text-2xl font-black text-slate-800">18</div>
          <Link href="/dashboard/client/proposals" className="text-[10px] font-semibold text-[#2d5bff] mt-1 hover:underline">View proposals →</Link>
        </div>

        {/* Projects in Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#6c5ce7]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Projects in Progress</span>
          </div>
          <div className="text-2xl font-black text-slate-800">04</div>
          <Link href="/dashboard/client/contracts" className="text-[10px] font-semibold text-[#2d5bff] mt-1 hover:underline">View progress →</Link>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Spent</span>
          </div>
          <div className="text-2xl font-black text-slate-800">₹1,48,250</div>
          <Link href="/dashboard/client/payments" className="text-[10px] font-semibold text-[#2d5bff] mt-1 hover:underline">View transactions →</Link>
        </div>
      </div>

      {/* Middle Row (Activity, Spending Chart, Project Status Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <button className="text-xs font-semibold text-[#2d5bff]">View all</button>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2d5bff]/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#2d5bff]" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">You received 5 new proposals for <strong>Website Development</strong></p>
                <span className="text-[10px] text-slate-400 mt-1 block">10 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">A message from <strong>Priya Sharma</strong> regarding project: Mobile App Design</p>
                <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">Milestone payment of <strong>₹25,000</strong> paid for Logo Design</p>
                <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#6c5ce7]" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">Project "Content Writing" marked as <strong className="text-emerald-500">completed</strong></p>
                <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Overview Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Spending Overview</h3>
            <select className="text-xs font-semibold text-slate-600 bg-transparent outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <div>
              <div className="text-2xl font-black text-slate-800">₹48,650</div>
              <div className="text-[10px] text-slate-500">Total Spent</div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold">
              ↑ 12%<br/>vs last month
            </div>
          </div>

          <div className="flex-1 h-48 w-full -ml-4 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorValueClient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d5bff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2d5bff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Spent']}
                />
                <Area type="monotone" dataKey="value" stroke="#2d5bff" strokeWidth={3} fillOpacity={1} fill="url(#colorValueClient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <h3 className="font-bold text-slate-800 w-full mb-2">Project Status</h3>
          <div className="relative w-32 h-32 flex-shrink-0 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">07</span>
              <span className="text-[9px] text-slate-500 font-semibold">Total</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="w-full mt-4 space-y-2">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-slate-800">{item.value}</span>
                  <span className="text-[9px] text-slate-400">({Math.round((item.value/19)*100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row (My Active Projects & Top Rated Providers) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* My Active Projects */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">My Active Projects</h3>
            <button className="text-xs font-semibold text-[#2d5bff]">View all</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-medium">Project Title</th>
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium">Budget</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="text-xs">
                
                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-800">Website Development</div>
                    <div className="text-[10px] text-slate-500">E-commerce website</div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="font-semibold text-slate-700">Amit Kumar</div>
                        <div className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500" /> 4.8</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-bold text-slate-800">₹45,000</td>
                  <td className="py-4 pr-4">
                    <span className="bg-[#2d5bff]/10 text-[#2d5bff] px-2.5 py-1 rounded-md font-bold text-[10px]">In Progress</span>
                  </td>
                  <td className="py-4 pr-4 text-slate-500">20 May, 2024</td>
                  <td className="py-4 text-right text-slate-400 hover:text-slate-700 cursor-pointer"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                </tr>

                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-800">Mobile App Design</div>
                    <div className="text-[10px] text-slate-500">UI/UX for Android & iOS</div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="font-semibold text-slate-700">Priya Sharma</div>
                        <div className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500" /> 4.9</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-bold text-slate-800">₹35,000</td>
                  <td className="py-4 pr-4">
                    <span className="bg-[#2d5bff]/10 text-[#2d5bff] px-2.5 py-1 rounded-md font-bold text-[10px]">In Progress</span>
                  </td>
                  <td className="py-4 pr-4 text-slate-500">25 May, 2024</td>
                  <td className="py-4 text-right text-slate-400 hover:text-slate-700 cursor-pointer"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                </tr>

                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-800">Content Writing</div>
                    <div className="text-[10px] text-slate-500">Blog Articles & SEO</div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="font-semibold text-slate-700">Neha Verma</div>
                        <div className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-500" /> 4.7</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-bold text-slate-800">₹8,000</td>
                  <td className="py-4 pr-4">
                    <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md font-bold text-[10px]">Review</span>
                  </td>
                  <td className="py-4 pr-4 text-slate-500">15 May, 2024</td>
                  <td className="py-4 text-right text-slate-400 hover:text-slate-700 cursor-pointer"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                </tr>

              </tbody>
            </table>
          </div>
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
