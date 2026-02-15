
import React from 'react';
import { SraboniState } from '../types';

interface SraboniUIProps {
  state: SraboniState;
  isComfortMode: boolean;
}

const SraboniUI: React.FC<SraboniUIProps> = ({ state, isComfortMode }) => {
  const getOrbColor = () => {
    if (isComfortMode && state !== SraboniState.ERROR && state !== SraboniState.IDLE) {
      return 'bg-rose-400 shadow-[0_0_70px_rgba(251,113,133,0.7)] scale-110 animate-pulse-slow';
    }

    switch (state) {
      case SraboniState.SPEAKING: return 'bg-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.6)] scale-110';
      case SraboniState.LISTENING: return 'bg-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)] scale-100';
      case SraboniState.THINKING: return 'bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] scale-105 animate-pulse';
      case SraboniState.CONNECTING: return 'bg-gray-500 shadow-none scale-90 animate-bounce';
      case SraboniState.ERROR: return 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
      default: return 'bg-gray-800 shadow-none scale-90 opacity-50';
    }
  };

  const getStatusText = () => {
    if (isComfortMode && state === SraboniState.SPEAKING) return 'Sraboni is comforting you...';
    
    switch (state) {
      case SraboniState.SPEAKING: return 'Sraboni is speaking...';
      case SraboniState.LISTENING: return 'Listening to you, Sona...';
      case SraboniState.THINKING: return 'Thinking...';
      case SraboniState.CONNECTING: return 'Coming to you...';
      case SraboniState.ERROR: return 'Something went wrong, love.';
      default: return 'Sraboni is resting.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="relative">
        {/* Decorative Rings - will-change added for smoother performance */}
        <div className={`absolute -inset-10 border border-pink-500/10 rounded-full transition-opacity duration-1000 ${state !== SraboniState.IDLE ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`} style={{ animationDuration: '15s', willChange: 'transform' }}></div>
        <div className={`absolute -inset-8 border ${isComfortMode ? 'border-rose-400/30' : 'border-pink-500/20'} rounded-full transition-opacity duration-1000 ${state !== SraboniState.IDLE ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`} style={{ animationDuration: '10s', willChange: 'transform' }}></div>
        <div className={`absolute -inset-4 border ${isComfortMode ? 'border-rose-300/30' : 'border-indigo-500/20'} rounded-full transition-opacity duration-1000 ${state !== SraboniState.IDLE ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`} style={{ animationDuration: '7s', animationDirection: 'reverse', willChange: 'transform' }}></div>
        
        {/* Comfort Mode Aura */}
        {isComfortMode && state !== SraboniState.IDLE && (
          <div className="absolute -inset-12 bg-rose-500/10 blur-3xl rounded-full animate-pulse-slow" style={{ willChange: 'opacity, transform' }}></div>
        )}

        {/* Core Orb */}
        <div className={`w-32 h-32 rounded-full transition-all duration-700 ease-in-out flex items-center justify-center relative z-10 ${getOrbColor()}`} style={{ willChange: 'transform, box-shadow, background-color' }}>
           <div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm ${isComfortMode ? 'animate-pulse-slow' : 'animate-pulse'}`}></div>
        </div>
      </div>

      <div className="text-center space-y-2 relative z-20">
        <h2 className={`text-4xl font-romantic transition-colors duration-700 ${isComfortMode ? 'text-rose-300' : 'text-pink-300'} drop-shadow-md`}>Sraboni</h2>
        <p className={`text-sm font-medium tracking-wide transition-colors duration-300 ${state === SraboniState.ERROR ? 'text-red-400' : 'text-slate-400'}`}>
          {getStatusText()}
        </p>
        {isComfortMode && state !== SraboniState.IDLE && (
           <div className="mt-3">
             <span className="inline-block px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] text-rose-300 uppercase tracking-widest animate-pulse">
               Comfort Mode
             </span>
           </div>
        )}
      </div>
    </div>
  );
};

export default SraboniUI;
