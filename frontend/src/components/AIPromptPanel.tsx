"use client";

import React, { useState } from 'react';

interface AIPromptPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const AIPromptPanel: React.FC<AIPromptPanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState("");

  const quickPrompts = [
    "Demo Video", "Funny", "Emotional", "YouTube", "TikTok Reel",
    "Instagram Reel", "Proposal", "Cinematic", "Tutorial"
  ];

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
           <i className="ti ti-sparkles text-[#7C5CFC]"></i>
           AI PROMPT
        </h3>
        <p className="text-xs text-zinc-500">Describe your vision and let ClipMind do the work.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your video goal... e.g. make this a demo for a client, make it funny, emotional..."
          className="w-full h-48 bg-[#1E1E24] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder-zinc-600 focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30 outline-none transition-standard resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 bg-[#1E1E24] border border-white/5 rounded-full text-[10px] font-bold text-zinc-400 hover:text-white hover:border-[#7C5CFC]/50 transition-standard"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onGenerate(prompt)}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-4 bg-[#7C5CFC] hover:bg-[#6a4ae8] disabled:bg-zinc-800 disabled:text-zinc-600 rounded-2xl font-black text-sm tracking-widest uppercase shadow-glow-purple transition-standard flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <i className="ti ti-sparkles"></i>
            Generate Edit
          </>
        )}
      </button>

      <div className="pt-6 border-t border-white/5">
        <div className="bg-[#7C5CFC]/5 rounded-xl p-4 border border-[#7C5CFC]/10">
           <p className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-widest mb-1">AI Intelligence</p>
           <p className="text-[11px] text-zinc-400 leading-relaxed">
             Our AI will detect speech, analyze visuals, and apply the best effects, transitions, and captions based on your prompt.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AIPromptPanel;
