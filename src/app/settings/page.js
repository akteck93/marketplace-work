"use client";

import { useState } from "react";
import { Bell, Shield, Key, Eye, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account Settings", icon: User },
    { id: "security", label: "Password & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing & Methods", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Settings Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href={session?.user?.role === "CLIENT" ? "/dashboard/client" : "/dashboard/freelancer"} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-xl font-black text-slate-900 border-l border-slate-200 pl-4">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-[#2d5bff] text-white shadow-sm shadow-[#2d5bff]/20" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {activeTab === "account" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Account Settings</h2>
              
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" disabled value={session?.user?.email || ""} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-400 mt-1">To change your email, please contact support.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button className="px-6 py-2 bg-[#2d5bff] hover:bg-[#1a47e6] text-white text-sm font-bold rounded-lg shadow-sm transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-slate-400" /> Change Password
              </h2>
              
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button className="px-6 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-lg shadow-sm transition">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Email Notifications</h2>
              
              <div className="space-y-4 max-w-2xl">
                {[
                  { title: "New Messages", desc: "Receive an email when you get a new message." },
                  { title: "Proposal Updates", desc: "Get notified when a proposal is accepted or rejected." },
                  { title: "Marketing & Promos", desc: "Receive tips, offers, and Workiffy news." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d5bff]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Billing options are managed in Payments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Head over to the Payments dashboard to add funds, withdraw balance, or view transaction history.
              </p>
              <Link href="/dashboard/client/payments" className="inline-block mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition">
                Go to Payments &rarr;
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
