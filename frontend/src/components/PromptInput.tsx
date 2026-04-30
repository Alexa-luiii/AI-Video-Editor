"use strict";

import React from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading, disabled }) => {
  const suggestions = [
    "Make demo video for client",
    "Make proposal video",
    "Make funny reel",
    "Make emotional story"
  ];

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare size={14} className="text-blue-500" />
          AI Prompt
        </h2>
        <Sparkles size={16} className="text-purple-500 animate-pulse" />
      </div>

      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vision..."
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all resize-none h-32 text-sm leading-relaxed"
          disabled={disabled || isLoading}
        />

        <button
          onClick={onGenerate}
          disabled={disabled || isLoading || !prompt.trim()}
          className={`absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            disabled || isLoading || !prompt.trim()
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-95'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="text-[11px] px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all border border-zinc-700/50"
              disabled={disabled || isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isLoading || !prompt.trim()}
        className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          disabled || isLoading || !prompt.trim()
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/10'
        }`}
      >
        {isLoading ? 'AI is working...' : 'GENERATE AI EDIT'}
        {!isLoading && <Sparkles size={16} />}
      </button>
    </div>
  );
};

export default PromptInput;
