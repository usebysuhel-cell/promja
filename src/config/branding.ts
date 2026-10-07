/**
 * PROMJA - Centralized Brand Configuration
 * 
 * Modify this single configuration file to update brand identity,
 * social links, color schemes, and global site copy across the entire application.
 */

export interface BrandConfig {
  brandName: string;
  tagline: string;
  subtitle: string;
  description: string;
  logo: {
    text: string;
    showIcon: boolean;
    iconSvgPath?: string;
  };
  favicon: string;
  colors: {
    primary: string;       // e.g. deep charcoal/black
    primaryDark: string;
    accent: string;        // subtle purple/indigo
    accentHover: string;
    accentGlow: string;
    surface: string;
    surfaceBorder: string;
  };
  social: {
    instagram: {
      url: string;
      handle: string;
      label: string;
    };
    twitter?: {
      url: string;
      handle: string;
    };
    discord?: {
      url: string;
    };
    github?: {
      url: string;
    };
  };
  contact: {
    email: string;
    supportUrl: string;
  };
  meta: {
    title: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string[];
    siteUrl: string;
  };
}

export const BRAND: BrandConfig = {
  brandName: 'PROMJA',
  tagline: 'Discover. Copy. Create.',
  subtitle: 'Discover high-quality AI prompts for stunning images, videos and creative ideas.',
  description:
    'PROMJA is an elite AI prompt library. Search, discover, and copy production-grade prompts for Midjourney, Flux, DALL-E 3, Sora, Stable Diffusion, and Runway.',
  logo: {
    text: 'PROMJA',
    showIcon: true,
  },
  favicon: '/favicon.ico',
  colors: {
    primary: '#090a0f',
    primaryDark: '#050608',
    accent: '#a855f7', // Purple 500
    accentHover: '#c084fc', // Purple 400
    accentGlow: 'rgba(168, 85, 247, 0.25)',
    surface: '#12131b',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  },
  social: {
    instagram: {
      url: 'https://www.instagram.com/suhel_tech/',
      handle: '@suhel_tech',
      label: 'Official Instagram',
    },
  },
  contact: {
    email: 'contact@promja.com',
    supportUrl: 'https://www.instagram.com/suhel_tech/',
  },
  meta: {
    title: 'PROMJA – AI Prompt Library | Discover. Copy. Create.',
    ogTitle: 'PROMJA – Discover, Copy, and Create with AI Prompts',
    ogDescription: 'Discover high-quality AI prompts for stunning images, videos and creative ideas.',
    keywords: [
      'AI Prompts',
      'Midjourney prompts',
      'Flux prompts',
      'DALL-E 3',
      'Sora video prompts',
      'Runway Gen-3',
      'Prompt Engineering',
      'AI art prompts',
      'PROMJA',
    ],
    siteUrl: 'https://promja.com',
  },
};
