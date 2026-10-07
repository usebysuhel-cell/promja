import React, { useState, useEffect } from 'react';
import { PromptCategory } from '../types/prompt';
import { promptService } from '../services/promptService';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesHubPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesHubPage: React.FC<CategoriesHubPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<{ category: PromptCategory; count: number }[]>([]);

  useEffect(() => {
    promptService.getCategories().then(setCategories);
  }, []);

  const categoryDetails: Record<
    string,
    { icon: string; bgImage: string; description: string }
  > = {
    'Cinematic': {
      icon: '🎬',
      bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      description: 'Anamorphic lens flares, volumetric fog, moody lighting, and film-still aesthetics.',
    },
    'Product': {
      icon: '💎',
      bgImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      description: 'Studio product staging, travertine textures, cosmetics, and luxury commercial lighting.',
    },
    'Fashion': {
      icon: '✨',
      bgImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      description: 'Avant-garde couture, fluid silk fabrics, high-fashion runway poses, and editorial styling.',
    },
    'Portrait': {
      icon: '👤',
      bgImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
      description: 'Detailed skin pores, authentic expressions, intimate documentary lighting, and 85mm optics.',
    },
    'Architecture': {
      icon: '🏛️',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      description: 'Brutalist concrete pavilions, Scandinavian modernism, cantilevers, and minimalist interiors.',
    },
    'AI Video': {
      icon: '🎥',
      bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      description: 'FPV drone glides, slow motion, time-lapses, and camera stabilization syntax for Sora & Runway.',
    },
    'Photography': {
      icon: '📷',
      bgImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      description: 'Analog 35mm film grain, vintage Kodachrome color palettes, and candid documentary stills.',
    },
    'Anime': {
      icon: '🌸',
      bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      description: 'Ghibli watercolor skies, Makoto Shinkai volumetrics, cel-shaded characters, and fantasy worlds.',
    },
    'Aesthetic': {
      icon: '🔮',
      bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      description: 'Bioluminescence, neon minimalism, dreamscapes, ambient lighting, and serene textures.',
    },
    'AI Images': {
      icon: '🎨',
      bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      description: 'Conceptual surrealism, digital matte paintings, futuristic cityscapes, and fantasy illustrations.',
    },
    'Other': {
      icon: '⚡',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      description: 'Experimental prompt formulations, multi-genre blends, and prompt engineering utilities.',
    },
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Disciplines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Prompt Categories
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400">
          Explore specialized aesthetic styles, lighting setups, and camera configurations.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(({ category, count }) => {
          const meta = categoryDetails[category] || {
            icon: '✨',
            bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
            description: `Curated prompts for ${category}.`,
          };

          return (
            <div
              key={category}
              onClick={() => onNavigate(`/category/${encodeURIComponent(category)}`)}
              className="group relative rounded-3xl bg-[#11121d] border border-white/[0.08] hover:border-purple-500/40 p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-purple-950/20"
            >
              {/* Subtle background image watermark */}
              <div
                className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${meta.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11121d] via-[#11121d]/85 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="text-xs font-mono text-purple-300 font-medium px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/20">
                    {count} {count === 1 ? 'prompt' : 'prompts'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {category}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {meta.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>Browse Prompts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
