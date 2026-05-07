"use client";

import React, { useState, useEffect } from 'react';
import ClipMindApp from '@/components/ClipMindApp';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#0E0E10] z-[9999] flex flex-col items-center justify-center animate-out fade-out duration-500 delay-[2500ms] fill-mode-forwards">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7C5CFC] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
             <i className="ti ti-player-play-filled text-4xl text-white"></i>
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">ClipMind</h1>
        <p className="text-zinc-500 text-sm tracking-widest font-medium uppercase">Your prompt. Your video. Done.</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-zinc-900 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF] w-0 animate-[loading_2.5s_ease-in-out_forwards]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 2.5s loading + 0.5s fade
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <SplashScreen />}
      <ClipMindApp />
    </>
  );
}
