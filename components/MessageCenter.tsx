import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
}

const INITIAL_MESSAGES: Message[] = [
    { id: 1, text: 'Hello Mr. Anderson, I wanted to ask about the field trip schedule.', sender: 'other', time: '10:30 AM' },
    { id: 2, text: 'Hi! The bus leaves at 9:00 AM sharp on Friday. Make sure Alex packs a lunch.', sender: 'me', time: '10:32 AM' }
];

export const MessageCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
      if (!inputText.trim()) return;
      
      const newMessage: Message = {
          id: Date.now(),
          text: inputText,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate reply
      setTimeout(() => {
          const reply: Message = {
              id: Date.now() + 1,
              text: 'Thanks for the information!',
              sender: 'other',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, reply]);
      }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar */}
      <Card className="w-80 flex flex-col p-0 overflow-hidden hidden md:flex">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${i === 1 ? 'bg-indigo-50/50' : ''}`}>
              <div className="relative">
                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full" />
                {i < 3 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">Mrs. Parent {i}</h4>
                  <span className="text-xs text-slate-400">10:3{i} AM</span>
                </div>
                <p className="text-xs text-slate-500 truncate">Regarding the upcoming field trip to the museum...</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <img src="https://i.pravatar.cc/150?img=11" alt="Current User" className="w-10 h-10 rounded-full" />
             <div>
               <h3 className="font-bold text-slate-800">Mrs. Parent 1</h3>
               <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</p>
             </div>
          </div>
          <div className="flex gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
           {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-3 rounded-2xl max-w-md shadow-sm ${msg.sender === 'me' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200' : 'bg-white border border-slate-100 rounded-tl-none'}`}>
                       <p className={`text-sm ${msg.sender === 'me' ? 'text-white' : 'text-slate-700'}`}>{msg.text}</p>
                       <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>{msg.time}</span>
                   </div>
               </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form 
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          >
            <input 
                type="text" 
                placeholder="Type a message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              <Send size={20} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};