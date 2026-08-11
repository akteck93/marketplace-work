import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Star, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Users,
  Zap,
  Globe,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function Home() {

  const STATS = [
    { value: "50K+", label: "Freelancers" },
    { value: "12K+", label: "Projects Posted" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const HOW_IT_WORKS = [
    {
      step: "01",
      title: "Post Your Project",
      description: "Describe your project requirements, set a budget, and choose from fixed-price or hourly contracts.",
      icon: Briefcase
    },
    {
      step: "02",
      title: "Review Proposals",
      description: "Receive proposals from skilled freelancers within hours. Review portfolios, ratings, and bids.",
      icon: Users
    },
    {
      step: "03",
      title: "Hire & Collaborate",
      description: "Select the best match, communicate in real-time, and track progress through our dashboard.",
      icon: Zap
    },
    {
      step: "04",
      title: "Pay Securely",
      description: "Release payments only when you're 100% satisfied. Your funds are held securely in escrow.",
      icon: ShieldCheck
    }
  ];

  const CATEGORIES = [
    { name: "AI & Automation", slug: "ai-automation", desc: "Prompt engineering, chatbots & AI tools", count: "2,400+" },
    { name: "Development & IT", slug: "development-it", desc: "Full stack, mobile & blockchain projects", count: "5,100+" },
    { name: "Design & Creative", slug: "design-creative", desc: "UI/UX, 3D, branding & motion graphics", count: "3,200+" },
    { name: "Marketing", slug: "marketing", desc: "SEO, social media & growth campaigns", count: "1,800+" },
    { name: "Writing & Content", slug: "writing-content", desc: "Copywriting, blogs & technical writing", count: "2,900+" },
    { name: "Admin & Support", slug: "admin-support", desc: "Virtual assistance & project management", count: "900+" },
  ];

  const TESTIMONIALS = [
    {
      name: "Rahul Sharma",
      role: "Startup Founder",
      avatar: "R",
      review: "Workiffy helped me find the perfect developer in 24 hours. The escrow system gave me complete confidence to invest without risk.",
      rating: 5
    },
    {
      name: "Priya Mehta",
      role: "Freelance Designer",
      avatar: "P",
      review: "As a freelancer, Workiffy is a game-changer. Quality clients, transparent payments, and a smooth work process every time.",
      rating: 5
    },
    {
      name: "Arjun Kapoor",
      role: "Product Manager",
      avatar: "A",
      review: "The category system makes it so easy to find specialists. We hired a 3D designer and an AI developer within the same week.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Navbar activeRole="CLIENT" />
      
      <main className="flex-1">

        {/* ─────────── HERO SECTION ─────────── */}
        <section className="relative overflow-hidden bg-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            
            {/* Left: Text */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-full text-sm font-bold text-[#cc0000]">
                <span className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse"></span>
                India's Fastest Growing Freelance Marketplace
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-black">
                Hire the Best.<br />
                <span className="text-[#cc0000]">Get It Done.</span><br />
                <span className="text-black">With Workiffy.</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                Connect with top-rated freelancers across 50+ skill categories. Post a project in minutes and receive proposals from verified experts within hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/jobs/create" className="px-8 py-4 bg-[#cc0000] text-white rounded-full font-bold text-lg hover:bg-[#aa0000] transition text-center shadow-lg shadow-red-500/30">
                  Post a Project — Free
                </Link>
                <Link href="/jobs" className="px-8 py-4 bg-white text-black border-2 border-black rounded-full font-bold text-lg hover:bg-slate-50 transition text-center">
                  Find Work
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                {STATS.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black text-black">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero image + floating cards */}
            <div className="flex-1 w-full max-w-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating on Workiffy" 
                className="w-full h-[520px] object-cover rounded-[2.5rem] shadow-2xl border border-slate-100"
              />
              {/* Floating card: Job completed */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">Project Delivered!</p>
                  <p className="text-xs text-slate-500">Website Redesign • ₹45,000</p>
                </div>
              </div>
              {/* Floating card: New proposal */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#cc0000]" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">12 Proposals</p>
                  <p className="text-xs text-slate-500">Received in 3 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── CATEGORY GRID ─────────── */}
        <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-black">Browse by Category</h2>
              <p className="text-slate-500 mt-3 text-lg">50+ skill categories. Thousands of verified experts ready to help.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <Link key={idx} href={`/jobs?category=${cat.slug}`} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#cc0000] hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-black group-hover:text-[#cc0000] transition">{cat.name}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex-shrink-0">{cat.count}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                  <div className="mt-6 flex items-center text-sm font-bold text-[#cc0000] gap-1 opacity-0 group-hover:opacity-100 transition">
                    Browse Jobs <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── HOW IT WORKS ─────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-black">How Workiffy Works</h2>
              <p className="text-slate-500 mt-3 text-lg">From posting to payment — streamlined in 4 simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map((step, idx) => (
                <div key={idx} className="relative text-center">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-slate-200 -translate-x-1/2 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-[#cc0000] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                      <step.icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="text-xs font-black text-[#cc0000] mb-2 tracking-wider">STEP {step.step}</div>
                    <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── WHY WORKIFFY ─────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black mb-12 leading-tight">
                Why Businesses<br />Choose <span className="text-[#cc0000]">Workiffy</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "100% Secure Escrow Payments", desc: "Your money is held safely in escrow and released only after you approve the final work. Zero risk of fraud." },
                  { icon: Award, title: "Verified Freelancers Only", desc: "Every freelancer on Workiffy is profile-verified and has a public track record of reviews and completed projects." },
                  { icon: Clock, title: "Fast Turnaround Times", desc: "Most projects receive qualified proposals within 24 hours. Hire in days, not weeks." },
                  { icon: TrendingUp, title: "Transparent Pricing", desc: "No hidden fees. Know exactly what you pay. Simple per-post or subscription plans for both clients and freelancers." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#cc0000]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#cc0000]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 space-y-8">
                <h3 className="text-2xl font-bold">Workiffy in Numbers</h3>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { n: "50,000+", l: "Registered Freelancers" },
                    { n: "12,000+", l: "Projects Completed" },
                    { n: "₹10Cr+", l: "Payouts Processed" },
                    { n: "98%", l: "Client Satisfaction" },
                  ].map((s, i) => (
                    <div key={i}>
                      <p className="text-4xl font-black text-[#cc0000]">{s.n}</p>
                      <p className="text-sm text-slate-400 mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#cc0000]" />
                    <p className="text-sm text-slate-300 font-medium">Available across India • Remote-first platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── TESTIMONIALS ─────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-black">What Our Community Says</h2>
              <p className="text-slate-500 mt-3 text-lg">Real stories from real clients and freelancers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#cc0000] rounded-full flex items-center justify-center text-white font-black text-lg">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── DUAL CTA ─────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* For Clients */}
              <div className="bg-[#cc0000] rounded-3xl p-10 text-white">
                <Briefcase className="w-12 h-12 mb-6 opacity-80" />
                <h3 className="text-3xl font-black mb-4">Hire Top Talent</h3>
                <p className="text-white/80 mb-8 leading-relaxed">Post your project for free and connect with India's best freelancers. From design to development — we have experts in every domain.</p>
                <Link href="/jobs/create" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#cc0000] rounded-full font-bold hover:bg-slate-100 transition">
                  Post a Project <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* For Freelancers */}
              <div className="bg-black rounded-3xl p-10 text-white">
                <Users className="w-12 h-12 mb-6 opacity-80" />
                <h3 className="text-3xl font-black mb-4">Find Paid Work</h3>
                <p className="text-white/80 mb-8 leading-relaxed">Join 50,000+ freelancers earning on Workiffy. Build your profile, apply to projects, and get paid securely for every job you complete.</p>
                <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-[#cc0000] text-white rounded-full font-bold hover:bg-[#aa0000] transition">
                  Join as Freelancer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
