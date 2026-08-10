"use client";

import { Search, Bell, HelpCircle, User } from "lucide-react";

export default function DashboardTopNav({ userTitle, user }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-bold text-slate-800 hidden md:block">{userTitle}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, clients..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5bff] focus:bg-white w-64 text-slate-700"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-800 transition">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button className="relative hover:text-slate-800 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">8</span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800">{user?.name || "John Doe"}</div>
              <div className="text-[10px] text-slate-500">{user?.role === 'CLIENT' ? 'Service Seeker' : 'Freelancer'}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
              {/* Fallback avatar */}
              <User className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
