'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#080d14] text-slate-400 pt-16 pb-10 border-t border-slate-800/60 overflow-hidden">
      {/* Subtle Radial Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo Recreation matching design request */}
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <svg className="w-6 h-6 text-cyan-500 drop-shadow-md relative left-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11l3 3 7-7" className="text-slate-800" />
                  <path d="M4 14l3 3 7-7" className="text-cyan-500" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-widest drop-shadow-sm">WORKIFFY</span>
            </Link>
            
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Workiffy is India's growing freelance marketplace. Connect skilled freelancers with quality clients — fast, safe, and transparent.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
                <Shield className="w-4 h-4 text-[#cc0000] drop-shadow-[0_0_4px_rgba(204,0,0,0.5)]" />
                <span>100% Secure Escrow Payments</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
                <Globe className="w-4 h-4 text-[#cc0000] drop-shadow-[0_0_4px_rgba(204,0,0,0.5)]" />
                <span>Remote-First · Available Across India</span>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-5 lg:ml-8">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Clients</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/post-project" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Post a Project</Link></li>
              <li><Link href="/freelancers" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Browse Freelancers</Link></li>
              <li><Link href="/client/dashboard" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Client Dashboard</Link></li>
              <li><Link href="/client/projects" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">My Projects</Link></li>
              <li><Link href="/client/payments" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Payments & Billing</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Freelancers</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/jobs" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Find Jobs</Link></li>
              <li><Link href="/create-profile" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Create Profile</Link></li>
              <li><Link href="/freelancer/dashboard" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Freelancer Dashboard</Link></li>
              <li><Link href="/freelancer/proposals" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">My Proposals</Link></li>
              <li><Link href="/membership-plans" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Membership Plans</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/about" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">About Workiffy</Link></li>
              <li><Link href="/how-it-works" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Pricing</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Workiffy. All rights reserved. Made with <span className="text-[#cc0000]">❤️</span> in India.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Terms</Link>
            <Link href="/privacy" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Privacy</Link>
            <Link href="/contact" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
