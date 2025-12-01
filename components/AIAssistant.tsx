
import React, { useState, useRef, useEffect } from 'react';
import { ProjectData, ChatMessage } from '../types';
import { generateProjectInsight } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  data: ProjectData;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'سلام! من دستیار هوشمند پروژه هستم. می‌توانید درباره پیشرفت، هزینه‌ها، بدهی‌ها یا هر جزئیات دیگری از من سوال کنید.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await generateProjectInsight(userMsg.text, data, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "وضعیت بدهی‌های پروژه چطور است؟",
    "چقدر تا تکمیل فونداسیون مانده؟",
    "گزارش آخرین واریزی‌ها را بده",
    "آیا از بودجه عقب هستیم؟"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">دستیار هوشمند پروژه</h3>
          <p className="text-xs text-slate-500">پاسخگویی بر اساس داده‌های واقعی پروژه</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-emerald-100 text-emerald-600'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`
              max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-emerald-800 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}
            `}>
              {msg.text}
              <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-600" />
              <span className="text-xs text-slate-500">در حال تحلیل داده‌های پروژه...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setQuery(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-full hover:bg-emerald-100 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="سوال خود را درباره پروژه بپرسید..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-emerald-700 text-white p-3 rounded-xl hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:rotate-180" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
