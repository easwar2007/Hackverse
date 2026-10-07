import React, { useState } from 'react';
import type { LanguageCode } from '../types';
import { multilingualSnippets, getSmartReply } from '../data/chatbotKnowledge';
import { askSocraticTutorBackend } from '../services/apiService';
import { sound } from '../utils/audio';

interface MultilingualChatbotProps {
  initialTopic?: string;
  onEarnCredits?: (amount: number) => void;
  onStartQuiz?: (courseTitle: string) => void;
}

export const MultilingualChatbot: React.FC<MultilingualChatbotProps> = ({
  initialTopic,
  onEarnCredits,
  onStartQuiz
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [selectedCourse, setSelectedCourse] = useState<string>(
    initialTopic || 'CS-402: Distributed Consensus & Raft'
  );
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState(
    'Can you explain Raft Leader Election simply? What happens during a split vote?'
  );
  const [customReply, setCustomReply] = useState<string | null>(null);
  const [activeModeTag, setActiveModeTag] = useState<string | null>(null);

  // Available courses for context
  const availableCourses = [
    { title: 'CS-402: Distributed Consensus & Raft', subtitle: 'Core Systems • Lecture 14 Reading Notes' },
    { title: 'MATH-301: Markov Chains & Martingales', subtitle: 'Probability Theory • Module 8 Reference' },
    { title: 'EE-512: Deep Neural Architectures', subtitle: 'Machine Intelligence • Lab 4 Annotated' }
  ];

  const handleLanguageChange = async (lang: LanguageCode) => {
    sound.playClick();
    setSelectedLang(lang);

    // If there is an active custom query, re-query backend in the chosen language
    if (customReply) {
      setIsThinking(true);
      try {
        const res = await askSocraticTutorBackend(userQuery, selectedCourse, lang);
        setCustomReply(res.text);
        setActiveModeTag(res.modeTag);
      } catch (_err) {
        const smartResult = getSmartReply(userQuery, lang, selectedCourse);
        setCustomReply(smartResult.reply);
      } finally {
        setIsThinking(false);
      }
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    sound.playClick();
    if (promptText.includes('3-question review quiz')) {
      if (onStartQuiz) {
        onStartQuiz(selectedCourse);
        return;
      }
    }
    setInputValue(promptText);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    sound.playClick();
    const q = inputValue.trim();
    setUserQuery(q);
    setInputValue('');
    setIsThinking(true);

    try {
      const res = await askSocraticTutorBackend(q, selectedCourse, selectedLang);
      setCustomReply(res.text);
      setActiveModeTag(res.modeTag);
      setIsThinking(false);
      if (onEarnCredits) onEarnCredits(15);
    } catch (err: any) {
      console.warn('Backend chat fallback:', err);
      const smartResult = getSmartReply(q, selectedLang, selectedCourse);
      setCustomReply(smartResult.reply);
      setActiveModeTag(null);
      setIsThinking(false);
      if (onEarnCredits) onEarnCredits(15);
    }
  };

  const handleReadAloud = () => {
    sound.playClick();
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    const langMap: Record<LanguageCode, string> = {
      en: 'en-US',
      ta: 'ta-IN',
      hi: 'hi-IN',
      tngl: 'en-IN'
    };

    const plainText = customReply 
      ? customReply.replace(/<[^>]*>/g, '').replace(/[*#_`$]/g, '')
      : multilingualSnippets[selectedLang].plainText;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = langMap[selectedLang] || 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveNote = () => {
    sound.playClick();
    if (!savedNotes.includes(userQuery)) {
      setSavedNotes(prev => [...prev, userQuery]);
      if (onEarnCredits) onEarnCredits(10);
      alert('✅ Academic note saved to your Study Catalogue Binder! (+10 CP awarded)');
    } else {
      alert('Note is already saved in your binder.');
    }
  };

  const handleToggleVoice = () => {
    sound.playClick();
    setIsVoiceActive(!isVoiceActive);
  };

  const currentSnippet = multilingualSnippets[selectedLang] || multilingualSnippets.en;

  return (
    <div className="flex flex-col relative w-full pb-16 space-y-4 max-w-4xl mx-auto">
      
      {/* Subject & Context Selector Bar */}
      <div className="w-full relative z-20">
        <div className="bg-white border border-[#e7e6df] rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-[#eaf4f0] border border-[#d2e8dd] flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                Current Syllabus Context
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
              </span>
              <button 
                className="flex items-center gap-1 text-left group"
                onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
              >
                <span className="font-title-md text-[14px] text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                  {selectedCourse}
                </span>
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${isCourseDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 bg-[#eaf4f0] border border-[#cbe5d8] px-2.5 py-1 rounded-md text-primary font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Backend AI Engine
            </span>
            <div className="flex items-center gap-1 bg-[#f5f4ef] border border-[#e6e5dd] px-2.5 py-1 rounded-md">
              <span className="material-symbols-outlined text-[14px] text-primary">school</span>
              <span className="font-label-sm text-[11px] text-[#27322d] font-semibold">Syllabus v4</span>
            </div>
          </div>
        </div>

        {/* Course Dropdown Popover */}
        {isCourseDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e1db] rounded-xl shadow-lg overflow-hidden z-30 transition-all">
            <div className="p-1 space-y-0.5">
              {availableCourses.map((c) => (
                <button
                  key={c.title}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-[#f5f4ef] transition-colors ${
                    selectedCourse === c.title ? 'bg-[#f0f7f4]' : ''
                  }`}
                  onClick={() => {
                    setSelectedCourse(c.title);
                    setIsCourseDropdownOpen(false);
                    sound.playClick();
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-title-md text-sm font-semibold text-[#161c27]">{c.title}</span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">{c.subtitle}</span>
                  </div>
                  {selectedCourse === c.title && (
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Multilingual Segmented Rail */}
      <div className="bg-white border border-[#e5e4de] p-1 rounded-xl shadow-xs">
        <div className="flex items-center justify-between gap-1 w-full">
          <button
            className={`flex-1 py-1.5 px-1 rounded-lg font-label-md text-label-md transition-all flex flex-col items-center justify-center ${
              selectedLang === 'en'
                ? 'bg-[#234e40] text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-[#f5f4ef]'
            }`}
            onClick={() => handleLanguageChange('en')}
          >
            <span className="font-semibold tracking-tight text-[12px]">EN</span>
            <span className={`font-label-sm text-[9.5px] ${selectedLang === 'en' ? 'opacity-90' : 'text-on-surface-variant'}`}>
              English
            </span>
          </button>

          <button
            className={`flex-1 py-1.5 px-1 rounded-lg font-label-md text-label-md transition-all flex flex-col items-center justify-center ${
              selectedLang === 'ta'
                ? 'bg-[#234e40] text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-[#f5f4ef]'
            }`}
            onClick={() => handleLanguageChange('ta')}
          >
            <span className="font-semibold text-[12px]">தமிழ்</span>
            <span className={`font-label-sm text-[9.5px] ${selectedLang === 'ta' ? 'opacity-90' : 'text-on-surface-variant'}`}>
              Tamil
            </span>
          </button>

          <button
            className={`flex-1 py-1.5 px-1 rounded-lg font-label-md text-label-md transition-all flex flex-col items-center justify-center ${
              selectedLang === 'hi'
                ? 'bg-[#234e40] text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-[#f5f4ef]'
            }`}
            onClick={() => handleLanguageChange('hi')}
          >
            <span className="font-semibold text-[12px]">हिन्दी</span>
            <span className={`font-label-sm text-[9.5px] ${selectedLang === 'hi' ? 'opacity-90' : 'text-on-surface-variant'}`}>
              Hindi
            </span>
          </button>

          <button
            className={`flex-1 py-1.5 px-1 rounded-lg font-label-md text-label-md transition-all flex flex-col items-center justify-center ${
              selectedLang === 'tngl'
                ? 'bg-[#234e40] text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-[#f5f4ef]'
            }`}
            onClick={() => handleLanguageChange('tngl')}
          >
            <span className="font-semibold tracking-tight text-[12px]">Tanglish</span>
            <span className={`font-label-sm text-[9.5px] ${selectedLang === 'tngl' ? 'opacity-90' : 'text-on-surface-variant'}`}>
              Colloquial
            </span>
          </button>
        </div>
      </div>

      {/* Real-time Mode Toast Indicator */}
      <div className="flex items-center justify-between px-1 text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label-sm text-[11px] text-[#27322d] tracking-wide">
            {activeModeTag || currentSnippet.tag}
          </span>
        </div>
        <span className="font-label-sm text-[11px] text-outline">Bilingual Gloss Active</span>
      </div>

      {/* Chat History Stream */}
      <div className="flex flex-col space-y-3.5">
        
        {/* Student Prompt (User Message) */}
        <div className="flex items-start justify-end gap-2 pl-6">
          <div className="flex flex-col items-end max-w-[85%]">
            <div className="bg-[#f2ede4] border border-[#e4ded4] text-[#1e2329] rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
              <p className="font-body-md text-[14px] leading-relaxed">
                {userQuery}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-1 pr-1">
              <span className="font-label-sm text-[10px] text-outline">Just now</span>
              <span className="material-symbols-outlined text-[13px] text-primary">done_all</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#07372a] text-white flex items-center justify-center shrink-0 mt-1 border border-[#e4ded4] shadow-xs text-xs font-bold">
            U
          </div>
        </div>

        {/* AI Academic Companion Response */}
        <div className="flex items-start gap-2.5 pr-1">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>

          <div className="flex flex-col max-w-[92%] space-y-2 flex-1">
            {/* Companion Textbook Note Card */}
            <div className="bg-white border border-[#e5e4de] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs relative overflow-hidden">
              
              {/* Header info inside scholarly card */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#f0eee6]">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[10.5px] uppercase font-bold tracking-wider text-primary">
                    Syllabus Mentor ({selectedCourse.split(':')[0]}) • Faculty Annotations
                  </span>
                </div>
                <button 
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-[12px] bg-[#f7f6f0] px-2 py-0.5 rounded border border-[#e8e7df]"
                  onClick={handleReadAloud}
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">volume_up</span>
                  <span className="font-label-sm text-[11px] font-medium">Read Aloud</span>
                </button>
              </div>

              {/* Dynamic localized response text */}
              {isThinking ? (
                <div className="py-6 flex items-center justify-center gap-2 text-primary font-serif italic text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  Processing syllabus consultation via backend in {selectedLang.toUpperCase()}...
                </div>
              ) : (
                <div 
                  className="font-body-lg text-[15px] leading-relaxed text-[#161c27] font-serif whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: customReply ? customReply.replace(/\n/g, '<br/>') : currentSnippet.content 
                  }}
                />
              )}

              {/* State Machine Micro-diagram Pill */}
              <div className="mt-3.5 bg-[#fbfbf9] border border-[#e8e7df] p-2.5 rounded-lg flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">device_hub</span>
                  <span className="font-label-sm text-[11px] font-semibold text-on-surface font-sans">
                    Follower → Candidate → Leader (Quorum Q &gt; N/2)
                  </span>
                </div>
                <span className="font-label-sm text-[10px] font-semibold bg-[#eaf4f0] text-primary border border-[#cce8db] px-2 py-0.5 rounded">
                  Safe Invariant
                </span>
              </div>

              {/* Quick interactive translation switcher chips right inside card */}
              <div className="mt-3 pt-2.5 border-t border-[#f0eee6] flex items-center gap-1.5 flex-wrap">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline mr-0.5">
                  Annotation Dialect:
                </span>
                {(['en', 'tngl', 'ta', 'hi'] as LanguageCode[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      selectedLang === l
                        ? 'bg-[#eaf4f0] text-primary border border-[#cbe5d8] font-semibold'
                        : 'bg-[#f5f4ef] text-on-surface-variant hover:text-on-surface border border-[#e6e5dd]'
                    }`}
                  >
                    {l === 'en' ? 'English' : l === 'tngl' ? 'Tanglish' : l === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Evaluation / Action Strip */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => sound.playClick()} 
                  className="p-1 px-2 rounded-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-[11px] hover:bg-white border border-transparent hover:border-[#e5e4de]"
                >
                  <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                  <span>Helpful</span>
                </button>
                <button 
                  onClick={() => sound.playClick()} 
                  className="p-1 px-1.5 rounded-md text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-[11px] hover:bg-white border border-transparent hover:border-[#e5e4de]"
                >
                  <span className="material-symbols-outlined text-[15px]">thumb_down</span>
                </button>
                <button 
                  onClick={handleSaveNote} 
                  className="p-1 px-2 rounded-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-[11px] hover:bg-white border border-transparent hover:border-[#e5e4de]"
                >
                  <span className="material-symbols-outlined text-[15px]">bookmark_add</span>
                  <span>Save Note</span>
                </button>
              </div>

              <span className="font-label-sm text-[11px] text-primary font-semibold flex items-center gap-1 bg-[#eaf4f0] border border-[#d2e8dd] px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[13px]">military_tech</span> +15 Study CP Earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Prompts Rail (Scholarly Context) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-sm text-[10.5px] text-outline uppercase tracking-wider font-semibold">
            Scholarly Inquiries &amp; Tools
          </span>
          <span className="material-symbols-outlined text-outline text-[15px]">auto_awesome</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            className="shrink-0 bg-white border border-[#e5e4de] hover:border-primary/40 text-on-surface px-3 py-2 rounded-xl text-left transition-colors shadow-xs flex items-center gap-2"
            onClick={() => handleQuickPrompt('Provide historical context and real-world intuition for split votes in distributed systems')}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">history_edu</span>
            <span className="font-label-md text-[12px] whitespace-nowrap font-medium">Historical context / analogy</span>
          </button>

          <button 
            className="shrink-0 bg-white border border-[#e5e4de] hover:border-primary/40 text-on-surface px-3 py-2 rounded-xl text-left transition-colors shadow-xs flex items-center gap-2"
            onClick={() => handleQuickPrompt('Generate a 3-question review quiz on this')}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">quiz</span>
            <span className="font-label-md text-[12px] whitespace-nowrap font-medium">Generate 3-question review</span>
          </button>

          <button 
            className="shrink-0 bg-white border border-[#e5e4de] hover:border-primary/40 text-on-surface px-3 py-2 rounded-xl text-left transition-colors shadow-xs flex items-center gap-2"
            onClick={() => handleQuickPrompt('Summarize key points in 3 concise bullet points with exam formula highlights')}
          >
            <span className="material-symbols-outlined text-[16px] text-[#27322d]">format_list_bulleted</span>
            <span className="font-label-md text-[12px] whitespace-nowrap font-medium">Summarize in bullet points</span>
          </button>

          <button 
            className="shrink-0 bg-white border border-[#e5e4de] hover:border-primary/40 text-on-surface px-3 py-2 rounded-xl text-left transition-colors shadow-xs flex items-center gap-2"
            onClick={() => handleQuickPrompt('List the core formal state invariants and safety proofs for exams')}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">functions</span>
            <span className="font-label-md text-[12px] whitespace-nowrap font-medium">Formal Invariants</span>
          </button>
        </div>
      </div>

      {/* Refined Editorial Paper Input Deck */}
      <div className="bg-white border border-[#e5e4de] p-2.5 rounded-2xl shadow-xs space-y-2">
        {/* Active Context Indicator Inside Bar */}
        <div className="flex items-center justify-between px-1.5 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-primary">translate</span>
            <span className="font-label-sm text-[11px]">
              {`Backend AI Engine • ${selectedLang.toUpperCase()}`}
            </span>
          </div>
          <span className="font-label-sm text-[10.5px] text-outline font-mono">LaTeX / MathJax Enabled</span>
        </div>

        {/* Main Message Input Box */}
        <div className="flex items-center gap-2 bg-[#fbfbf9] border border-[#e6e5dd] rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:bg-white transition-all">
          <button 
            className="text-outline hover:text-primary transition-colors flex items-center justify-center p-1 rounded-md"
            title="Attach lecture note or diagram"
            onClick={() => sound.playClick()}
          >
            <span className="material-symbols-outlined text-[19px]">add_circle</span>
          </button>
          
          <input 
            className="bg-transparent flex-1 font-body-md text-sm text-[#161c27] placeholder:text-outline/70 focus:outline-none min-w-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Ask your syllabus companion in English, Tamil, Hindi, or Tanglish..." 
            type="text"
          />

          <button 
            className={`transition-colors p-1 flex items-center justify-center rounded-md ${
              isVoiceActive ? 'text-secondary animate-pulse' : 'text-outline hover:text-secondary'
            }`}
            onClick={handleToggleVoice}
            title="Voice Clarification"
          >
            <span className="material-symbols-outlined text-[19px]">
              {isVoiceActive ? 'graphic_eq' : 'mic'}
            </span>
          </button>

          <button 
            className="bg-primary text-white hover:bg-[#1b3d32] transition-colors p-1.5 rounded-lg flex items-center justify-center shadow-xs"
            onClick={handleSubmit}
            title="Submit Question"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_upward</span>
          </button>
        </div>

        {/* Quick Tool Attachments Row */}
        <div className="flex items-center gap-1.5 px-0.5 text-on-surface-variant overflow-x-auto no-scrollbar">
          <button 
            onClick={() => { sound.playClick(); alert('📸 Camera OCR: Snap lecture slides or formulas to transcribe.'); }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f6f0] border border-[#e8e7df] font-label-sm text-[11px] hover:text-on-surface shrink-0"
          >
            <span className="material-symbols-outlined text-[13px] text-primary">photo_camera</span>
            <span>Snap Diagram</span>
          </button>
          <button 
            onClick={() => { sound.playClick(); alert('📖 Linked to Syllabus Reference (Distributed Log Replication).'); }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f6f0] border border-[#e8e7df] font-label-sm text-[11px] hover:text-on-surface shrink-0"
          >
            <span className="material-symbols-outlined text-[13px] text-secondary">auto_stories</span>
            <span>Syllabus Page 14</span>
          </button>
          <button 
            onClick={() => { sound.playClick(); handleReadAloud(); }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f6f0] border border-[#e8e7df] font-label-sm text-[11px] hover:text-on-surface shrink-0"
          >
            <span className="material-symbols-outlined text-[13px] text-primary">record_voice_over</span>
            <span>Pronounce Terms</span>
          </button>
          <button 
            onClick={() => { sound.playClick(); alert('⚙️ Academic depth set to Graduate Seminar level.'); }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f6f0] border border-[#e8e7df] font-label-sm text-[11px] hover:text-on-surface shrink-0"
          >
            <span className="material-symbols-outlined text-[13px] text-outline">tune</span>
            <span>Academic Depth</span>
          </button>
        </div>
      </div>

    </div>
  );
};
