import { Award, CheckCircle2 } from "lucide-react";

export default function FreelancerMembershipPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            Membership Plan <Award className="w-6 h-6 text-[#ff2a5f]" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">View and manage your current subscription plan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Basic Plan */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
          <h3 className="text-xl font-bold text-black">Basic</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Pay as you go for proposals.</p>
          <div className="text-4xl font-black text-black mb-6">$0<span className="text-base text-slate-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-slate-300" />
              Pay $1 per proposal
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-slate-300" />
              Standard profile visibility
            </li>
          </ul>
          
          <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-red-50 p-8 rounded-3xl border-2 border-[#ff2a5f] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#ff2a5f] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>
          <h3 className="text-xl font-bold text-[#ff2a5f]">Freelancer Pro</h3>
          <p className="text-sm text-slate-700 mt-2 mb-6">Everything you need to grow your freelance business.</p>
          <div className="text-4xl font-black text-black mb-6">$5<span className="text-base text-slate-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-slate-900 font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#ff2a5f]" />
              Unlimited proposals ($0 per apply)
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-900 font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#ff2a5f]" />
              Boosted profile visibility
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-900 font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#ff2a5f]" />
              Premium support
            </li>
          </ul>
          
          <button className="w-full py-3 rounded-xl bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold text-sm transition shadow-md">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
