import React, { useState } from 'react';
import type { CatalogueItem, LanguageCode } from '../types';
import { sound } from '../utils/audio';

interface CatalogueDetailProps {
  item: CatalogueItem;
  onBack: () => void;
  onStartFocus: (item: CatalogueItem) => void;
  onStartMockTest: (item: CatalogueItem) => void;
  onOpenChatWithTopic: (topic: string) => void;
  onToggleChapterComplete: (itemId: string, chapterId: string) => void;
}

export const CatalogueDetail: React.FC<CatalogueDetailProps> = ({
  item,
  onBack,
  onStartFocus,
  onStartMockTest,
  onOpenChatWithTopic,
  onToggleChapterComplete
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'notes' | 'jargon' | 'formulas'>('notes');

  const languages: Array<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'tngl', label: 'Tanglish' }
  ];

  const completedCount = item.chapters.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / (item.chapters.length || 1)) * 100);

  const summaryText = typeof item.summary === 'string' 
    ? item.summary 
    : (item.summary[selectedLang] || item.summary.en);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
        <button 
          onClick={() => { sound.playClick(); onBack(); }}
          className="flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>Study Catalogue</span>
        </button>
        <span>/</span>
        <span className="text-on-surface-variant">{item.domain}</span>
        <span>/</span>
        <span className="text-[#161c27] font-semibold truncate max-w-xs">{item.code}: {item.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-[#e5e4de] bg-white p-6 sm:p-7 shadow-xs space-y-5">
        
        {/* Title, Code & Badge Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary bg-[#eaf4f0] px-2.5 py-1 rounded border border-[#cbe5d8]">
                {item.code}
              </span>
              <span className="rounded-full bg-[#f5f4ef] px-2.5 py-0.5 text-xs font-semibold text-[#27322d] border border-[#e6e5dd] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">auto_stories</span>
                {item.aiSimplifiedVersion}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                item.examProbability === 'Essential' 
                  ? 'bg-[#fff3ed] text-secondary border border-[#ffd5c4]' 
                  : 'bg-[#fef8ea] text-[#916b08] border border-[#fae5b6]'
              }`}>
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                {item.examProbability} Exam Weight
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#161c27] tracking-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant pt-1">
              <span>Domain: <strong className="text-[#161c27]">{item.domain}</strong></span>
              <span>•</span>
              <span>Estimated Reading: <strong className="text-[#161c27]">{item.estimatedMinutes} mins</strong></span>
              <span>•</span>
              <span>Difficulty: <strong className="text-[#161c27]">{item.difficulty}</strong></span>
            </div>
          </div>

          {/* Quick Actions Stack */}
          <div className="flex flex-row md:flex-col gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={() => { sound.playClick(); onStartFocus(item); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1a4b3b] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              <span>Start Focus Interval</span>
            </button>

            <button
              onClick={() => { sound.playClick(); onStartMockTest(item); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#85371b] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">quiz</span>
              <span>Practice Mock Quiz</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Summary */}
        <div className="rounded-xl bg-[#fbfbf9] p-4 border border-[#e8e7df] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#161c27] font-serif">Syllabus Mastery Progress</span>
            <span className="font-mono font-bold text-primary">{progressPercent}% ({completedCount}/{item.chapters.length} Modules)</span>
          </div>
          <div className="w-full bg-[#e8e7df] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            {summaryText}
          </p>
        </div>
      </div>

      {/* Chapters & Syllabus Breakdown */}
      <div className="rounded-2xl border border-[#e5e4de] bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#161c27] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">format_list_numbered</span>
          Curriculum Modules &amp; Subsections
        </h2>

        <div className="space-y-2.5">
          {item.chapters.map((chapter, idx) => (
            <div 
              key={chapter.id}
              className={`rounded-xl border p-3.5 flex items-center justify-between transition-all ${
                chapter.completed 
                  ? 'bg-[#f7faf8] border-[#cbe5d8]' 
                  : 'bg-[#fbfbf9] border-[#e8e7df] hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => { sound.playClick(); onToggleChapterComplete(item.id, chapter.id); }}
                  className="text-primary hover:opacity-80 transition-opacity"
                  title={chapter.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <span className={`material-symbols-outlined text-[22px] ${chapter.completed ? 'text-primary' : 'text-outline'}`}>
                    {chapter.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-xs font-bold text-on-surface-variant">Module {idx + 1}:</span>
                    <span className={`font-serif text-sm font-semibold truncate ${chapter.completed ? 'text-on-surface-variant line-through' : 'text-[#161c27]'}`}>
                      {chapter.title}
                    </span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    Est. Duration: {chapter.durationMinutes} mins
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenChatWithTopic(`${item.title} - Module ${idx + 1}: ${chapter.title}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#e5e4de] text-primary hover:border-primary text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[14px]">chat</span>
                <span className="hidden sm:inline">Ask AI Companion</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Study Notes & Reference Section */}
      <div className="rounded-2xl border border-[#e5e4de] bg-white p-6 shadow-xs space-y-5">
        
        {/* Tab & Language Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#f0eee6]">
          <div className="flex items-center gap-1 bg-[#f5f4ef] p-1 rounded-xl border border-[#e6e5dd]">
            <button
              onClick={() => { setActiveTab('notes'); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notes' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-[#161c27]'
              }`}
            >
              Academic Notes
            </button>
            <button
              onClick={() => { setActiveTab('jargon'); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jargon' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-[#161c27]'
              }`}
            >
              Jargon Glossary ({item.jargonBreakdown?.length || 0})
            </button>
            <button
              onClick={() => { setActiveTab('formulas'); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'formulas' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-[#161c27]'
              }`}
            >
              Formulas &amp; Invariants ({item.highYieldFormulas?.length || 0})
            </button>
          </div>

          {activeTab === 'notes' && (
            <div className="flex items-center gap-1 self-start sm:self-auto">
              <span className="font-label-sm text-[11px] text-on-surface-variant mr-1">Language:</span>
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setSelectedLang(l.code); sound.playClick(); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedLang === l.code
                      ? 'bg-[#eaf4f0] text-primary border border-[#cbe5d8]'
                      : 'bg-white text-on-surface-variant border border-[#e5e4de] hover:bg-[#f5f4ef]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content: Academic Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] font-serif text-[15px] leading-relaxed text-[#161c27]">
              {item.chapters[0]?.simplifiedExplanation?.[selectedLang] || summaryText}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenChatWithTopic(item.title);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-2 shadow-xs hover:bg-[#1a4b3b] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                <span>Ask Socratic Questions on this Reading</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Jargon Glossary */}
        {activeTab === 'jargon' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {item.jargonBreakdown?.map((j, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-secondary">{j.term}</span>
                  <span className="font-label-sm text-[10px] uppercase font-bold bg-[#fff3ed] text-secondary px-2 py-0.5 rounded border border-[#ffd5c4]">
                    Concept
                  </span>
                </div>
                <p className="font-body-sm text-xs text-[#161c27]">{j.formalDefinition}</p>
                <div className="pt-1 text-[11px] text-on-surface-variant font-serif italic">
                  💡 Analogy: {j.simplifiedAnalogy}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Formulas */}
        {activeTab === 'formulas' && (
          <div className="space-y-3">
            {item.highYieldFormulas?.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#161c27]">{f.title}</span>
                  <span className="font-mono text-xs font-bold text-primary bg-[#eaf4f0] px-2 py-0.5 rounded border border-[#cbe5d8]">
                    Invariant #{idx + 1}
                  </span>
                </div>
                <div className="font-mono text-sm bg-white p-2.5 rounded-lg border border-[#e5e4de] text-primary font-bold">
                  {f.formula}
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {f.meaning}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
