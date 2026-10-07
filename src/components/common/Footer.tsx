import React from 'react';
import { Sparkles, Instagram, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { BRAND } from '../../config/branding';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const categories = [
    'Cinematic',
    'AI Video',
    'Portrait',
    'Product',
    'Fashion',
    'Architecture',
    'Photography',
    'Anime',
  ];

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07080c] text-neutral-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                {BRAND.brandName}
              </span>
            </div>
            <p className="text-sm text-neutral-300 font-medium">
              "{BRAND.tagline}"
            </p>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              {BRAND.subtitle}
            </p>

            {/* Official Instagram Badge */}
            <div className="pt-2">
              <a
                href={BRAND.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-pink-500/40 text-purple-300 hover:text-pink-300 text-xs font-semibold transition-all group"
              >
                <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span>Follow {BRAND.social.instagram.handle} on Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/library')}
                  className="hover:text-white transition-colors"
                >
                  Prompt Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/trending')}
                  className="hover:text-white transition-colors"
                >
                  Trending Prompts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/categories')}
                  className="hover:text-white transition-colors"
                >
                  All Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About PROMJA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate(`/category/${encodeURIComponent(cat)}`)}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {currentYear} {BRAND.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered for prompt artisans <Heart className="w-3 h-3 text-purple-400 inline fill-purple-400" />
            </span>
            <span>·</span>
            <a
              href={BRAND.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 transition-colors"
            >
              Instagram: {BRAND.social.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
