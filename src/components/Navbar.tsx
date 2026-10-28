import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface NavbarProps {
  creditPoints: number;
  streakDays: number;
  onOpenUpload: () => void;
  isAmbientPlaying: boolean;
  setIsAmbientPlaying: (val: boolean) => void;
  onSignOut?: () => Promise<void>;
  activeTab: 'home' | 'catalogue' | 'focus' | 'assistant' | 'rewards';
  setActiveTab: (tab: 'home' | 'catalogue' | 'focus' | 'assistant' | 'rewards') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  creditPoints,
  streakDays,
  onOpenUpload,
  isAmbientPlaying,
  setIsAmbientPlaying,
  onSignOut,
  activeTab,
  setActiveTab
}) => {
  const [signOutError, setSignOutError] = useState('');

  const toggleSound = () => {
    const isPlaying = sound.toggleAmbientSound();
    setIsAmbientPlaying(isPlaying);
    sound.playClick();
  };

  const handleSignOut = async () => {
    if (!onSignOut) return;
    setSignOutError('');
    try {
      await onSignOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Could not sign out. Please try again.');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#e5e4de]">
      <div className="h-16 px-4 max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Faculty Mentor Emblem & Brand */}
        <button 
          onClick={() => { sound.playClick(); setActiveTab('home'); }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
        >
          <div className="w-8 h-8 rounded-md bg-[#07372a] text-[#beedd9] flex items-center justify-center border border-[#d2e8dd] shadow-xs">
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase text-primary font-semibold">
              Faculty Mentor
            </span>
            <span className="text-[17px] text-[#161c27] tracking-tight font-serif leading-tight">
              Study Companion
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f5f4ef] p-1 rounded-xl border border-[#e6e5dd]">
          <button
            onClick={() => { sound.playClick(); setActiveTab('home'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">space_dashboard</span>
            <span>Reading Desk</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('catalogue'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalogue'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">local_library</span>
            <span>Study Catalogue</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('focus'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'focus'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">hourglass_top</span>
            <span>Focus Suite</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('assistant'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'assistant'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">school</span>
            <span>Socratic Tutor</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('rewards'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rewards'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">military_tech</span>
            <span>Rewards</span>
          </button>
        </nav>

        {/* Right Stats: Streak, CP Coins, Sound, and Ingest CTA */}
        <div className="flex items-center gap-2">
          
          {/* 5D Streak */}
          <div 
            title={`${streakDays}-Day Focus Streak`}
            className="flex items-center gap-1 bg-white border border-[#e5e4de] px-2.5 py-1 rounded-full text-secondary shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] leading-none text-secondary">
              local_fire_department
            </span>
            <span className="text-[11px] font-bold text-secondary">{streakDays}D Streak</span>
          </div>

          {/* Credit Points */}
          <button
            onClick={() => { sound.playClick(); setActiveTab('rewards'); }}
            title="Credit Points Balance"
            className="flex items-center gap-1 bg-white border border-[#e5e4de] px-2.5 py-1 rounded-full text-primary shadow-xs hover:bg-[#f5f4ef] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] leading-none text-primary">
              auto_stories
            </span>
            <span className="text-[11px] font-bold text-primary">{creditPoints} CP</span>
          </button>

          {/* 40Hz Alpha Tone Soundscape */}
          <button
            onClick={toggleSound}
            title={isAmbientPlaying ? 'Mute 40Hz Alpha Focus Tone' : 'Play 40Hz Alpha Focus Tone'}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all ${
              isAmbientPlaying 
                ? 'bg-[#beedd9] border-[#a3d0be] text-primary' 
                : 'bg-white border-[#e5e4de] text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAmbientPlaying ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {onSignOut && (
            <>
              <button
                aria-label="Sign out"
                onClick={() => { sound.playClick(); void handleSignOut(); }}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e4de] bg-white text-on-surface-variant text-xs transition-colors hover:bg-[#f5f4ef] hover:text-primary"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
              {signOutError && (
                <span className="max-w-28 text-[10px] text-red-700" role="alert">
                  {signOutError}
                </span>
              )}
            </>
          )}

          {/* Ingest Notes Quick Action */}
          <button
            onClick={() => { sound.playClick(); onOpenUpload(); }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#1a4b3b] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
            <span>Ingest</span>
          </button>
        </div>
      </div>
    </header>
  );
};
