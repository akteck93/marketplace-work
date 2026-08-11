"use client";

import { useState } from "react";
import { Search, MoreVertical, Send, Phone, Video, Paperclip, Smile } from "lucide-react";

const MOCK_CONTACTS = [
  { id: 1, name: "Hanuman Ji", role: "3D Modeler", lastMessage: "I will start working on the empire tonight.", time: "10:24 AM", unread: 2, online: true },
  { id: 2, name: "Rahul Sharma", role: "VFX Artist", lastMessage: "Check the latest renders I sent.", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "Priya Singh", role: "Animator", lastMessage: "Sounds good, let's connect tomorrow.", time: "Tuesday", unread: 0, online: true },
];

const MOCK_MESSAGES = [
  { id: 1, sender: "Hanuman Ji", text: "Hello! I've reviewed the project requirements for the Empire build.", time: "10:15 AM", isMe: false },
  { id: 2, sender: "Me", text: "Great! Do you think we can complete it within 3 weeks?", time: "10:18 AM", isMe: true },
  { id: 3, sender: "Hanuman Ji", text: "Yes, definitely. I will start working on the empire tonight.", time: "10:24 AM", isMe: false },
];

export default function MessagesPage() {
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: "Me",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setInputValue("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Sidebar - Contact List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setActiveContact(contact)}
              className={`p-4 flex gap-3 cursor-pointer transition border-b border-slate-50 ${activeContact.id === contact.id ? 'bg-[#2d5bff]/5' : 'hover:bg-slate-50'}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#ff2a5f] text-white text-[9px] font-bold flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f8f9fc] h-full">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d5bff]/10 flex items-center justify-center text-[#2d5bff] font-bold">
              {activeContact.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{activeContact.name}</h3>
              <p className="text-xs text-emerald-500 font-medium">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-slate-600 transition"><Phone className="w-5 h-5" /></button>
            <button className="hover:text-slate-600 transition"><Video className="w-5 h-5" /></button>
            <button className="hover:text-slate-600 transition"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full">Today</span>
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.isMe ? 'bg-[#2d5bff] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-white/70' : 'text-slate-400'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition bg-slate-50 hover:bg-slate-100 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..." 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#2d5bff] focus:ring-1 focus:ring-[#2d5bff]"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button 
              type="submit" 
              disabled={!inputValue.trim()}
              className="p-3 bg-[#2d5bff] text-white rounded-full hover:bg-[#1a47e6] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#2d5bff]/30"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
