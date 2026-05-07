"use client";

import React from 'react';

interface ApprovalOverlayProps {
  decisions: Array<{
    id: string;
    icon: string;
    label: string;
    status: 'pending' | 'selected' | 'skipped' | 'ai-decides';
  }>;
  onSelect: (id: string) => void;
  onSkip: (id: string) => void;
  onAIDecides: (id: string) => void;
  onBuild: () => void;
}

const ApprovalOverlay: React.FC<ApprovalOverlayProps> = ({
  decisions, onSelect, onSkip, onAIDecides, onBuild
}) => {
  return (
    <div className="fixed inset-0 bg-[#0E0E10]/95 backdrop-blur-md z-[100] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="h-20 border-b border-white/5 flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#7C5CFC] rounded-xl flex items-center justify-center text-white">
              <i className="ti ti-sparkles text-xl"></i>
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tight">AI Generated Edit Plan</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Review and approve AI decisions</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-full text-xs font-bold transition-standard">Reject All</button>
           <button className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-bold transition-standard">Apply All Remaining</button>
           <button
             onClick={onBuild}
             className="px-8 py-2 bg-[#7C5CFC] hover:bg-[#6a4ae8] rounded-full text-xs font-black uppercase tracking-widest shadow-glow-purple transition-standard"
           >
             Build My Video
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Preview */}
        <div className="flex-1 p-12 flex items-center justify-center bg-black/40">
           <div className="w-full h-full max-w-4xl bg-black rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <i className="ti ti-video text-zinc-900 text-[200px]"></i>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12">
                 <div className="max-w-md bg-[#7C5CFC]/20 backdrop-blur border border-[#7C5CFC]/30 p-6 rounded-2xl">
                    <p className="text-xs font-bold text-[#7C5CFC] uppercase tracking-widest mb-2">Current Insight</p>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      AI has detected speech and visuals. Synchronizing captions and applying energetic transitions for your TikTok Reel prompt.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Decisions List */}
        <div className="w-[500px] border-l border-white/5 overflow-y-auto custom-scrollbar p-12 space-y-6">
           <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">AI Decisions</span>
              <div className="h-1 flex-1 mx-4 bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-[#7C5CFC] w-[45%]" />
              </div>
              <span className="text-[10px] font-bold text-[#7C5CFC]">45% COMPLETE</span>
           </div>

           {decisions.map(d => (
             <div key={d.id} className="bg-[#1E1E24] border border-white/5 p-5 rounded-2xl flex items-center gap-4 transition-standard hover:border-white/10 group">
                <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-standard shrink-0">
                   <i className={`ti ${d.icon} text-2xl`}></i>
                </div>
                <div className="flex-1">
                   <p className="text-xs font-bold text-white mb-1">{d.label}</p>
                   <div className="flex gap-2">
                      <DecisionButton
                        active={d.status === 'selected'}
                        variant="green"
                        onClick={() => onSelect(d.id)}
                      >
                         <i className="ti ti-check"></i> Select
                      </DecisionButton>
                      <DecisionButton
                        active={d.status === 'skipped'}
                        variant="gray"
                        onClick={() => onSkip(d.id)}
                      >
                         <i className="ti ti-x"></i> Skip
                      </DecisionButton>
                      <DecisionButton
                        active={d.status === 'ai-decides'}
                        variant="purple"
                        onClick={() => onAIDecides(d.id)}
                      >
                         <i className="ti ti-sparkles"></i> AI Decides
                      </DecisionButton>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const DecisionButton = ({ children, active, variant, onClick }: { children: React.ReactNode, active: boolean, variant: 'green' | 'gray' | 'purple', onClick: () => void }) => {
  const styles = {
    green: active ? "bg-green-500 text-white" : "text-zinc-500 hover:bg-green-500/10",
    gray: active ? "bg-zinc-600 text-white" : "text-zinc-500 hover:bg-white/5",
    purple: active ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "text-zinc-500 hover:bg-[#7C5CFC]/10"
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-standard ${styles[variant]} ${!active && "border border-white/5"}`}
    >
      {children}
    </button>
  );
};

export default ApprovalOverlay;
