import React, { useState, useEffect } from 'react';
import { Prompt } from '../types/prompt';
import { promptService } from '../services/promptService';
import { PromptCard } from '../components/common/PromptCard';
import { AdSlot } from '../components/common/AdSlot';
import { useToast } from '../components/common/Toast';
import {
  Copy,
  Check,
  Eye,
  ArrowLeft,
  Sparkles,
  Share2,
  Bookmark,
  Layers,
  User,
} from 'lucide-react';

interface PromptDetailPageProps {
  promptId: string;
  onNavigate: (path: string) => void;
  onViewPrompt: (id: string) => void;
  onTriggerComingSoon?: (featureName: string) => void;
}

export const PromptDetailPage: React.FC<PromptDetailPageProps> = ({
  promptId,
  onNavigate,
  onViewPrompt,
  onTriggerComingSoon,
}) => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showCopiedToast, showToast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const data = await promptService.getPromptById(promptId);
      if (data) {
        setPrompt(data);
        // Increment view count asynchronously
        promptService.incrementViews(data.id);

        // Fetch related prompts by category or model
        const related = await promptService.getAllPrompts({
          category: data.category,
        });
        setRelatedPrompts(related.filter((p) => p.id !== data.id).slice(0, 3));
      } else {
        setPrompt(null);
      }
      setLoading(false);
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [promptId]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      showCopiedToast();
      promptService.incrementCopies(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = prompt.promptText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showCopiedToast();
      promptService.incrementCopies(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && prompt) {
      try {
        await navigator.share({
          title: prompt.title,
          text: `Check out this AI prompt for ${prompt.aiModel} on PROMJA`,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or failed, fall back to copy link
      }
    }
    // Fallback: Copy link
    navigator.clipboard.writeText(window.location.href);
    showToast('Page link copied to clipboard!', 'info', 'Link Copied');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-neutral-800 rounded-lg" />
        <div className="h-96 w-full bg-neutral-900 rounded-3xl" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white">Prompt not found</h2>
        <p className="mt-2 text-sm text-neutral-400">
          The prompt you are looking for may have been removed or unpublished.
        </p>
        <button
          onClick={() => onNavigate('/library')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-500 transition-colors"
        >
          Return to Prompt Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <button
        onClick={() => onNavigate('/library')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Prompts</span>
      </button>

      {/* Main Grid: Left Image & Details, Right Code Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Image Preview + Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Large Image Preview */}
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl">
            <img
              src={prompt.imageUrl}
              alt={prompt.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f]/80 via-transparent to-transparent pointer-events-none" />

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-black/85 backdrop-blur-md text-purple-200 border border-purple-500/30 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{prompt.aiModel}</span>
                {prompt.aiModelCategory && (
                  <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold ml-1 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/20">
                    {prompt.aiModelCategory}
                  </span>
                )}
              </span>
              {prompt.trending && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-500/90 text-white shadow">
                  Trending
                </span>
              )}
            </div>
          </div>

          {/* Details header */}
          <div>
            {/* Zero-Pill category & stats line */}
            <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 mb-2 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(`/category/${encodeURIComponent(prompt.category)}`)}
                  className="font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {prompt.category}
                </button>
                <span>·</span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <User className="w-3 h-3 text-neutral-400" />
                  {prompt.authorName}
                </span>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {prompt.views.toLocaleString()} views
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" />
                  {prompt.copies.toLocaleString()} copies
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {prompt.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
              {prompt.description}
            </p>

            {/* Clickable Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
                    className="text-xs text-neutral-400 hover:text-purple-300 hover:underline transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Box + Copy Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Clean Code-Style Container */}
          <div className="rounded-3xl bg-[#0f1019] border border-purple-500/20 shadow-2xl overflow-hidden flex flex-col">
            {/* Code Box Header */}
            <div className="px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-neutral-400 font-semibold">
                  prompt.txt
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Share prompt link"
                  aria-label="Share prompt link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTriggerComingSoon?.('Save to Bookmarks')}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Bookmark prompt"
                  aria-label="Bookmark prompt"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Content Container */}
            <div className="p-5 font-mono text-xs sm:text-sm text-purple-100 bg-[#0b0c13] leading-relaxed select-all whitespace-pre-wrap break-words min-h-[180px]">
              {prompt.promptText}
            </div>

            {/* Code Box Action Footer */}
            <div className="p-5 border-t border-white/[0.08] bg-white/[0.02]">
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-xl ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 active:scale-[0.98]'
                }`}
                aria-label="Copy Prompt to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 animate-in zoom-in" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Prompt (One Tap)</span>
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-neutral-500">
                Copies exact prompt syntax and flags to your clipboard.
              </p>
            </div>
          </div>

          {/* Prompt Specs & Parameters Box */}
          <div className="p-5 rounded-2xl bg-[#11121c] border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Prompt Technical Specs</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Target Model</span>
                <span className="font-semibold text-white mt-0.5 block">{prompt.aiModel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-white mt-0.5 block">{prompt.category}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Aspect Ratio</span>
                <span className="font-semibold text-white mt-0.5 block">{prompt.aspectRatio || '16:9'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Creator ID</span>
                <span className="font-mono text-purple-300 mt-0.5 block truncate">{prompt.authorId}</span>
              </div>
            </div>
          </div>

          {/* Ad Slot: Detail Sidebar */}
          <AdSlot slotId="AD_SLOT_DETAIL" />
        </div>
      </div>

      {/* Related Prompts Section */}
      {relatedPrompts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Related {prompt.category} Prompts
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                More prompts with complementary aesthetics and techniques.
              </p>
            </div>
            <button
              onClick={() => onNavigate(`/category/${encodeURIComponent(prompt.category)}`)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              View Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPrompts.map((related) => (
              <PromptCard
                key={related.id}
                prompt={related}
                onViewPrompt={onViewPrompt}
                onCategoryClick={(cat) => onNavigate(`/category/${encodeURIComponent(cat)}`)}
                onTagClick={(tag) => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
