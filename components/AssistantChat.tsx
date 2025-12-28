
import React, { useState, useRef, useEffect } from 'react';
import { getParkingAdvice } from '../services/geminiService';
import { ParkingLot } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AssistantChatProps {
  lots: ParkingLot[];
}

const AssistantChat: React.FC<AssistantChatProps> = ({ lots }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Welcome back! I'm scanning all 1,200+ spots across campus. Where are you heading? I'll find you the perfect space." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    const response = await getParkingAdvice(lots, userMsg);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
  };

  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-800 flex flex-col h-[520px] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-black text-sm tracking-tight">ParkExpert AI</h3>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Intelligence</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar relative z-10">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
              : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50 backdrop-blur-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 group">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Where are you heading today?"
          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-5 pr-14 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500 transition-all focus:bg-slate-800"
        />
        <button 
          onClick={handleSend}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg flex items-center justify-center active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      
      <p className="mt-4 text-[9px] text-center font-bold text-slate-600 uppercase tracking-widest">Powered by Gemini AI Engine</p>
    </div>
  );
};

export default AssistantChat;
