"use client";

import React, { useState } from 'react';

interface ExportModalProps {
  onClose: () => void;
  onExport: (settings: any) => void;
  isExporting: boolean;
  progress: number;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport, isExporting, progress }) => {
  const [resolution, setResolution] = useState('720p');
  const [format, setFormat] = useState('MP4');
  const [quality, setQuality] = useState(80);
  const [includeCaptions, setIncludeCaptions] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#1E1E24] border border-white/10 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#7C5CFC]/20 rounded-2xl flex items-center justify-center text-[#7C5CFC]">
                 <i className="ti ti-download text-2xl"></i>
              </div>
              <div>
                 <h2 className="text-xl font-black tracking-tight">Export Video</h2>
                 <p className="text-xs text-zinc-500 uppercase tracking-widest">Finalize your masterpiece</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-standard">
              <i className="ti ti-x text-2xl"></i>
           </button>
        </div>

        <div className="p-8 space-y-8">
           {isExporting ? (
             <div className="py-12 space-y-8 flex flex-col items-center text-center">
                <div className="relative">
                   <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * progress) / 100}
                        className="text-[#7C5CFC] transition-all duration-500"
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-white">
                      {Math.round(progress)}%
                   </div>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white mb-2">Rendering with FFmpeg</h3>
                   <p className="text-sm text-zinc-500 max-w-xs">Your video is being processed client-side. Please keep this tab open.</p>
                </div>
             </div>
           ) : (
             <>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Resolution</p>
                     <div className="space-y-2">
                        {['720p', '1080p', '4K'].map(res => (
                          <button
                            key={res}
                            onClick={() => setResolution(res)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-standard ${resolution === res ? "bg-[#7C5CFC]/10 border-[#7C5CFC] text-white" : "bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10"}`}
                          >
                             <span className="text-xs font-bold">{res}</span>
                             {res !== '720p' && <span className="text-[8px] font-black bg-[#7C5CFC] text-white px-2 py-0.5 rounded-full uppercase">PRO</span>}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Format</p>
                        <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
                           {['MP4', 'MOV'].map(f => (
                             <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-standard ${format === f ? "bg-[#7C5CFC] text-white" : "text-zinc-500"}`}>{f}</button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Quality</p>
                           <span className="text-[10px] font-mono text-[#7C5CFC]">{quality}%</span>
                        </div>
                        <input type="range" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full accent-[#7C5CFC] h-1" />
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                     <i className="ti ti-subtitles text-[#00D4FF]"></i>
                     <span className="text-xs font-bold text-zinc-300">Burn-in AI Captions</span>
                  </div>
                  <button
                    onClick={() => setIncludeCaptions(!includeCaptions)}
                    className={`w-12 h-6 rounded-full transition-standard p-1 relative ${includeCaptions ? "bg-[#7C5CFC]" : "bg-zinc-800"}`}
                  >
                     <div className={`w-4 h-4 bg-white rounded-full transition-standard ${includeCaptions ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
               </div>
             </>
           )}
        </div>

        {!isExporting && (
          <div className="p-8 pt-0 flex gap-4">
             <button onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-standard">Cancel</button>
             <button
               onClick={() => onExport({ resolution, format, quality, includeCaptions })}
               className="flex-[2] py-4 bg-[#7C5CFC] hover:bg-[#6a4ae8] rounded-2xl font-black text-xs tracking-widest uppercase shadow-glow-purple transition-standard"
             >
               Start Export
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;
