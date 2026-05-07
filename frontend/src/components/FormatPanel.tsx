"use client";

import React, { useState } from 'react';

const FormatPanel = () => {
  const [aspectRatio, setAspectRatio] = useState('9:16');

  const formats = [
    { id: '9:16', label: '9:16 TikTok / Reels', icon: 'ti-device-mobile' },
    { id: '16:9', label: '16:9 YouTube / Desktop', icon: 'ti-screen-share' },
    { id: '1:1', label: '1:1 Square Instagram', icon: 'ti-square' },
    { id: '4:5', label: '4:5 Instagram Portrait', icon: 'ti-rectangle-vertical' },
    { id: '21:9', label: '21:9 Cinematic Ultra', icon: 'ti-rectangle' },
  ];

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-left duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2 uppercase">
           <i className="ti ti-aspect-ratio text-[#7C5CFC]"></i>
           Aspect Ratio
        </h3>
        <p className="text-xs text-zinc-500">Select the output format for your video.</p>
      </div>

      <div className="space-y-3">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => setAspectRatio(f.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-standard group ${aspectRatio === f.id ? "bg-[#7C5CFC]/10 border-[#7C5CFC] text-white shadow-lg" : "bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-standard ${aspectRatio === f.id ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "bg-zinc-900 group-hover:text-white"}`}>
               <i className={`ti ${f.icon}`}></i>
            </div>
            <div className="text-left">
               <p className={`text-[11px] font-black uppercase tracking-widest ${aspectRatio === f.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>{f.label}</p>
               <p className="text-[9px] text-zinc-600 font-medium">Auto-resized for {f.id}</p>
            </div>
            {aspectRatio === f.id && <i className="ti ti-circle-check-filled ml-auto text-[#00D4FF]"></i>}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 space-y-4">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Zoom & Pan</p>
         <div className="bg-[#1E1E24] p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ken Burns Effect</span>
               <button className="w-10 h-5 rounded-full bg-[#7C5CFC] p-1 flex items-center justify-end transition-standard">
                  <div className="w-3 h-3 bg-white rounded-full" />
               </button>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-zinc-600">ZOOM STRENGTH</span>
                  <span className="text-[9px] font-mono text-[#7C5CFC]">1.2X</span>
               </div>
               <input type="range" className="w-full accent-[#7C5CFC] h-1" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default FormatPanel;
