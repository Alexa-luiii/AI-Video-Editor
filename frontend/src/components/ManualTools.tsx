"use strict";

import React from 'react';
import {
  Settings2,
  Sun,
  Volume2,
  Type,
  Music,
  Palette,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ManualToolsProps {
  isVisible: boolean;
}

const ManualTools: React.FC<ManualToolsProps> = ({ isVisible }) => {
  if (!isVisible) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-800">
          <Settings2 size={48} strokeWidth={1} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-400">Advanced Tools Locked</h4>
          <p className="text-[11px] text-zinc-600 leading-relaxed px-4">
            Upload a video and generate an AI edit to unlock manual adjustment tools.
          </p>
        </div>
      </div>
    );
  }

  const toolCategories = [
    { icon: Sun, label: 'Adjustments', desc: 'Brightness, contrast, saturation' },
    { icon: Palette, label: 'Filters & Effects', desc: 'LUTS and visual styles' },
    { icon: Type, label: 'Text Overlays', desc: 'Titles, captions, typography' },
    { icon: Volume2, label: 'Audio Mixing', desc: 'Leveling and equalization' },
    { icon: Zap, label: 'Transitions', desc: 'Scene blending effects' },
    { icon: Layers, label: 'Overlays', desc: 'Stickers and graphics' },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Settings2 size={18} className="text-purple-500" />
          Refine Edit
        </h3>

        <div className="space-y-4">
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Brightness</label>
                <span className="text-[10px] text-blue-500 font-mono">+12%</span>
             </div>
             <input type="range" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">AI Voice Volume</label>
                <span className="text-[10px] text-purple-500 font-mono">85%</span>
             </div>
             <input type="range" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-900 space-y-4">
        <h4 className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black mb-4">Manual Controls</h4>
        <div className="grid grid-cols-1 gap-2">
          {toolCategories.map((tool) => (
            <button
              key={tool.label}
              className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group"
            >
              <div className="p-2 bg-zinc-950 rounded-lg text-zinc-500 group-hover:text-white group-hover:bg-blue-600/20 transition-all">
                <tool.icon size={16} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">{tool.label}</p>
                <p className="text-[9px] text-zinc-600 truncate">{tool.desc}</p>
              </div>
              <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <button className="w-full mt-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-500 rounded-xl font-bold text-xs transition-all uppercase tracking-widest active:scale-95">
        Add Manual Track
      </button>
    </div>
  );
};

export default ManualTools;
