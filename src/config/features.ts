/**
 * PROMJA - Centralized Feature Flags
 * 
 * Future features are activated here without rewriting the application.
 * All modular components gracefully adapt when these flags are turned on.
 */

export interface FeatureFlags {
  ENABLE_ADS: boolean;
  ENABLE_AUTH: boolean;
  ENABLE_CREATORS: boolean;
  ENABLE_SUBSCRIPTIONS: boolean;
  ENABLE_PREMIUM_PROMPTS: boolean;
  ENABLE_COMMENTS: boolean;
  ENABLE_LIKES: boolean;
  ENABLE_FAVORITES: boolean;
  ENABLE_CREATOR_EARNINGS: boolean;
  ENABLE_PAYMENTS: boolean;
  ENABLE_MODERATION: boolean;
  ENABLE_EXPORT_IMPORT: boolean;
  ENABLE_PROMPT_SUBMISSIONS: boolean;
}

export const FEATURES: FeatureFlags = {
  ENABLE_ADS: false,
  ENABLE_AUTH: false,
  ENABLE_CREATORS: false,
  ENABLE_SUBSCRIPTIONS: false,
  ENABLE_PREMIUM_PROMPTS: false,
  ENABLE_COMMENTS: false,
  ENABLE_LIKES: false,
  ENABLE_FAVORITES: false,
  ENABLE_CREATOR_EARNINGS: false,
  ENABLE_PAYMENTS: false,
  ENABLE_MODERATION: false,
  ENABLE_EXPORT_IMPORT: true, // Enables admin JSON backup/restore
  ENABLE_PROMPT_SUBMISSIONS: false,
};

/**
 * Helper to check if a feature flag is enabled.
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return Boolean(FEATURES[flag]);
}
