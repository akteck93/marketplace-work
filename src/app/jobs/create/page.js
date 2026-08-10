'use client';

import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('3D & WebGL Development');
  const [type, setType] = useState('FIXED_PRICE'); // 'FIXED_PRICE' | 'HOURLY'
  const [budget, setBudget] = useState(3500);
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['React Three Fiber', 'Next.js 15', 'Three.js']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          type,
          budget,
          description,
          skills
        })
      });

      if (res.ok) {
        setTimeout(() => {
          router.push('/dashboard/client');
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar
        activeRole="CLIENT"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-mono text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Client Job Posting Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Post a New 3D Contract</h1>
          <p className="text-xs text-slate-400">Reach over 1,840+ verified 3D & Full Stack developers</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contract Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Build Interactive 3D Product Visualizer with R3F & Next.js 15"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="3D & WebGL Development">3D & WebGL Development</option>
                  <option value="Full Stack & Payments">Full Stack & Payments</option>
                  <option value="UI/UX & Frontend">UI/UX & Frontend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Budget Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('FIXED_PRICE')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'FIXED_PRICE'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('HOURLY')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'HOURLY'
                        ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    Hourly Rate
                  </button>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {type === 'FIXED_PRICE' ? 'Estimated Fixed Budget ($)' : 'Hourly Rate Cap ($/hr)'}
              </label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-emerald-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description & Scope</label>
              <textarea
                rows={5}
                required
                placeholder="Describe project deliverables, 3D performance targets, GLTF model requirements, and timeline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Required Skills Tagging */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills Tagging</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. GLSL Shaders, Prisma"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-1.5">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Escrow Notice */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Stripe Connect Escrow will automatically secure funds once you accept a freelancer proposal.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publishing Job Contract...</span>
              ) : (
                <>
                  <span>Publish Contract to Marketplace</span>
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
