'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cpu, Lock, Terminal, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 pt-16 pb-12 bg-slate-950/90 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">Workiffy 3D</span>
            </div>
            <p className="text-xs leading-relaxed">
              Upwork-Grade 3D Freelance Marketplace powered by Next.js 15, React Three Fiber canvas rendering, and Stripe Connect Escrow security.
            </p>
            <div className="flex items-center gap-3 text-xs text-cyan-400 font-mono">
              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> R3F 3D Engine</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Stripe Escrow</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top 3D Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/jobs?skill=React+Three+Fiber" className="hover:text-cyan-400 transition">React Three Fiber & WebGL</Link></li>
              <li><Link href="/jobs?category=3D+%26+WebGL+Development" className="hover:text-cyan-400 transition">Blender 3D Asset Design</Link></li>
              <li><Link href="/jobs?skill=Next.js+15" className="hover:text-cyan-400 transition">Next.js 15 Full Stack AI</Link></li>
              <li><Link href="/jobs?category=UI%2FUX+%26+Frontend" className="hover:text-cyan-400 transition">Glassmorphism UI Systems</Link></li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/jobs/create" className="hover:text-cyan-400 transition">Client Job Posting Wizard</Link></li>
              <li><Link href="/jobs" className="hover:text-cyan-400 transition">Freelancer Proposal Bidding</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-cyan-400 transition">3D Isometric Progress Canvas</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition">Super Admin & Dispute Arbitration</Link></li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Security & Escrow</h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4" /> KYC Verified Payouts
              </div>
              <p className="text-[11px] text-slate-400">
                100% of contract funds are locked in Stripe Escrow until client approves delivered work milestones.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Workiffy 3D Marketplace Platform. Built with Next.js 15, Prisma ORM, and R3F.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-400" /> Global Nodes</span>
            <span>Terms of Escrow</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
