import React from 'react';
import { BRAND } from '../config/branding';
import { Sparkles, Instagram, ArrowUpRight, Zap, Target, Shield, Cpu } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>The Platform Behind High-Fidelity AI Art</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          About <span className="gradient-text">{BRAND.brandName}</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
          {BRAND.subtitle}
        </p>
      </div>

      {/* Core Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 rounded-3xl bg-[#12131e] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Generative AI is only as capable as the vocabulary used to command it.
              At <strong className="text-white font-semibold">{BRAND.brandName}</strong>, we curate, stress-test, and standardize production-level prompt engineering techniques. We remove guesswork so visual creators, art directors, and storytellers can jump straight from prompt to high-fidelity output.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-xs text-neutral-500 font-mono">
            Discover · Copy · Create
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#12131e] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">One-Tap Workflow</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every prompt featured on {BRAND.brandName} is verified across leading foundation models—including Midjourney v6, Flux.1 Pro, DALL-E 3, OpenAI Sora, and Runway Gen-3. With one-tap instant copying, creators can seamlessly embed parameter syntax right into their creative suites.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-xs text-neutral-500 font-mono">
            Zero bloat · Verified parameters
          </div>
        </div>
      </div>

      {/* Feature Matrix */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0f1019] border border-purple-500/20 mb-16">
        <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
          What Sets {BRAND.brandName} Apart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Multi-Model Testing</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Prompts include specific syntax flags tailored for image generators and next-generation video diffusion models.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>Pristine Accuracy</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No generic fluff words. Every prompt uses precise lighting, optics, aspect ratio parameters, and lens specifications.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Creator-Ready Core</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Engineered with an open schema designed to empower creators, studio teams, and emerging AI art directors.
            </p>
          </div>
        </div>
      </div>

      {/* Official Instagram Connect Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#12131e] to-pink-950/30 border border-purple-500/30 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 mx-auto flex items-center justify-center text-white mb-4 shadow-xl shadow-pink-600/20">
          <Instagram className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Official Social Media
        </h2>
        <p className="mt-2 text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Follow our official Instagram account to explore daily visual generations, prompt breakdowns, and emerging generative tools.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={BRAND.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow {BRAND.social.instagram.handle}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 hover:text-white border border-white/10 font-semibold text-sm transition-all"
          >
            Contact Team
          </button>
        </div>
      </div>
    </div>
  );
};
