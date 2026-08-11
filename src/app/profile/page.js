'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { User, Mail, Briefcase, DollarSign, Tag, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(75);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success && data.user) {
        setName(data.user.name || '');
        setBio(data.user.bio || '');
        setHourlyRate(data.user.hourlyRate || 75);
        setSkills(data.user.skills || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, hourlyRate, skills })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern">
      <Navbar onToggleChat={() => setIsChatOpen(true)} />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-mono text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> User Profile & Portfolio Settings
          </div>
          <h1 className="text-3xl font-extrabold text-white">Manage Account Profile</h1>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading profile data...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              {message && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  {message}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-emerald-400"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio & Portfolio Summary</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your 3D engineering background, experience with R3F, Next.js, WebGL..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills & Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Three.js, R3F, Prisma"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-1.5">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-slate-500 hover:text-red-400">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>

            </form>
          )}
        </div>
      </main>

      <Footer />
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
