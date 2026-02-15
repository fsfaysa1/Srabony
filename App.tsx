
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SraboniSession } from './services/geminiLiveService';
import { Message, SraboniState } from './types';
import SraboniUI from './components/SraboniUI';
import ChatLog from './components/ChatLog';

// High-quality Bengali-style anime girl avatar
const SRABONI_LOGO_URL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sraboni&backgroundColor=ffdfbf&mouth=smile&eyes=happy&top=longHairCurvy&accessories=none&clothes=shirtVNeck&clothingColor=f59e0b';
const ANIME_GIF_URL = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGY5OHRieXNueWV2ZG96MHRiZTR4eGxlc2M4dmJ2eXV4eXN6eDlpOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L59vS0q6KByX6/giphy.gif';

const App: React.FC = () => {
  const [state, setState] = useState<SraboniState>(SraboniState.IDLE);
  const [isComfortMode, setIsComfortMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAssistantText, setCurrentAssistantText] = useState('');
  const [currentUserText, setCurrentUserText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionRef = useRef<SraboniSession | null>(null);

  const handleTranscription = useCallback((text: string, role: 'user' | 'assistant') => {
    if (role === 'user') {
      setCurrentUserText(text);
    } else {
      setCurrentAssistantText(text);
    }
  }, []);

  const handleStateChange = useCallback((newState: string) => {
    setState(newState as SraboniState);
    if (newState === 'LISTENING' || newState === 'IDLE') {
        setMessages(prev => {
            const next = [...prev];
            if (currentUserText) {
                next.push({ id: Math.random().toString(), role: 'user', text: currentUserText, timestamp: new Date() });
                setCurrentUserText('');
            }
            if (currentAssistantText) {
                next.push({ id: Math.random().toString(), role: 'assistant', text: currentAssistantText, timestamp: new Date() });
                setCurrentAssistantText('');
            }
            return next;
        });
    }
  }, [currentAssistantText, currentUserText]);

  const handleComfortModeChange = useCallback((active: boolean) => {
    setIsComfortMode(active);
  }, []);

  const toggleSession = async () => {
    if (state === SraboniState.IDLE || state === SraboniState.ERROR) {
      setErrorMessage(null);
      try {
        sessionRef.current = new SraboniSession(
          handleTranscription,
          handleStateChange,
          handleComfortModeChange,
          (err) => {
              setErrorMessage(err?.message || "Internal error. Try running on localhost.");
              setState(SraboniState.ERROR);
          }
        );
        await sessionRef.current.start();
      } catch (e: any) {
        setErrorMessage(e?.message || "Failed to start Sraboni. Check microphone permissions.");
        setState(SraboniState.ERROR);
      }
    } else {
      sessionRef.current?.stop();
      sessionRef.current = null;
      setIsComfortMode(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between p-4 md:p-6 bg-[#0a0a0c] overflow-hidden">
      {/* Anime Character GIF Background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 z-0 bg-cover bg-center ${isComfortMode ? 'opacity-40 brightness-75 blur-sm' : 'opacity-20 grayscale-[10%]'}`}
        style={{ backgroundImage: `url(${ANIME_GIF_URL})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/60 to-[#0a0a0c]/90 z-1" />

      {/* Header with Circular Profile Photo */}
      <header className="w-full max-w-4xl flex justify-between items-center py-3 px-5 glass-morphism rounded-2xl z-50 border border-white/5 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Animated Ring */}
            <div className={`absolute -inset-1 rounded-full blur-md transition-all duration-1000 ${state !== SraboniState.IDLE ? (isComfortMode ? 'bg-rose-500/50' : 'bg-pink-500/40') : 'bg-transparent'}`} />
            
            {/* Circular Profile Photo */}
            <img 
              src={SRABONI_LOGO_URL} 
              alt="Sraboni" 
              className={`relative w-12 h-12 rounded-full border-2 transition-all duration-700 object-cover bg-slate-800 p-0.5 shadow-inner ${isComfortMode ? 'border-rose-400 scale-105' : 'border-pink-500/70'}`}
            />
            
            {/* Status Dot */}
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0c] transition-all duration-500 ${state === SraboniState.IDLE ? 'bg-slate-600' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]'}`}></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center leading-none">
              Sraboni <span className={`font-romantic ml-2 text-2xl transition-colors duration-700 ${isComfortMode ? 'text-rose-400' : 'text-pink-400'}`}>Companion</span>
            </h1>
            <span className="text-[10px] text-pink-500/60 font-black uppercase tracking-[0.2em] mt-1">Dev & Emotional Support</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            <div className={`hidden sm:flex px-3 py-1 rounded-full border transition-all duration-700 ${isComfortMode ? 'bg-rose-500/20 border-rose-500/40' : 'bg-white/5 border-white/10'}`}>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isComfortMode ? 'text-rose-200' : 'text-slate-500'}`}>
                    {isComfortMode ? 'Comfort Mode: Active' : 'System: Stable'}
                </span>
            </div>
        </div>
      </header>

      {/* Main UI */}
      <main className="w-full max-w-4xl flex-1 flex flex-col gap-4 mt-4 mb-4 overflow-hidden relative z-10">
        <div className={`glass-morphism rounded-[2.5rem] flex-1 flex flex-col overflow-hidden transition-all duration-1000 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isComfortMode ? 'bg-rose-950/20' : ''}`}>
          <div className="flex-none">
            <SraboniUI state={state} isComfortMode={isComfortMode} />
          </div>
          
          {errorMessage && (
            <div className="mx-8 p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-200 text-[11px] text-center backdrop-blur-md animate-pulse">
              <span className="block font-bold mb-1">Oh Sona! There's a glitch:</span>
              {errorMessage}
            </div>
          )}

          <ChatLog 
            messages={messages} 
            currentAssistantText={currentAssistantText} 
            currentUserText={currentUserText} 
          />
        </div>
      </main>

      {/* Mic Controls */}
      <footer className="w-full max-w-4xl py-4 flex flex-col items-center z-50">
        <button
          onClick={toggleSession}
          className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 shadow-2xl ${
            state === SraboniState.IDLE || state === SraboniState.ERROR
              ? 'bg-pink-600 hover:bg-pink-500 scale-100 hover:rotate-3'
              : 'bg-red-600 hover:bg-red-500 scale-110 shadow-red-900/40'
          }`}
        >
          <div className={`absolute inset-0 rounded-full transition-all ${state !== SraboniState.IDLE ? 'animate-ping bg-red-500/30' : 'bg-pink-500/20 group-hover:scale-125'}`}></div>
          {state === SraboniState.IDLE || state === SraboniState.ERROR ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
        
        <div className="mt-4 flex flex-col items-center">
            <p className={`text-[11px] font-black tracking-[0.4em] uppercase transition-colors duration-500 ${state === SraboniState.ERROR ? 'text-red-400' : 'text-slate-500'}`}>
                {state === SraboniState.ERROR ? 'System Interference' : (state === SraboniState.IDLE ? 'Call your Sraboni' : 'She is listening...')}
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
