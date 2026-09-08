import React from 'react';
import { NavTab } from '../types.ts';
import { LayoutDashboard, GanttChart, ListTodo, FolderGit2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline' as NavTab, label: 'Timeline', icon: GanttChart },
    { id: 'activities' as NavTab, label: 'Activities', icon: ListTodo },
    { id: 'media-docs' as NavTab, label: 'Media/Docs', icon: FolderGit2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#c4c6ce]/30 shadow-[0_-2px_12px_rgba(15,39,68,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-lg transition-all focus:outline-none ${
                isActive ? 'text-[#216293] font-semibold scale-105' : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[11px] leading-tight tracking-tight mt-1 font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
