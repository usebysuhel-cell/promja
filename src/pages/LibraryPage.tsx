import React, { useState, useEffect, useMemo } from 'react';
import { Prompt, PromptCategory, AIModel } from '../types/prompt';
import { promptService } from '../services/promptService';
import { PromptCard } from '../components/common/PromptCard';
import { CategoryPills } from '../components/common/CategoryPills';
import { AdSlot } from '../components/common/AdSlot';
import { getActiveAITools } from '../config/aiTools';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface LibraryPageProps {
  initialCategory?: PromptCategory | 'All';
  initialModel?: AIModel | 'All';
  onViewPrompt: (id: string) => void;
  onNavigate: (path: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  initialCategory = 'All',
  initialModel = 'All',
  onViewPrompt,
  onNavigate,
}) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'All'>(
    initialCategory
  );
  const [selectedModel, setSelectedModel] = useState<AIModel | 'All'>(
    initialModel
  );
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'popular' | 'copies'>('trending');
  const [filterSearch, setFilterSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const items = await promptService.getAllPrompts({
        publishedOnly: true,
      });
      setPrompts(items);
      setLoading(false);
    };

    fetchPrompts();
    return promptService.subscribe(fetchPrompts);
  }, []);

  const activeTools = getActiveAITools();

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Model filter
      if (selectedModel !== 'All') {
        const targetModel = selectedModel.toLowerCase();
        const promptModel = (p.aiModel || '').toLowerCase();
        if (!promptModel.includes(targetModel) && !targetModel.includes(promptModel)) {
          return false;
        }
      }
      // Text search filter
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.aiModel.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') {
        if (a.trending !== b.trending) return a.trending ? -1 : 1;
        return b.copies + b.views - (a.copies + a.views);
      }
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'copies') return b.copies - a.copies;
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [prompts, selectedCategory, selectedModel, filterSearch, sortBy]);

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Curated Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          AI Prompt Library
        </h1>
        <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
          Browse, filter, and instantly copy battle-tested prompts engineered for photorealism, cinematic styles, and generative video.
        </p>
      </div>

      {/* Ad slot at top of library */}
      <AdSlot slotId="AD_SLOT_LIBRARY" />

      {/* Search & Filter Toolbar */}
      <div className="mb-6 space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Filter by keyword, style, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12131e] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Model Select */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as AIModel | 'All')}
              className="px-3 py-2.5 rounded-xl bg-[#12131e] border border-white/10 text-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 max-w-[160px] sm:max-w-none truncate"
              aria-label="Filter by AI model"
            >
              <option value="All">All Models</option>
              <optgroup label="Image Models">
                {activeTools
                  .filter((t) => t.category === 'Image')
                  .map((tool) => (
                    <option key={tool.id} value={tool.name}>
                      {tool.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Video Models">
                {activeTools
                  .filter((t) => t.category === 'Video')
                  .map((tool) => (
                    <option key={tool.id} value={tool.name}>
                      {tool.name}
                    </option>
                  ))}
              </optgroup>
            </select>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#12131e] border border-white/10 text-xs sm:text-sm text-neutral-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-neutral-200 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
                aria-label="Sort prompts"
              >
                <option value="trending" className="bg-[#12131e]">Trending</option>
                <option value="copies" className="bg-[#12131e]">Most Copied</option>
                <option value="popular" className="bg-[#12131e]">Most Viewed</option>
                <option value="latest" className="bg-[#12131e]">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-6 pb-3 border-b border-white/[0.06]">
        <span>
          Showing <strong className="text-white font-semibold">{filteredPrompts.length}</strong>{' '}
          {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          {selectedModel !== 'All' && <span> for <strong>{selectedModel}</strong></span>}
        </span>

        {(selectedCategory !== 'All' || selectedModel !== 'All' || filterSearch) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedModel('All');
              setFilterSearch('');
            }}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl bg-neutral-900/60" />
          ))}
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onViewPrompt={onViewPrompt}
              onCategoryClick={(cat) => setSelectedCategory(cat as PromptCategory)}
              onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No matching prompts found</h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Try choosing a different category, clearing your search query, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedModel('All');
              setFilterSearch('');
            }}
            className="mt-5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
          >
            View All Prompts
          </button>
        </div>
      )}
    </div>
  );
};
