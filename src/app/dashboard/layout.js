import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopNav from "@/components/DashboardTopNav";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;
  const userTitle = role === "CLIENT" ? "Service Seeker Dashboard" : role === "ADMIN" ? "Admin Dashboard" : "Freelancer Dashboard";

  return (
    <div className="h-screen w-full flex bg-[#f8f9fc] overflow-hidden text-slate-900">
      {/* Sidebar */}
      <DashboardSidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardTopNav userTitle={userTitle} user={session.user} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
