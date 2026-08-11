import { BarChart2 } from "lucide-react";

export default function FreelancerAnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            Analytics <BarChart2 className="w-6 h-6 text-[#ff2a5f]" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">Track your earnings, profile views, and success rate.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase">Total Earnings</p>
          <p className="text-3xl font-black text-black mt-2">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase">Profile Views</p>
          <p className="text-3xl font-black text-black mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase">Job Success Score</p>
          <p className="text-3xl font-black text-black mt-2">--</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <h3 className="text-lg font-bold text-black">More insights coming soon</h3>
        <p className="text-sm text-slate-500 mt-2">
          As you complete more jobs, detailed charts and breakdowns will appear here.
        </p>
      </div>
    </div>
  );
}
