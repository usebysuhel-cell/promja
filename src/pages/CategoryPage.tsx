import React, { useState, useEffect } from 'react';
import { Prompt, PromptCategory } from '../types/prompt';
import { promptService } from '../services/promptService';
import { PromptCard } from '../components/common/PromptCard';
import { ALL_CATEGORIES } from '../components/common/CategoryPills';
import { ArrowLeft, Layers, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  categoryName: string;
  onNavigate: (path: string) => void;
  onViewPrompt: (id: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryName,
  onNavigate,
  onViewPrompt,
}) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'latest' | 'copies'>('trending');

  const normalizedCategory = decodeURIComponent(categoryName);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const items = await promptService.getAllPrompts({
        category: normalizedCategory as PromptCategory,
        sortBy,
        publishedOnly: true,
      });
      setPrompts(items);
      setLoading(false);
    };

    fetchPrompts();
  }, [normalizedCategory, sortBy]);

  const categoryDescriptions: Record<string, string> = {
    'Cinematic': 'Dynamic camera perspectives, anamorphic lighting, and film-still aesthetics engineered for Midjourney and video generators.',
    'Product': 'High-end commercial studio staging, luxury textures, crisp depth-of-field, and professional advertising lighting.',
    'Fashion': 'Avant-garde runway styling, editorial poses, fluid fabrics, and magazine-quality photography prompts.',
    'Portrait': 'Intimate close-ups, skin pores, expressive eyes, documentary lighting, and photorealistic human features.',
    'Architecture': 'Monolithic concrete, brutalism, organic modernism, tilt-shift angles, and atmospheric interior design.',
    'AI Video': 'Cinematic camera moves, continuous camera glides, speed ramps, and frame stabilization prompts for Sora & Runway.',
    'Photography': 'Analog 35mm grain, Kodachrome vintage palettes, street photography, and natural golden hour lighting.',
    'Anime': 'Makoto Shinkai clouds, Ghibli gouache aesthetics, Studio Trigger action framing, and stylized cel shading.',
    'Aesthetic': 'Bioluminescence, neon minimalism, ambient abstracts, vaporwave, and serene composition templates.',
    'AI Images': 'All-purpose conceptual image generation prompts across fantasy, surrealism, and concept design.',
  };

  const description =
    categoryDescriptions[normalizedCategory] ||
    `Curated collection of high quality AI prompts for ${normalizedCategory}.`;

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/categories')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>All Categories</span>
      </button>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            {normalizedCategory}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <span className="text-xs text-neutral-400">
            <strong>{prompts.length}</strong> {prompts.length === 1 ? 'prompt' : 'prompts'}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12131e] border border-white/10 text-xs text-neutral-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="trending" className="bg-[#12131e]">Trending</option>
              <option value="copies" className="bg-[#12131e]">Most Copied</option>
              <option value="popular" className="bg-[#12131e]">Most Viewed</option>
              <option value="latest" className="bg-[#12131e]">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl bg-neutral-900/60" />
          ))}
        </div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onViewPrompt={onViewPrompt}
              onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
              onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center max-w-md mx-auto">
          <p className="text-base font-semibold text-white">
            No prompts found in {normalizedCategory}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Check other categories or explore the full prompt library.
          </p>
          <button
            onClick={() => onNavigate('/library')}
            className="mt-5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500"
          >
            Explore Library
          </button>
        </div>
      )}

      {/* Quick category switch pills at bottom */}
      <div className="mt-16 pt-8 border-t border-white/[0.08]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
          Other Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.filter(
            (c) => c !== 'All' && c.toLowerCase() !== normalizedCategory.toLowerCase()
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigate(`/category/${encodeURIComponent(cat)}`)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
