'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-black flex items-center gap-1.5">
              WORK<span className="text-[#ff2a5f]">IFFY</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Marketplace</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
            <Link href="/jobs" className="px-4 py-2 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition">
              Find Work
            </Link>
            <Link href="/jobs/create" className="px-4 py-2 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition flex items-center gap-1.5">
              Post a Job
            </Link>
            <Link href="/dashboard/client" className="px-4 py-2 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition">
              Client Portal
            </Link>
            <Link href="/dashboard/freelancer" className="px-4 py-2 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition">
              Freelancer Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Active Role Selector Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 hover:border-slate-300 transition cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${
                activeRole === 'CLIENT' ? 'bg-[#ff2a5f]' : activeRole === 'FREELANCER' ? 'bg-black' : 'bg-emerald-500'
              }`}></span>
              <span>Role: <strong className="text-black">{activeRole}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { onRoleChange('CLIENT'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Client (Employer)</span>
                  {activeRole === 'CLIENT' && <CheckCircle2 className="w-4 h-4 text-[#ff2a5f]" />}
                </button>
                <button
                  onClick={() => { onRoleChange('FREELANCER'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Freelancer (Talent)</span>
                  {activeRole === 'FREELANCER' && <CheckCircle2 className="w-4 h-4 text-black" />}
                </button>
                <button
                  onClick={() => { onRoleChange('ADMIN'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Super Admin</span>
                  {activeRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Realtime Chat Button */}
          <button
            onClick={onToggleChat}
            className="relative p-2.5 rounded-full bg-slate-50 text-slate-500 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            title="Realtime Chat Drawer"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff2a5f]"></span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 rounded-full bg-slate-50 text-slate-500 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              title="System Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff2a5f] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-black">Notifications</h4>
                  <button onClick={markAllRead} className="text-xs text-[#ff2a5f] hover:underline font-bold">
                    Mark all read
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl border text-xs ${
                      n.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-red-50 border-red-100 text-slate-800'
                    }`}>
                      <div className="font-bold text-black">{n.title}</div>
                      <div className="mt-1 leading-relaxed">{n.message}</div>
                      <div className="mt-1 text-[10px] text-slate-400 font-medium">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {session ? (
            <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 border-l border-slate-200 pl-2 sm:pl-3">
              <Link
                href="/dashboard"
                className="block"
              >
                <img
                  src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 hover:border-black transition"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 sm:ml-2 px-5 py-2 rounded-full bg-black text-white text-sm font-bold hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 text-slate-500 hover:text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 shadow-lg absolute w-full left-0">
          <nav className="flex flex-col gap-2">
            <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:text-black hover:bg-slate-50 transition text-sm font-bold">
              Find Work
            </Link>
            <Link href="/jobs/create" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:text-black hover:bg-slate-50 transition text-sm font-bold flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Post a Job
            </Link>
            <Link href="/dashboard/client" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:text-black hover:bg-slate-50 transition text-sm font-bold">
              Client Portal
            </Link>
            <Link href="/dashboard/freelancer" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:text-black hover:bg-slate-50 transition text-sm font-bold">
              Freelancer Dashboard
            </Link>
            {session && (
              <button 
                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                className="text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-bold"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
