export type SubjectDomain = 
  | 'Computer Science'
  | 'Data Science & AI'
  | 'Mathematics'
  | 'Electronics'
  | 'Software Engineering'
  | 'Biotech & Science';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'tngl';

export type DifficultyLevel = 'Foundation' | 'Intermediate' | 'Advanced';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  durationMinutes: number;
  completed: boolean;
  keyPoints: string[];
  simplifiedExplanation: {
    en: string;
    ta: string;
    hi: string;
    tngl: string;
  };
  examTip?: string;
}

export interface CatalogueItem {
  id: string;
  code: string;
  title: string;
  domain: SubjectDomain;
  languages: LanguageCode[];
  difficulty: DifficultyLevel;
  chaptersCount: number;
  estimatedMinutes: number;
  aiSimplifiedVersion: string;
  isAiSimplified: boolean;
  examProbability: 'High' | 'Medium' | 'Essential';
  lastStudiedDate: string;
  progressPercent: number;
  tags: string[];
  summary: {
    en: string;
    ta: string;
    hi: string;
    tngl: string;
  };
  jargonBreakdown: Array<{
    term: string;
    formalDefinition: string;
    simplifiedAnalogy: string;
  }>;
  chapters: Chapter[];
  highYieldFormulas: Array<{
    title: string;
    formula: string;
    meaning: string;
  }>;
}

export interface MockQuestion {
  id: string;
  catalogueId: string;
  topicTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: {
    en: string;
    ta: string;
    hi: string;
    tngl: string;
  };
  keyTakeaway: string;
  points: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  language: LanguageCode;
  timestamp: string;
  suggestedFollowUps?: string[];
  relatedCatalogueCode?: string;
}

export interface FocusSessionLog {
  id: string;
  catalogueId: string;
  subjectTitle: string;
  plannedMinutes: number;
  actualFocusMinutes: number;
  interruptionMinutes: number;
  callCount: number;
  callExtensionMinutes: number;
  completedAt: string;
  pointsEarned: number;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: 'Passes' | 'Perks' | 'Tools' | 'Themes';
  icon: string;
  description: string;
  badge?: string;
  durationMinutes?: number;
  unlocked: boolean;
  expiresAt?: string;
}

export interface RewardTransaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  title: string;
  timestamp: string;
  source: 'Mock Test' | 'Focus Session' | 'Streak Bonus' | 'Reward Store';
}
