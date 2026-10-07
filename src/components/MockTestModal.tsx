import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { CatalogueItem, MockQuestion, LanguageCode } from '../types';
import { getQuestionsForSubject } from '../data/mockTests';
import { sound } from '../utils/audio';

interface MockTestModalProps {
  item: CatalogueItem;
  onClose: () => void;
  onAwardPoints: (points: number, reason: string) => void;
  onGoToRewards: () => void;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({
  item,
  onClose,
  onAwardPoints,
  onGoToRewards
}) => {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [explanationLang, setExplanationLang] = useState<LanguageCode>('en');

  useEffect(() => {
    const list = getQuestionsForSubject(item.id);
    setQuestions(list);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [item]);

  const currentQ = questions[currentIndex];

  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered || !currentQ) return;
    
    setSelectedOption(optIndex);
    setIsAnswered(true);

    const isCorrect = optIndex === currentQ.correctIndex;
    if (isCorrect) {
      sound.playQuizCorrect();
      setScore(prev => prev + currentQ.points);
    } else {
      sound.playQuizWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalEarned = score + (selectedOption === currentQ.correctIndex ? currentQ.points : 0);
      onAwardPoints(totalEarned, `Mock Test: ${item.code} ${item.title}`);
      sound.playVictory();
      triggerConfettiCelebration();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const languages: Array<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'tngl', label: 'Tanglish' }
  ];

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center border border-[#e5e4de] shadow-xl">
          <p className="font-serif text-lg font-bold text-[#161c27]">Generating AI Mock Quiz Questions...</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#e5e4de] shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-[#fbfbf9] px-5 sm:px-6 py-4 border-b border-[#e5e4de] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eaf4f0] border border-[#cbe5d8] text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">quiz</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[10.5px] uppercase font-bold text-primary tracking-wider">
                  Academic Mock Examination
                </span>
                <span className="font-mono text-xs font-bold text-secondary">
                  {item.code}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#161c27] truncate max-w-md">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-8 h-8 rounded-lg border border-[#e5e4de] bg-white hover:bg-[#f5f4ef] text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {!isFinished ? (
            <>
              {/* Question Progress & Points Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-label-sm text-on-surface-variant">
                  Question <strong className="text-[#161c27] font-serif text-sm">{currentIndex + 1}</strong> of {questions.length}
                </span>
                <div className="flex items-center gap-1.5 bg-[#eaf4f0] border border-[#cbe5d8] px-2.5 py-1 rounded-full text-primary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">military_tech</span>
                  <span>+{currentQ.points} CP available</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#f0eee6] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] space-y-2">
                <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-[#fff3ed] px-2 py-0.5 rounded border border-[#ffd5c4]">
                  {currentQ.topicTitle}
                </span>
                <p className="font-serif text-base sm:text-lg font-semibold text-[#161c27] leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Answer Choices */}
              <div className="space-y-2.5">
                {currentQ.options.map((optionText, optIdx) => {
                  let buttonStyle = 'bg-white border-[#e5e4de] hover:border-primary/40 text-[#161c27]';
                  let icon = null;

                  if (isAnswered) {
                    if (optIdx === currentQ.correctIndex) {
                      buttonStyle = 'bg-[#f0f7f4] border-[#91beac] text-primary font-bold shadow-xs';
                      icon = <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>;
                    } else if (optIdx === selectedOption) {
                      buttonStyle = 'bg-[#fff0ed] border-[#ffb59c] text-secondary';
                      icon = <span className="material-symbols-outlined text-secondary text-[18px]">cancel</span>;
                    } else {
                      buttonStyle = 'bg-white border-[#e5e4de] opacity-50 text-on-surface-variant';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-[#f5f4ef] border border-[#e6e5dd] flex items-center justify-center font-bold text-xs text-on-surface-variant shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-sans leading-relaxed">{optionText}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation Card */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-serif text-xs font-bold text-[#161c27] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">school</span>
                      Socratic Explanation:
                    </span>

                    {/* Language selector */}
                    <div className="flex items-center gap-1">
                      {languages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { setExplanationLang(l.code); sound.playClick(); }}
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all ${
                            explanationLang === l.code
                              ? 'bg-primary text-white'
                              : 'bg-white text-on-surface-variant border border-[#e5e4de]'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="font-serif text-xs sm:text-sm text-[#161c27] leading-relaxed">
                    {currentQ.explanation[explanationLang] || currentQ.explanation.en}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-2 shadow-xs hover:bg-[#1a4b3b] transition-colors"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete & View Score'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="text-center space-y-6 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-[#eaf4f0] border border-[#cbe5d8] text-primary flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-[36px]">military_tech</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-[#161c27]">
                  Examination Complete!
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  You tested your mastery of <strong className="text-[#161c27]">{item.title}</strong>
                </p>
              </div>

              {/* Score Box */}
              <div className="max-w-xs mx-auto p-4 rounded-xl bg-[#fbfbf9] border border-[#e8e7df] space-y-2">
                <span className="font-label-sm text-[10.5px] uppercase font-bold text-on-surface-variant">
                  Study Credit Points Awarded
                </span>
                <div className="font-serif text-4xl font-bold text-primary flex items-center justify-center gap-1.5">
                  <span>+{score}</span>
                  <span className="font-sans text-sm text-secondary">CP</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#e5e4de] bg-white text-[#161c27] text-xs font-semibold hover:bg-[#f5f4ef] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Retake Quiz</span>
                </button>

                <button
                  onClick={() => { onClose(); onGoToRewards(); }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-[#85371b] flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">card_giftcard</span>
                  <span>Spend in Rewards Commissary</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
