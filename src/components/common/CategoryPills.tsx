import React from 'react';
import { PromptCategory } from '../../types/prompt';

export const ALL_CATEGORIES: PromptCategory[] = [
  'All',
  'AI Images',
  'AI Video',
  'Portrait',
  'Fashion',
  'Cinematic',
  'Aesthetic',
  'Photography',
  'Product',
  'Architecture',
  'Anime',
  'Other',
];

interface CategoryPillsProps {
  selectedCategory: PromptCategory | string;
  onSelectCategory: (category: PromptCategory) => void;
  className?: string;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar ${className}`}
      role="tablist"
      aria-label="Filter by category"
    >
      {ALL_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              isSelected
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
