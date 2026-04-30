"use strict";

import React, { useState } from 'react';
import { Settings, Scissors, Type, Mic, Music, Palette, Zap, Layout, Info, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FeatureValue = 'apply' | 'skip' | 'no-idea';

interface FeatureGroup {
  name: string;
  icon: any;
  features: string[];
}

const FEATURE_GROUPS: FeatureGroup[] = [
  { name: 'Basic Editing', icon: Scissors, features: ['Trim / Split', 'Crop', 'Merge clips', 'Delete section'] },
  { name: 'Text & Captions', icon: Type, features: ['Auto captions', 'Auto text (Visuals)', 'Manual text', 'Font styles', 'Text colors', 'Text position'] },
  { name: 'Voice', icon: Mic, features: ['AI Voice Male', 'AI Voice Female', 'Upload user voice', 'Voice sync', 'Voice volume control'] },
  { name: 'Audio', icon: Music, features: ['Background music', 'Volume control', 'Fade in/out'] },
  { name: 'Visual', icon: Palette, features: ['Filters', 'Color grading', 'Brightness / contrast'] },
  { name: 'Effects', icon: Zap, features: ['Zoom in/out', 'Transitions', 'Animations', 'Speed control'] },
  { name: 'Format', icon: Layout, features: ['9:16 (TikTok)', '16:9 (YouTube)', '1:1 (Instagram)'] },
];

interface FeatureControlPanelProps {
  controls: Record<string, FeatureValue>;
  setControl: (feature: string, value: FeatureValue) => void;
  disabled: boolean;
}

const FeatureControlPanel: React.FC<FeatureControlPanelProps> = ({ controls, setControl, disabled }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSetControl = (feature: string, value: FeatureValue) => {
    if (value === 'no-idea') {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
    setControl(feature, value);
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 relative">
      <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Settings size={14} className="text-orange-500" />
        Feature Controls
      </h2>

      {/* AI Decision Popup */}
      {showPopup && (
        <div className="absolute top-4 right-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Info size={20} />
          <p className="text-xs font-bold">AI will choose best settings based on video</p>
        </div>
      )}

      <div className="space-y-8">
        {FEATURE_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.name} className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-800/50 pb-2">
                <Icon size={12} />
                {group.name}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {group.features.map((feature) => (
                  <div key={feature} className="flex items-center justify-between group">
                    <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors">{feature}</p>
                    <div className="flex bg-zinc-800/50 p-0.5 rounded-lg border border-zinc-700/30">
                      {(['apply', 'skip', 'no-idea'] as FeatureValue[]).map((val) => (
                        <button
                          key={val}
                          onClick={() => handleSetControl(feature, val)}
                          disabled={disabled}
                          className={cn(
                            "text-[9px] py-1 px-2 rounded-md font-bold uppercase tracking-tighter transition-all",
                            controls[feature] === val
                              ? val === 'apply' ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                                : val === 'skip' ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                : "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                              : "text-zinc-600 hover:text-zinc-400"
                          )}
                        >
                          {val === 'no-idea' ? 'Auto' : val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureControlPanel;
