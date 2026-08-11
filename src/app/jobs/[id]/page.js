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
  CreditCard,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

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
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  const [milestones, setMilestones] = useState([
    { title: 'Milestone 1: Setup & Initial Architecture', amount: 500 },
    { title: 'Milestone 2: Final Polish & Delivery', amount: 500 }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

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
    }
  };

  const handlePayment = async (amountUSD, isSubscription) => {
    if (!isRazorpayLoaded) {
      alert("Razorpay SDK is not loaded yet!");
      return;
    }
    
    // Amount is in currency subunits (paise for INR). Assuming 1 USD = 80 INR roughly for demo.
    const amountINR = amountUSD * 80 * 100;

    const options = {
      key: "rzp_test_YourTestKey", // Mock Key
      amount: amountINR.toString(), 
      currency: "INR",
      name: "Workiffy Marketplace",
      description: isSubscription ? "1 Month Freelancer Pro Subscription" : "Single Proposal Connects Fee",
      image: "https://marketplace-work-rose.vercel.app/favicon.ico",
      handler: async function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        
        if (isSubscription) {
          // Update subscription in backend
          await fetch('/api/user/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: 'FREELANCER_PRO', durationDays: 30 })
          });
          setHasSubscription(true);
        }
        
        setShowPaywall(false);
        executeProposalSubmit(); // Immediately submit proposal after payment
      },
      prefill: {
        name: session?.user?.name || "Freelancer",
        email: session?.user?.email || "freelancer@example.com",
      },
      theme: {
        color: "#ff2a5f", // Red Theme
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        onLoad={() => setIsRazorpayLoaded(true)} 
      />
      <Navbar
        activeRole="FREELANCER"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowPaywall(false); setShowProposalModal(true); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <CreditCard className="w-8 h-8 text-[#ff2a5f]" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Submit Your Proposal</h2>
              <p className="text-sm text-slate-600">Choose a payment option to apply for this job.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-black bg-slate-50 transition cursor-pointer flex justify-between items-center group" onClick={() => handlePayment(1, false)}>
                <div>
                  <h3 className="font-bold text-black text-lg">Single Proposal</h3>
                  <p className="text-xs text-slate-500 mt-1">Pay once for this specific application.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-black">$1</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-[#ff2a5f] bg-red-50 transition cursor-pointer flex justify-between items-center relative overflow-hidden" onClick={() => handlePayment(5, true)}>
                <div className="absolute top-0 right-0 bg-[#ff2a5f] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMMENDED</div>
                <div>
                  <h3 className="font-bold text-[#ff2a5f] text-lg">Pro Subscription</h3>
                  <p className="text-xs text-slate-600 mt-1">Unlimited proposals for 30 days.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-black">$5<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Or Pay via PayPal</p>
                <a 
                  href="https://paypal.me/YOUR_PAYPAL_LINK_HERE" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#003087] hover:bg-[#001c56] text-white font-bold text-sm transition"
                >
                  Pay with PayPal
                </a>
                <p className="text-[10px] text-slate-400 mt-2">After paying via PayPal, contact admin to verify.</p>
              </div>

            </div>
          </div>
        </div>
      )}


      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <Link href="/jobs" className="text-xs font-bold text-[#ff2a5f] flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Job Feed
        </Link>

        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 border border-slate-200 rounded-3xl">
            Loading job details...
          </div>
        ) : !job ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 border border-slate-200 rounded-3xl">
            Job contract not found.
          </div>
        ) : (
          /* Job Header Glass Panel */
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {job.category}
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
                {job.type === 'FIXED_PRICE' ? `$${job.budget.toLocaleString()}` : `$${job.budget}/hr`}
              </div>
              <div className="text-xs text-slate-500 font-bold">{job.type.replace('_', ' ')}</div>
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
              {job.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setShowProposalModal(true)}
              className="px-8 py-3.5 rounded-xl bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Proposal
            </button>
          </div>
        </div>
        )}

        {/* PROPOSAL SUBMISSION MODAL */}
        {showProposalModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ff2a5f]" /> Submit Proposal
                  </h2>
                  <p className="text-xs text-slate-500">Define your bid, cover letter, and escrow milestones</p>
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
                      className="text-xs text-[#ff2a5f] font-bold hover:underline flex items-center gap-1"
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

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-3.5 rounded-xl bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitted ? 'Submitting to Client...' : (hasSubscription ? 'Submit Official Proposal' : 'Pay & Submit Proposal')}
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
