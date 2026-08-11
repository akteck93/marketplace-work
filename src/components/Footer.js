'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Globe, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-slate-400 pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <img src="/logo.png" alt="Workiffy" className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Workiffy is India's growing freelance marketplace. Connect skilled freelancers with quality clients — fast, safe, and transparent.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Shield className="w-4 h-4 text-[#cc0000]" />
              <span>100% Secure Escrow Payments</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Globe className="w-4 h-4 text-[#cc0000]" />
              <span>Remote-First · Available Across India</span>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs/create" className="hover:text-white transition">Post a Project</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition">Browse Freelancers</Link></li>
              <li><Link href="/dashboard/client" className="hover:text-white transition">Client Dashboard</Link></li>
              <li><Link href="/dashboard/client/projects" className="hover:text-white transition">My Projects</Link></li>
              <li><Link href="/dashboard/client/payments" className="hover:text-white transition">Payments & Billing</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Freelancers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition">Find Jobs</Link></li>
              <li><Link href="/signup" className="hover:text-white transition">Create Profile</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-white transition">Freelancer Dashboard</Link></li>
              <li><Link href="/dashboard/freelancer/proposals" className="hover:text-white transition">My Proposals</Link></li>
              <li><Link href="/dashboard/freelancer/membership" className="hover:text-white transition">Membership Plans</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Workiffy</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} Workiffy. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
