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
  onClipMove: (clipId: string, newStart: number) => void;
  onClipResize: (clipId: string, newDuration: number) => void;
}

const TimelineTrack: React.FC<TrackProps> = ({ label, icon, color, height = 36, clips, onClipMove, onClipResize }) => {
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
              className="absolute h-full rounded-lg border border-white/10 opacity-70 cursor-grab active:cursor-grabbing hover:opacity-100 transition-standard flex items-center px-3 shadow-lg"
              style={{
                backgroundColor: color,
                left: `${clip.start}%`,
                width: `${clip.duration}%`
              }}
            >
               <span className="text-[9px] font-black text-white truncate drop-shadow-md">{clip.label}</span>

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

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 112; // Adjusted for track label width
    if (x < 0) return;
    const percentage = (x / (rect.width - 112)) * 100;
    setPlayheadPos(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col relative" onClick={handleTimelineClick}>
       {/* Ruler */}
       <div className="h-6 flex border-b border-white/5 mb-4 ml-28">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="flex-1 border-l border-white/10 relative">
               <span className="absolute top-0 left-1 text-[8px] font-mono text-zinc-600">{i * 10}s</span>
            </div>
          ))}
       </div>

       <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
          <TimelineTrack
            label="Captions" icon="ti-subtitles" color="#00D4FF"
            clips={tracks.captions} onClipMove={(id, pos) => handleClipMove('captions', id, pos)}
            onClipResize={() => {}}
          />
          <TimelineTrack
            label="Text" icon="ti-text-size" color="#7C5CFC"
            clips={tracks.overlays} onClipMove={(id, pos) => handleClipMove('overlays', id, pos)}
            onClipResize={() => {}}
          />
          <TimelineTrack
            label="Video" icon="ti-video" color="#3B82F6" height={64}
            clips={tracks.video} onClipMove={(id, pos) => handleClipMove('video', id, pos)}
            onClipResize={() => {}}
          />
          <TimelineTrack
            label="Audio" icon="ti-microphone" color="#10B981"
            clips={tracks.audio} onClipMove={(id, pos) => handleClipMove('audio', id, pos)}
            onClipResize={() => {}}
          />
          <TimelineTrack
            label="Music" icon="ti-headphones" color="#F59E0B"
            clips={tracks.music} onClipMove={(id, pos) => handleClipMove('music', id, pos)}
            onClipResize={() => {}}
          />
          <TimelineTrack
            label="Effects" icon="ti-wand" color="#EF4444"
            clips={tracks.effects} onClipMove={(id, pos) => handleClipMove('effects', id, pos)}
            onClipResize={() => {}}
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
