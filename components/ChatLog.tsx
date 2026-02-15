
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatLogProps {
  messages: Message[];
  currentAssistantText: string;
  currentUserText: string;
}

const ChatLog: React.FC<ChatLogProps> = ({ messages, currentAssistantText, currentUserText }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentAssistantText, currentUserText]);

  const renderMessageText = (text: string) => {
    // Basic regex to find code blocks if Sraboni provides them
    const parts = text.split(/```([\s\S]*?)```/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <pre key={i} className="bg-slate-900 text-pink-400 p-4 rounded-lg my-2 overflow-x-auto text-xs border border-pink-500/20 font-mono">
            <code>{part.trim()}</code>
          </pre>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth max-h-[40vh] border-t border-white/5 bg-black/20"
    >
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
            m.role === 'user' 
              ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30' 
              : 'bg-pink-600/10 text-pink-100 border border-pink-500/20'
          }`}>
             {renderMessageText(m.text)}
          </div>
        </div>
      ))}
      
      {/* Real-time Streaming View */}
      {currentUserText && (
        <div className="flex justify-end">
          <div className="max-w-[85%] px-4 py-2 rounded-2xl text-sm bg-indigo-600/10 text-indigo-200/70 border border-indigo-500/10 italic">
            {currentUserText}
          </div>
        </div>
      )}
      
      {currentAssistantText && (
        <div className="flex justify-start">
          <div className="max-w-[85%] px-4 py-2 rounded-2xl text-sm bg-pink-600/10 text-pink-100 border border-pink-500/20">
            {renderMessageText(currentAssistantText)}
          </div>
        </div>
      )}

      {messages.length === 0 && !currentAssistantText && !currentUserText && (
        <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
          Start talking to Sraboni...
        </div>
      )}
    </div>
  );
};

export default ChatLog;
