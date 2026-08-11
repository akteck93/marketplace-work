"use client";

import { Bookmark, Star, MapPin, Search } from "lucide-react";
import Link from "next/link";

const SAVED_PROVIDERS = [
  { id: 1, name: "Hanuman Ji", role: "Expert 3D Modeler & Rigger", rating: 4.9, jobs: 124, rate: "$45/hr", location: "India", tags: ["Blender", "Maya", "Rigging"] },
  { id: 2, name: "Sarah Jenkins", role: "VFX Supervisor", rating: 5.0, jobs: 89, rate: "$80/hr", location: "UK", tags: ["Houdini", "Nuke", "Compositing"] },
  { id: 3, name: "David Chen", role: "Character Animator", rating: 4.7, jobs: 42, rate: "$35/hr", location: "Singapore", tags: ["ZBrush", "Substance", "Texturing"] },
];

export default function SavedProvidersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Saved Providers 🔖
          </h2>
          <p className="text-sm text-slate-500 mt-1">Freelancers you have bookmarked for future projects.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search saved..." 
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]"
          />
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAVED_PROVIDERS.map((provider) => (
          <div key={provider.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative group hover:shadow-md transition">
            
            {/* Bookmark Icon */}
            <button className="absolute top-4 right-4 text-[#ff2a5f] hover:scale-110 transition">
              <Bookmark className="w-5 h-5 fill-current" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl shadow-sm border-2 border-white">
                🧑‍🎨
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{provider.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{provider.role}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" /> {provider.rating}
                </span>
                <span>{provider.rate}</span>
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> {provider.location}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {provider.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                <Link 
                  href="/dashboard/messages" 
                  className="py-2 text-slate-600 font-bold text-xs bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                >
                  Message
                </Link>
                <button 
                  className="py-2 text-white font-bold text-xs bg-[#2d5bff] hover:bg-[#1a47e6] rounded-lg shadow-sm transition"
                >
                  Invite to Job
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
