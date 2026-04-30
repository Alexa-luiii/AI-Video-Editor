"use strict";

import React from 'react';
import { Share2, Download, User, ChevronDown } from 'lucide-react';

interface TopBarProps {
  projectName: string;
  onExport: () => void;
  isProcessing: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ projectName, onExport, isProcessing }) => {
  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-zinc-950/80">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Project</span>
          <div className="w-px h-4 bg-zinc-700" />
          <h2 className="text-sm font-semibold text-white">{projectName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Auto-saved
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
            <Share2 size={20} />
          </button>

          <button
            onClick={onExport}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isProcessing ? 'Processing...' : 'Export'}
          </button>

          <div className="w-px h-6 bg-zinc-800 mx-2" />

          <button className="flex items-center gap-2 pl-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
              JD
            </div>
            <ChevronDown size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
