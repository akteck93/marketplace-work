'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, FileText, Loader2, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ChatDrawer({ isOpen = false, onClose = () => {} }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !session) return;
    
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/contracts/my');
        const data = await res.json();
        if (data.success && data.contracts.length > 0) {
          setContracts(data.contracts);
          setActiveContract(data.contracts[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [isOpen, session]);

  useEffect(() => {
    if (!activeContract || !isOpen) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?contractId=${activeContract.id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeContract, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeContract) return;

    const text = inputMsg;
    setInputMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId: activeContract.id, text })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end transition-all">
      <div className="w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Chat Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff2a5f]/10 flex items-center justify-center text-[#ff2a5f]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black flex items-center gap-1.5">
                Quick Chat <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <p className="text-[11px] text-slate-500">
                {activeContract ? activeContract.job?.title || 'Active Contract' : 'No active contract'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!session ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-slate-500 mb-4">Please log in to view your messages.</p>
            <Link href="/login" onClick={onClose} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">
              Log In
            </Link>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !activeContract ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h4 className="text-black font-bold mb-2">No Active Contracts</h4>
            <p className="text-sm text-slate-500 mb-6">You don't have any active contracts to chat about yet.</p>
            <Link href="/dashboard/messages" onClick={onClose} className="text-[#ff2a5f] text-sm font-bold hover:underline">
              Go to Full Inbox
            </Link>
          </div>
        ) : (
          <>
            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              <div className="text-center mb-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                  Contract: {activeContract.job?.title || activeContract.id}
                </span>
              </div>
              
              {messages.map((m) => {
                const isMe = m.senderId === session.user.id;
                const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-1 px-1">
                      {m.sender?.name || 'Unknown'} • {timeStr}
                    </span>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-black text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-black rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="p-2.5 rounded-full bg-[#ff2a5f] hover:bg-[#e01b4a] text-white font-bold transition shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
            
            <div className="p-2 bg-slate-50 text-center border-t border-slate-200">
              <Link href="/dashboard/messages" onClick={onClose} className="text-[10px] font-bold text-slate-500 hover:text-black uppercase tracking-wider transition">
                Open Full Inbox
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

