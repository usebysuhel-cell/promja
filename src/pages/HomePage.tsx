import React, { useState, useEffect } from 'react';
import { Prompt, PromptCategory } from '../types/prompt';
import { promptService } from '../services/promptService';
import { PromptCard } from '../components/common/PromptCard';
import { AdSlot } from '../components/common/AdSlot';
import { BRAND } from '../config/branding';
import { Search, Sparkles, Flame, ArrowRight, Instagram, Compass, Star, Clock } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onViewPrompt: (id: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onViewPrompt,
  onOpenSearch,
}) => {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([]);
  const [latestPrompts, setLatestPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<{ category: PromptCategory; count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [allFeatured, allTrending, allLatest, cats] = await Promise.all([
        promptService.getAllPrompts({ featuredOnly: true }),
        promptService.getAllPrompts({ trendingOnly: true }),
        promptService.getAllPrompts({ sortBy: 'latest' }),
        promptService.getCategories(),
      ]);

      setFeaturedPrompts(allFeatured.slice(0, 4));
      setTrendingPrompts(allTrending.slice(0, 4));
      setLatestPrompts(allLatest.slice(0, 6));
      setCategories(cats);
    };

    loadData();
    return promptService.subscribe(loadData);
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onOpenSearch();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-purple-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Prompt Engineering Library</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="block text-white tracking-widest">{BRAND.brandName}</span>
            <span className="gradient-text block text-3xl sm:text-5xl lg:text-6xl mt-2 font-black">
              {BRAND.tagline}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mb-8">
            {BRAND.subtitle}
          </p>

          {/* Interactive Search Bar in Hero */}
          <div className="max-w-xl mx-auto mb-8">
            <form onSubmit={handleHeroSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-neutral-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Midjourney, Flux, Sora, anime, portraits..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-[#12131e]/90 border border-white/10 hover:border-purple-500/40 focus:border-purple-500 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xl shadow-black/50"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-600/30"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('/library')}
              className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm sm:text-base transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Prompts</span>
            </button>

            <a
              href={BRAND.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-200 hover:text-white border border-white/10 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Follow {BRAND.social.instagram.handle}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modular Ad Slot: Home Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot slotId="AD_SLOT_HOME" />
      </div>

      {/* Featured Prompts Section */}
      {featuredPrompts.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>Hand-Picked Gems</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Prompts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/library')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onViewPrompt={onViewPrompt}
                onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
                onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Categories Grid */}
      <section className="py-12 border-y border-white/[0.06] bg-[#0c0d15]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Explore specialized styles curated for digital artists, filmmakers, and concept creators.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.slice(0, 12).map(({ category, count }) => (
              <button
                key={category}
                onClick={() => onNavigate(`/category/${encodeURIComponent(category)}`)}
                className="group p-4 rounded-2xl bg-[#12131d] border border-white/[0.06] hover:border-purple-500/40 text-left transition-all hover:bg-white/[0.04]"
              >
                <p className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                  {category}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {count} {count === 1 ? 'prompt' : 'prompts'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Prompts Section */}
      {trendingPrompts.length > 0 && (
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-rose-400" />
                <span>Most Copied & Shared</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Trending Right Now
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/trending')}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>See Trending Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onViewPrompt={onViewPrompt}
                onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
                onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Prompts Section */}
      <section className="py-14 border-t border-white/[0.06] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Fresh Additions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Latest Additions
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/library')}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Browse Full Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onViewPrompt={onViewPrompt}
              onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
              onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
            />
          ))}
        </div>
      </section>

      {/* Community / Instagram Banner */}
      <section className="my-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#131422] to-pink-900/20 border border-purple-500/20 text-center overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-500/20">
              <Instagram className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Join the Creative Stream
            </h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Follow our official social hub on Instagram for daily AI visual experiments, prompt breakdown breakdowns, and new model releases.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href={BRAND.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <span>Follow {BRAND.social.instagram.handle}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
