import React from 'react';
import { BRAND } from '../config/branding';
import { Compass, Search, Home, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg mx-auto">
        <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-500/80 to-transparent select-none">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
          The prompt, category, or document you requested does not exist or has been moved to a new URL.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={() => onNavigate('/library')}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Prompts</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-xs text-neutral-500">
          Looking for something specific?{' '}
          <button
            onClick={() => onNavigate('/search')}
            className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
          >
            Try Prompt Search <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
