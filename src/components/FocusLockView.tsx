import React, { useState, useEffect, useCallback } from 'react';
import type { CatalogueItem, FocusSessionLog } from '../types';
import { sound } from '../utils/audio';

interface FocusLockViewProps {
  catalogueItems: CatalogueItem[];
  selectedItem: CatalogueItem | null;
  onSessionComplete: (log: FocusSessionLog) => void;
  onLaunchMockTest: (item: CatalogueItem) => void;
  isFocusLocked: boolean;
  setIsFocusLocked: (locked: boolean) => void;
  isAmbientPlaying: boolean;
  setIsAmbientPlaying: (playing: boolean) => void;
}

export const FocusLockView: React.FC<FocusLockViewProps> = ({
  catalogueItems,
  selectedItem,
  onSessionComplete,
  onLaunchMockTest,
  isFocusLocked,
  setIsFocusLocked,
  isAmbientPlaying,
  setIsAmbientPlaying
}) => {
  // Navigation tabs in Focus suite
  const [activeFocusTab, setActiveFocusTab] = useState<'timer' | 'shield' | 'controls'>('timer');
  
  // Subject & Timing State
  const [subjectId, setSubjectId] = useState<string>(() => selectedItem?.id ?? catalogueItems[0]?.id ?? '');
  const targetSubject = catalogueItems.find(item => item.id === subjectId) ?? selectedItem ?? catalogueItems[0];
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [originalTotalSeconds, setOriginalTotalSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Call Shield & Simulation State
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(false);
  const [simulatedCaller, setSimulatedCaller] = useState<string>('Prof. Eleanor Vance (Thesis Advisor)');
  const [callDurationSecs, setCallDurationSecs] = useState<number>(0);
  const [callCount, setCallCount] = useState<number>(0);
  const [callInterruptionSecs, setCallInterruptionSecs] = useState<number>(0);
  const [callLedger, setCallLedger] = useState<Array<{ id: string; title: string; subtitle: string; credited: string; isAuto: boolean }>>([
    {
      id: 'c-1',
      title: "Dean's Registrar Desk",
      subtitle: '10:14 AM · Course approval clearance',
      credited: '+4m Credited',
      isAuto: true
    },
    {
      id: 'c-2',
      title: 'Unknown Toll Number',
      subtitle: '09:05 AM · Auto-screened by Silent Guard',
      credited: 'Silenced',
      isAuto: false
    },
    {
      id: 'c-3',
      title: 'Lab Partner (Julian M.)',
      subtitle: 'Yesterday · Bench server restart',
      credited: '+8m Credited',
      isAuto: true
    }
  ]);

  // App Controls Permissions Toggles
  const [controlsState, setControlsState] = useState({
    strictMode: true,
    whitelistPass: true,
    hapticOnly: false,
    autoDispatch: true
  });

  const handleCompleteSession = useCallback(() => {
    if (!targetSubject) {
      return;
    }
    sound.playVictory();
    setIsActive(false);
    setIsFocusLocked(false);
    setSessionCompleted(true);

    const log: FocusSessionLog = {
      id: `focus-${Date.now()}`,
      catalogueId: targetSubject.id,
      subjectTitle: targetSubject.title,
      plannedMinutes: durationMinutes,
      actualFocusMinutes: durationMinutes,
      interruptionMinutes: Math.round(callInterruptionSecs / 60),
      callCount,
      callExtensionMinutes: Math.round(callInterruptionSecs / 60),
      completedAt: 'Just now',
      pointsEarned: 50
    };

    onSessionComplete(log);
  }, [targetSubject, durationMinutes, callInterruptionSecs, callCount, onSessionComplete, setIsFocusLocked]);

  // Main Timer Countdown
  useEffect(() => {
    let timer: number | null = null;
    if (isActive && !isSimulationActive) {
      let remaining = secondsRemaining;
      timer = window.setInterval(() => {
        remaining = Math.max(0, remaining - 1);
        setSecondsRemaining(remaining);
        if (remaining === 0) handleCompleteSession();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isSimulationActive, secondsRemaining, handleCompleteSession]);

  // Call duration counter
  useEffect(() => {
    let interval: number | null = null;
    if (isSimulationActive) {
      interval = window.setInterval(() => {
        setCallDurationSecs(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulationActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    sound.playClick();
    if (!isActive) {
      setIsActive(true);
      setIsFocusLocked(true);
      setSessionCompleted(false);
    } else {
      setIsActive(false);
    }
  };

  const handleResetTimer = () => {
    sound.playClick();
    setIsActive(false);
    setIsFocusLocked(false);
    setSecondsRemaining(durationMinutes * 60);
    setOriginalTotalSeconds(durationMinutes * 60);
    setIsSimulationActive(false);
    sound.stopPhoneRing();
  };

  const handleSetPreset = (mins: number) => {
    sound.playClick();
    setDurationMinutes(mins);
    const secs = mins * 60;
    setSecondsRemaining(secs);
    setOriginalTotalSeconds(secs);
    setIsActive(false);
    setIsFocusLocked(false);
  };

  // Trigger Incoming Call Simulation
  const handleSimulateCall = (callerName = 'Prof. Eleanor Vance (Thesis Advisor)') => {
    sound.playClick();
    setSimulatedCaller(callerName);
    setIsSimulationActive(true);
    setCallDurationSecs(0);
    sound.startPhoneRing();
  };

  // Dismiss / End Call and auto-reconcile timer
  const handleDismissCallAndCredit = () => {
    sound.stopPhoneRing();
    sound.playReward();
    setIsSimulationActive(false);

    const creditedSeconds = Math.max(90, callDurationSecs > 0 ? callDurationSecs : 120);
    const addedMinutes = Math.round(creditedSeconds / 60);

    // Add call duration back onto the focus timer
    setSecondsRemaining(prev => prev + creditedSeconds);
    setCallInterruptionSecs(prev => prev + creditedSeconds);
    setCallCount(prev => prev + 1);

    // Add to Archival Ledger
    const newEntry = {
      id: `call-${Date.now()}`,
      title: simulatedCaller,
      subtitle: `Just now • Urgent consultation`,
      credited: `+${addedMinutes}m Credited`,
      isAuto: true
    };
    setCallLedger(prev => [newEntry, ...prev]);

    setActiveFocusTab('timer');
  };

  // Ring progress
  const progressRatio = Math.max(0, Math.min(1, (originalTotalSeconds - secondsRemaining) / originalTotalSeconds));
  const dashOffset = 640.88 * progressRatio;

  if (!targetSubject) {
    return null;
  }

  return (
    <div className="flex flex-col w-full pb-16 space-y-5 max-w-4xl mx-auto">
      
      {/* Archival Context / Breadcrumb Sub-bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px] font-semibold tracking-wider uppercase font-mono">
          <span className="material-symbols-outlined text-[15px] text-primary">menu_book</span>
          <span>Bodleian Study Suite · Desk 14</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8eeff] text-primary text-[11px] font-semibold">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span>{isFocusLocked ? 'Deep Session Locked' : 'Ready for Ingestion'}</span>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <nav aria-label="Focus Module Tabs" className="flex p-1 bg-surface-container rounded-lg shadow-xs">
        <button
          onClick={() => { sound.playClick(); setActiveFocusTab('timer'); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] transition-all duration-200 ${
            activeFocusTab === 'timer'
              ? 'bg-white text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">hourglass_empty</span>
          <span>Timer</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveFocusTab('shield'); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] transition-all duration-200 ${
            activeFocusTab === 'shield'
              ? 'bg-white text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">shield_with_heart</span>
          <span>Call Shield</span>
          {callCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          )}
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveFocusTab('controls'); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] transition-all duration-200 ${
            activeFocusTab === 'controls'
              ? 'bg-white text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">tune</span>
          <span>App Controls</span>
        </button>
      </nav>

      {/* ================= TAB 1: TIMER ================= */}
      {activeFocusTab === 'timer' && (
        <section className="flex flex-col space-y-5">
          
          {/* Active Reading Colloquium Card */}
          <div className="bg-white border border-[#e5e4de] p-4 rounded-xl shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#e8eeff] flex items-center justify-center text-primary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">history_edu</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-secondary font-bold font-mono">
                  Current Colloquium
                </span>
                <h2 className="text-[16px] font-serif font-bold text-on-surface leading-snug truncate">
                  {targetSubject.code}: {targetSubject.title}
                </h2>
                <span className="text-[12px] text-on-surface-variant mt-0.5 truncate">
                  {targetSubject.domain} • Focus Duration: {durationMinutes} mins
                </span>
              </div>
            </div>

            <select
              value={targetSubject?.id ?? ''}
              onChange={(e) => {
                const found = catalogueItems.find(c => c.id === e.target.value);
                if (found) setSubjectId(found.id);
              }}
              className="rounded-lg bg-[#f5f4ef] border border-[#e5e4de] text-[12px] font-semibold text-on-surface p-1.5 focus:outline-none shrink-0"
            >
              {catalogueItems.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          {/* Timer Ring & Display */}
          <div className="relative bg-white border border-[#e5e4de] rounded-xl p-6 shadow-xs flex flex-col items-center justify-center overflow-hidden">
            
            {/* Watermark Seal Background */}
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none select-none text-primary">
              <span className="material-symbols-outlined text-[220px]">architecture</span>
            </div>

            {/* Scholastic Ring SVG */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                {/* Background track */}
                <circle className="text-[#f1f3ff]" cx="120" cy="120" fill="none" r="102" stroke="currentColor" strokeWidth="6"></circle>
                {/* Subtle tick ring */}
                <circle className="text-[#dde2f3]" cx="120" cy="120" fill="none" r="92" stroke="currentColor" strokeDasharray="2,6" strokeWidth="1"></circle>
                {/* Animated Progress Bar */}
                <circle 
                  className="text-primary transition-all duration-700 ease-out" 
                  cx="120" 
                  cy="120" 
                  fill="none" 
                  r="102" 
                  stroke="currentColor" 
                  strokeDasharray="640.88" 
                  strokeDashoffset={dashOffset} 
                  strokeLinecap="round" 
                  strokeWidth="6"
                ></circle>
              </svg>

              {/* Center Counter Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] tracking-widest uppercase text-on-surface-variant mb-1 font-mono">
                  {isActive ? 'In Deep Flow' : 'Time Remaining'}
                </span>
                <span className="text-[44px] text-on-surface font-serif font-bold tracking-tight">
                  {formatTime(secondsRemaining)}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-secondary font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  <span>+50 Credit Points upon completion</span>
                </div>
              </div>
            </div>

            {/* Ambient Sound & Preset Selector */}
            <div className="w-full mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Standard Durations
                </span>
                <button
                  onClick={() => {
                    const isPlaying = sound.toggleAmbientSound();
                    setIsAmbientPlaying(isPlaying);
                  }}
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md transition-colors border ${
                    isAmbientPlaying
                      ? 'bg-[#eaf4f0] text-primary border-[#cbe5d8] font-bold'
                      : 'bg-[#f5f4ef] text-on-surface-variant border-[#e6e5dd] hover:text-[#161c27]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isAmbientPlaying ? 'graphic_eq' : 'volume_up'}
                  </span>
                  <span>{isAmbientPlaying ? '40Hz Alpha Waves (Active)' : 'Alpha Waves (Off)'}</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[25, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleSetPreset(mins)}
                    className={`py-2 px-3 rounded-lg text-[13px] transition-colors flex items-center justify-center gap-1 font-semibold ${
                      durationMinutes === mins
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-[#f5f4ef] text-on-surface hover:bg-[#e8eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>{mins}m</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Control Actions */}
            <div className="flex items-center justify-center gap-3 w-full mt-5 pt-4 border-t border-[#f0eee6]">
              <button
                onClick={handleToggleTimer}
                className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[14px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isActive ? 'pause' : 'play_arrow'}
                </span>
                <span>{isActive ? 'Pause Focus' : 'Begin Focus Session'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="px-4 py-3 rounded-lg bg-[#f5f4ef] hover:bg-[#ffdad6] text-on-surface-variant text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">stop_circle</span>
                <span>End Session</span>
              </button>
            </div>
          </div>

          {/* Archival Discipline Note */}
          <div className="bg-[#f5f4ef] border border-[#e6e5dd] p-3.5 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">lightbulb</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Archival Discipline Note
              </span>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                "The faculty preserves uninterrupted deep thought. Sudden phone calls will be logged and credited gracefully in the Call Shield."
              </p>
            </div>
          </div>

          {/* Completed State Modal / Banner */}
          {sessionCompleted && (
            <div className="bg-[#beedd9] border border-[#a3d0be] p-5 rounded-xl shadow-md text-center space-y-3 animate-glow">
              <span className="material-symbols-outlined text-primary text-[36px]">workspace_premium</span>
              <h3 className="text-[18px] font-serif font-bold text-[#07372a]">
                Focus Session Completed!
              </h3>
              <p className="text-[13px] text-[#234e40]">
                Logged {durationMinutes} minutes on {targetSubject.code}. Earned +50 Credit Points.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onLaunchMockTest(targetSubject)}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-[13px] font-bold shadow-xs hover:bg-primary-container transition-colors"
                >
                  Take Practice Quiz
                </button>
                <button
                  onClick={() => setSessionCompleted(false)}
                  className="px-4 py-2 bg-white text-primary rounded-lg text-[13px] font-semibold shadow-xs hover:bg-[#f5f4ef] transition-colors"
                >
                  Start New Session
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= TAB 2: CALL SHIELD ================= */}
      {activeFocusTab === 'shield' && (
        <section className="flex flex-col space-y-4">
          
          {/* Call Auto-Credit Feature Banner */}
          <div className="bg-white border border-[#e5e4de] p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center border border-[#ffd5c4]">
                <span className="material-symbols-outlined text-[22px]">phone_paused</span>
              </div>
              <div>
                <h3 className="text-[18px] font-serif font-bold text-on-surface">Auto-Credit Call Handling</h3>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Zero Guilt Interruptions
                </span>
              </div>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Emergencies happen. When a verified faculty member or direct contact reaches your line, the system pauses your clock and dynamically logs minutes spent, replenishing your study timer upon completion.
            </p>

            {/* Simulated Call Tester Trigger */}
            <div className="pt-2">
              <button
                onClick={() => handleSimulateCall('Prof. Eleanor Vance (Thesis Advisor)')}
                className="w-full py-2.5 px-4 rounded-lg bg-secondary text-on-secondary font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">ring_volume</span>
                <span>Simulate Incoming Urgent Call</span>
              </button>
            </div>
          </div>

          {/* Active Call Shield Event Banner (When call is active/simulated) */}
          {isSimulationActive && (
            <div className="bg-secondary-container text-on-secondary-container p-4 rounded-xl shadow-md space-y-2.5 animate-phone-ring border border-[#ffd5c4]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-secondary-container text-[22px]">
                    phone_in_talk
                  </span>
                  <span className="text-[13px] font-bold uppercase tracking-wider">
                    Active Call Shield Event
                  </span>
                </div>
                <span className="text-[12px] bg-white/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {formatTime(callDurationSecs)}
                </span>
              </div>
              <p className="text-[13px] text-on-secondary-container">
                Incoming: <strong>{simulatedCaller}</strong>. Study timer is temporarily paused. Your study streak is safeguarded.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleDismissCallAndCredit}
                  className="flex-1 py-2 px-3 rounded-lg bg-white text-on-surface text-[12px] font-bold shadow-xs hover:bg-[#f5f4ef] transition-colors"
                >
                  Resume Desk Session & Credit Time
                </button>
              </div>
            </div>
          )}

          {/* Archival Call Ledger */}
          <div className="bg-white border border-[#e5e4de] p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Archival Call Ledger
              </span>
              <span className="text-[11px] text-primary font-medium">
                {callLedger.length} Recorded Today
              </span>
            </div>

            <div className="space-y-2">
              {callLedger.map(record => (
                <div key={record.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f5f4ef] border border-[#e8e7df]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {record.isAuto ? 'call_received' : 'call_missed'}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-on-surface">{record.title}</span>
                      <span className="text-[11px] text-on-surface-variant">{record.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[12px] font-bold ${record.isAuto ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {record.credited}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {record.isAuto ? 'Auto-reconciled' : 'No impact'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* ================= TAB 3: APP CONTROLS ================= */}
      {activeFocusTab === 'controls' && (
        <section className="flex flex-col space-y-4">
          
          {/* Quiet Study Status Overview */}
          <div className="bg-white border border-[#e5e4de] p-5 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">do_not_disturb_on</span>
                <h3 className="text-[18px] font-serif font-bold text-on-surface">Quiet Study Firewall</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#beedd9] text-primary text-[11px] font-bold uppercase tracking-wider">
                Enforced
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Curate your intellectual perimeter. Restrict notification pings, throttle non-academic messaging, and channel high-priority faculty dispatches only.
            </p>
          </div>

          {/* Toggle Controls List */}
          <div className="bg-white border border-[#e5e4de] p-4 rounded-xl shadow-xs space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Distraction Shield Permissions
            </span>

            {/* Control 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f5f4ef] border border-[#e8e7df]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">notifications_paused</span>
                <div>
                  <span className="text-[13px] text-on-surface block font-semibold">Strict Monograph Mode</span>
                  <span className="text-[11px] text-on-surface-variant">Suppress all push badges, social media notifications, and banners</span>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setControlsState(s => ({ ...s, strictMode: !s.strictMode })); }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  controlsState.strictMode ? 'bg-primary' : 'bg-[#c0c8c3]'
                }`}
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow-xs transform transition-transform ${
                  controlsState.strictMode ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            {/* Control 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f5f4ef] border border-[#e8e7df]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">verified_user</span>
                <div>
                  <span className="text-[13px] text-on-surface block font-semibold">Faculty Whitelist Pass</span>
                  <span className="text-[11px] text-on-surface-variant">Allow calls only from authorized university domain contacts</span>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setControlsState(s => ({ ...s, whitelistPass: !s.whitelistPass })); }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  controlsState.whitelistPass ? 'bg-primary' : 'bg-[#c0c8c3]'
                }`}
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow-xs transform transition-transform ${
                  controlsState.whitelistPass ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            {/* Control 3 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f5f4ef] border border-[#e8e7df]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">volume_off</span>
                <div>
                  <span className="text-[13px] text-on-surface block font-semibold">Haptic Chime Only</span>
                  <span className="text-[11px] text-on-surface-variant">Replace audible timer alarms with soft desk vibrations</span>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setControlsState(s => ({ ...s, hapticOnly: !s.hapticOnly })); }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  controlsState.hapticOnly ? 'bg-primary' : 'bg-[#c0c8c3]'
                }`}
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow-xs transform transition-transform ${
                  controlsState.hapticOnly ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            {/* Control 4 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f5f4ef] border border-[#e8e7df]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">browser_updated</span>
                <div>
                  <span className="text-[13px] text-on-surface block font-semibold">Automated Away Dispatch</span>
                  <span className="text-[11px] text-on-surface-variant">SMS auto-reply: "In deep seminar focus until 3:30 PM."</span>
                </div>
              </div>
              <button 
                onClick={() => { sound.playClick(); setControlsState(s => ({ ...s, autoDispatch: !s.autoDispatch })); }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  controlsState.autoDispatch ? 'bg-primary' : 'bg-[#c0c8c3]'
                }`}
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow-xs transform transition-transform ${
                  controlsState.autoDispatch ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

          </div>
        </section>
      )}

    </div>
  );
};
