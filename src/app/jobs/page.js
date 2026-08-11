'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatDrawer from '@/components/ChatDrawer';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronRight,
  X,
  ChevronDown
} from 'lucide-react';

function JobFeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Read current filters from URL
  const urlCategory = searchParams.get('category') || '';
  const urlSubcategory = searchParams.get('subcategory') || '';

  useEffect(() => {
    // Fetch categories for sidebar
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
          // Auto-expand the active category in sidebar
          if (urlCategory) {
            const found = data.categories.find(c => c.slug === urlCategory);
            if (found) setExpandedCategory(found.id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [urlCategory, urlSubcategory, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (urlCategory) params.set('category', urlCategory);
      if (urlSubcategory) params.set('subcategory', urlSubcategory);
      if (selectedType !== 'ALL') params.set('type', selectedType);
      
      const res = await fetch(`/api/jobs/feed?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (categorySlug, subcategorySlug) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    if (subcategorySlug) params.set('subcategory', subcategorySlug);
    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/jobs');
  };

  const filteredJobs = jobs.filter(j => {
    const matchesQuery = !searchQuery || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  const activeCategory = categories.find(c => c.slug === urlCategory);
  const activeSubcategory = activeCategory?.subcategories?.find(s => s.slug === urlSubcategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        activeRole="FREELANCER"
        onRoleChange={() => {}}
        onToggleChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Search Bar */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-black mb-2">
            {activeSubcategory ? activeSubcategory.name : activeCategory ? activeCategory.name : 'Find Work'}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {activeSubcategory?.description || 'Browse jobs from top clients. Filter by category to find your perfect match.'}
          </p>
          <div className="relative flex items-center max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              placeholder="Search jobs by title, skill, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Active Filters Pills */}
        {(urlCategory || urlSubcategory) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-500">Active filters:</span>
            {urlCategory && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full">
                {activeCategory?.name || urlCategory}
                <button onClick={clearFilters} className="hover:text-red-300"><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {urlSubcategory && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff2a5f] text-white text-xs font-bold rounded-full">
                {activeSubcategory?.name || urlSubcategory}
                <button onClick={() => setFilter(urlCategory, '')} className="hover:text-red-200"><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-black font-bold underline">Clear all</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-black pb-3 border-b border-slate-100">
                <Filter className="w-4 h-4 text-[#ff2a5f]" /> Filters
              </div>

              {/* Contract Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contract Type</label>
                <div className="space-y-1">
                  {['ALL', 'FIXED_PRICE', 'HOURLY'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium ${
                        selectedType === t
                          ? 'bg-black text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t === 'ALL' ? 'All Types' : t === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly Rate'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={clearFilters}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                      !urlCategory ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <div key={cat.id}>
                      <button
                        onClick={() => {
                          setFilter(cat.slug, '');
                          setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                          urlCategory === cat.slug ? 'bg-[#ff2a5f] text-white' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                        {cat.subcategories?.length > 0 && (
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Subcategories */}
                      {expandedCategory === cat.id && cat.subcategories?.length > 0 && (
                        <div className="ml-3 mt-1 space-y-0.5">
                          {cat.subcategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => setFilter(cat.slug, sub.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                                urlSubcategory === sub.slug ? 'text-[#ff2a5f] font-bold bg-red-50' : 'text-slate-500 hover:text-black hover:bg-slate-50'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <section className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500 pb-2">
              <span>Showing <strong className="text-black">{filteredJobs.length}</strong> jobs</span>
              {activeCategory && <span className="text-xs font-bold text-[#ff2a5f]">{activeCategory.name}</span>}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-slate-100 rounded-2xl h-40 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-black mb-2">No jobs found</h3>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-slate-800 transition">
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition group">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {job.category}
                        </span>
                        {job.subcategory && (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#ff2a5f]">
                            {job.subcategory}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-black group-hover:text-[#ff2a5f] transition">
                        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">by {job.clientName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-black text-black">
                        {job.type === 'FIXED_PRICE' ? `$${job.budget?.toLocaleString()}` : `$${job.budget}/hr`}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">{job.type === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills?.slice(0, 5).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Client
                      </span>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-5 py-2.5 rounded-full bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold text-xs flex items-center gap-1 transition shadow-sm"
                      >
                        Apply Now <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>

      <Footer />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default function JobFeedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500">Loading...</div>}>
      <JobFeedContent />
    </Suspense>
  );
}
