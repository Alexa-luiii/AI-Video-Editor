"use strict";

import React from 'react';
import { Scissors, Trash2, GripVertical, Type, Music, Film } from 'lucide-react';

const Timeline: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Timeline</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
            <span className="text-[10px] font-mono text-blue-500">00:00:12:05</span>
            <span className="text-[10px] text-zinc-600">/ 00:01:30:00</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold transition-all border border-zinc-700/50 group">
            <Scissors size={12} className="group-hover:text-blue-500" />
            SPLIT
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold transition-all border border-zinc-700/50 group">
            <Trash2 size={12} className="group-hover:text-red-500" />
            DELETE
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        {/* Track 1: Text */}
        <div className="flex gap-4 group">
          <div className="w-8 flex flex-col items-center justify-center text-zinc-700 group-hover:text-purple-500 transition-colors">
            <Type size={14} />
          </div>
          <div className="flex-1 h-10 bg-purple-500/5 border border-purple-500/10 rounded-lg relative overflow-hidden group-hover:bg-purple-500/10 transition-all">
             <div className="absolute inset-y-1.5 left-[20%] w-[15%] bg-purple-500/40 border border-purple-500/50 rounded-md flex items-center px-2 cursor-pointer hover:bg-purple-500/60 transition-all">
                <span className="text-[8px] font-bold text-white truncate">Captions 01</span>
             </div>
             <div className="absolute inset-y-1.5 left-[40%] w-[20%] bg-purple-500/40 border border-purple-500/50 rounded-md flex items-center px-2 cursor-pointer hover:bg-purple-500/60 transition-all">
                <span className="text-[8px] font-bold text-white truncate">Captions 02</span>
             </div>
          </div>
        </div>

        {/* Track 2: Video */}
        <div className="flex gap-4 group">
          <div className="w-8 flex flex-col items-center justify-center text-zinc-700 group-hover:text-blue-500 transition-colors">
            <Film size={14} />
          </div>
          <div className="flex-1 h-14 bg-blue-500/5 border border-blue-500/10 rounded-lg relative overflow-hidden group-hover:bg-blue-500/10 transition-all">
             <div className="absolute inset-y-1 left-[5%] right-[10%] bg-blue-500/20 border border-blue-500/40 rounded-md flex items-center justify-between px-3 cursor-grab active:cursor-grabbing hover:bg-blue-500/30 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-zinc-800 rounded overflow-hidden border border-white/10">
                    <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-zinc-900" />
                  </div>
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Main_Clip.mp4</span>
                </div>
                <GripVertical size={12} className="text-blue-500/50" />
             </div>
          </div>
        </div>

        {/* Track 3: Audio */}
        <div className="flex gap-4 group">
          <div className="w-8 flex flex-col items-center justify-center text-zinc-700 group-hover:text-green-500 transition-colors">
            <Music size={14} />
          </div>
          <div className="flex-1 h-10 bg-green-500/5 border border-green-500/10 rounded-lg relative overflow-hidden group-hover:bg-green-500/10 transition-all">
             <div className="absolute inset-y-1.5 left-[0%] right-[0%] bg-green-500/20 border border-green-500/30 rounded-md flex items-center px-3 cursor-pointer hover:bg-green-500/40 transition-all">
                <div className="flex-1 h-full flex items-center gap-[1px]">
                   {[...Array(100)].map((_, i) => (
                     <div key={i} className="flex-1 bg-green-500/40 rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Playhead Mock */}
      <div className="absolute left-[300px] top-0 bottom-0 w-px bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] z-20 pointer-events-none">
        <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white" />
      </div>
    </div>
  );
};

export default Timeline;
