"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  CheckSquare, 
  User, 
  Star, 
  BarChart2, 
  Award, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();

  const freelancerLinks = [
    { name: "Dashboard", href: "/dashboard/freelancer", icon: Home },
    { name: "Find Work", href: "/jobs", icon: Search },
    { name: "My Proposals", href: "/dashboard/freelancer/proposals", icon: FileText },
    { name: "My Projects", href: "/dashboard/freelancer/projects", icon: Briefcase },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 12 },
    { name: "Contracts", href: "/dashboard/freelancer/contracts", icon: CheckSquare },
    { name: "My Profile", href: "/dashboard/freelancer/profile", icon: User },
    { name: "Reviews & Ratings", href: "/dashboard/freelancer/reviews", icon: Star },
    { name: "Analytics", href: "/dashboard/freelancer/analytics", icon: BarChart2 },
    { name: "Membership", href: "/dashboard/freelancer/membership", icon: Award },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const clientLinks = [
    { name: "Dashboard", href: "/dashboard/client", icon: Home },
    { name: "Post a Project", href: "/jobs/create", icon: Search },
    { name: "My Projects", href: "/dashboard/client/projects", icon: Briefcase },
    { name: "Proposals", href: "/dashboard/client/proposals", icon: FileText },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 6 },
    { name: "Saved Providers", href: "/dashboard/client/saved", icon: User },
    { name: "Payments", href: "/dashboard/client/payments", icon: BarChart2 },
    { name: "Contracts", href: "/dashboard/client/contracts", icon: CheckSquare },
    { name: "My Profile", href: "/dashboard/client/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const links = role === "CLIENT" ? clientLinks : freelancerLinks;

  return (
    <aside className="w-64 bg-[#0a1128] text-white flex flex-col h-full sticky top-0 border-r border-slate-800">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
            WORKIFFY
          </span>
          <span className="text-[10px] text-slate-400 mt-1">Your Skills. Global Opportunities.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-[#ff2a5f] text-white" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {link.name}
              </div>
              {link.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20" : "bg-[#6c5ce7] text-white"}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner (for Client) */}
      {role === "CLIENT" && (
        <div className="mx-4 my-4 p-4 rounded-xl bg-gradient-to-br from-[#1a295c] to-[#0a1128] border border-white/5">
          <Award className="w-6 h-6 text-yellow-500 mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">Hire Faster, Get Better</h4>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Upgrade to Premium and connect with top-rated service providers.</p>
          <button className="w-full py-2 bg-[#2d5bff] hover:bg-[#1a47e6] text-white text-xs font-bold rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      {/* Footer Links */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <HelpCircle className="w-4 h-4 text-slate-400" /> Help Center
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#ff7675] hover:text-[#ff4757] transition-colors rounded-lg hover:bg-[#ff7675]/10"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
