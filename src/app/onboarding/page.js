'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  User, 
  Briefcase, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  Plus, 
  X, 
  Upload,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState('FREELANCER'); // 'FREELANCER' | 'CLIENT'
  const [step, setStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@3dmagic.io');
  const [hourlyRate, setHourlyRate] = useState(95);
  const [bio, setBio] = useState('Senior 3D Artist & React Three Fiber Specialist with 7+ years creating immersive web experiences, Three.js shaders, and interactive products.');
  const [company, setCompany] = useState('Metaverse Labs Inc');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['React Three Fiber', 'Three.js', 'WebGL', 'Next.js 15']);
  const [submitted, setSubmitted] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (role === 'CLIENT') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/freelancer');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar
        activeRole={role}
        onRoleChange={setRole}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-mono text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Identity & Skill Taxonomy Onboarding
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Your Marketplace Profile</h1>
          <p className="text-xs text-slate-400">Step {step} of 2 • Set up your role & credentials for Escrow verification</p>
        </div>

        {/* Wizard Container */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Role Choice Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('FREELANCER')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                role === 'FREELANCER'
                  ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'FREELANCER' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">I am a Freelancer</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Looking for 3D & Full Stack WebGL contracts</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                role === 'CLIENT'
                  ? 'bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'CLIENT' ? 'bg-violet-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">I am a Client</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Hiring top developers & managing escrow</div>
              </div>
            </button>
          </div>

          <form onSubmit={handleFinish} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Freelancer Specific Fields */}
            {role === 'FREELANCER' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate ($/hr)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">KYC Verification Status</label>
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Verified ID Ready for Escrow
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Skill Tagging Taxonomy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Skills & Technical Taxonomy</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add a skill (e.g. React Three Fiber, Blender, GLSL)"
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
              </>
            ) : (
              /* Client Specific Fields */
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Submission Button */}
            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitted ? (
                <span>Saving Profile & Redirecting...</span>
              ) : (
                <>
                  <span>Complete Onboarding & Go to Dashboard</span>
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
