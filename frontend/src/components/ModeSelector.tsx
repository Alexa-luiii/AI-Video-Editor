"use strict";

import React from 'react';
import { Cpu, Users, Hand } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModeSelectorProps {
  mode: 'auto' | 'assist' | 'manual';
  setMode: (mode: 'auto' | 'assist' | 'manual') => void;
  disabled: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode, disabled }) => {
  const modes = [
    { id: 'auto', label: 'Auto Mode', icon: Cpu, desc: 'Full AI editing' },
    { id: 'assist', label: 'Assist Mode', icon: Users, desc: 'AI suggests, you decide' },
    { id: 'manual', label: 'Manual Mode', icon: Hand, desc: 'Minimal automation' },
  ] as const;

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Select Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center p-4 rounded-lg border-2 transition-all text-center",
                isActive
                  ? "bg-blue-500/10 border-blue-500 text-blue-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon size={24} className={cn("mb-2", isActive ? "text-blue-500" : "text-zinc-500")} />
              <span className="font-semibold block mb-1">{m.label}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-60">{m.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
