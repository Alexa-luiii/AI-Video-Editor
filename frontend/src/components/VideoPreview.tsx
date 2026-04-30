"use strict";

import React from 'react';
import { Play, Pause, RotateCcw, Volume2, Maximize, Sparkles } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, isLoading }) => {
  return (
    <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
      {/* Player Frame */}
      <div className="flex-1 bg-black rounded-3xl overflow-hidden relative border border-zinc-800 shadow-2xl group">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Sparkles size={32} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
            </div>
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-white font-bold text-lg tracking-tight">AI is crafting your video</h3>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] animate-pulse">Analyzing visuals & speech</p>
            </div>
          </div>
        ) : videoUrl ? (
          <>
            <video
              src={videoUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
            />
            {/* Live Captions Mock Overlay */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
               <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-2xl">
                  <p className="text-white font-black text-lg uppercase tracking-tight italic drop-shadow-lg">
                    <span className="text-yellow-400">AI</span> GENERATED CAPTION
                  </p>
               </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-800 border border-zinc-800">
               <Play size={48} fill="currentColor" />
            </div>
            <h3 className="text-zinc-400 font-bold text-lg mb-2">No Video Selected</h3>
            <p className="text-zinc-600 text-sm max-w-xs leading-relaxed">
              Upload a project to start editing with the power of Next-Gen AI.
            </p>
          </div>
        )}

        {/* Player Controls Overlay */}
        {videoUrl && !isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="flex items-center gap-6">
               <button className="text-white hover:text-blue-400 transition-colors">
                  <Play size={20} fill="currentColor" />
               </button>
               <div className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden cursor-pointer group/progress">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               </div>
               <div className="flex items-center gap-4">
                  <button className="text-white hover:text-blue-400 transition-colors"><Volume2 size={18} /></button>
                  <button className="text-white hover:text-blue-400 transition-colors"><Maximize size={18} /></button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Playback Settings */}
      {videoUrl && !isLoading && (
        <div className="mt-6 flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                 <RotateCcw size={12} />
                 Loop Playback
              </button>
              <div className="w-px h-3 bg-zinc-800" />
              <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                 Resolution: 1080p
              </button>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Preview Live</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
