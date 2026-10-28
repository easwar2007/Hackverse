import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { RewardItem, RewardTransaction } from '../types';
import { getScholarTier } from '../data/rewardsData';
import { sound } from '../utils/audio';

interface RewardsStoreProps {
  creditPoints: number;
  streakDays: number;
  rewards: RewardItem[];
  transactions: RewardTransaction[];
  onRedeemReward: (reward: RewardItem) => void;
}

export const RewardsStore: React.FC<RewardsStoreProps> = ({
  creditPoints,
  streakDays,
  rewards,
  transactions,
  onRedeemReward
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSocialPassTimer, setActiveSocialPassTimer] = useState<number | null>(null);
  const [claimMessage, setClaimMessage] = useState('');

  const tier = getScholarTier(creditPoints);

  // Social pass countdown
  useEffect(() => {
    let interval: number | null = null;
    if (activeSocialPassTimer !== null && activeSocialPassTimer > 0) {
      interval = window.setInterval(() => {
        setActiveSocialPassTimer(prev => (prev && prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSocialPassTimer]);

  const handleClaim = (reward: RewardItem) => {
    if (creditPoints < reward.cost) {
      setClaimMessage(`You need ${reward.cost - creditPoints} more CP to redeem ${reward.title}. Complete a focus session or mock quiz to earn more.`);
      return;
    }

    setClaimMessage(`${reward.title} redeemed.`);
    sound.playReward();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    onRedeemReward(reward);

    if (reward.id === 'rew-1') {
      setActiveSocialPassTimer(30 * 60);
    }
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'InstagramLogo': return 'public';
      case 'Coffee': return 'local_cafe';
      case 'FileText': return 'menu_book';
      case 'Headphones': return 'headphones';
      case 'ShieldCheck': return 'verified_user';
      default: return 'card_giftcard';
    }
  };

  const categories = ['All', 'Passes', 'Perks', 'Tools', 'Themes'];

  const filteredRewards = rewards.filter(r => 
    selectedCategory === 'All' || r.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Top Banner: Credit Balance & Scholar Tier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Points Tile */}
        <div className="rounded-2xl border border-[#e5e4de] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">
              Available Credit Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eaf4f0] border border-[#cbe5d8] text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
          </div>

          <div>
            <div className="font-serif text-4xl sm:text-5xl font-bold text-[#161c27] flex items-baseline gap-2">
              <span>{creditPoints}</span>
              <span className="font-sans text-sm font-bold text-secondary">CP</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant pt-1.5 leading-relaxed">
              Earned via Bodleian Focus Sessions and high-score Mock Quiz evaluations.
            </p>
          </div>

          <div className="rounded-lg bg-[#fbfbf9] p-2.5 text-[11.5px] text-primary font-medium flex items-center justify-between border border-[#e5e4de]">
            <span>Next milestone bonus:</span>
            <strong className="font-semibold">+100 CP at 1,000 CP</strong>
          </div>
        </div>

        {/* Scholar Tier Card */}
        <div className="rounded-2xl border border-[#e5e4de] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 md:col-span-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">military_tech</span>
              <span className="font-serif text-lg font-bold text-[#161c27]">
                Scholar Cadence Tier:
              </span>
              <span className="rounded-md bg-[#fff3ed] px-2.5 py-0.5 text-xs font-bold text-secondary border border-[#ffd5c4]">
                {tier.badge} {tier.tierName}
              </span>
            </div>
            <span className="font-label-sm text-xs text-on-surface-variant font-mono">
              {creditPoints} / {tier.nextTierPoints} CP
            </span>
          </div>

          {/* Tier Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#f0eee6] rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary via-[#234e40] to-secondary h-2.5 rounded-full transition-all duration-700" 
                style={{ width: `${tier.progress}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-on-surface-variant font-label-sm">
              <span>Novice (0)</span>
              <span>Adept (250)</span>
              <span>Master (600)</span>
              <span>Titan (1200+)</span>
            </div>
          </div>

          {/* 7-Day Streak Row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#f0eee6] text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">local_fire_department</span>
              <span className="font-semibold text-[#161c27]">{streakDays}-Day Focus Record</span>
            </div>
            <div className="flex items-center gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <span 
                  key={day} 
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all ${
                    idx < streakDays 
                      ? 'bg-secondary text-white shadow-xs' 
                      : 'bg-[#f0eee6] text-on-surface-variant'
                  }`}
                  title={`${day}: ${idx < streakDays ? 'Day streak active' : 'Upcoming'}`}
                >
                  {day[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Active Social Pass Alert */}
      {activeSocialPassTimer !== null && activeSocialPassTimer > 0 && (
        <div className="rounded-2xl border border-[#ffd5c4] bg-[#fff6f2] p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">public</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold text-[#161c27]">
                  30-Minute Guilt-Free Social Pass Active!
                </span>
                <span className="rounded-full bg-[#ffdbd0] px-2 py-0.5 text-[10px] font-bold text-[#742505]">
                  Unlocked
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                You earned this break through focused reading. Enjoy browsing without disrupting your streak record.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold block">Remaining</span>
            <span className="font-mono text-xl font-bold text-secondary">
              {Math.floor(activeSocialPassTimer / 60)}:{(activeSocialPassTimer % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Redemption Store Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#161c27] flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">card_giftcard</span>
              Scholar Reward Commissary
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Exchange your verified study credits for study passes, ambient audio presets, and academic aids.
            </p>
          </div>
          {claimMessage && <p role="status" className="rounded-lg bg-[#f0f7f4] px-3 py-2 text-xs text-primary">{claimMessage}</p>}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e5e4de] shadow-xs self-start sm:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); sound.playClick(); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#f5f4ef]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Reward Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map(reward => {
            const canAfford = creditPoints >= reward.cost;

            return (
              <div
                key={reward.id}
                className="rounded-2xl border border-[#e5e4de] bg-white p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f4ef] border border-[#e6e5dd] flex items-center justify-center text-primary group-hover:bg-[#eaf4f0] transition-colors">
                      <span className="material-symbols-outlined text-[22px]">
                        {getRewardIcon(reward.icon)}
                      </span>
                    </div>
                    <span className="font-label-sm rounded-full bg-[#f5f4ef] border border-[#e6e5dd] px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {reward.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#161c27] group-hover:text-primary transition-colors">
                      {reward.title}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant pt-1 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0eee6] flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-xl font-bold text-[#161c27]">{reward.cost}</span>
                    <span className="font-label-sm text-[11px] font-bold text-secondary">CP</span>
                  </div>

                  <button
                    onClick={() => handleClaim(reward)}
                    disabled={reward.unlocked && reward.category !== 'Passes'}
                    className={`px-3.5 py-1.5 rounded-xl font-label-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      reward.unlocked && reward.category !== 'Passes'
                        ? 'bg-[#f0eee6] text-on-surface-variant cursor-not-allowed'
                        : canAfford
                        ? 'bg-primary text-white hover:bg-[#1c4d3d] shadow-xs'
                        : 'bg-[#f5f4ef] text-on-surface-variant hover:bg-[#e8e7df]'
                    }`}
                  >
                    {reward.unlocked && reward.category !== 'Passes' ? (
                      <>
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Acquired</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">redeem</span>
                        <span>{canAfford ? 'Redeem' : 'Need CP'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Ledger */}
      {transactions.length > 0 && (
        <div className="bg-white border border-[#e5e4de] rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#161c27] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
            Recent Reward Archival Ledger
          </h3>
          <div className="divide-y divide-[#f0eee6]">
            {transactions.slice(-4).reverse().map(t => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">receipt_long</span>
                  <span className="font-medium text-[#161c27]">{t.title}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="font-mono text-secondary font-bold">-{t.amount} CP</span>
                  <span className="font-label-sm text-[10.5px]">{t.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
