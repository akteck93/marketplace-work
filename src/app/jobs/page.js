'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_JOBS } from '@/lib/store';

export default function JobFeedPage() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'FIXED_PRICE' | 'HOURLY'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const categories = ['ALL', '3D & WebGL Development', 'Full Stack & Payments', 'UI/UX & Frontend'];

  const filteredJobs = jobs.filter(j => {
    const matchesQuery = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || j.type === selectedType;
    const matchesCategory = selectedCategory === 'ALL' || j.category === selectedCategory;
    const matchesSkill = !selectedSkill || j.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()));
    return matchesQuery && matchesType && matchesCategory && matchesSkill;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar
        activeRole="FREELANCER"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Search Banner */}
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-violet-950/40 space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Freelancer Marketplace Feed</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Explore High-Paying 3D & AI Contracts</h1>
          </div>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              placeholder="Search contracts by keyword, R3F, Next.js 15, Three.js..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>
        </div>

        {/* Main Content Layout with Facet Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Facets Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-white pb-2 border-b border-white/10">
                <Filter className="w-4 h-4 text-cyan-400" /> Filter Facets
              </div>

              {/* Budget Type Facet */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Contract Type</label>
                <div className="space-y-1 text-xs">
                  {['ALL', 'FIXED_PRICE', 'HOURLY'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        selectedType === t
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {t === 'ALL' ? 'All Types' : t === 'FIXED_PRICE' ? 'Fixed Price Budget' : 'Hourly Rate'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Facet */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Category Facet</label>
                <div className="space-y-1 text-xs">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        selectedCategory === c
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 font-bold'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {c === 'ALL' ? 'All Categories' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Tag Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Filter by Skill Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Three.js"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>

            </div>
          </aside>

          {/* Job Feed List */}
          <section className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing <strong>{filteredJobs.length}</strong> open job contracts</span>
              <span className="text-cyan-400 font-mono">Real-time updates</span>
            </div>

            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6 rounded-3xl glass-card border border-white/10 space-y-4 relative group">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-semibold">
                      {job.category}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-400 transition">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h2>
                  </div>

                  {/* Budget Badge */}
                  <div className="text-right sm:text-right">
                    <div className="text-lg font-extrabold text-emerald-400">
                      {job.type === 'FIXED_PRICE' ? `$${job.budget.toLocaleString()}` : `$${job.budget}/hr`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{job.type.replace('_', ' ')}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {job.description}
                </p>

                {/* Tags & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Verified Escrow Client
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition shadow-md shadow-cyan-500/20"
                    >
                      Submit Proposal <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}

          </section>

        </div>

      </main>

      <Footer />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
