import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { CatalogueView } from './components/CatalogueView';
import { CatalogueDetail } from './components/CatalogueDetail';
import { FocusLockView } from './components/FocusLockView';
import { MultilingualChatbot } from './components/MultilingualChatbot';
import { RewardsStore } from './components/RewardsStore';
import { MockTestModal } from './components/MockTestModal';
import { UploadModal } from './components/UploadModal';
import { BottomNav } from './components/BottomNav';

import { INITIAL_CATALOGUE } from './data/mockCatalogue';
import { INITIAL_REWARDS, INITIAL_TRANSACTIONS } from './data/rewardsData';
import { MOCK_TESTS_DATABASE } from './data/mockTests';
import type { CatalogueItem, FocusSessionLog, RewardItem, RewardTransaction, MockQuestion } from './types';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'catalogue' | 'focus' | 'assistant' | 'rewards'>('home');
  const [selectedDetailItem, setSelectedDetailItem] = useState<CatalogueItem | null>(null);

  // App Data State (with localStorage persistence)
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>(() => {
    const saved = localStorage.getItem('hackverse_catalogue');
    return saved ? JSON.parse(saved) : INITIAL_CATALOGUE;
  });

  const [creditPoints, setCreditPoints] = useState<number>(() => {
    const saved = localStorage.getItem('hackverse_credits');
    return saved ? parseInt(saved, 10) : 480;
  });

  const [streakDays] = useState<number>(() => {
    const saved = localStorage.getItem('hackverse_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('hackverse_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [transactions, setTransactions] = useState<RewardTransaction[]>(() => {
    const saved = localStorage.getItem('hackverse_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Modal & Focus States
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [chatTopic, setChatTopic] = useState<string>('CS-402: Distributed Consensus & Raft');
  const [mockTestSubject, setMockTestSubject] = useState<CatalogueItem | null>(null);
  const [focusSubject, setFocusSubject] = useState<CatalogueItem | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [isFocusLocked, setIsFocusLocked] = useState<boolean>(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hackverse_catalogue', JSON.stringify(catalogueItems));
  }, [catalogueItems]);

  useEffect(() => {
    localStorage.setItem('hackverse_credits', creditPoints.toString());
  }, [creditPoints]);

  useEffect(() => {
    localStorage.setItem('hackverse_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('hackverse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Award points handler
  const handleAwardPoints = (pts: number, reason: string) => {
    setCreditPoints(prev => prev + pts);
    const newTx: RewardTransaction = {
      id: `tx-${Date.now()}`,
      type: 'earn',
      amount: pts,
      title: reason,
      timestamp: 'Just now',
      source: reason.includes('Mock Test') ? 'Mock Test' : 'Focus Session'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Redeem reward handler
  const handleRedeemReward = (reward: RewardItem) => {
    if (creditPoints < reward.cost) return;

    setCreditPoints(prev => prev - reward.cost);
    setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, unlocked: true } : r));

    const newTx: RewardTransaction = {
      id: `tx-${Date.now()}`,
      type: 'redeem',
      amount: reward.cost,
      title: `Redeemed: ${reward.title}`,
      timestamp: 'Just now',
      source: 'Reward Store'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Add newly uploaded catalogue item + optional AI mock questions
  const handleAddCatalogueItem = (newItem: CatalogueItem, mockQuestions?: MockQuestion[]) => {
    setCatalogueItems(prev => [newItem, ...prev]);
    if (mockQuestions && mockQuestions.length > 0) {
      MOCK_TESTS_DATABASE[newItem.id] = mockQuestions;
    }
    setSelectedDetailItem(newItem);
    setActiveTab('catalogue');
    handleAwardPoints(30, `Ingested: ${newItem.title}`);
  };

  // Toggle chapter completion
  const handleToggleChapter = (itemId: string, chapterId: string) => {
    setCatalogueItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const updatedChapters = item.chapters.map(ch => 
        ch.id === chapterId ? { ...ch, completed: !ch.completed } : ch
      );
      const completedCount = updatedChapters.filter(c => c.completed).length;
      const progressPercent = Math.round((completedCount / updatedChapters.length) * 100);
      
      const updatedItem = {
        ...item,
        chapters: updatedChapters,
        progressPercent
      };

      if (selectedDetailItem?.id === itemId) {
        setSelectedDetailItem(updatedItem);
      }

      return updatedItem;
    }));
  };

  // Navigation handlers
  const handleStartFocusFromItem = (item: CatalogueItem) => {
    setFocusSubject(item);
    setActiveTab('focus');
  };

  const handleStartMockTestFromItem = (item: CatalogueItem) => {
    setMockTestSubject(item);
  };

  const handleOpenChatWithTopic = (topic: string) => {
    setChatTopic(topic);
    setActiveTab('assistant');
  };

  const handleFocusSessionComplete = (log: FocusSessionLog) => {
    handleAwardPoints(log.pointsEarned, `Focus Session: ${log.subjectTitle} (${log.plannedMinutes}m)`);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#161c27] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDetailItem(null);
          setActiveTab(tab);
        }}
        creditPoints={creditPoints}
        streakDays={streakDays}
        onOpenUpload={() => setIsUploadOpen(true)}
        isAmbientPlaying={isAmbientPlaying}
        setIsAmbientPlaying={setIsAmbientPlaying}
      />

      {/* Main Scholastic Content Desk */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        
        {/* TAB 1: Home Reading Desk */}
        {activeTab === 'home' && (
          <HomeDashboard
            catalogueItems={catalogueItems}
            onSelectSubject={(item) => {
              setSelectedDetailItem(item);
              setActiveTab('catalogue');
            }}
            onStartFocus={(item) => {
              setFocusSubject(item);
              setActiveTab('focus');
            }}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenAssistant={() => setActiveTab('assistant')}
            onStartQuiz={(item) => {
              setMockTestSubject(item);
            }}
          />
        )}

        {/* TAB 2: Study Catalogue */}
        {activeTab === 'catalogue' && (
          selectedDetailItem ? (
            <CatalogueDetail
              item={selectedDetailItem}
              onBack={() => setSelectedDetailItem(null)}
              onStartFocus={handleStartFocusFromItem}
              onStartMockTest={handleStartMockTestFromItem}
              onOpenChatWithTopic={handleOpenChatWithTopic}
              onToggleChapterComplete={handleToggleChapter}
            />
          ) : (
            <CatalogueView
              items={catalogueItems}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              onStartFocus={handleStartFocusFromItem}
              onStartMockTest={handleStartMockTestFromItem}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )
        )}

        {/* TAB 3: Bodleian Focus Lock Suite */}
        {activeTab === 'focus' && (
          <FocusLockView
            catalogueItems={catalogueItems}
            selectedItem={focusSubject || catalogueItems[0]}
            onSessionComplete={handleFocusSessionComplete}
            onLaunchMockTest={(item) => setMockTestSubject(item)}
            isFocusLocked={isFocusLocked}
            setIsFocusLocked={setIsFocusLocked}
            isAmbientPlaying={isAmbientPlaying}
            setIsAmbientPlaying={setIsAmbientPlaying}
          />
        )}

        {/* TAB 4: Multilingual Study Assistant */}
        {activeTab === 'assistant' && (
          <MultilingualChatbot
            initialTopic={chatTopic}
            onEarnCredits={(amount) => handleAwardPoints(amount, 'Socratic Q&A Contribution')}
            onStartQuiz={(courseTitle) => {
              const matched = catalogueItems.find(i => i.title.toLowerCase().includes(courseTitle.toLowerCase()) || courseTitle.toLowerCase().includes(i.title.toLowerCase())) || catalogueItems[0];
              setMockTestSubject(matched);
            }}
          />
        )}

        {/* TAB 5: Scholar Reward Commissary */}
        {activeTab === 'rewards' && (
          <RewardsStore
            creditPoints={creditPoints}
            streakDays={streakDays}
            rewards={rewards}
            transactions={transactions}
            onRedeemReward={handleRedeemReward}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedDetailItem(null);
          setActiveTab(tab);
        }}
      />

      {/* Ingest Syllabus / PPT Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddCatalogueItem={handleAddCatalogueItem}
      />

      {/* Auto Mock Test Modal */}
      {mockTestSubject && (
        <MockTestModal
          item={mockTestSubject}
          onClose={() => setMockTestSubject(null)}
          onAwardPoints={handleAwardPoints}
          onGoToRewards={() => {
            setSelectedDetailItem(null);
            setActiveTab('rewards');
          }}
        />
      )}

      {/* Academic Footer */}
      <footer className="border-t border-[#e5e4de] bg-[#fbfbf9] py-6 text-center text-xs text-on-surface-variant hidden md:block">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#161c27]">Smart Study Planner</span>
            <span>•</span>
            <span>HACK VERSE 2.0</span>
          </div>
          <p className="font-label-sm text-[11px] text-outline">
            Focus • Understand • Test • Reward — Bodleian Academic Light Edition
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
