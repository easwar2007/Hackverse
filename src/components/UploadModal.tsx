import React, { useState } from 'react';
import type { CatalogueItem, SubjectDomain, MockQuestion } from '../types';
import { ingestSyllabusBackend } from '../services/apiService';
import { sound } from '../utils/audio';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCatalogueItem: (newItem: CatalogueItem, mockQuestions?: MockQuestion[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddCatalogueItem
}) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; domain: SubjectDomain; content?: string } | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain>('Computer Science');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom' | 'file'>('preset');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePresets = [
    { 
      name: 'Distributed_Systems_Raft_Consensus_Lecture08.pptx', 
      size: '4.2 MB', 
      domain: 'Software Engineering' as SubjectDomain,
      content: `Distributed Consensus & Raft Protocol:
- State Machine Replication with Leader Election and Log Matching.
- Leader heartbeats every 50-100ms. Randomized election timeout 150-300ms.
- Split vote resolution: randomized timer reset avoids deadlocks.
- Invariants: Election Safety (at most one leader per term), Log Matching (identical index & term implies identical prefix), Leader Append-Only.`
    },
    { 
      name: 'Quantum_Computing_Qubits_Superposition.pdf', 
      size: '2.8 MB', 
      domain: 'Computer Science' as SubjectDomain,
      content: `Quantum Computing Foundations:
- Qubits, Bloch Sphere representation, Superposition |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.
- Quantum Entanglement: Bell states, EPR paradox.
- Quantum Gates: Hadamard (H), Pauli-X, CNOT for two-qubit entanglement.
- Shor's algorithm for prime factorization and Grover's search algorithm ($O(\\sqrt{N})$ speedup).`
    },
    { 
      name: 'Linear_Algebra_Eigenvalues_PCA.docx', 
      size: '1.9 MB', 
      domain: 'Mathematics' as SubjectDomain,
      content: `Linear Algebra & Principal Component Analysis (PCA):
- Eigenvalues & Eigenvectors: $Av = \\lambda v$, characteristic polynomial $\\det(A - \\lambda I) = 0$.
- Spectral Theorem for symmetric matrices: $A = Q \\Lambda Q^T$.
- PCA Algorithm: Mean centering, Covariance matrix calculation $C = \\frac{1}{n} X^T X$, Eigen-decomposition of $C$, projecting data onto top $k$ principal eigenvectors.`
    },
    { 
      name: 'Microprocessor_8086_Architecture_Notes.pdf', 
      size: '3.4 MB', 
      domain: 'Electronics' as SubjectDomain,
      content: `8086 Microprocessor Architecture:
- 16-bit processor with 20-bit address bus (1 MB physical memory address space).
- Bus Interface Unit (BIU) and Execution Unit (EU) pipelining with 6-byte instruction queue.
- Segment registers: CS, DS, SS, ES. Physical Address = Segment Register * 16 + Offset.
- Interrupt Vector Table (IVT) locations from 00000H to 003FFH.`
    }
  ];

  const stages = [
    'Parsing slide decks, diagrams, and OCR mathematical symbols...',
    'Stripping academic jargon & generating plain-language analogies...',
    'Synthesizing multilingual summaries (Tamil, Hindi, Tanglish, English)...',
    'Generating high-yield mock test questions & publishing to Catalogue...'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        domain: selectedDomain,
        content: text || `Lecture notes for ${file.name}`
      });
    };
    reader.readAsText(file);
  };

  const handleStartProcessing = async () => {
    let contentToProcess = '';
    let fileName = '';
    let domain = selectedDomain;

    if (activeTab === 'preset' && selectedFile) {
      contentToProcess = selectedFile.content || selectedFile.name;
      fileName = selectedFile.name;
      domain = selectedFile.domain;
    } else if (activeTab === 'custom' && customText.trim()) {
      contentToProcess = customText.trim();
      fileName = customText.split('\n')[0].slice(0, 40) || 'Custom Lecture Notes';
    } else if (activeTab === 'file' && selectedFile) {
      contentToProcess = selectedFile.content || selectedFile.name;
      fileName = selectedFile.name;
      domain = selectedFile.domain;
    } else {
      return;
    }

    sound.playClick();
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(15);
    setProgressStage(0);

    // Progress animation timer
    const p1 = setTimeout(() => {
      setProgressStage(1);
      setProgressPercent(45);
    }, 400);

    const p2 = setTimeout(() => {
      setProgressStage(2);
      setProgressPercent(75);
    }, 900);

    try {
      // Backend Ingest Call
      const result = await ingestSyllabusBackend(fileName, contentToProcess, domain);

      clearTimeout(p1);
      clearTimeout(p2);

      setProgressStage(3);
      setProgressPercent(100);
      sound.playVictory();

      setTimeout(() => {
        setIsProcessing(false);
        onAddCatalogueItem(result.item, result.mockQuestions);
        onClose();
      }, 600);

    } catch (err: any) {
      clearTimeout(p1);
      clearTimeout(p2);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to deconstruct syllabus through backend server.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e5e4de] shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in">
        
        {/* Header */}
        <div className="bg-[#fbfbf9] px-6 py-4 border-b border-[#e5e4de] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eaf4f0] border border-[#cbe5d8] text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-[#161c27]">
                  Ingest Syllabus PPT / Notes
                </h3>
                <span className="rounded-full bg-[#eaf4f0] border border-[#cbe5d8] px-2 py-0.2 text-[10px] font-bold text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Backend Engine
                </span>
              </div>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                Automatic Academic Deconstruction &amp; Quiz Synthesis
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            disabled={isProcessing}
            className="w-8 h-8 rounded-lg border border-[#e5e4de] bg-white hover:bg-[#f5f4ef] text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#fff0ed] border border-[#ffb59c] text-secondary text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {!isProcessing ? (
            <>
              {/* Ingest Mode Tabs */}
              <div className="flex items-center gap-1 bg-[#f5f4ef] p-1 rounded-xl border border-[#e6e5dd]">
                <button
                  onClick={() => { setActiveTab('preset'); sound.playClick(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'preset' ? 'bg-white text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-[#161c27]'
                  }`}
                >
                  Preset Lectures
                </button>
                <button
                  onClick={() => { setActiveTab('file'); sound.playClick(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'file' ? 'bg-white text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-[#161c27]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => { setActiveTab('custom'); sound.playClick(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'custom' ? 'bg-white text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-[#161c27]'
                  }`}
                >
                  Paste Notes
                </button>
              </div>

              {/* Preset Mode */}
              {activeTab === 'preset' && (
                <div className="space-y-2">
                  <span className="font-label-sm text-[10.5px] uppercase font-bold text-on-surface-variant">
                    Select Sample Lecture Slide Deck:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {samplePresets.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedFile(file); sound.playClick(); }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          selectedFile?.name === file.name
                            ? 'bg-[#eaf4f0] border-[#cbe5d8] text-primary font-bold shadow-xs'
                            : 'bg-white border-[#e5e4de] hover:border-primary/40 text-[#161c27]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            description
                          </span>
                          <span className="truncate font-sans font-medium">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-label-sm text-[10px] bg-[#f5f4ef] px-1.5 py-0.5 rounded text-on-surface-variant font-mono">
                            {file.size}
                          </span>
                          {selectedFile?.name === file.name && (
                            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload File Mode */}
              {activeTab === 'file' && (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-[#d2e8dd] bg-[#fbfbf9] hover:bg-[#f0f7f4] rounded-2xl p-6 text-center space-y-2 transition-colors cursor-pointer block">
                    <input 
                      type="file" 
                      accept=".txt,.md,.pdf,.pptx,.docx" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    <div className="w-10 h-10 rounded-xl bg-[#eaf4f0] text-primary flex items-center justify-center mx-auto shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                    </div>
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#161c27]">
                        {selectedFile ? selectedFile.name : 'Click to Browse / Drop File'}
                      </p>
                      <p className="font-label-sm text-[11px] text-on-surface-variant pt-0.5">
                        {selectedFile ? `${selectedFile.size} ready for parsing` : 'Supports .txt, .md, .pdf, .pptx'}
                      </p>
                    </div>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Subject Domain:</span>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value as SubjectDomain)}
                      className="bg-white border border-[#e5e4de] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#161c27] focus:outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Data Science & AI">Data Science &amp; AI</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Paste Custom Notes Mode */}
              {activeTab === 'custom' && (
                <div className="space-y-2">
                  <span className="font-label-sm text-[10.5px] uppercase font-bold text-on-surface-variant">
                    Paste Lecture Outline, Slide Text, or Syllabus:
                  </span>
                  <textarea
                    rows={5}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. Distributed Consensus in Raft: Leader election mechanics, heartbeat frequency (150ms), log replication invariants..."
                    className="w-full bg-[#fbfbf9] border border-[#e5e4de] rounded-xl p-3 text-xs font-sans text-[#161c27] focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Backend Status Note */}
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-[#f0eee6]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>Backend Academic Ingestion Pipeline Active</span>
                </div>
                <span className="font-mono text-[10px] text-outline font-semibold">Live Mode</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#e5e4de] text-xs font-semibold text-on-surface-variant hover:bg-[#f5f4ef]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartProcessing}
                  disabled={
                    (activeTab === 'preset' && !selectedFile) ||
                    (activeTab === 'file' && !selectedFile) ||
                    (activeTab === 'custom' && !customText.trim())
                  }
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-xs ${
                    (selectedFile || customText.trim()) ? 'bg-primary hover:bg-[#1a4b3b]' : 'bg-[#e5e4de] text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                  <span>Ingest &amp; Deconstruct</span>
                </button>
              </div>
            </>
          ) : (
            /* Ingestion Processing Progress */
            <div className="py-6 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#eaf4f0] text-primary flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <span className="material-symbols-outlined text-[30px]">neurology</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-[#161c27]">
                  Deconstructing Syllabus via Backend...
                </h4>
                <p className="font-label-sm text-xs text-on-surface-variant">
                  {stages[progressStage]}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#f0eee6] rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="font-mono text-xs font-bold text-primary block">
                {progressPercent}% completed
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
