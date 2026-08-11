'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  ArrowRight,
  CreditCard,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const PAYPAL_ME = 'https://paypal.me/aloks272';

export default function CreateJobPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [type, setType] = useState('FIXED_PRICE');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Categories
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Payment Modal State
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [paypalOpened, setPaypalOpened] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // 'single' | 'pro'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          const firstCat = data.categories[0];
          setCategory(firstCat.id);
          setSubcategories(firstCat.subcategories || []);
          if (firstCat.subcategories?.length > 0) {
            setSubcategory(firstCat.subcategories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.subscriptionActiveUntil) {
            const expDate = new Date(data.subscriptionActiveUntil);
            if (expDate > new Date()) setHasSubscription(true);
          }
        }
      } catch (err) {
        console.error('Failed to check subscription', err);
      }
    };
    if (session) checkSubscription();
  }, [session]);

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    const found = categories.find(c => c.id === categoryId);
    const subs = found?.subcategories || [];
    setSubcategories(subs);
    setSubcategory(subs.length > 0 ? subs[0].id : '');
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const executeJobPost = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId: category || undefined,
          subcategoryId: subcategory || undefined,
          type,
          budget: parseFloat(budget),
          description,
          skills
        })
      });

      if (res.ok) {
        setTimeout(() => router.push('/dashboard/client'), 800);
      } else {
        alert('Failed to post job. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (hasSubscription) {
      executeJobPost();
    } else {
      setShowPaywall(true);
      setPaypalOpened(false);
      setSelectedPlan(null);
    }
  };

  // Open PayPal with correct amount, then show confirmation button
  const openPayPal = (plan) => {
    setSelectedPlan(plan);
    const amount = plan === 'single' ? '1' : '5';
    const note = plan === 'single' ? 'Workiffy-Single-Post' : 'Workiffy-Pro-Subscription';
    window.open(`${PAYPAL_ME}/${amount}USD?note=${note}`, '_blank');
    setPaypalOpened(true);
  };

  // Called after user confirms they've paid on PayPal
  const handlePayPalConfirm = async () => {
    if (selectedPlan === 'pro') {
      try {
        await fetch('/api/user/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'CLIENT_PRO', durationDays: 30 })
        });
        setHasSubscription(true);
      } catch (err) {
        console.error('Subscription update failed', err);
      }
    }
    setShowPaywall(false);
    executeJobPost();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Navbar
        activeRole="CLIENT"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      {/* ─── PayPal Payment Modal ─── */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#003087]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#003087]" />
              </div>
              <h2 className="text-2xl font-black text-black mb-2">Choose a Plan</h2>
              <p className="text-sm text-slate-500">Pay securely via PayPal to publish your job.</p>
            </div>

            {/* Plan Options */}
            {!paypalOpened ? (
              <div className="space-y-4">
                {/* Single Post */}
                <button
                  onClick={() => openPayPal('single')}
                  className="w-full p-5 rounded-2xl border-2 border-slate-200 hover:border-black bg-white transition text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-black text-lg">Single Post</h3>
                      <p className="text-xs text-slate-500 mt-1">Pay once for this specific job posting.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-black">$1</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-black transition" />
                    </div>
                  </div>
                </button>

                {/* Pro Subscription */}
                <button
                  onClick={() => openPayPal('pro')}
                  className="w-full p-5 rounded-2xl border-2 border-[#cc0000] bg-red-50 hover:bg-red-100 transition text-left relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-[#cc0000] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl">BEST VALUE</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#cc0000] text-lg">Pro Subscription</h3>
                      <p className="text-xs text-slate-600 mt-1">Unlimited job posts for 30 days.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-2xl font-black text-black">$5</span>
                        <span className="text-xs text-slate-500 font-normal">/mo</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#cc0000] group-hover:opacity-70 transition" />
                    </div>
                  </div>
                </button>

                <p className="text-center text-xs text-slate-400 pt-2">
                  Clicking will open PayPal in a new tab. Come back to confirm after payment.
                </p>
              </div>
            ) : (
              /* After PayPal opened — Confirmation screen */
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
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Publishing Job...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> I've Paid — Publish My Job</>
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
                    className="text-xs text-slate-400 hover:text-black transition underline"
                  >
                    ← Back to plan selection
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  After clicking "I've Paid", your job will be published. Our team will verify your PayPal payment within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Main Form ─── */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-black">Post a New Job</h1>
          <p className="text-sm text-slate-500">Reach thousands of verified freelancers on Workiffy</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handlePreSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Job Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Build a React dashboard with Tailwind CSS"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black"
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black focus:outline-none focus:border-black"
                >
                  {categories.length === 0 && (
                    <option disabled value="">Loading categories...</option>
                  )}
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Subcategory <span className="text-slate-400 font-normal">(optional)</span></label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black focus:outline-none focus:border-black"
                >
                  <option value="">-- Select Subcategory --</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Budget Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('FIXED_PRICE')}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                    type === 'FIXED_PRICE' ? 'bg-black text-white border-black' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Fixed Price
                </button>
                <button
                  type="button"
                  onClick={() => setType('HOURLY')}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                    type === 'HOURLY' ? 'bg-black text-white border-black' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Hourly Rate
                </button>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {type === 'FIXED_PRICE' ? 'Budget ($)' : 'Hourly Rate ($/hr)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder={type === 'FIXED_PRICE' ? 'e.g. 500' : 'e.g. 25'}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Job Description <span className="text-red-500">*</span></label>
              <textarea
                rows={5}
                required
                placeholder="Describe what you need, deliverables, timeline, and any requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Required Skills</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Figma"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold flex items-center gap-1.5">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="text-white/60 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing Info Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#003087]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#003087] font-black text-sm">P</span>
              </div>
              <div className="text-sm">
                <p className="font-bold text-black">Payment via PayPal</p>
                <p className="text-slate-500 text-xs mt-0.5">Single post: <strong>$1</strong> · Pro subscription (30 days unlimited): <strong>$5</strong></p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold text-base shadow-md transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
              ) : (
                <>{hasSubscription ? 'Publish Job — Free (Pro Member)' : 'Continue to Payment'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

          </form>
        </div>
      </main>

      <Footer />
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
