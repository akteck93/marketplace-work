"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Briefcase, 
  Send, 
  Eye, 
  Star,
  MessageSquare,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  MonitorSmartphone,
  Smartphone,
  PenTool
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock Data for Charts
const earningsData = [
  { name: '1 May', value: 0 },
  { name: '8 May', value: 1200 },
  { name: '15 May', value: 2450 },
  { name: '22 May', value: 2100 },
  { name: '29 May', value: 3800 },
];

const proposalData = [
  { name: 'Viewed', value: 10, color: '#2d5bff' },
  { name: 'Shortlisted', value: 5, color: '#00d2d3' },
  { name: 'Invited', value: 4, color: '#feca57' },
  { name: 'Accepted', value: 3, color: '#10ac84' },
  { name: 'Rejected', value: 2, color: '#ff6b6b' },
];

export default function FreelancerDashboard({ initialContracts = [], jobFeed = [], user }) {
  // We mock some states just to match the visual if real data isn't full enough
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Welcome back, {user?.name || 'John'}! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your work today.</p>
        </div>
        <button className="px-4 py-2 bg-[#ff2a5f] hover:bg-[#ff104b] text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm shadow-[#ff2a5f]/20 transition">
          Customize Dashboard <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#6c5ce7]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
          </div>
          <div className="text-2xl font-black text-slate-800">$12,450</div>
          <div className="text-[10px] font-semibold text-emerald-500 mt-1">↑ 18.6% this month</div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2d5bff]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#2d5bff]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
          </div>
          <div className="text-2xl font-black text-slate-800">08</div>
          <div className="text-[10px] font-semibold text-[#2d5bff] mt-1">3 new this week</div>
        </div>

        {/* Proposals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Proposals Submitted</span>
          </div>
          <div className="text-2xl font-black text-slate-800">24</div>
          <div className="text-[10px] font-semibold text-amber-500 mt-1">5 pending response</div>
        </div>

        {/* Profile Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Profile Views</span>
          </div>
          <div className="text-2xl font-black text-slate-800">312</div>
          <div className="text-[10px] font-semibold text-emerald-500 mt-1">↑ 12% this week</div>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ff2a5f]/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-[#ff2a5f]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Client Rating</span>
          </div>
          <div className="text-2xl font-black text-slate-800">4.8</div>
          <div className="text-[10px] font-semibold text-[#6c5ce7] mt-1">Top Rated</div>
        </div>
      </div>

      {/* Middle Row (Activity, Earnings Chart, Proposal Donut) */}
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
                <Eye className="w-4 h-4 text-[#2d5bff]" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">Your proposal for "Website Development" project has been viewed.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">2 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#6c5ce7]" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">You have received a new message from <strong>David Smith</strong>.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">Your project "Mobile App Design" has been milestone approved.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#ff2a5f]/10 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-[#ff2a5f]" />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-snug">You have been invited to submit a proposal for "E-commerce Website".</p>
                <span className="text-[10px] text-slate-400 mt-1 block">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Earnings Overview</h3>
            <select className="text-xs font-semibold text-slate-600 bg-transparent outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex-1 h-48 w-full -ml-4 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d5bff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2d5bff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="value" stroke="#2d5bff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proposal Stats Donut */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <h3 className="font-bold text-slate-800 w-full mb-2">Proposal Stats</h3>
          <div className="relative w-40 h-40 flex-shrink-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={proposalData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {proposalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">24</span>
              <span className="text-[10px] text-slate-500 font-semibold">Total</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="w-full mt-6 space-y-2.5">
            {proposalData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-slate-800">{item.value}</span>
                  <span className="text-[10px] text-slate-400">({Math.round((item.value/24)*100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row (Recommended Projects & My Projects) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Projects (Job Feed) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recommended Projects for You</h3>
            <button className="text-xs font-semibold text-[#2d5bff]">View all</button>
          </div>
          <div className="space-y-4">
            
            {/* Real Data map or fallback */}
            {jobFeed.length > 0 ? jobFeed.slice(0,3).map(job => (
               <div key={job.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2d5bff]/30 transition-colors bg-slate-50/50 group">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#2d5bff] transition">{job.title}</h4>
                    <button className="text-slate-300 hover:text-[#ff2a5f]"><Bookmark className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                    <span className="text-slate-700">{job.type === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}</span>
                    <span className="font-bold text-slate-800">${job.budget}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded">Proposals: {job.proposalsCount}</span>
                  </div>
                </div>
              </div>
            )) : (
              // Hardcoded fallbacks to match design if db empty
              <>
                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2d5bff]/30 transition-colors bg-slate-50/50 group">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                    <MonitorSmartphone className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#2d5bff] transition">WordPress Website Development</h4>
                        <span className="text-[10px] px-1.5 py-0.5 bg-pink-50 text-pink-600 font-bold rounded">Featured</span>
                      </div>
                      <button className="text-slate-300 hover:text-[#ff2a5f]"><Bookmark className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                      <span>Fixed Price</span>
                      <span className="font-bold text-slate-800">$1,200 - $2,000</span>
                      <span>Intermediate</span>
                      <span>Proposals: 15</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#2d5bff]/30 transition-colors bg-slate-50/50 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#2d5bff] transition">UI/UX Design for Mobile App</h4>
                      <button className="text-slate-300 hover:text-[#ff2a5f]"><Bookmark className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                      <span>Hourly</span>
                      <span className="font-bold text-slate-800">$25 - $40 / hr</span>
                      <span>Expert</span>
                      <span>Proposals: 22</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">Posted 5 hours ago</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">My Projects</h3>
            <button className="text-xs font-semibold text-[#2d5bff]">View all</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2d5bff]/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#2d5bff]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">E-commerce Website Development</h4>
                  <span className="text-[10px] font-bold text-[#2d5bff] bg-[#2d5bff]/10 px-2 py-0.5 rounded-full mt-1 inline-block">In Progress</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Due in 10 days</div>
                <div className="text-sm font-bold text-slate-800 mt-1">60%</div>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#2d5bff] w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Mobile App Design</h4>
                  <span className="text-[10px] font-bold text-[#2d5bff] bg-[#2d5bff]/10 px-2 py-0.5 rounded-full mt-1 inline-block">In Progress</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Due in 5 days</div>
                <div className="text-sm font-bold text-slate-800 mt-1">80%</div>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#2d5bff] w-[80%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Logo Design for Startup</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">Completed</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Completed on 20 May</div>
                <div className="text-sm font-bold text-slate-800 mt-1">100%</div>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>

    </div>
  );
}
