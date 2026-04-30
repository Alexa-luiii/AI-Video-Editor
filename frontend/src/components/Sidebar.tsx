"use strict";

import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Video,
  Settings,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: FolderKanban, label: 'Projects', active: false },
    { icon: Video, label: 'Editor', active: true },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Video className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Editor</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                item.active
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                item.active ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="font-medium">{item.label}</span>
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-900">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-200 group">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
