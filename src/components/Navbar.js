'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageSquare, 
  Bell, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  PlusCircle, 
  Search,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '@/lib/store';

export default function Navbar({ activeRole = 'CLIENT', onRoleChange = () => {}, onToggleChat = () => {} }) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Workiffy<span className="text-cyan-400 text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">3D</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Upwork-Grade 3D Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/jobs" className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition">
              Find Work
            </Link>
            <Link href="/jobs/create" className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              Post a Job
            </Link>
            <Link href="/dashboard/client" className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition">
              Client Portal
            </Link>
            <Link href="/dashboard/freelancer" className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition">
              3D Dashboard
            </Link>
            <Link href="/admin" className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Super Admin
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Active Role Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:border-cyan-400 transition cursor-pointer shadow-md"
            >
              <span className={`w-2 h-2 rounded-full ${
                activeRole === 'CLIENT' ? 'bg-cyan-400' : activeRole === 'FREELANCER' ? 'bg-violet-400' : 'bg-emerald-400'
              }`}></span>
              <span>Role: <strong className="text-white">{activeRole}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { onRoleChange('CLIENT'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center justify-between"
                >
                  <span>Client (Employer)</span>
                  {activeRole === 'CLIENT' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <button
                  onClick={() => { onRoleChange('FREELANCER'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-violet-500/10 hover:text-violet-400 flex items-center justify-between"
                >
                  <span>Freelancer (Talent)</span>
                  {activeRole === 'FREELANCER' && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                </button>
                <button
                  onClick={() => { onRoleChange('ADMIN'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center justify-between"
                >
                  <span>Super Admin Console</span>
                  {activeRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Realtime Chat Button */}
          <button
            onClick={onToggleChat}
            className="relative p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
            title="Realtime Chat Drawer"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
              title="System Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="text-sm font-bold text-white">System Notifications</h4>
                  <button onClick={markAllRead} className="text-xs text-cyan-400 hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl border text-xs ${
                      n.read ? 'bg-slate-950/40 border-white/5 text-slate-400' : 'bg-cyan-950/20 border-cyan-500/30 text-slate-200'
                    }`}>
                      <div className="font-semibold text-cyan-300">{n.title}</div>
                      <div className="mt-1">{n.message}</div>
                      <div className="mt-1 text-[10px] text-slate-400">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <Link
            href="/onboarding"
            className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="User"
              className="w-9 h-9 rounded-xl object-cover"
            />
          </Link>

        </div>
      </div>
    </header>
  );
}
