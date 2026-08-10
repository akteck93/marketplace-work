'use client';

import React, { useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { SAMPLE_JOBS } from '@/lib/store';

export default function JobDetailPage({ params }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;
  const job = SAMPLE_JOBS.find(j => j.id === jobId) || SAMPLE_JOBS[0];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(job.type === 'FIXED_PRICE' ? job.budget : 95);
  const [coverLetter, setCoverLetter] = useState('Hi! I am a senior R3F & Next.js 15 developer. I have extensive experience building interactive 3D canvases and escrow pipelines.');
  
  // Custom Milestones Breakdown
  const [milestones, setMilestones] = useState([
    { title: 'Milestone 1: 3D Scene Architecture & Lighting', amount: 1500 },
    { title: 'Milestone 2: Glowing Node Paths & Controls', amount: 1500 },
    { title: 'Milestone 3: Final Integration & Polish', amount: 1200 }
  ]);

  const [submitted, setSubmitted] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { title: `Milestone ${milestones.length + 1}`, amount: 1000 }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowProposalModal(false);
      setSubmitted(false);
      alert('Proposal successfully submitted to Client!');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar
        activeRole="FREELANCER"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <Link href="/jobs" className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Job Feed
        </Link>

        {/* Job Header Glass Panel */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-bold">
                {job.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">{job.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Posted by {job.clientName}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Verified Stripe Escrow Client
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right p-4 rounded-2xl bg-slate-900/90 border border-white/10">
              <div className="text-2xl font-black text-emerald-400">
                {job.type === 'FIXED_PRICE' ? `$${job.budget.toLocaleString()}` : `$${job.budget}/hr`}
              </div>
              <div className="text-xs text-slate-400 font-mono">{job.type.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Job Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Required Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={() => setShowProposalModal(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Proposal & Milestone Breakdown
            </button>
          </div>
        </div>

        {/* PROPOSAL SUBMISSION MODAL */}
        {showProposalModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl glass-panel bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Submit Proposal for Contract
                  </h2>
                  <p className="text-xs text-slate-400">Define your bid, cover letter, and escrow milestone breakdown</p>
                </div>
                <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-white text-xs">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-6">
                
                {/* Total Bid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Total Bid Amount ($)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-sm font-bold text-cyan-400"
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Letter</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Milestone Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Escrow Milestone Breakdown</label>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-2">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-white/10">
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-white"
                        />
                        <input
                          type="number"
                          value={m.amount}
                          onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                          className="w-28 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs font-bold text-cyan-400"
                        />
                        {milestones.length > 1 && (
                          <button type="button" onClick={() => removeMilestone(idx)} className="text-slate-500 hover:text-red-400 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitted ? 'Submitting to Client...' : 'Submit Official Proposal'}
                </button>

              </form>

            </div>
          </div>
        )}

      </main>

      <Footer />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
