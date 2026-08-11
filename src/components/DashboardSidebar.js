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
    <aside className="w-64 bg-black text-white flex flex-col h-full sticky top-0 border-r border-slate-900">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex flex-col">
          <img src="/logo.png" alt="Workiffy" className="h-10 w-auto object-contain object-left" />
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
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                isActive 
                  ? "bg-[#ff2a5f] text-white" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                {link.name}
              </div>
              {link.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20" : "bg-[#ff2a5f] text-white"}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner (for Client) */}
      {role === "CLIENT" && (
        <div className="mx-4 my-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <Award className="w-6 h-6 text-[#ff2a5f] mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">Hire Faster</h4>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Upgrade to Premium and connect with top-rated service providers.</p>
          <button className="w-full py-2 bg-[#ff2a5f] hover:bg-[#e01b4a] text-white text-xs font-bold rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      {/* Footer Links */}
      <div className="p-4 border-t border-slate-900 space-y-1">
        <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900">
          <HelpCircle className="w-4 h-4 text-slate-500" /> Help Center
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
