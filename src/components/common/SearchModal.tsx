import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types/prompt';
import { promptService } from '../../services/promptService';
import { useToast } from './Toast';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptId: string) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showCopiedToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const items = await promptService.getAllPrompts({ searchQuery: query });
      setResults(items.slice(0, 6));
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleCopy = async (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      showCopiedToast();
      promptService.incrementCopies(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onViewAllResults(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularKeywords = ['Cyberpunk', 'Midjourney v6', 'Fashion', 'Sora', 'Product', 'Anime'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-2xl glass-dropdown border border-purple-500/25 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts by keyword, model, tags, category..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800"
          >
            Esc
          </button>
        </form>

        {/* Results / Suggestions Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-white/[0.04]">
          {loading ? (
            <div className="py-12 text-center text-sm text-neutral-400 animate-pulse">
              Searching prompt library...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex justify-between">
                <span>Matching Prompts</span>
                <span>{results.length} found</span>
              </div>
              {results.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => {
                    onSelectPrompt(prompt.id);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prompt.imageUrl}
                      alt={prompt.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-purple-300">
                          {prompt.title}
                        </h4>
                        <span className="text-[10px] text-purple-300/80 shrink-0 font-medium">
                          {prompt.aiModel}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {prompt.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, prompt)}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                        copiedId === prompt.id
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                      title="Copy prompt text"
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-300 transition-colors" />
                  </div>
                </div>
              ))}

              {/* View all search button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>View all search results for "{query}"</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : query.trim() ? (
            <div className="py-10 text-center">
              <p className="text-sm text-neutral-300">No prompts found for "{query}"</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for generic terms like "cyberpunk", "portrait", or "video"
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setQuery(kw)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-purple-600/20 hover:text-purple-300 border border-white/5 text-xs text-neutral-300 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
