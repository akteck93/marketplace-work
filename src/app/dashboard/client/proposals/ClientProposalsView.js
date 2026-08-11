"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, CheckCircle2, User, DollarSign, Calendar, Sparkles } from 'lucide-react';

export default function ClientProposalsView({ proposals }) {
  const [proposalList, setProposalList] = useState(proposals);
  const [acceptingId, setAcceptingId] = useState(null);

  const handleAccept = async (proposalId) => {
    setAcceptingId(proposalId);
    try {
      const res = await fetch('/api/contracts/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId })
      });
      const data = await res.json();
      if (data.success) {
        setProposalList(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'ACCEPTED' } : p));
        alert('Proposal accepted! Contract has been awarded.');
      } else {
        alert(data.error || 'Failed to accept proposal.');
      }
    } catch (err) {
      console.error(err);
      alert('Error accepting proposal.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Received Proposals 📜
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review all incoming freelancer bids for your posted projects.</p>
        </div>
      </div>

      {/* Proposals Container */}
      {proposalList.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Proposals Received Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Jab freelancers aapke kisi project pe proposal submit karenge, wo yahan show honge.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposalList.map((prop) => (
            <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition">
              
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2d5bff]/10 text-[#2d5bff] font-extrabold text-sm flex items-center justify-center shrink-0">
                      {prop.freelancerName?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{prop.freelancerName}</h3>
                      <p className="text-xs text-slate-500">{prop.freelancerEmail}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                    prop.status === 'ACCEPTED' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                {/* Job Title & Bid Amount */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Job</span>
                    <Link href={`/jobs/${prop.jobId}`} className="text-xs font-bold text-[#2d5bff] hover:underline line-clamp-1">
                      {prop.jobTitle}
                    </Link>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bid Amount</span>
                    <span className="text-sm font-black text-emerald-600">${prop.bidAmount}</span>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cover Letter</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed italic whitespace-pre-line">
                    "{prop.coverLetter}"
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Applied: {new Date(prop.createdAt).toLocaleDateString()}
                </span>

                {prop.status === 'PENDING' ? (
                  <button
                    onClick={() => handleAccept(prop.id)}
                    disabled={acceptingId === prop.id}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm shadow-emerald-500/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {acceptingId === prop.id ? 'Accepting...' : 'Accept Proposal & Award'}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Awarded
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
