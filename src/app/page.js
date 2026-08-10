'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import CanvasLoader from '@/components/3d/CanvasLoader';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Briefcase, 
  Code, 
  Cpu, 
  Zap, 
  Star, 
  CheckCircle2,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { SAMPLE_USERS, SAMPLE_JOBS } from '@/lib/store';

// Dynamic import of 3D Hero Canvas with SSR disabled to prevent hydration mismatches
const Hero3DCanvas = dynamic(() => import('@/components/3d/Hero3DCanvas'), {
  ssr: false,
  loading: () => <CanvasLoader />
});

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState('CLIENT');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const freelancers = SAMPLE_USERS.filter(u => u.role === 'FREELANCER');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern relative">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full space-y-20">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Next.js 15 • React Three Fiber • Stripe Escrow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Hire Top 3D Talent on the <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">3D Mesh Platform</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Connect with elite WebGL graphics engineers, R3F developers, and full-stack architects. 100% secured through automated Stripe Connect escrow protection.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/jobs"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.02] transition duration-300 flex items-center gap-2"
              >
                <span>Find Top 3D Talent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/jobs/create"
                className="px-7 py-3.5 rounded-2xl glass-panel border border-white/20 text-white font-bold text-sm hover:border-cyan-400 hover:bg-slate-900/60 transition duration-300 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Post a Job Free</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Stripe Escrow Lock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>60fps R3F Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>KYC Verified Talent</span>
              </div>
            </div>

          </div>

          {/* 3D HERO CANVAS */}
          <div className="lg:col-span-6">
            <Hero3DCanvas />
          </div>

        </section>

        {/* METRICS & TELEMETRY BANNER */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 flex items-center gap-1">
              $524,000+
            </div>
            <p className="text-xs text-slate-400 font-medium">Total Escrow GMV Processed</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-violet-400 flex items-center gap-1">
              99.8%
            </div>
            <p className="text-xs text-slate-400 font-medium">Milestone Approval Rate</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center gap-1">
              1,840+
            </div>
            <p className="text-xs text-slate-400 font-medium">Verified 3D & AI Engineers</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1">
              &lt; 24 hrs
            </div>
            <p className="text-xs text-slate-400 font-medium">Average Proposal Time</p>
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Explore 3D Skill Taxonomy</h2>
              <p className="text-xs text-slate-400 mt-1">Specialized engineering categories backed by verified portfolio reviews</p>
            </div>
            <Link href="/jobs" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">React Three Fiber & WebGL</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Interactive 3D product visualizers, GLSL shader effects, particle engines, and instanced mesh optimizations.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span>124 Active Jobs</span>
                <span>Avg $95/hr</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Next.js 15 Full Stack</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  App Router server actions, Prisma ORM schema migrations, PostgreSQL database scaling, and real-time sockets.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-violet-400 font-medium">
                <span>98 Active Jobs</span>
                <span>Avg $110/hr</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Stripe Escrow & Payments</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Multi-tenant Stripe Connect accounts, custom milestone hold triggers, and dispute arbitration pipelines.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>65 Active Jobs</span>
                <span>Avg $105/hr</span>
              </div>
            </div>
          </div>
        </section>

        {/* TOP VERIFIED TALENT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Top Rated 3D Freelancers</h2>
              <p className="text-xs text-slate-400 mt-1">Pre-vetted developers available for instant contract award</p>
            </div>
            <Link href="/onboarding" className="text-xs font-bold text-cyan-400 hover:underline">
              Join as Freelancer
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freelancers.map(talent => (
              <div key={talent.id} className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col sm:flex-row gap-5">
                <img
                  src={talent.avatarUrl}
                  alt={talent.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-cyan-500/30"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        {talent.name} <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">${talent.hourlyRate}/hr • {talent.jobsCompleted} Jobs Completed</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{talent.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                    {talent.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {talent.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10 text-[10px] font-medium text-cyan-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="p-10 sm:p-14 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-violet-950/60 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Launch Your 3D Platform Work?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Post your job in under 2 minutes or submit proposals for top high-paying 3D WebGL contracts today.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/jobs/create"
                className="px-8 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-400/20 transition"
              >
                Post a Job Now
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-3.5 rounded-2xl bg-slate-900 border border-white/20 text-white font-bold text-sm hover:border-cyan-400 transition"
              >
                Browse Job Feed
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
