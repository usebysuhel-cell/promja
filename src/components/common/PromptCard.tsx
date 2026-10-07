import React, { useState } from 'react';
import { Copy, Check, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { Prompt } from '../../types/prompt';
import { promptService } from '../../services/promptService';
import { useToast } from './Toast';

interface PromptCardProps {
  prompt: Prompt;
  onViewPrompt: (promptId: string) => void;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onViewPrompt,
  onTagClick,
  onCategoryClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showCopiedToast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      showCopiedToast();
      promptService.incrementCopies(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = prompt.promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      showCopiedToast();
      promptService.incrementCopies(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      onClick={() => onViewPrompt(prompt.id)}
      className="group relative flex flex-col rounded-2xl bg-[#11121b] border border-white/[0.07] hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20 overflow-hidden cursor-pointer"
    >
      {/* Image Preview Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-neutral-800/60" />
        )}
        <img
          src={prompt.imageUrl}
          alt={prompt.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11121b] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
          {/* AI Model Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-black/80 backdrop-blur-md text-purple-200 border border-purple-500/30 shadow-md">
            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate max-w-[120px]">{prompt.aiModel}</span>
            {prompt.aiModelCategory && (
              <span className="text-[9px] uppercase tracking-wider text-purple-400/90 font-bold ml-0.5">
                · {prompt.aiModelCategory}
              </span>
            )}
          </span>

          {prompt.trending && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/80 text-white shadow shrink-0">
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category & Stats (Zero-Pill: Clean unboxed typographic layout) */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick?.(prompt.category);
            }}
            className="hover:text-purple-300 font-medium tracking-wide uppercase text-[11px] text-purple-400/90 transition-colors"
          >
            {prompt.category}
          </button>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5" />
              {prompt.views.toLocaleString()}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1" title="Copies">
              <Copy className="w-3.5 h-3.5" />
              {prompt.copies.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base leading-snug group-hover:text-purple-200 transition-colors line-clamp-1">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed flex-1">
          {prompt.description}
        </p>

        {/* Tags list (clean unboxed text with # prefix) */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-400">
            {prompt.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="hover:text-purple-300 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/[0.06] text-white hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 active:scale-95'
            }`}
            title="Copy exact prompt text"
            aria-label="Copy prompt"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-300" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          {/* View Prompt Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewPrompt(prompt.id);
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="View full prompt details"
            aria-label="View prompt details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
