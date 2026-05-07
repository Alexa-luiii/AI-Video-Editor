"use client";

import React, { useState, useEffect } from 'react';
import AIPromptPanel from './AIPromptPanel';
import ApprovalOverlay from './ApprovalOverlay';
import Timeline from './Timeline';
import VoicePanel from './VoicePanel';
import ExportModal from './ExportModal';

const ClipMindApp = () => {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(30);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Collapse States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);

  // Error State
  const [error, setError] = useState<string | null>(null);

  const [decisions, setDecisions] = useState([
    { id: '1', icon: 'ti-subtitles', label: 'Synced bold captions for speech', status: 'pending' },
    { id: '2', icon: 'ti-wave-sine', label: 'Dynamic glitch transitions', status: 'pending' },
    { id: '3', icon: 'ti-headphones', label: 'Energetic electronic background music', status: 'pending' },
    { id: '4', icon: 'ti-wand', label: 'Subtle vignette and film grain', status: 'pending' },
    { id: '5', icon: 'ti-crop', label: '9:16 Format for TikTok/Reels', status: 'pending' },
  ]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
      if (e.code === 'ArrowRight') {
        setPlayheadPos(p => Math.min(100, p + 1));
      }
      if (e.code === 'ArrowLeft') {
        setPlayheadPos(p => Math.max(0, p - 1));
      }
      if (e.code === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Auto-save logic
  useEffect(() => {
    const interval = setInterval(() => {
      const state = { projectName, playheadPos, decisions };
      localStorage.setItem('clipmind_project', JSON.stringify(state));
    }, 30000);
    return () => clearInterval(interval);
  }, [projectName, playheadPos, decisions]);

  const handleGenerate = (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    setTimeout(() => {
      if (prompt.toLowerCase().includes("error")) {
        setError("AI Analysis failed. Please check your connection and try again.");
        setIsGenerating(false);
      } else {
        setIsGenerating(false);
        setShowApproval(true);
      }
    }, 2000);
  };

  const updateDecision = (id: string, status: any) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleBuildVideo = () => {
     setShowApproval(false);
  };

  const handleStartExport = (settings: any) => {
     setIsExporting(true);
     setExportProgress(0);
     const interval = setInterval(() => {
        setExportProgress(prev => {
           if (prev >= 100) {
              clearInterval(interval);
              setIsExporting(false);
              setShowExport(false);
              return 100;
           }
           return prev + 2;
        });
     }, 100);
  };

  const toolGroups = [
    { label: 'Media', items: [{ id: 'upload', icon: 'ti-upload' }, { id: 'music', icon: 'ti-music' }, { id: 'photo', icon: 'ti-photo' }, { id: 'world', icon: 'ti-world', badge: 'SOON' }] },
    { label: 'AI Tools', items: [{ id: 'ai', icon: 'ti-sparkles' }, { id: 'captions', icon: 'ti-subtitles' }, { id: 'narration', icon: 'ti-eye' }, { id: 'voice', icon: 'ti-microphone' }, { id: 'translate', icon: 'ti-language', badge: 'SOON' }] },
    { label: 'Edit', items: [{ id: 'cut', icon: 'ti-cut' }, { id: 'trim', icon: 'ti-arrows-horizontal' }, { id: 'speed', icon: 'ti-gauge' }, { id: 'crop', icon: 'ti-crop' }, { id: 'rotate', icon: 'ti-rotate' }] },
    { label: 'Visuals', items: [{ id: 'filters', icon: 'ti-adjustments' }, { id: 'color', icon: 'ti-palette' }, { id: 'transitions', icon: 'ti-wave-sine' }, { id: 'effects', icon: 'ti-wand' }] },
    { label: 'Text', items: [{ id: 'text', icon: 'ti-text-size' }, { id: 'sticker', icon: 'ti-mood-happy' }] },
  ];

  return (
    <div className={`h-screen w-screen bg-[#0E0E10] flex flex-col overflow-hidden text-white relative ${isFullscreen ? "cursor-none" : ""}`}>
      {showApproval && (
        <ApprovalOverlay
          decisions={decisions as any}
          onSelect={(id) => updateDecision(id, 'selected')}
          onSkip={(id) => updateDecision(id, 'skipped')}
          onAIDecides={(id) => updateDecision(id, 'ai-decides')}
          onBuild={handleBuildVideo}
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onExport={handleStartExport}
          isExporting={isExporting}
          progress={exportProgress}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="bg-[#1E1E24] border border-white/10 w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl">
              <h2 className="text-xl font-black flex items-center gap-3"><i className="ti ti-help-circle text-[#7C5CFC]"></i> Shortcuts & Guide</h2>
              <div className="space-y-4">
                 <ShortcutRow label="Play / Pause" keybind="SPACE" />
                 <ShortcutRow label="Save Project" keybind="CTRL + S" />
                 <ShortcutRow label="Undo Action" keybind="CTRL + Z" />
                 <ShortcutRow label="Seek Forward" keybind="→" />
                 <ShortcutRow label="Seek Backward" keybind="←" />
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full py-3 bg-[#7C5CFC] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-standard shadow-glow-purple">Got it</button>
           </div>
        </div>
      )}

      {/* Zone 1: Top Bar */}
      {!isFullscreen && (
        <header className="h-14 bg-[#0E0E10] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7C5CFC] to-[#00D4FF] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
              <i className="ti ti-player-play-filled text-sm"></i>
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">ClipMind</span>
          </div>

          <div className="flex-1 flex justify-center px-12">
             <input
               value={projectName}
               onChange={(e) => setProjectName(e.target.value)}
               className="bg-transparent text-center text-sm font-bold tracking-tight focus:bg-white/5 px-4 py-1 rounded-xl outline-none transition-standard border border-transparent focus:border-white/10 w-full max-w-sm"
             />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#1E1E24] p-1 rounded-xl border border-white/5">
               <button className="p-2 text-zinc-500 hover:text-white transition-standard"><i className="ti ti-arrow-back-up text-lg"></i></button>
               <button className="p-2 text-zinc-500 hover:text-white transition-standard"><i className="ti ti-arrow-forward-up text-lg"></i></button>
            </div>
            <button className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-standard">Save Draft</button>
            <button
              onClick={() => setShowExport(true)}
              className="px-6 py-1.5 text-xs font-black uppercase tracking-widest bg-[#7C5CFC] hover:bg-[#6a4ae8] rounded-full shadow-glow-purple transition-standard border border-[#7C5CFC]/20"
            >
              Export
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Zone 2: Left Sidebar */}
        {!isFullscreen && (
          <aside className={`${sidebarCollapsed ? "w-0 overflow-hidden" : "w-[72px]"} bg-[#0E0E10] border-r border-white/5 flex flex-col py-6 shrink-0 overflow-y-auto custom-scrollbar no-scrollbar transition-standard`}>
            <div className="space-y-6 flex flex-col items-center">
              {toolGroups.map((group, idx) => (
                <div key={group.label} className={`flex flex-col gap-3 items-center w-full ${idx !== toolGroups.length - 1 ? "border-b border-white/5 pb-6" : ""}`}>
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
                      className={`p-2.5 rounded-xl transition-standard group relative ${activePanel === item.id ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "text-zinc-500 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5"}`}
                    >
                      <i className={`ti ${item.icon} text-xl`}></i>
                      {item.badge && (
                         <span className="absolute -top-1 -right-1 bg-cyan-500 text-[6px] font-black text-white px-1 py-0.5 rounded-full ring-2 ring-[#0E0E10]">
                            {item.badge}
                         </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex overflow-hidden">
            {/* Collapse Toggle Left */}
            {!isFullscreen && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-[#1E1E24] border border-white/5 rounded-r-lg flex items-center justify-center text-zinc-600 hover:text-white z-40 transition-standard ${sidebarCollapsed ? "translate-x-0" : "translate-x-[72px]"}`}
              >
                <i className={`ti ${sidebarCollapsed ? 'ti-chevron-right' : 'ti-chevron-left'} text-xs`}></i>
              </button>
            )}

            {/* Context Panel */}
            {activePanel && !isFullscreen && (
              <div className="w-[300px] border-r border-white/5 bg-[#0E0E10] shrink-0 p-6 overflow-y-auto custom-scrollbar animate-in slide-in-from-left duration-300">
                {activePanel === 'voice' ? <VoicePanel /> : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                     <i className="ti ti-tool text-4xl"></i>
                     <p className="text-xs font-bold uppercase tracking-widest">{activePanel} Tools Placeholder</p>
                  </div>
                )}
              </div>
            )}

            {/* Zone 3: Center Preview */}
            <div className={`flex-1 bg-[#0E0E10] flex flex-col p-8 items-center justify-center relative min-w-0 ${isFullscreen ? "p-0" : ""}`}>
               {error && (
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <i className="ti ti-alert-circle text-red-500 text-xl"></i>
                    <p className="text-xs font-bold text-red-500">{error}</p>
                    <button onClick={() => handleGenerate("Retry")} className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Retry</button>
                 </div>
               )}

               <div className={`w-full h-full max-w-4xl bg-black rounded-[40px] border border-white/5 shadow-2xl flex items-center justify-center relative group overflow-hidden ${isFullscreen ? "max-w-none rounded-none border-0" : ""}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <i className="ti ti-video text-zinc-900 text-[160px]"></i>
                  </div>

                  {/* Playback Controls */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1E1E24]/80 backdrop-blur-xl px-8 py-4 rounded-3xl flex items-center gap-8 border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
                     <button className="text-zinc-400 hover:text-white transition-standard"><i className="ti ti-rotate-2 text-2xl"></i></button>
                     <button className="text-zinc-400 hover:text-white transition-standard"><i className="ti ti-player-skip-back text-2xl"></i></button>
                     <button className="w-14 h-14 bg-[#7C5CFC] rounded-full flex items-center justify-center text-white shadow-glow-purple transition-standard active:scale-90"><i className="ti ti-player-play-filled text-xl"></i></button>
                     <button className="text-zinc-400 hover:text-white transition-standard"><i className="ti ti-player-skip-forward text-2xl"></i></button>
                     <button onClick={() => setIsFullscreen(!isFullscreen)} className={`transition-standard ${isFullscreen ? "text-[#7C5CFC]" : "text-zinc-400 hover:text-white"}`}><i className={`ti ${isFullscreen ? 'ti-arrows-minimize' : 'ti-maximize'} text-2xl`}></i></button>
                     <div className="h-6 w-px bg-white/10" />
                     <div className="flex items-center gap-3">
                        <i className="ti ti-volume text-zinc-400"></i>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="w-1/2 h-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF]" />
                        </div>
                     </div>
                  </div>

                  {isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="ti ti-x text-2xl"></i>
                    </button>
                  )}
               </div>

               {!isFullscreen && (
                 <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] bg-[#1E1E24] px-4 py-2 rounded-full border border-white/5 shrink-0">
                    <span className="text-[#00D4FF]">00:00:12:05</span>
                    <span className="opacity-20">/</span>
                    <span>00:01:30:00</span>
                 </div>
               )}
            </div>

            {/* Zone 4: Right Sidebar */}
            {!isFullscreen && (
              <aside className={`${rightPanelCollapsed ? "w-0" : "w-[340px]"} bg-[#0E0E10] border-l border-white/5 overflow-y-auto custom-scrollbar flex flex-col shrink-0 transition-standard relative`}>
                 <button
                   onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                   className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-[#1E1E24] border border-white/5 rounded-l-lg flex items-center justify-center text-zinc-600 hover:text-white z-40"
                 >
                   <i className={`ti ${rightPanelCollapsed ? 'ti-chevron-left' : 'ti-chevron-right'} text-xs`}></i>
                 </button>
                 {!rightPanelCollapsed && (
                   <div className="p-6 h-full">
                      <AIPromptPanel
                        onGenerate={handleGenerate}
                        isLoading={isGenerating}
                      />
                   </div>
                 )}
              </aside>
            )}
          </div>

          {/* Zone 5: Timeline */}
          {!isFullscreen && (
            <div className={`${timelineCollapsed ? "h-14" : "h-[340px]"} bg-[#1A1A1F] border-t border-white/5 flex flex-col shrink-0 relative overflow-hidden transition-standard`}>
               <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-[#1A1A1F] shrink-0">
                  <div className="flex items-center gap-6 text-zinc-500">
                     <button
                       onClick={() => setTimelineCollapsed(!timelineCollapsed)}
                       className="hover:text-white transition-standard"
                     >
                       <i className={`ti ${timelineCollapsed ? 'ti-layout-bottombar-expand' : 'ti-layout-bottombar-collapse'} text-lg`}></i>
                     </button>
                     {!timelineCollapsed && (
                       <>
                        <button className="flex items-center gap-2 hover:text-white transition-standard"><i className="ti ti-plus"></i> <span className="text-[10px] font-black tracking-widest uppercase">Track</span></button>
                        <div className="h-4 w-px bg-white/10" />
                        <button className="hover:text-[#7C5CFC] transition-standard"><i className="ti ti-scissors text-lg"></i></button>
                        <button className="hover:text-[#7C5CFC] transition-standard"><i className="ti ti-copy text-lg"></i></button>
                        <button className="hover:text-red-500 transition-standard"><i className="ti ti-trash text-lg"></i></button>
                       </>
                     )}
                  </div>
                  {!timelineCollapsed && (
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-3 text-zinc-500">
                          <i className="ti ti-zoom-out text-lg"></i>
                          <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden group">
                             <div className="w-1/2 h-full bg-[#7C5CFC] group-hover:bg-[#00D4FF] transition-standard" />
                          </div>
                          <i className="ti ti-zoom-in text-lg"></i>
                       </div>
                    </div>
                  )}
               </div>

               {!timelineCollapsed && (
                 <div className="flex-1 flex flex-col p-8 min-h-0 bg-black/20">
                    <Timeline playheadPos={playheadPos} setPlayheadPos={setPlayheadPos} />
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Help Button */}
      {!isFullscreen && (
        <button
          onClick={() => setShowHelp(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#1E1E24] border border-white/10 rounded-3xl flex items-center justify-center text-zinc-400 hover:text-white shadow-2xl transition-standard z-50 group hover:border-[#7C5CFC]/30 active:scale-95"
        >
           <i className="ti ti-help-circle text-3xl group-hover:text-[#7C5CFC]"></i>
        </button>
      )}
    </div>
  );
};

const ShortcutRow = ({ label, keybind }: any) => (
  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-standard">
    <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200">{label}</span>
    <span className="px-2 py-1 bg-[#7C5CFC]/10 text-[#7C5CFC] text-[9px] font-black rounded-lg border border-[#7C5CFC]/20">{keybind}</span>
  </div>
);

export default ClipMindApp;
