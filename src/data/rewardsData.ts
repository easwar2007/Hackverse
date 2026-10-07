import type { RewardItem, RewardTransaction } from '../types';

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: '30-Min Guilt-Free Social Media Pass',
    cost: 150,
    category: 'Passes',
    icon: 'InstagramLogo',
    description: 'Unlocked temporary pass with a live timer to check Instagram, YouTube, or Reddit without breaking your focus streak.',
    badge: 'Popular',
    durationMinutes: 30,
    unlocked: false
  },
  {
    id: 'rew-2',
    title: 'Campus Coffee & Snack Voucher',
    cost: 300,
    category: 'Perks',
    icon: 'Coffee',
    description: 'Redeemable for a complimentary double-espresso or energizing study snack at participating university cafes.',
    badge: 'Real Perk',
    unlocked: false
  },
  {
    id: 'rew-3',
    title: 'AI Exam Master Cheat-Sheet Generator',
    cost: 120,
    category: 'Tools',
    icon: 'FileText',
    description: 'One-click high-yield printable 1-page formula and mnemonic sheet generated from any catalogue topic.',
    badge: 'Instant',
    unlocked: true
  },
  {
    id: 'rew-4',
    title: 'Cyberpunk Neon Dark Mode Theme',
    cost: 200,
    category: 'Themes',
    icon: 'Sparkle',
    description: 'High-contrast emerald & electric amber visual palette for midnight study sessions.',
    unlocked: false
  },
  {
    id: 'rew-5',
    title: 'Binaural 40Hz Gamma Focus Audio Pack',
    cost: 180,
    category: 'Tools',
    icon: 'Headphones',
    description: 'High-fidelity acoustic wave audio track designed by neuroscientists for rapid flow-state induction.',
    unlocked: true
  },
  {
    id: 'rew-6',
    title: '1-Hour Priority Focus Shield Pass',
    cost: 250,
    category: 'Passes',
    icon: 'ShieldCheck',
    description: 'Double credit multiplier on your next 60-minute Focus Lock session with automatic call guardian logging.',
    badge: '2x Multiplier',
    durationMinutes: 60,
    unlocked: false
  }
];

export const INITIAL_TRANSACTIONS: RewardTransaction[] = [
  {
    id: 'tx-1',
    type: 'earn',
    amount: 100,
    title: 'Perfect Score: CS-302 Virtual Memory Quiz',
    timestamp: '2 hours ago',
    source: 'Mock Test'
  },
  {
    id: 'tx-2',
    type: 'earn',
    amount: 50,
    title: '25-Min Deep Focus Lock Session Completed',
    timestamp: 'Yesterday',
    source: 'Focus Session'
  },
  {
    id: 'tx-3',
    type: 'earn',
    amount: 150,
    title: '5-Day Continuous Study Streak Milestone',
    timestamp: '2 days ago',
    source: 'Streak Bonus'
  }
];

export function getScholarTier(points: number): {
  tierName: string;
  badge: string;
  nextTierPoints: number;
  progress: number;
} {
  if (points < 250) {
    return {
      tierName: 'Novice Scholar',
      badge: '🥉 Bronze',
      nextTierPoints: 250,
      progress: Math.min(100, (points / 250) * 100)
    };
  } else if (points < 600) {
    return {
      tierName: 'Focus Adept',
      badge: '🥈 Silver',
      nextTierPoints: 600,
      progress: Math.min(100, ((points - 250) / 350) * 100)
    };
  } else if (points < 1200) {
    return {
      tierName: 'Master Scholar',
      badge: '🥇 Gold',
      nextTierPoints: 1200,
      progress: Math.min(100, ((points - 600) / 600) * 100)
    };
  } else {
    return {
      tierName: 'Academic Titan',
      badge: '💎 Diamond',
      nextTierPoints: 2500,
      progress: 100
    };
  }
}
