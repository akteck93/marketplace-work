import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Code2,
  Box,
  Palette,
  Layout,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const CATEGORIES = [
    { name: "3D Modeling & WebGL", icon: Box, jobs: "1,240" },
    { name: "Full Stack Development", icon: Code2, jobs: "3,105" },
    { name: "UI/UX Design", icon: Palette, jobs: "2,430" },
    { name: "Web Architecture", icon: Layout, jobs: "850" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Navbar activeRole="CLIENT" />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-black">
              How work <br/>
              <span className="text-[#ff2a5f]">should work</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
              Forget the old rules. You can have the best people. Right now. Right here. Hire expert freelancers for any 3D, Web, or Design project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/jobs" className="px-8 py-4 bg-[#ff2a5f] text-white rounded-full font-bold text-lg hover:bg-[#e01b4a] transition text-center shadow-lg shadow-red-500/20">
                Find Talent
              </Link>
              <Link href="/jobs/create" className="px-8 py-4 bg-white text-black border-2 border-black rounded-full font-bold text-lg hover:bg-slate-50 transition text-center">
                Post a Job
              </Link>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-sm font-bold text-slate-500">
              <span>Trusted by</span>
              <div className="flex gap-4 opacity-60 grayscale">
                <span className="font-black text-xl tracking-tighter">Microsoft</span>
                <span className="font-black text-xl tracking-tighter">Airbnb</span>
                <span className="font-black text-xl tracking-tighter">Bissell</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" 
              alt="Professional Freelancer" 
              className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] shadow-2xl border border-slate-200"
            />
            {/* Floating Card */}
            <div className="absolute bottom-10 -left-10 z-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-black text-sm">Project Completed</p>
                <p className="text-xs text-slate-500">Fixed-price • $2,500</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-black mb-12">Browse talent by category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl hover:shadow-xl transition cursor-pointer border border-slate-200 group">
                  <cat.icon className="w-10 h-10 text-[#ff2a5f] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl text-black mb-2">{cat.name}</h3>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5
                    </span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{cat.jobs} skills</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY WORKIFFY SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row gap-16 items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff2a5f] blur-[120px] rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Why businesses <br/>turn to Workiffy</h2>
              <div className="space-y-8 mt-12">
                <div className="flex gap-4">
                  <ShieldCheck className="w-8 h-8 text-[#ff2a5f] shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Proof of quality</h3>
                    <p className="text-slate-400">Check any pro's work samples, client reviews, and identity verification.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Briefcase className="w-8 h-8 text-[#ff2a5f] shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safe and secure</h3>
                    <p className="text-slate-400">Focus on your work knowing we help protect your data and privacy. We're here with 24/7 support if you need it.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10 w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl space-y-6">
                <h3 className="text-2xl font-bold">We're the world's work marketplace</h3>
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <p className="text-4xl font-black text-[#ff2a5f]">4.9/5</p>
                    <p className="text-sm text-slate-300 font-medium mt-1">Average rating</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-[#ff2a5f]">🏆</p>
                    <p className="text-sm text-slate-300 font-medium mt-1">G2 Best Software 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-[#ff2a5f] py-20 text-center px-4">
          <h2 className="text-4xl font-black text-white mb-6">Find talent your way</h2>
          <p className="text-white/80 font-medium max-w-2xl mx-auto mb-10 text-lg">Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#ff2a5f] rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl">
            Join Workiffy <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
