"use client";

import React, { useState } from 'react';

const VoicePanel = () => {
  const [voiceType, setVoiceType] = useState<'male' | 'female'>('male');
  const [speakBasedOn, setSpeakBasedOn] = useState<'visuals' | 'captions' | 'script'>('captions');
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-left duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
           <i className="ti ti-microphone text-[#7C5CFC]"></i>
           ADD VOICE
        </h3>
        <p className="text-xs text-zinc-500">Generate high-quality AI narration for your video.</p>
      </div>

      <div className="space-y-6">
        {/* AI Generated Voice Selection */}
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Select Voice</p>
          <div className="grid grid-cols-2 gap-4">
            <VoiceCard
              active={voiceType === 'male'}
              onClick={() => setVoiceType('male')}
              icon="ti-user"
              name="Alex"
              gender="Male"
            />
            <VoiceCard
              active={voiceType === 'female'}
              onClick={() => setVoiceType('female')}
              icon="ti-user-circle"
              name="Aria"
              gender="Female"
            />
          </div>
        </div>

        {/* Speak Based On Toggle */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Speak Based On</p>
          <div className="bg-[#1E1E24] p-1 rounded-xl flex border border-white/5">
            {['visuals', 'captions', 'script'].map(type => (
              <button
                key={type}
                onClick={() => setSpeakBasedOn(type as any)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-standard ${speakBasedOn === type ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {type}
              </button>
            ))}
          </div>

          {speakBasedOn === 'script' && (
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Type your script here..."
              className="w-full h-32 bg-[#1E1E24] border border-white/5 rounded-xl p-4 text-xs text-white placeholder-zinc-600 focus:border-[#7C5CFC]/50 outline-none transition-standard resize-none"
            />
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={() => setIsGenerating(true)}
          className="w-full py-4 bg-[#7C5CFC] hover:bg-[#6a4ae8] rounded-2xl font-black text-xs tracking-widest uppercase shadow-glow-purple transition-standard flex items-center justify-center gap-3"
        >
          {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Generate Voice"}
        </button>

        <div className="pt-6 border-t border-white/5 space-y-4">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Upload Recording</p>
           <label className="w-full h-24 border-2 border-dashed border-white/10 hover:border-[#7C5CFC]/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-standard group">
              <i className="ti ti-cloud-upload text-2xl text-zinc-600 group-hover:text-[#7C5CFC] mb-2"></i>
              <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">Upload MP3 / WAV</span>
              <input type="file" className="hidden" accept="audio/*" />
           </label>
        </div>

        <button className="w-full py-4 bg-zinc-800/50 text-zinc-600 rounded-2xl font-black text-xs tracking-widest uppercase cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group">
           <i className="ti ti-microphone-2"></i>
           Record Live
           <span className="absolute top-1 right-2 bg-[#7C5CFC] text-white text-[8px] px-2 py-0.5 rounded-full font-black">SOON</span>
        </button>
      </div>
    </div>
  );
};

const VoiceCard = ({ active, onClick, icon, name, gender }: any) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-standard flex flex-col items-center gap-2 group ${active ? "bg-[#7C5CFC]/10 border-[#7C5CFC] text-[#7C5CFC]" : "bg-[#1E1E24] border-white/5 text-zinc-500 hover:border-white/10"}`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-standard ${active ? "bg-[#7C5CFC] text-white shadow-glow-purple" : "bg-zinc-950"}`}>
       <i className={`ti ${icon} text-xl`}></i>
    </div>
    <div className="text-center">
       <p className={`text-xs font-black uppercase tracking-widest ${active ? "text-white" : "text-zinc-400"}`}>{name}</p>
       <p className="text-[10px] font-medium opacity-60">{gender}</p>
    </div>
    <div className="mt-1 px-3 py-1 bg-zinc-950 rounded-full text-[8px] font-black text-zinc-400 group-hover:text-white transition-standard uppercase tracking-tighter">
       Preview
    </div>
  </button>
);

export default VoicePanel;
