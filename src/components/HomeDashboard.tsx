import React, { useState } from 'react';
import type { CatalogueItem } from '../types';
import { sound } from '../utils/audio';

interface HomeDashboardProps {
  catalogueItems: CatalogueItem[];
  onSelectSubject: (item: CatalogueItem) => void;
  onStartFocus: (item: CatalogueItem) => void;
  onStartQuiz: (item: CatalogueItem) => void;
  onOpenUpload: () => void;
  onOpenAssistant: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  catalogueItems,
  onSelectSubject,
  onStartFocus,
  onStartQuiz,
  onOpenUpload,
  onOpenAssistant
}) => {
  const [activeDeskTab, setActiveDeskTab] = useState<'overview' | 'tools' | 'queue'>('overview');

  const currentFocus = catalogueItems[0] || null;

  return (
    <div className="flex flex-col w-full pb-16 space-y-5 max-w-4xl mx-auto">
      
      {/* Editorial Header Sub-bar */}
      <div className="pt-2 pb-1">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[12px] uppercase tracking-wider text-secondary font-semibold font-mono">
            Trinity Term · Week 4
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium">
            Academic Session 2025–26
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] text-on-surface font-serif font-normal tracking-tight">
          Scholastic Reading Desk
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-0.5">
          Your daytime cadence, focus milestones, and critical annotations.
        </p>
      </div>

      {/* Segmented Desk Tabs */}
      <div className="flex p-1 bg-surface-container rounded-full shadow-xs">
        <button
          onClick={() => { sound.playClick(); setActiveDeskTab('overview'); }}
          className={`flex-1 py-2 rounded-full text-[13px] text-center transition-all duration-200 ${
            activeDeskTab === 'overview'
              ? 'bg-white text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveDeskTab('tools'); }}
          className={`flex-1 py-2 rounded-full text-[13px] text-center transition-all duration-200 ${
            activeDeskTab === 'tools'
              ? 'bg-white text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          Interactive Tools
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveDeskTab('queue'); }}
          className={`flex-1 py-2 rounded-full text-[13px] text-center transition-all duration-200 ${
            activeDeskTab === 'queue'
              ? 'bg-white text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          Study Queue
        </button>
      </div>

      {/* ================= PANEL 1: OVERVIEW ================= */}
      {activeDeskTab === 'overview' && (
        <section className="flex flex-col space-y-5">
          
          {/* Main "Currently In Focus" Card */}
          {currentFocus && (
            <div className="bg-white border border-[#e5e4de] rounded-xl p-5 shadow-xs relative overflow-hidden space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-2 border border-[#ffd5c4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="text-[11px] font-semibold tracking-wider uppercase">Currently In Focus</span>
                  </div>
                  <h2 className="text-[20px] text-on-surface font-serif font-bold">
                    {currentFocus.code}: {currentFocus.title}
                  </h2>
                  <p className="text-[13px] text-on-surface-variant mt-0.5">
                    {currentFocus.domain} • AI Simplified Notes & Flashpoints
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed/60 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">account_tree</span>
                </div>
              </div>

              {/* Archival Dossier Graphic Banner */}
              <div className="relative w-full h-36 rounded-lg overflow-hidden shadow-inner bg-gradient-to-r from-[#07372a] to-[#234e40] flex items-end p-4 text-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-on-primary">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    <span className="text-[12px] font-semibold">Lecture Dossier & Marginalia ({currentFocus.chaptersCount} Chapters)</span>
                  </div>
                  <p className="text-[11px] text-[#beedd9] line-clamp-1">
                    {currentFocus.summary.en}
                  </p>
                </div>
              </div>

              {/* Velocity vs Pace */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f0eee6]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant uppercase font-medium">Reading Velocity</span>
                  <span className="text-[15px] font-bold text-on-surface">38 mins logged today</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-on-surface-variant uppercase font-medium">Target Pace</span>
                  <span className="text-[15px] font-bold text-secondary">{currentFocus.estimatedMinutes} mins required</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { sound.playClick(); onStartFocus(currentFocus); }}
                  className="flex items-center justify-center gap-2 h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-[13px] shadow-xs transition-colors active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>Resume Monograph</span>
                </button>

                <button
                  onClick={() => { sound.playClick(); onSelectSubject(currentFocus); }}
                  className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#f5f4ef] hover:bg-[#e8eeff] text-on-surface font-semibold text-[13px] transition-colors active:scale-[0.99] border border-[#e5e4de]"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">style</span>
                  <span>View Notes ({currentFocus.chaptersCount})</span>
                </button>
              </div>
            </div>
          )}

          {/* Daily Milestone & Streak Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Daily Milestone */}
            <div className="bg-white border border-[#e5e4de] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
                  <h3 className="text-[15px] font-bold text-on-surface">Daily Milestone Progress</h3>
                </div>
                <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-[#beedd9] border border-[#a3d0be]">
                  75% Reached
                </span>
              </div>

              <div className="flex items-center gap-4 py-1">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                    <circle className="stroke-[#e8eeff]" cx="36" cy="36" fill="transparent" r="28" strokeWidth="6"></circle>
                    <circle className="stroke-[#07372a]" cx="36" cy="36" fill="transparent" r="28" strokeDasharray="175.9" strokeDashoffset="44" strokeLinecap="round" strokeWidth="6"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-serif text-[16px] font-bold text-on-surface">75%</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center flex-1 space-y-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <span className="font-medium text-on-surface">Archival Chapters</span>
                    <span className="text-on-surface-variant">3 of 4 done</span>
                  </div>
                  <div className="w-full bg-[#e8eeff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant pt-0.5">
                    22 minutes remaining to complete your diurnal scholarly quota.
                  </p>
                </div>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="bg-white border border-[#e5e4de] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary border border-[#ffd5c4]">
                  <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">5-Day Scholarly Cadence</h3>
                  <span className="text-[12px] text-on-surface-variant">Best streak: 18 consecutive library days</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-7 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-7 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-7 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-7 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-7 rounded-full bg-secondary"></span>
                  <span className="w-2.5 h-7 rounded-full bg-[#e8eeff]"></span>
                  <span className="w-2.5 h-7 rounded-full bg-[#e8eeff]"></span>
                </div>
                <span className="text-[11px] font-mono text-secondary font-bold uppercase">
                  Streak Active
                </span>
              </div>
            </div>

          </div>

        </section>
      )}

      {/* ================= PANEL 2: INTERACTIVE TOOLS ================= */}
      {activeDeskTab === 'tools' && (
        <section className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] text-on-surface font-serif font-bold">Scholastic Workbench</h2>
              <p className="text-[13px] text-on-surface-variant">Spacious study actions for rigorous research sessions.</p>
            </div>
            <span className="material-symbols-outlined text-primary text-[24px]">handyman</span>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1">
            
            {/* Tool 1: Ingest */}
            <div 
              onClick={() => { sound.playClick(); onOpenUpload(); }}
              className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex items-center justify-between group active:scale-[0.99] transition-transform cursor-pointer hover:border-primary/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#beedd9] flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">document_scanner</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">Ingest & Extract Notes</h3>
                  <p className="text-[12px] text-on-surface-variant">OCR scan excerpts, slides, PDFs and multi-language summaries</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>

            {/* Tool 2: Launch Focus */}
            <div 
              onClick={() => { sound.playClick(); if (currentFocus) onStartFocus(currentFocus); }}
              className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex items-center justify-between group active:scale-[0.99] transition-transform cursor-pointer hover:border-secondary/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">hourglass_empty</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">Launch Focus Interval</h3>
                  <p className="text-[12px] text-on-surface-variant">Deep retention blocks with Smart Call Guardian protection</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-secondary transition-colors">
                chevron_right
              </span>
            </div>

            {/* Tool 3: Socratic Assistant */}
            <div 
              onClick={() => { sound.playClick(); onOpenAssistant(); }}
              className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex items-center justify-between group active:scale-[0.99] transition-transform cursor-pointer hover:border-primary/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#e8eeff] flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">psychology_alt</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">Consult Socratic Assistant</h3>
                  <p className="text-[12px] text-on-surface-variant">Multilingual answers in Tamil, Hindi, Tanglish, and English</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>

            {/* Tool 4: Mock Quiz */}
            <div 
              onClick={() => { sound.playClick(); if (currentFocus) onStartQuiz(currentFocus); }}
              className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex items-center justify-between group active:scale-[0.99] transition-transform cursor-pointer hover:border-primary/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#d9e6dd] flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">quiz</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">Synthesize Practice Quiz</h3>
                  <p className="text-[12px] text-on-surface-variant">Formative retrieval drills that convert score directly to Credit Points</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>

          </div>

          {/* Mentor Tip */}
          <div className="bg-[#f5f4ef] border border-[#e6e5dd] rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">lightbulb</span>
            <p className="text-[13px] text-on-surface">
              <span className="font-bold">Mentor Tip:</span> Deconstruct complex textbook chapters into Jargon vs Analogy cards before attempting end-of-week quizzes.
            </p>
          </div>
        </section>
      )}

      {/* ================= PANEL 3: STUDY QUEUE ================= */}
      {activeDeskTab === 'queue' && (
        <section className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] text-on-surface font-serif font-bold">Curated Study Queue</h2>
              <p className="text-[13px] text-on-surface-variant">Ordered syllabus milestones & seminar submissions.</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#e8eeff] text-primary font-semibold">
              3 Pending
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {catalogueItems.slice(0, 3).map((item, idx) => (
              <div key={item.id} className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#beedd9] text-[#07372a] font-semibold">
                        Priority {idx + 1}
                      </span>
                      <span className="text-[11px] text-secondary font-medium font-mono">
                        {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Saturday'}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-on-surface pt-1">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant">
                      {item.code} • {item.domain}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#e8eeff] flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">timer</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#f0eee6]">
                  <span className="text-[12px] text-on-surface-variant">
                    Est. {item.estimatedMinutes} mins focused deep work
                  </span>
                  <button 
                    onClick={() => { sound.playClick(); onSelectSubject(item); }}
                    className="text-[12px] text-primary font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>Open Monograph</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bodleian Library Archival Motto */}
      <div className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#07372a] text-[#beedd9] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">format_quote</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-serif italic text-on-surface leading-snug">
              “Order is the shape upon which understanding breathes.”
            </p>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block mt-0.5 font-semibold">
              Bodleian Library Archival Motto
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
