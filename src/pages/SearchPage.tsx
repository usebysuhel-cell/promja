import React, { useState, useEffect } from 'react';
import { Prompt } from '../types/prompt';
import { promptService } from '../services/promptService';
import { PromptCard } from '../components/common/PromptCard';
import { getActiveAITools } from '../config/aiTools';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
  onViewPrompt: (id: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onNavigate,
  onViewPrompt,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('All');

  useEffect(() => {
    setQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      const items = await promptService.getAllPrompts({
        searchQuery: submittedQuery,
        publishedOnly: true,
      });

      if (selectedModel !== 'All') {
        setResults(items.filter((p) => p.aiModel === selectedModel));
      } else {
        setResults(items);
      }
      setLoading(false);
    };

    doSearch();
  }, [submittedQuery, selectedModel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleQuickKeyword = (kw: string) => {
    setQuery(kw);
    setSubmittedQuery(kw);
  };

  const popularKeywords = [
    'Cyberpunk',
    'Midjourney v6',
    'Flux.1 Pro',
    'Fashion',
    'Sora',
    'Photorealistic',
    'Anime',
    'Architectural',
    'Minimalist',
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Header Form */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Search AI Prompts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Find prompts by title, description, AI model, artistic genre, or specialized camera tags.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
          <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, e.g. 'cinematic', 'portrait', '85mm', 'ghibli'..."
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-[#12131e] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSubmittedQuery('');
              }}
              className="absolute right-24 p-1.5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/30"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-neutral-500 mr-1">Suggestions:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleQuickKeyword(kw)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/5 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-bold text-white">
            {submittedQuery ? (
              <span>
                Search results for &ldquo;<span className="text-purple-300">{submittedQuery}</span>&rdquo;
              </span>
            ) : (
              <span>All Available Prompts</span>
            )}
          </h2>
          <span className="text-xs text-neutral-400">
            {results.length} {results.length === 1 ? 'match found' : 'matches found'}
          </span>
        </div>

        {/* Model Filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#12131e] border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-purple-500 max-w-[150px] sm:max-w-none truncate"
          >
            <option value="All">All AI Models</option>
            <optgroup label="Image Models">
              {getActiveAITools()
                .filter((t) => t.category === 'Image')
                .map((tool) => (
                  <option key={tool.id} value={tool.name}>
                    {tool.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Video Models">
              {getActiveAITools()
                .filter((t) => t.category === 'Video')
                .map((tool) => (
                  <option key={tool.id} value={tool.name}>
                    {tool.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl bg-neutral-900/60" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onViewPrompt={onViewPrompt}
              onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
              onTagClick={(tag) => handleQuickKeyword(tag)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">No results found</h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            We couldn't find any prompts matching &ldquo;{submittedQuery}&rdquo;. Try using broader terms, checking spelling, or browsing our curated categories.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setQuery('');
                setSubmittedQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700"
            >
              Clear Search
            </button>
            <button
              onClick={() => onNavigate('/library')}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500"
            >
              Explore Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
