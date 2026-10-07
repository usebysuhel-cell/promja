/**
 * PROMJA - Modular Monetization & Ad Slots Configuration
 * 
 * Slots are cleanly decoupled from the UI.
 * When ENABLE_ADS is false (default), nothing invasive is rendered.
 * If ENABLE_ADS is enabled, real ad network scripts (Google AdSense, Carbon, etc.)
 * plug in directly via the AdProvider adapter.
 */

export type AdSlotId =
  | 'HOME_TOP'
  | 'HOME_MIDDLE'
  | 'LIBRARY_TOP'
  | 'LIBRARY_BETWEEN_PROMPTS'
  | 'PROMPT_DETAIL_TOP'
  | 'PROMPT_DETAIL_MIDDLE'
  | 'PROMPT_DETAIL_BOTTOM'
  // Legacy aliases for backward compatibility
  | 'AD_SLOT_HOME'
  | 'AD_SLOT_LIBRARY'
  | 'AD_SLOT_DETAIL'
  | 'AD_SLOT_BETWEEN_PROMPTS';

export interface AdSlotConfig {
  id: AdSlotId;
  label: string;
  format: 'banner' | 'rectangle' | 'in-feed' | 'responsive';
  client?: string;
  slot?: string;
}

export const AD_SLOTS: Record<AdSlotId, AdSlotConfig> = {
  HOME_TOP: {
    id: 'HOME_TOP',
    label: 'Home Page Top Banner',
    format: 'responsive',
  },
  HOME_MIDDLE: {
    id: 'HOME_MIDDLE',
    label: 'Home Page In-Feed Unit',
    format: 'responsive',
  },
  LIBRARY_TOP: {
    id: 'LIBRARY_TOP',
    label: 'Library Top Leaderboard',
    format: 'banner',
  },
  LIBRARY_BETWEEN_PROMPTS: {
    id: 'LIBRARY_BETWEEN_PROMPTS',
    label: 'Library In-Feed Grid Placement',
    format: 'in-feed',
  },
  PROMPT_DETAIL_TOP: {
    id: 'PROMPT_DETAIL_TOP',
    label: 'Prompt Detail Header Placement',
    format: 'banner',
  },
  PROMPT_DETAIL_MIDDLE: {
    id: 'PROMPT_DETAIL_MIDDLE',
    label: 'Prompt Detail Sidebar Placement',
    format: 'rectangle',
  },
  PROMPT_DETAIL_BOTTOM: {
    id: 'PROMPT_DETAIL_BOTTOM',
    label: 'Prompt Detail Footer Placement',
    format: 'responsive',
  },

  // Aliases ensuring zero breaks for existing layout bindings
  AD_SLOT_HOME: {
    id: 'HOME_TOP',
    label: 'Home Feed Sponsored Unit',
    format: 'responsive',
  },
  AD_SLOT_LIBRARY: {
    id: 'LIBRARY_TOP',
    label: 'Prompt Library Sidebar / Top Banner',
    format: 'banner',
  },
  AD_SLOT_DETAIL: {
    id: 'PROMPT_DETAIL_MIDDLE',
    label: 'Prompt Detail Sidebar Unit',
    format: 'rectangle',
  },
  AD_SLOT_BETWEEN_PROMPTS: {
    id: 'LIBRARY_BETWEEN_PROMPTS',
    label: 'Between Prompt Cards Native Placement',
    format: 'in-feed',
  },
};
