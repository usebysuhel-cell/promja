/**
 * PROMJA - Centralized AI Tools & Foundation Models Configuration
 * 
 * Manage, expand, or rename AI generation tools from this single configuration file
 * without editing multiple components.
 */

export type AIToolCategory = 'Image' | 'Video' | 'Other';

export interface AITool {
  id: string;
  name: string;
  category: AIToolCategory;
  description: string;
  active: boolean;
  websiteUrl?: string;
}

export const AI_TOOLS_CATALOG: AITool[] = [
  // IMAGE GENERATION
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT',
    category: 'Image',
    description: 'OpenAI multi-modal assistant with integrated image synthesis and instruction following.',
    active: true,
  },
  {
    id: 'tool-gemini',
    name: 'Gemini',
    category: 'Image',
    description: 'Google multi-modal generative AI with high precision image generation.',
    active: true,
  },
  {
    id: 'tool-midjourney',
    name: 'Midjourney',
    category: 'Image',
    description: 'Industry benchmark for photorealistic aesthetics, lighting nuances, and cinematic styling.',
    active: true,
  },
  {
    id: 'tool-flux-pro',
    name: 'Flux.1 Pro',
    category: 'Image',
    description: 'Black Forest Labs state-of-the-art 12B parameter model with pristine anatomy and typography.',
    active: true,
  },
  {
    id: 'tool-flux-schnell',
    name: 'Flux.1 Schnell',
    category: 'Image',
    description: 'High-speed 4-step distilled version of Flux.1 for instant production iterations.',
    active: true,
  },
  {
    id: 'tool-dalle-3',
    name: 'DALL-E 3',
    category: 'Image',
    description: 'OpenAI advanced semantic prompt interpreter with exceptional complex detail handling.',
    active: true,
  },
  {
    id: 'tool-sdxl',
    name: 'Stable Diffusion XL',
    category: 'Image',
    description: 'Stability AI open-weights flagship with unparalleled control, LoRAs, and fine-tuning.',
    active: true,
  },
  {
    id: 'tool-leonardo',
    name: 'Leonardo AI',
    category: 'Image',
    description: 'Creative studio suite tailored for concept art, gaming assets, and custom model styles.',
    active: true,
  },
  {
    id: 'tool-ideogram',
    name: 'Ideogram',
    category: 'Image',
    description: 'Leader in typography integration, graphic design layout, and poster aesthetics.',
    active: true,
  },
  {
    id: 'tool-firefly',
    name: 'Adobe Firefly',
    category: 'Image',
    description: 'Commercially safe generative engine built for enterprise graphic design and vectors.',
    active: true,
  },
  {
    id: 'tool-recraft',
    name: 'Recraft',
    category: 'Image',
    description: 'Professional design model excelling at vector art, 3D icons, and brand illustrations.',
    active: true,
  },
  {
    id: 'tool-playground',
    name: 'Playground AI',
    category: 'Image',
    description: 'Flexible mixed latent space image editor for digital creators and illustrators.',
    active: true,
  },
  {
    id: 'tool-imagen',
    name: 'Google Imagen',
    category: 'Image',
    description: 'DeepMind photorealistic diffusion model with high spatial composition accuracy.',
    active: true,
  },

  // VIDEO GENERATION
  {
    id: 'tool-sora',
    name: 'Sora',
    category: 'Video',
    description: 'OpenAI physical world simulator capable of generating up to 60s of consistent 1080p video.',
    active: true,
  },
  {
    id: 'tool-veo',
    name: 'Google Veo',
    category: 'Video',
    description: 'Google DeepMind cinematic video model with advanced camera moves and physics understanding.',
    active: true,
  },
  {
    id: 'tool-higgsfield',
    name: 'Higgsfield',
    category: 'Video',
    description: 'Cinematic AI video model specialized in realistic human movement, camera choreography, and physics.',
    active: true,
  },
  {
    id: 'tool-runway',
    name: 'Runway',
    category: 'Video',
    description: 'Pioneering multimodal video engine with camera control, motion brushes, and Gen-3 Alpha.',
    active: true,
  },
  {
    id: 'tool-kling',
    name: 'Kling AI',
    category: 'Video',
    description: 'Kuaishou 3D spatio-temporal attention video generator with high motion fidelity.',
    active: true,
  },
  {
    id: 'tool-luma',
    name: 'Luma Dream Machine',
    category: 'Video',
    description: 'High-speed physical world video transformer generating fluid action shots and camera shifts.',
    active: true,
  },
  {
    id: 'tool-pika',
    name: 'Pika',
    category: 'Video',
    description: 'Dynamic animation and video platform featuring Pikaffects, sound FX, and scene lip-sync.',
    active: true,
  },
  {
    id: 'tool-hailuo',
    name: 'Hailuo AI',
    category: 'Video',
    description: 'MiniMax high-coherence video model noted for fluid cinematic character motions.',
    active: true,
  },
  {
    id: 'tool-pixverse',
    name: 'PixVerse',
    category: 'Video',
    description: 'Versatile video generation with character preservation, 4K upscaling, and creative styles.',
    active: true,
  },
  {
    id: 'tool-vidu',
    name: 'Vidu',
    category: 'Video',
    description: 'High-speed generative video engine supporting dynamic lighting and physics simulations.',
    active: true,
  },
  {
    id: 'tool-haiper',
    name: 'Haiper',
    category: 'Video',
    description: 'Perceptual AI video model focused on realistic texture flow and cinematic rendering.',
    active: true,
  },

  // OTHER / HYBRID
  {
    id: 'tool-other',
    name: 'Other',
    category: 'Other',
    description: 'Emerging or specialized generative AI models.',
    active: true,
  },
];

/**
 * Returns all tools registered in the catalog.
 */
export function getAllAITools(): AITool[] {
  return AI_TOOLS_CATALOG;
}

/**
 * Returns all currently active tools for dropdowns and filters.
 */
export function getActiveAITools(): AITool[] {
  return AI_TOOLS_CATALOG.filter((t) => t.active);
}

/**
 * Derives the tool category ('Image' | 'Video' | 'Other') for any model name.
 */
export function getModelCategory(modelName: string): AIToolCategory {
  const match = AI_TOOLS_CATALOG.find(
    (t) => t.name.toLowerCase() === modelName.toLowerCase()
  );
  if (match) return match.category;

  // Heuristic fallbacks for backward compatibility
  const lower = modelName.toLowerCase();
  if (
    lower.includes('sora') ||
    lower.includes('veo') ||
    lower.includes('runway') ||
    lower.includes('kling') ||
    lower.includes('luma') ||
    lower.includes('pika') ||
    lower.includes('higgsfield') ||
    lower.includes('video') ||
    lower.includes('hailuo') ||
    lower.includes('pixverse') ||
    lower.includes('vidu') ||
    lower.includes('haiper')
  ) {
    return 'Video';
  }
  return 'Image';
}
