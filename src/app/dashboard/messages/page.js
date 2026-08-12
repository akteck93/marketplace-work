"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Search, Send, Loader2 } from "lucide-react";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // Fetch all contracts where current user is a participant
  useEffect(() => {
    if (!session) return;
    const fetchContracts = async () => {
      try {
        const res = await fetch('/api/contracts/my');
        const data = await res.json();
        if (data.success && data.contracts.length > 0) {
          setContracts(data.contracts);
          setActiveContract(data.contracts[0]);
        }
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [session]);

  // Fetch messages for active contract + polling
  useEffect(() => {
    if (!activeContract) return;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?contractId=${activeContract.id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // Poll for new messages every 5 seconds
    pollInterval.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollInterval.current);
  }, [activeContract]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeContract || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: activeContract.id,
          text: inputValue.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setInputValue("");
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Get the "other person" name for sidebar display
  const getOtherPerson = (contract) => {
    if (!session) return { name: 'Unknown', role: '' };
    if (contract.clientId === session.user.id) {
      return { name: contract.freelancer?.name || 'Freelancer', role: 'Freelancer' };
    }
    return { name: contract.client?.name || 'Client', role: 'Client' };
  };

  const filteredContracts = contracts.filter(c => {
    if (!searchQuery) return true;
    const other = getOtherPerson(c);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!session) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <p className="text-slate-500">Please log in to view messages.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Sidebar - Conversations */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#cc0000]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
              <p className="text-xs text-slate-400 mt-2">Loading conversations...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 font-medium">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">Messages will appear here once a contract is active.</p>
            </div>
          ) : (
            filteredContracts.map(contract => {
              const other = getOtherPerson(contract);
              return (
                <div 
                  key={contract.id} 
                  onClick={() => setActiveContract(contract)}
                  className={`p-4 flex gap-3 cursor-pointer transition border-b border-slate-50 ${
                    activeContract?.id === contract.id ? 'bg-red-50 border-l-4 border-l-[#cc0000]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#cc0000] flex items-center justify-center text-white font-bold text-lg">
                      {other.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{other.name}</h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{other.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{contract.job?.title || 'Contract'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f8f9fc] h-full">
        {!activeContract ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-400">Select a conversation</p>
              <p className="text-sm text-slate-400 mt-1">Choose a contract from the sidebar to start messaging.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#cc0000]/10 flex items-center justify-center text-[#cc0000] font-bold">
                  {getOtherPerson(activeContract).name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{getOtherPerson(activeContract).name}</h3>
                  <p className="text-xs text-slate-500">{activeContract.job?.title || 'Contract'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  activeContract.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                  activeContract.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {activeContract.status}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full">
                  Contract started
                </span>
              </div>
              
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-400">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === session?.user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMe 
                          ? 'bg-[#cc0000] text-white rounded-br-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-[10px] font-bold mb-1 opacity-70">
                          {msg.sender?.name || (isMe ? 'You' : 'Other')}
                        </p>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..." 
                    disabled={sending}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#cc0000]"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || sending}
                  className="p-3 bg-[#cc0000] text-white rounded-full hover:bg-[#aa0000] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
