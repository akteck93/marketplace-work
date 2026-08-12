'use client';

import React, { useState, use, useEffect } from 'react';
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
  ArrowLeft,
  X,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const PAYPAL_ME = 'https://paypal.me/aloks272';

export default function JobDetailPage({ params }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;
  const { data: session } = useSession();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(1000);
  const [coverLetter, setCoverLetter] = useState('Hi! I am experienced with this stack. I would love to build this project for you.');
  
  const [milestones, setMilestones] = useState([
    { title: 'Milestone 1: Setup & Initial Architecture', amount: 500 },
    { title: 'Milestone 2: Final Polish & Delivery', amount: 500 }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [paypalOpened, setPaypalOpened] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.subscriptionActiveUntil) {
            const expDate = new Date(data.subscriptionActiveUntil);
            if (expDate > new Date()) {
              setHasSubscription(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check subscription", err);
      }
    };
    if (session) {
      checkSubscription();
    }
  }, [session]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/feed`);
      const data = await res.json();
      if (data.success) {
        const found = data.jobs.find(j => j.id === jobId);
        setJob(found || data.jobs[0]);
        if (found) setBidAmount(found.budget || 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: `Milestone ${milestones.length + 1}`, amount: 500 }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const executeProposalSubmit = async () => {
    setSubmitted(true);
    try {
      const res = await fetch('/api/proposals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          bidAmount: parseFloat(bidAmount),
          coverLetter
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Proposal successfully submitted to Client!');
        setShowProposalModal(false);
      } else {
        alert(data.error || 'Failed to submit proposal. Make sure you are logged in as a Freelancer.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting proposal.');
    } finally {
      setSubmitted(false);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (hasSubscription) {
      executeProposalSubmit();
    } else {
      setShowPaywall(true);
      setShowProposalModal(false);
      setPaypalOpened(false);
      setSelectedPlan(null);
    }
  };

  const openPayPal = (plan) => {
    setSelectedPlan(plan);
    const amount = plan === 'single' ? '1' : '5';
    const note = plan === 'single' ? 'Workiffy-Single-Proposal' : 'Workiffy-Freelancer-Pro';
    window.open(`${PAYPAL_ME}/${amount}USD?note=${note}`, '_blank');
    setPaypalOpened(true);
  };

  const handlePayPalConfirm = async () => {
    if (selectedPlan === 'pro') {
      try {
        await fetch('/api/user/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'FREELANCER_PRO', durationDays: 30 })
        });
        setHasSubscription(true);
      } catch (err) {
        console.error('Subscription update failed', err);
      }
    }
    setShowPaywall(false);
    executeProposalSubmit();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Navbar
        activeRole="FREELANCER"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      {/* PayPal Payment Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => { setShowPaywall(false); setShowProposalModal(true); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#003087]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#003087] font-black text-2xl">P</span>
              </div>
              <h2 className="text-2xl font-black text-black mb-2">Apply for this Job</h2>
              <p className="text-sm text-slate-500">Choose a plan and pay via PayPal to submit your proposal.</p>
            </div>

            {!paypalOpened ? (
              <div className="space-y-4">
                <button
                  onClick={() => openPayPal('single')}
                  className="w-full p-5 rounded-2xl border-2 border-slate-200 hover:border-black bg-white transition text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-black text-lg">Single Apply</h3>
                      <p className="text-xs text-slate-500 mt-1">Pay once to submit this proposal.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-black">$1</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-black transition" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => openPayPal('pro')}
                  className="w-full p-5 rounded-2xl border-2 border-[#cc0000] bg-red-50 hover:bg-red-100 transition text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#cc0000] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl">BEST VALUE</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#cc0000] text-lg">Pro Subscription</h3>
                      <p className="text-xs text-slate-600 mt-1">Unlimited proposals for 30 days.</p>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-black">$5</span>
                      <span className="text-xs text-slate-500 font-normal">/mo</span>
                    </div>
                  </div>
                </button>

                <p className="text-center text-xs text-slate-400 pt-2">Clicking will open PayPal in a new tab.</p>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 bg-[#003087] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-black text-lg">P</span>
                  </div>
                  <p className="font-bold text-black text-sm">PayPal opened in new tab</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Amount: <strong>{selectedPlan === 'single' ? '$1 USD' : '$5 USD'}</strong> to <strong>@aloks272</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePayPalConfirm}
                    disabled={submitted}
                    className="w-full py-4 bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
                  >
                    {submitted ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Proposal...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> I've Paid — Submit My Proposal</>
                    )}
                  </button>
                  <button
                    onClick={() => openPayPal(selectedPlan)}
                    className="w-full py-3 border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Re-open PayPal
                  </button>
                  <button
                    onClick={() => setPaypalOpened(false)}
                    className="text-xs text-slate-400 hover:text-black underline"
                  >
                    ← Back to plan selection
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">Our team will verify your PayPal payment within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <Link href="/jobs" className="text-xs font-bold text-[#cc0000] flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Job Feed
        </Link>

        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 border border-slate-200 rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-slate-400" />
            Loading job details...
          </div>
        ) : !job ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 border border-slate-200 rounded-3xl">
            Job not found.
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {job.category?.name || job.category || 'General'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black mt-3">{job.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Posted by {job.clientName}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" /> Verified Client
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-2xl font-black text-black">
                  {job.type === 'FIXED_PRICE' ? `$${job.budget?.toLocaleString()}` : `$${job.budget}/hr`}
                </div>
                <div className="text-xs text-slate-500 font-bold">{job.type?.replace('_', ' ')}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">Job Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowProposalModal(true)}
                className="px-8 py-3.5 rounded-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Proposal
              </button>
            </div>
          </div>
        )}

        {/* PROPOSAL SUBMISSION MODAL */}
        {showProposalModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#cc0000]" /> Submit Proposal
                  </h2>
                  <p className="text-xs text-slate-500">Define your bid, cover letter, and milestones</p>
                </div>
                <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-black">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <form onSubmit={handlePreSubmit} className="space-y-6">
                
                {/* Total Bid */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Your Total Bid Amount ($)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Cover Letter</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* Milestone Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Escrow Milestone Breakdown</label>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-xs text-[#cc0000] font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-2">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-black"
                        />
                        <input
                          type="number"
                          value={m.amount}
                          onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                          className="w-28 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-black"
                        />
                        {milestones.length > 1 && (
                          <button type="button" onClick={() => removeMilestone(idx)} className="text-slate-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#003087]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#003087] font-black text-sm">P</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-black">Payment via PayPal</p>
                    <p className="text-slate-500 text-xs">Single apply: <strong>$1</strong> · Pro (30 days unlimited): <strong>$5</strong></p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-4 rounded-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                  ) : (
                    <>{hasSubscription ? 'Submit Proposal (Pro Member)' : 'Continue to Payment'}</>
                  )}
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
