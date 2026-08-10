'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  Lock,
  RotateCcw
} from 'lucide-react';
import { SAMPLE_DISPUTES } from '@/lib/store';

export default function AdminConsolePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [disputes, setDisputes] = useState(SAMPLE_DISPUTES);
  
  // Platform Metrics
  const metrics = {
    gmvTotal: 524000,
    platformRevenue: 52400, // 10% fee
    escrowHoldBalance: 84500,
    totalUsers: 1840,
    activeJobs: 124,
    disputesOpen: disputes.filter(d => !d.status.startsWith('RESOLVED')).length
  };

  const handleResolveDispute = (disputeId, action) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return { ...d, status: `RESOLVED_${action}` };
      }
      return d;
    }));
    alert(`Dispute ${disputeId} arbitration executed: ${action}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar
        activeRole="ADMIN"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Header */}
        <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-xs font-mono text-emerald-400 border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Governance Console
          </div>
          <h1 className="text-3xl font-extrabold text-white">Platform Telemetry & Escrow Arbitration</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time GMV tracking, fee configuration, user KYC overrides, and dispute resolution</p>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-xs font-semibold text-slate-400">Total GMV Processed</div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">${metrics.gmvTotal.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400">Gross Merchandise Volume</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-1 bg-emerald-950/20">
            <div className="text-xs font-semibold text-emerald-400">Platform Revenue (10% Fee)</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">${metrics.platformRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400">Escrow Transaction Commissions</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-xs font-semibold text-slate-400">Stripe Escrow Hold Balance</div>
            <div className="text-2xl sm:text-3xl font-black text-violet-400">${metrics.escrowHoldBalance.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400">Secured Funds in Escrow</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-1 bg-amber-950/20">
            <div className="text-xs font-semibold text-amber-400">Open Escrow Disputes</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{metrics.disputesOpen}</div>
            <p className="text-[10px] text-slate-400">Requires Admin Arbitration</p>
          </div>
        </div>

        {/* ESCROW DISPUTE RESOLUTION TABLE */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Escrow Dispute Resolution Queue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Review client & freelancer milestone claims for final fund release or refund</p>
            </div>
          </div>

          <div className="space-y-4">
            {disputes.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                      DISPUTE #{d.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{d.jobTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Client: <strong className="text-white">{d.clientName}</strong> • Freelancer: <strong className="text-cyan-400">{d.freelancerName}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-amber-400">${d.disputedAmount.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-slate-400">Disputed Escrow Amount</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300">
                  <strong className="text-slate-400">Dispute Reason:</strong> "{d.reason}"
                </div>

                {/* Arbitration Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className={`text-xs font-bold ${d.status.startsWith('RESOLVED') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Status: {d.status}
                  </span>

                  {!d.status.startsWith('RESOLVED') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveDispute(d.id, 'RELEASE_FREELANCER')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Release to Freelancer
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, 'REFUND_CLIENT')}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold cursor-pointer"
                      >
                        Refund Client
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, 'SPLIT_50_50')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        Split 50/50
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
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
