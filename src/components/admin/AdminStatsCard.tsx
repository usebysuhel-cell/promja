import React from 'react';
import { PromptStats } from '../../types/prompt';
import { Layers, Eye, Copy, CheckCircle, Star, Flame } from 'lucide-react';

interface AdminStatsCardProps {
  stats: PromptStats;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Prompts',
      value: stats.totalPrompts.toLocaleString(),
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Copies',
      value: stats.totalCopies.toLocaleString(),
      icon: Copy,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Published',
      value: stats.publishedPrompts.toLocaleString(),
      icon: CheckCircle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Featured',
      value: stats.featuredPrompts.toLocaleString(),
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Trending',
      value: stats.trendingPrompts.toLocaleString(),
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-4 rounded-xl bg-[#11121c] border border-white/[0.07] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
