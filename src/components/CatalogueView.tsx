import React, { useState } from 'react';
import type { CatalogueItem } from '../types';
import { sound } from '../utils/audio';

interface CatalogueViewProps {
  items: CatalogueItem[];
  onSelectItem: (item: CatalogueItem) => void;
  onStartFocus: (item: CatalogueItem) => void;
  onStartMockTest: (item: CatalogueItem) => void;
  onOpenUpload: () => void;
  onArchiveItem: (itemId: string) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  items,
  onSelectItem,
  onStartFocus,
  onStartMockTest,
  onOpenUpload,
  onArchiveItem
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'readings' | 'notes'>('courses');
  const [isIngestDrawerOpen, setIsIngestDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('All domains');
  const [sortOrder, setSortOrder] = useState<'deadline' | 'name' | 'progress'>('deadline');
  const [selectedReading, setSelectedReading] = useState<(typeof readingsList)[number] | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<(typeof savedDecks)[number] | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  const matchingCourses = items.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    return (selectedDomain === 'All domains' || item.domain === selectedDomain) && (!q ||
      item.title.toLowerCase().includes(q) || 
      item.code.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q));
  });
  const filteredCourses = [...matchingCourses].sort((a, b) => {
    if (sortOrder === 'name') return a.title.localeCompare(b.title);
    if (sortOrder === 'progress') return b.progressPercent - a.progressPercent;
    const rank = { Essential: 0, High: 1, Medium: 2 };
    return rank[a.examProbability] - rank[b.examProbability];
  });

  const domains = ['All domains', ...new Set(items.map(item => item.domain))];

  const readingsList = [
    {
      id: 'read-1',
      title: 'CS402_Full_Syllabus_Consensus.pdf',
      meta: 'Annotated • 1.4 MB • Ingested Mar 2',
      type: 'pdf',
      courseCode: 'SE-315'
    },
    {
      id: 'read-2',
      title: 'Week_08_Paxos_And_Raft_Slides.pptx',
      meta: 'Lecture Slides • 8.2 MB • Ingested Yesterday',
      type: 'slides',
      courseCode: 'SE-315'
    },
    {
      id: 'read-3',
      title: 'Self_Attention_Transformers_Paper.pdf',
      meta: 'Journal Paper • 620 KB • AI-405',
      type: 'pdf',
      courseCode: 'AI-405'
    },
    {
      id: 'read-4',
      title: 'Graph_Theory_Handshaking_Proof.pdf',
      meta: 'Class Notes • 910 KB • MATH-210',
      type: 'pdf',
      courseCode: 'MATH-210'
    },
    {
      id: 'read-5',
      title: 'Discrete_Fourier_Transform_Notes.docx',
      meta: 'Lab Dossier • 2.1 MB • ECE-204',
      type: 'doc',
      courseCode: 'ECE-204'
    }
  ];

  const savedDecks = [
    {
      id: 'deck-1',
      code: 'CS-402',
      title: 'Byzantine Fault & Raft Terminology',
      cardsCount: 48,
      desc: 'Detailed definitions for split-brain resolution, term elections, and log compaction invariants.'
    },
    {
      id: 'deck-2',
      code: 'AI-405',
      title: 'Attention & QKV Vector Mechanisms',
      cardsCount: 32,
      desc: 'Formulas for Scaled Dot-Product, causal masks, and sinusoidal positional encodings.'
    },
    {
      id: 'deck-3',
      code: 'MATH-210',
      title: 'Graph Handshaking & Dijkstra Proofs',
      cardsCount: 24,
      desc: 'Shortest-path invariant proofs, planar Euler formula, and adjacency matrix theorems.'
    }
  ];
  const query = searchQuery.trim().toLowerCase();
  const filteredReadings = readingsList.filter(doc => !query || `${doc.title} ${doc.meta}`.toLowerCase().includes(query));
  const filteredDecks = savedDecks.filter(deck => !query || `${deck.code} ${deck.title} ${deck.desc}`.toLowerCase().includes(query));

  const toggleCardMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-5 max-w-4xl mx-auto">
      
      {/* Collapsible Ingest Syllabus Banner */}
      <section className="w-full bg-[#f5f4ef] border border-[#e5e4de] rounded-xl p-3.5 shadow-xs transition-all duration-300">
        <div 
          className="flex items-center justify-between gap-3 cursor-pointer" 
          onClick={() => {
            sound.playClick();
            setIsIngestDrawerOpen(!isIngestDrawerOpen);
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-on-primary text-body-sm">
              <span className="material-symbols-outlined text-[17px]">auto_read_pause</span>
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[16px] font-bold text-on-surface truncate">
                Ingest Syllabus or Lecture Material
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Instant parsing, OCR extraction & multilingual notes breakdown
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-on-surface-variant shrink-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">
              {isIngestDrawerOpen ? 'Close' : 'Upload'}
            </span>
            <span className={`material-symbols-outlined text-[19px] transition-transform duration-200 ${isIngestDrawerOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
        </div>

        {/* Collapsible Upload Drawer */}
        {isIngestDrawerOpen && (
          <div className="pt-3 mt-3 border-t border-[#e5e4de] flex flex-col space-y-3">
            <div 
              onClick={() => { sound.playClick(); onOpenUpload(); }}
              className="bg-white border border-dashed border-[#c0c8c3] p-4 rounded-lg flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-secondary text-[28px]">cloud_upload</span>
              <div className="space-y-0.5">
                <p className="text-[14px] text-on-surface font-semibold">Drop seminar syllabus, PDF, or PPTX archive</p>
                <p className="text-[11px] text-outline">OCR & syllabus auto-structuring up to 45MB</p>
              </div>
              <button 
                type="button"
                className="mt-1 px-4 py-1.5 bg-primary text-on-primary text-[12px] font-semibold rounded shadow-xs hover:opacity-95 transition-opacity"
              >
                Select Faculty File
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                Harvard Citation & BibTeX Auto-Sync Enabled
              </span>
              <button 
                onClick={() => setIsIngestDrawerOpen(false)}
                className="text-secondary font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Editorial Search Header & Tabs */}
      <section className="flex flex-col w-full space-y-3">
        
        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter courses, seminar notes, reading sets..." 
              className="w-full bg-white border border-[#e5e4de] text-on-surface placeholder:text-outline pl-9 pr-3 py-2.5 rounded-lg text-[14px] shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button 
            type="button" 
            onClick={() => {
              sound.playClick();
              setIsFilterOpen(open => !open);
            }}
            className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border border-[#e5e4de] text-on-surface-variant hover:text-primary shadow-xs hover:bg-[#f5f4ef] transition-colors"
            title="Filter Options"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white border border-[#e5e4de] rounded-lg shadow-xs">
            <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface">
              Domain
              <select value={selectedDomain} onChange={event => setSelectedDomain(event.target.value)} className="rounded border border-[#e5e4de] bg-white p-2 font-normal">
                {domains.map(domain => <option key={domain}>{domain}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface">
              Sort courses
              <select value={sortOrder} onChange={event => setSortOrder(event.target.value as typeof sortOrder)} className="rounded border border-[#e5e4de] bg-white p-2 font-normal">
                <option value="deadline">Exam priority</option>
                <option value="name">Course name</option>
                <option value="progress">Progress: highest first</option>
              </select>
            </label>
          </div>
        )}

        {/* Segmented Tabs directly under Search */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-surface-container shadow-inner text-center">
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('courses'); }}
            className={`py-2 px-1 rounded-lg text-[12px] transition-all duration-150 flex items-center justify-center gap-1 font-semibold ${
              activeTab === 'courses'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">menu_book</span>
            <span className="truncate">Courses ({filteredCourses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('readings'); }}
            className={`py-2 px-1 rounded-lg text-[12px] transition-all duration-150 flex items-center justify-center gap-1 font-semibold ${
              activeTab === 'readings'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span className="truncate">Readings ({filteredReadings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('notes'); }}
            className={`py-2 px-1 rounded-lg text-[12px] transition-all duration-150 flex items-center justify-center gap-1 font-semibold ${
              activeTab === 'notes'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span className="truncate">Saved Notes ({filteredDecks.length})</span>
          </button>
        </div>
      </section>

      {/* ================= TAB 1: ENROLLED COURSES ================= */}
      {activeTab === 'courses' && (
        <main className="flex flex-col space-y-4">
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] tracking-wider uppercase font-semibold text-outline">
              Active Curricula • Spring Term
            </span>
            <span className="text-[11px] text-primary font-medium">
              Sorted by Deadline
            </span>
          </div>

          {filteredCourses.map((item) => (
            <article 
              key={item.id}
              className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex flex-col space-y-3.5 relative overflow-visible hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#beedd9] text-[#07372a] text-[11px] font-bold">
                      {item.code}
                    </span>
                    <span className="text-[11px] text-secondary font-medium font-mono">
                      🔥 {item.examProbability} Exam Probability
                    </span>
                  </div>

                  <h2 
                    onClick={() => { sound.playClick(); onSelectItem(item); }}
                    className="text-[17px] font-serif font-bold text-on-surface leading-snug cursor-pointer hover:text-primary transition-colors"
                  >
                    {item.title}
                  </h2>
                  <p className="text-[13px] text-on-surface-variant line-clamp-1">
                    {item.domain} • {item.chaptersCount} Chapters • {item.estimatedMinutes} mins Focus
                  </p>
                </div>

                <div className="relative">
                  <button 
                    type="button"
                    onClick={(e) => toggleCardMenu(item.id, e)}
                    className="text-on-surface-variant hover:text-on-surface p-1 rounded-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>

                  {activeMenuId === item.id && (
                    <div className="absolute top-8 right-0 w-44 bg-white border border-[#e5e4de] rounded-lg shadow-lg p-1 z-30 flex flex-col space-y-0.5 text-[12px] font-medium">
                      <button 
                        onClick={() => { sound.playClick(); onSelectItem(item); setActiveMenuId(null); }}
                        className="w-full text-left px-3 py-2 text-on-surface hover:bg-[#f5f4ef] rounded"
                      >
                        Open Syllabus Monograph
                      </button>
                      <button 
                        onClick={() => { sound.playClick(); onStartMockTest(item); setActiveMenuId(null); }}
                        className="w-full text-left px-3 py-2 text-on-surface hover:bg-[#f5f4ef] rounded"
                      >
                        Synthesize Practice Quiz
                      </button>
                      <button 
                        onClick={() => {
                          setActiveMenuId(null);
                          onArchiveItem(item.id);
                        }}
                        className="w-full text-left px-3 py-2 text-error hover:bg-[#ffdad6] rounded"
                      >
                        Archive Course
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chapter Progress Bar */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">
                    Chapter Progress: <strong className="text-on-surface font-semibold">{Math.round((item.progressPercent / 100) * item.chaptersCount)} of {item.chaptersCount} Completed</strong>
                  </span>
                  <span className="font-bold text-primary">{item.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#e8eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${item.progressPercent}%` }}></div>
                </div>
              </div>

              {/* Single Primary Action & Next Step */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f0eee6]">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                  <span className="line-clamp-1">Est. {item.estimatedMinutes}m Focus</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); onSelectItem(item); }}
                    className="px-3 py-1.5 bg-[#f5f4ef] hover:bg-[#e8eeff] text-on-surface text-[12px] font-semibold rounded border border-[#e5e4de] transition-colors"
                  >
                    Open Syllabus
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); onStartFocus(item); }}
                    className="px-4 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-[12px] font-semibold rounded shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>Study Now</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filteredCourses.length === 0 && (
            <p className="rounded-xl border border-dashed border-[#c0c8c3] bg-white p-6 text-center text-sm text-on-surface-variant">
              No courses match these filters. Try another search or domain.
            </p>
          )}
        </main>
      )}

      {/* ================= TAB 2: READING MATERIALS ================= */}
      {activeTab === 'readings' && (
        <section className="flex flex-col space-y-3">
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] tracking-wider uppercase font-semibold text-outline">
              Uploaded Dossiers & Syllabi
            </span>
            <span className="text-[11px] text-primary font-medium">
              {readingsList.length} Files Indexed
            </span>
          </div>

          {filteredReadings.map(doc => (
            <article key={doc.id} className="bg-white border border-[#e5e4de] rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#e8eeff] flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    {doc.type === 'slides' ? 'slideshow' : 'picture_as_pdf'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-[14px] font-serif font-bold text-on-surface truncate">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">{doc.meta}</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => { sound.playClick(); setSelectedReading(doc); }}
                className="px-3.5 py-1.5 bg-[#f5f4ef] hover:bg-[#e8eeff] text-on-surface text-[12px] font-semibold rounded border border-[#e5e4de] transition-colors"
              >
                Read
              </button>
            </article>
          ))}
          {filteredReadings.length === 0 && <p className="rounded-xl border border-dashed border-[#c0c8c3] bg-white p-6 text-center text-sm text-on-surface-variant">No readings match your search.</p>}
        </section>
      )}

      {/* ================= TAB 3: SAVED NOTES ================= */}
      {activeTab === 'notes' && (
        <section className="flex flex-col space-y-3">
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] tracking-wider uppercase font-semibold text-outline">
              Personal Marginalia & Flashcard Decks
            </span>
            <span className="text-[11px] text-primary font-medium">
              {savedDecks.length} Decks Active
            </span>
          </div>

          {filteredDecks.map(deck => (
            <article key={deck.id} className="bg-white border border-[#e5e4de] rounded-xl p-4 shadow-xs flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#beedd9] text-[#07372a] text-[11px] font-bold">
                  {deck.code}
                </span>
                <span className="text-[11px] text-outline font-medium">
                  {deck.cardsCount} Flashcards
                </span>
              </div>
              <h3 className="text-[16px] font-serif font-bold text-on-surface">
                {deck.title}
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                {deck.desc}
              </p>
              <div className="pt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDeck(deck);
                    setFlashcardIndex(0);
                    setIsFlashcardFlipped(false);
                  }}
                  className="px-4 py-1.5 bg-primary text-on-primary text-[12px] font-semibold rounded shadow-xs hover:bg-primary-container transition-colors"
                >
                  Review Deck
                </button>
              </div>
            </article>
          ))}
          {filteredDecks.length === 0 && <p className="rounded-xl border border-dashed border-[#c0c8c3] bg-white p-6 text-center text-sm text-on-surface-variant">No saved decks match your search.</p>}
        </section>
      )}

      {/* Editorial Scholastic Archive Quote */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-[14px] italic font-serif text-outline max-w-sm mx-auto">
          “Study without desire spoils the memory, and it retains nothing that it takes in.”
        </p>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-semibold">
          Bodleian Reference Standard
        </p>
      </footer>

      {(selectedReading || selectedDeck) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <section className="w-full max-w-xl rounded-2xl border border-[#e5e4de] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {selectedReading ? 'Reading preview' : `Flashcard ${flashcardIndex + 1} of 3`}
                </p>
                <h2 className="font-serif text-lg font-bold text-[#161c27]">
                  {selectedReading?.title || selectedDeck?.title}
                </h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => { setSelectedReading(null); setSelectedDeck(null); }} className="rounded border border-[#e5e4de] px-2 py-1 text-sm">Close</button>
            </div>
            {selectedReading ? (
              <div className="space-y-3 rounded-xl bg-[#fbfbf9] p-4 text-sm text-on-surface-variant">
                <p>{selectedReading.meta}</p>
                <p>This item is part of the study archive. Open the linked course monograph to read the indexed notes and syllabus content.</p>
                {items.filter(item => item.code === selectedReading.courseCode).map(item => (
                  <button key={item.id} type="button" onClick={() => { setSelectedReading(null); onSelectItem(item); }} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">
                    Open {item.code} syllabus
                  </button>
                ))}
              </div>
            ) : selectedDeck && (
              <div className="space-y-4">
                <button type="button" onClick={() => setIsFlashcardFlipped(value => !value)} className="flex min-h-44 w-full items-center justify-center rounded-xl border border-[#cbe5d8] bg-[#f0f7f4] p-6 text-center font-serif text-lg text-[#161c27]">
                  {selectedDeck.id === 'deck-1'
                    ? isFlashcardFlipped ? 'Raft elects a leader through terms and majority votes; randomized election timeouts reduce repeated split votes.' : 'How does Raft resolve a split vote?'
                    : selectedDeck.id === 'deck-2'
                      ? isFlashcardFlipped ? 'Scaled dot-product attention is softmax(QKᵀ / √dₖ)V; the scale stabilizes dot-product magnitudes.' : 'What is the scaled dot-product attention formula?'
                      : isFlashcardFlipped ? 'For an undirected graph, the sum of vertex degrees equals twice the number of edges: Σ deg(v) = 2|E|.' : 'What does the handshaking lemma state?'}
                </button>
                <div className="flex justify-between">
                  <button type="button" onClick={() => { setFlashcardIndex(index => (index + 2) % 3); setIsFlashcardFlipped(false); }} className="rounded-lg border border-[#e5e4de] px-3 py-2 text-xs font-semibold">Previous</button>
                  <button type="button" onClick={() => setIsFlashcardFlipped(value => !value)} className="rounded-lg bg-[#f5f4ef] px-3 py-2 text-xs font-semibold">Flip card</button>
                  <button type="button" onClick={() => { setFlashcardIndex(index => (index + 1) % 3); setIsFlashcardFlipped(false); }} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">Next</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

    </div>
  );
};
