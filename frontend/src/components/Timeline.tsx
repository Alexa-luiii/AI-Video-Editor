"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Clip {
  id: string;
  start: number; // in percentage for now
  duration: number;
  label: string;
}

interface TrackProps {
  label: string;
  icon: string;
  color: string;
  height?: number;
  clips: Clip[];
  selectedClipId: string | null;
  onClipSelect: (id: string) => void;
  onClipMove: (clipId: string, newStart: number) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
}

const TimelineTrack: React.FC<TrackProps> = ({ label, icon, color, height = 36, clips, selectedClipId, onClipSelect, onClipMove, onContextMenu }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, clipId: string) => {
    e.dataTransfer.setData("clipId", clipId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const clipId = e.dataTransfer.getData("clipId");
    onClipMove(clipId, Math.max(0, Math.min(90, percentage)));
  };

  return (
    <div className="flex gap-4 group h-full items-center">
       <div className="w-24 shrink-0 flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest transition-standard group-hover:text-zinc-400">
          <i className={`ti ${icon} text-sm`}></i>
          {label}
       </div>
       <div
         ref={trackRef}
         onDragOver={(e) => e.preventDefault()}
         onDrop={handleDrop}
         className={`flex-1 rounded-xl border border-white/5 relative bg-black/40 overflow-hidden group-hover:bg-black/60 transition-standard`}
         style={{ height }}
       >
          {clips.map(clip => (
            <div
              key={clip.id}
              draggable
              onDragStart={(e) => handleDragStart(e, clip.id)}
              onClick={(e) => { e.stopPropagation(); onClipSelect(clip.id); }}
              onContextMenu={(e) => onContextMenu(e, clip.id)}
              className={`absolute h-full rounded-lg border opacity-80 cursor-grab active:cursor-grabbing hover:opacity-100 transition-standard flex items-center px-3 shadow-lg ${selectedClipId === clip.id ? "border-[#7C5CFC] ring-2 ring-[#7C5CFC]/20 opacity-100 z-10" : "border-white/10"}`}
              style={{
                backgroundColor: color,
                left: `${clip.start}%`,
                width: `${clip.duration}%`
              }}
            >
               <span className="text-[9px] font-black text-white truncate drop-shadow-md uppercase tracking-tight">{clip.label}</span>

               {/* Resizer handles */}
               <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/20" />
               <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/20" />
            </div>
          ))}
       </div>
    </div>
  );
};

const Timeline = ({ playheadPos, setPlayheadPos }: { playheadPos: number, setPlayheadPos: (pos: number) => void }) => {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, id: string } | null>(null);
  const [tracks, setTracks] = useState({
    video: [{ id: 'v1', start: 5, duration: 40, label: 'Main Scene' }, { id: 'v2', start: 50, duration: 30, label: 'B-Roll' }],
    audio: [{ id: 'a1', start: 5, duration: 75, label: 'Interview Audio' }],
    captions: [{ id: 'c1', start: 10, duration: 10, label: 'Hello world' }, { id: 'c2', start: 22, duration: 15, label: 'AI Editing is here' }],
    music: [{ id: 'm1', start: 0, duration: 95, label: 'Lo-Fi Chill Beats' }],
    overlays: [{ id: 'o1', start: 60, duration: 15, label: 'Subscribe Overlay' }],
    effects: [{ id: 'e1', start: 45, duration: 10, label: 'Glitch' }]
  });

  const handleClipMove = (trackName: keyof typeof tracks, clipId: string, newStart: number) => {
     setTracks(prev => ({
       ...prev,
       [trackName]: prev[trackName].map(c => c.id === clipId ? { ...c, start: newStart } : c)
     }));
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

  const handleDelete = (id: string) => {
    const newTracks = { ...tracks };
    Object.keys(newTracks).forEach(key => {
      const k = key as keyof typeof tracks;
      newTracks[k] = newTracks[k].filter(c => c.id !== id);
    });
    setTracks(newTracks);
    setContextMenu(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 112; // Adjusted for track label width
    if (x < 0) {
      setSelectedClipId(null);
      setContextMenu(null);
      return;
    }
    const percentage = (x / (rect.width - 112)) * 100;
    setPlayheadPos(Math.max(0, Math.min(100, percentage)));
    setSelectedClipId(null);
    setContextMenu(null);
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col relative" onClick={handleTimelineClick}>
       {/* Context Menu */}
       {contextMenu && (
         <div
           className="fixed z-[1000] bg-[#1E1E24] border border-white/10 p-2 rounded-xl shadow-2xl space-y-1 min-w-[140px] animate-in zoom-in duration-200"
           style={{ left: contextMenu.x, top: contextMenu.y }}
           onClick={e => e.stopPropagation()}
         >
            <button className="w-full text-left px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between transition-standard">
               <span>SPLIT</span>
               <i className="ti ti-cut"></i>
            </button>
            <button className="w-full text-left px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between transition-standard">
               <span>DUPLICATE</span>
               <i className="ti ti-copy"></i>
            </button>
            <div className="h-px bg-white/5 mx-2 my-1" />
            <button
              onClick={() => handleDelete(contextMenu.id)}
              className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg flex items-center justify-between transition-standard"
            >
               <span>DELETE</span>
               <i className="ti ti-trash"></i>
            </button>
         </div>
       )}

       {/* Ruler */}
       <div className="h-6 flex border-b border-white/5 mb-4 ml-28 shrink-0">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="flex-1 border-l border-white/10 relative">
               <span className="absolute top-0 left-1 text-[8px] font-mono text-zinc-700">{i * 10}s</span>
            </div>
          ))}
       </div>

       <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <TimelineTrack
            label="Captions" icon="ti-subtitles" color="#00D4FF"
            clips={tracks.captions} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('captions', id, pos)}
            onContextMenu={handleContextMenu}
          />
          <TimelineTrack
            label="Text" icon="ti-text-size" color="#7C5CFC"
            clips={tracks.overlays} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('overlays', id, pos)}
            onContextMenu={handleContextMenu}
          />
          <TimelineTrack
            label="Video" icon="ti-video" color="#3B82F6" height={64}
            clips={tracks.video} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('video', id, pos)}
            onContextMenu={handleContextMenu}
          />
          <TimelineTrack
            label="Audio" icon="ti-microphone" color="#10B981"
            clips={tracks.audio} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('audio', id, pos)}
            onContextMenu={handleContextMenu}
          />
          <TimelineTrack
            label="Music" icon="ti-headphones" color="#F59E0B"
            clips={tracks.music} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('music', id, pos)}
            onContextMenu={handleContextMenu}
          />
          <TimelineTrack
            label="Effects" icon="ti-wand" color="#EF4444"
            clips={tracks.effects} selectedClipId={selectedClipId}
            onClipSelect={setSelectedClipId}
            onClipMove={(id, pos) => handleClipMove('effects', id, pos)}
            onContextMenu={handleContextMenu}
          />
       </div>

       {/* Playhead */}
       <div
         className="absolute top-0 bottom-0 w-px bg-red-500 shadow-glow-purple z-[50] pointer-events-none transition-standard"
         style={{ left: `calc(112px + ${playheadPos}%)` }}
       >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
       </div>
    </div>
  );
};

export default Timeline;
