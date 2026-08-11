'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  Briefcase, 
  DollarSign, 
  Tag, 
  Plus, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import Link from 'next/link';

export default function CreateJobPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

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
  
  // Payment State
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    // Fetch dynamic categories from DB
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
    // Check if user has an active subscription
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
        setTimeout(() => {
          router.push('/dashboard/client');
        }, 800);
      } else {
        alert("Failed to post job.");
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
      description: isSubscription ? "1 Month Client Subscription" : "Single Job Post Fee",
      image: "https://marketplace-work-rose.vercel.app/favicon.ico",
      handler: async function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        
        if (isSubscription) {
          // Update subscription in backend
          await fetch('/api/user/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: 'CLIENT_PRO', durationDays: 30 })
          });
          setHasSubscription(true);
        }
        
        setShowPaywall(false);
        executeJobPost();
      },
      prefill: {
        name: session?.user?.name || "Client User",
        email: session?.user?.email || "client@example.com",
      },
      theme: {
        color: "#ff2a5f", // Red theme for Razorpay
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
        activeRole="CLIENT"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <CreditCard className="w-8 h-8 text-[#ff2a5f]" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Publish Your Contract</h2>
              <p className="text-sm text-slate-600">Choose a payment option to post this job to the marketplace.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-black bg-slate-50 transition cursor-pointer flex justify-between items-center group" onClick={() => handlePayment(1, false)}>
                <div>
                  <h3 className="font-bold text-black text-lg">Single Post</h3>
                  <p className="text-xs text-slate-500 mt-1">Pay once for this specific job posting.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-black">$1</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-[#ff2a5f] bg-red-50 transition cursor-pointer flex justify-between items-center relative overflow-hidden" onClick={() => handlePayment(5, true)}>
                <div className="absolute top-0 right-0 bg-[#ff2a5f] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMMENDED</div>
                <div>
                  <h3 className="font-bold text-[#ff2a5f] text-lg">Pro Subscription</h3>
                  <p className="text-xs text-slate-600 mt-1">Unlimited job posts for 30 days.</p>
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

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-black">Post a New Contract</h1>
          <p className="text-xs text-slate-500">Reach over 1,840+ verified top-tier developers</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handlePreSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Contract Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Build Interactive 3D Product Visualizer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black"
              />
            </div>

            {/* Category, Subcategory & Type */}
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
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Budget Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('FIXED_PRICE')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'FIXED_PRICE'
                        ? 'bg-black text-white border-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('HOURLY')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'HOURLY'
                        ? 'bg-black text-white border-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Hourly Rate
                  </button>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {type === 'FIXED_PRICE' ? 'Estimated Fixed Budget ($)' : 'Hourly Rate Cap ($/hr)'}
              </label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-black focus:outline-none focus:border-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Job Description & Scope</label>
              <textarea
                rows={5}
                required
                placeholder="Describe project deliverables and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black"
              />
            </div>

            {/* Required Skills Tagging */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Required Skills Tagging</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js"
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
                  <span key={idx} className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-1.5">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="text-red-400 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publishing Job Contract...</span>
              ) : (
                <>
                  <span>{hasSubscription ? "Publish Contract to Marketplace" : "Pay & Publish Contract"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
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
