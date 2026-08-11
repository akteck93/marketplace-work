"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send,
  Paperclip,
  Smile,
  Info
} from "lucide-react";

export default function WorkroomClientUI({ job, clientData, contractId }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'chat'
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?contractId=${contractId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchMessages();
      // Simple polling for real-time feel (every 3s)
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, contractId]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const textToSend = inputValue;
    setInputValue(""); // Optimistic clear

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, text: textToSend })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages([...messages, data.message]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 h-[calc(100vh-80px)] flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0">
        <Link href="/dashboard/freelancer/proposals" className="text-xs font-bold text-[#ff2a5f] flex items-center gap-1 hover:underline mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Proposals
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-red-100 text-red-700 mb-2 inline-block">
              Active Contract
            </span>
            <h2 className="text-2xl font-bold text-black">{job.title}</h2>
            <p className="text-sm text-slate-500 mt-1">Contract ID: {contractId}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Budget</p>
              <p className="text-lg font-black text-black">${job.budget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 flex-shrink-0">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "details" ? "border-[#ff2a5f] text-[#ff2a5f]" : "border-transparent text-slate-500 hover:text-black"
          }`}
        >
          Client Details
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "chat" ? "border-[#ff2a5f] text-[#ff2a5f]" : "border-transparent text-slate-500 hover:text-black"
          }`}
        >
          Project Chat
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 relative">
        
        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="h-full overflow-y-auto space-y-6 pb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl font-bold text-[#ff2a5f] flex-shrink-0">
                {clientData.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-black">{clientData.name}</h3>
                  <p className="text-sm text-slate-500">Verified Marketplace Client</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Email Address</p>
                      <p className="text-sm font-medium text-black">{clientData.email}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Phone Number</p>
                      <p className="text-sm font-medium text-black">{clientData.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Please use the Project Chat tab for all official project communications. Sharing external payment links or taking communication completely off-platform violates marketplace policies.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Job Context */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-black mb-4 border-b border-slate-100 pb-2">Contract Context</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="h-16 bg-slate-50 border-b border-slate-200 flex items-center px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#ff2a5f] font-bold text-xs">
                  {clientData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm">{clientData.name}</h3>
                  <p className="text-[10px] text-green-600 font-bold uppercase">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              <div className="text-center mb-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full">Contract Started</span>
              </div>
              
              {messages.map((msg) => {
                const isMe = msg.senderId === session?.user?.id;
                const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe ? 'bg-black text-white rounded-br-none' : 'bg-white border border-slate-200 text-black rounded-bl-none shadow-sm'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-slate-400' : 'text-slate-500'}`}>
                        {timeStr}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button type="button" className="p-2 text-slate-400 hover:text-black transition bg-slate-50 hover:bg-slate-100 rounded-full">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Message ${clientData.name}...`} 
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!inputValue.trim()}
                  className="p-3 bg-[#ff2a5f] text-white rounded-full hover:bg-[#e01b4a] transition disabled:opacity-50 shadow-sm shadow-red-500/20"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
