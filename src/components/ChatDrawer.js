'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip, ShieldCheck, DollarSign, CheckCircle, FileText } from 'lucide-react';
import { SAMPLE_MESSAGES, SAMPLE_CONTRACTS } from '@/lib/store';

export default function ChatDrawer({ isOpen = false, onClose = () => {}, activeUser = { name: 'Alex Rivera', role: 'FREELANCER' } }) {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'offer'

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'usr_client_1',
      senderName: 'Marcus Vance (Client)',
      receiverId: 'usr_freelancer_1',
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  const sendEscrowOffer = () => {
    const offerMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'usr_client_1',
      senderName: 'Marcus Vance (Client)',
      text: 'I have funded $4,200 into Stripe Escrow and issued Contract Offer #cnt_301.',
      offerCard: {
        title: '3D Workspace Node Canvas Contract Offer',
        amount: 4200,
        status: 'ESCROW_FUNDED',
        milestonesCount: 3
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, offerMsg]);
    setActiveTab('chat');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end transition-all">
      <div className="w-full max-w-lg h-full glass-panel bg-slate-900/95 border-l border-cyan-500/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Chat Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex Rivera"
                className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Alex Rivera <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-[11px] text-slate-400">3D Artist & R3F Specialist • Active Now</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'offer' : 'chat')}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-xs font-bold text-slate-950 flex items-center gap-1 hover:brightness-110 transition cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              {activeTab === 'chat' ? 'Issue Offer' : 'Back to Chat'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'chat' ? (
          <>
            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isMe = m.senderId === 'usr_client_1';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1">{m.senderName} • {m.timestamp}</span>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md shadow-cyan-900/30'
                          : 'bg-slate-800/90 text-slate-200 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {m.text}

                      {/* Offer Card Attachment */}
                      {m.offerCard && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-2 text-slate-200">
                          <div className="flex items-center justify-between text-emerald-400 font-bold text-xs">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> {m.offerCard.status}</span>
                            <span>${m.offerCard.amount}</span>
                          </div>
                          <div className="text-xs font-medium text-white">{m.offerCard.title}</div>
                          <div className="text-[10px] text-slate-400">{m.offerCard.milestonesCount} Milestones Funded into Escrow</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-950/80 flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 transition"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type real-time message or milestone discussion..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* Issue Escrow Offer Form */
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Create Escrow Contract Offer
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Deposit funds directly into Stripe Escrow. Funds are released upon your milestone approval.
              </p>
            </div>

            <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contract Title</label>
                <input
                  type="text"
                  defaultValue="3D Workspace Node Canvas & Product Showcase"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Escrow Amount ($)</label>
                <input
                  type="number"
                  defaultValue={4200}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Stripe Escrow Guarantee</div>
                <div>Funds are held in secure escrow. Freelancer receives payout only after work approval.</div>
              </div>
            </div>

            <button
              onClick={sendEscrowOffer}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
            >
              Deposit $4,200 to Escrow & Send Contract Offer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
