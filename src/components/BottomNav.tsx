import React from 'react';
import { sound } from '../utils/audio';

interface BottomNavProps {
  activeTab: 'home' | 'catalogue' | 'focus' | 'assistant' | 'rewards';
  onSelectTab: (tab: 'home' | 'catalogue' | 'focus' | 'assistant' | 'rewards') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Desk', icon: 'space_dashboard' },
    { id: 'catalogue' as const, label: 'Catalogue', icon: 'local_library' },
    { id: 'focus' as const, label: 'Focus Lock', icon: 'hourglass_top' },
    { id: 'assistant' as const, label: 'Syllabus AI', icon: 'school' },
    { id: 'rewards' as const, label: 'Commissary', icon: 'military_tech' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-t border-[#e5e4de] pb-safe md:hidden">
      <div className="h-16 flex items-center justify-around px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-[#161c27]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#eaf4f0] text-primary' : ''}`}>
                <span className={`material-symbols-outlined text-[21px] block leading-none ${isActive ? 'font-semibold' : ''}`}>
                  {tab.icon}
                </span>
              </div>
              <span className={`font-label-sm text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
