"use client";

import React, { useState } from 'react';

const MediaPanel = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'image'>('video');

  const assets = {
    video: [
      { name: 'main_clip.mp4', size: '24.5 MB', duration: '0:30' },
      { name: 'b-roll_city.mp4', size: '12.2 MB', duration: '0:15' }
    ],
    audio: [
      { name: 'background_music.mp3', size: '4.2 MB', duration: '3:20' }
    ],
    image: [
      { name: 'logo.png', size: '0.5 MB' }
    ]
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-left duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2 uppercase">
           <i className="ti ti-upload text-[#7C5CFC]"></i>
           Media Assets
        </h3>
        <p className="text-xs text-zinc-500">Manage your project files and overlays.</p>
      </div>

      <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
         {(['video', 'audio', 'image'] as const).map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-standard ${activeTab === tab ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "text-zinc-500 hover:text-zinc-300"}`}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="space-y-4">
        <label className="w-full h-32 border-2 border-dashed border-white/10 hover:border-[#7C5CFC]/30 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-standard group bg-[#1E1E24]/30">
           <i className={`ti ti-${activeTab === 'video' ? 'movie' : activeTab === 'audio' ? 'music' : 'photo'} text-3xl text-zinc-600 group-hover:text-[#7C5CFC] mb-2`}></i>
           <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">Upload {activeTab}</span>
           <input type="file" className="hidden" accept={`${activeTab}/*`} />
        </label>

        <div className="space-y-2">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Recent Uploads</p>
           {assets[activeTab].map((asset, i) => (
             <div key={i} className="flex items-center gap-4 p-3 bg-zinc-950 border border-white/5 rounded-2xl group hover:border-white/10 transition-standard cursor-grab active:cursor-grabbing">
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-[#7C5CFC] transition-standard">
                   <i className={`ti ti-${activeTab === 'video' ? 'player-play' : activeTab === 'audio' ? 'music' : 'photo'}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">{asset.name}</p>
                   <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">{asset.size} {asset.duration ? `• ${asset.duration}` : ''}</p>
                </div>
                <button className="text-zinc-700 hover:text-red-500 transition-standard"><i className="ti ti-trash"></i></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPanel;
