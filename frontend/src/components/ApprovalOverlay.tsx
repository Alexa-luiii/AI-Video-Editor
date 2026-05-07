"use client";

import React, { useState } from 'react';

interface Decision {
  id: string;
  icon: string;
  label: string;
  status: 'pending' | 'selected' | 'skipped' | 'ai-decides';
  previewColor?: string;
  previewText?: string;
}

interface ApprovalOverlayProps {
  decisions: Decision[];
  onSelect: (id: string) => void;
  onSkip: (id: string) => void;
  onAIDecides: (id: string) => void;
  onBuild: () => void;
  onApplyAll: () => void;
  onRejectAll: () => void;
}

const ApprovalOverlay: React.FC<ApprovalOverlayProps> = ({
  decisions, onSelect, onSkip, onAIDecides, onBuild, onApplyAll, onRejectAll
}) => {
  const completedCount = decisions.filter(d => d.status !== 'pending').length;
  const progress = (completedCount / decisions.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#0E0E10]/95 backdrop-blur-md z-[100] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="h-20 border-b border-white/5 flex items-center justify-between px-12 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#7C5CFC] rounded-xl flex items-center justify-center text-white shadow-glow-purple">
              <i className="ti ti-sparkles text-xl"></i>
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tight">AI Generated Edit Plan</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Review and approve AI decisions</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={onRejectAll} className="px-6 py-2 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 rounded-full text-xs font-bold transition-standard">Reject All Remaining</button>
           <button onClick={onApplyAll} className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-bold transition-standard">Apply All Remaining</button>
           <button
             onClick={onBuild}
             className="px-8 py-2 bg-[#7C5CFC] hover:bg-[#6a4ae8] rounded-full text-xs font-black uppercase tracking-widest shadow-glow-purple transition-standard border border-[#7C5CFC]/20"
           >
             Build My Video
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Preview */}
        <div className="flex-1 p-12 flex items-center justify-center bg-black/20">
           <div className="w-full h-full max-w-4xl bg-black rounded-[40px] border border-white/5 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <i className="ti ti-video text-zinc-900 text-[200px]"></i>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-12 transition-standard">
                 <div className="max-w-md bg-[#1E1E24]/60 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-3">
                       <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                       <p className="text-[10px] font-black text-[#00D4FF] uppercase tracking-[0.2em]">Current Insight</p>
                    </div>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      AI has completed the synchronization of captions and background tracks. Transitions are optimized for higher engagement.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Decisions List */}
        <div className="w-[520px] border-l border-white/5 bg-[#0E0E10] overflow-y-auto custom-scrollbar p-12 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">AI Decisions</span>
                 <span className="text-[10px] font-black text-[#7C5CFC] uppercase tracking-[0.2em]">{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF] transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className="space-y-4">
              {decisions.map(d => (
                <div key={d.id} className={`bg-[#1E1E24] border p-6 rounded-[24px] flex items-center gap-5 transition-standard hover:shadow-2xl group ${d.status === 'selected' ? "border-green-500/30" : d.status === 'skipped' ? "border-red-500/20" : d.status === 'ai-decides' ? "border-[#7C5CFC]/30" : "border-white/5"}`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-standard shrink-0 ${d.status === 'selected' ? "bg-green-500/10 text-green-500" : d.status === 'ai-decides' ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "bg-zinc-950 text-zinc-500 group-hover:text-white"}`}>
                      <i className={`ti ${d.icon}`}></i>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                         <p className="text-xs font-black text-white leading-tight uppercase tracking-tight">{d.label}</p>
                         {(d.previewColor || d.previewText) && (
                            <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: d.previewColor }}>
                               {d.previewText && <span className="text-[8px] font-black text-white uppercase">{d.previewText}</span>}
                            </div>
                         )}
                      </div>
                      <div className="flex gap-2">
                         <button
                           onClick={() => onSelect(d.id)}
                           className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-standard ${d.status === 'selected' ? "bg-green-500 text-white shadow-lg shadow-green-900/20" : "bg-zinc-950 text-zinc-500 hover:text-green-500 hover:bg-green-500/5"}`}
                         >
                            Select
                         </button>
                         <button
                           onClick={() => onSkip(d.id)}
                           className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-standard border ${d.status === 'skipped' ? "bg-red-500 border-red-500 text-white" : "bg-transparent border-white/5 text-zinc-500 hover:text-red-500 hover:border-red-500/20"}`}
                         >
                            Skip
                         </button>
                         <button
                           onClick={() => onAIDecides(d.id)}
                           className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-standard ${d.status === 'ai-decides' ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "bg-zinc-950 text-zinc-500 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5"}`}
                         >
                            No Idea
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalOverlay;
